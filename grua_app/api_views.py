from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.utils import timezone
from .models import SolicitudServicio, Cliente, Membresia
from .serializers import (
    SolicitudServicioSerializer, 
    SolicitudCreateSerializer,
    ClienteSerializer,
    UserSerializer,
    MembresiaSerializer
)
from .views import obtener_tarifas_usuario
import uuid

# Autenticación
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_api(request):
    """Login para app móvil - retorna JWT tokens"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({
            'error': 'Username y password son requeridos'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(username=username, password=password)
    
    if user:
        refresh = RefreshToken.for_user(user)
        
        # Obtener o crear cliente
        cliente, created = Cliente.objects.get_or_create(
            user=user,
            defaults={'telefono': ''}
        )
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data,
            'cliente': ClienteSerializer(cliente).data
        })
    
    return Response({
        'error': 'Credenciales inválidas'
    }, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_api(request):
    """Registro para app móvil"""
    serializer = UserSerializer(data=request.data)
    
    if serializer.is_valid():
        # Crear usuario
        user = User.objects.create_user(
            username=serializer.validated_data['username'],
            email=serializer.validated_data['email'],
            first_name=serializer.validated_data.get('first_name', ''),
            last_name=serializer.validated_data.get('last_name', ''),
            password=request.data.get('password')
        )
        
        # Crear cliente
        cliente = Cliente.objects.create(
            user=user,
            telefono=request.data.get('telefono', '')
        )
        
        # Generar tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data,
            'cliente': ClienteSerializer(cliente).data
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Perfil de usuario
class PerfilAPIView(generics.RetrieveUpdateAPIView):
    """Obtener y actualizar perfil del usuario"""
    serializer_class = ClienteSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        cliente, created = Cliente.objects.get_or_create(
            user=self.request.user,
            defaults={'telefono': ''}
        )
        return cliente

# Solicitudes de servicio
class SolicitudListCreateAPIView(generics.ListCreateAPIView):
    """Listar y crear solicitudes de servicio"""
    serializer_class = SolicitudServicioSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return SolicitudServicio.objects.filter(
            cliente=self.request.user
        ).order_by('-fecha_solicitud')
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return SolicitudCreateSerializer
        return SolicitudServicioSerializer
    
    def perform_create(self, serializer):
        # Generar número de orden único
        numero_orden = f"GR{timezone.now().strftime('%Y%m%d%H%M%S')}{uuid.uuid4().hex[:8].upper()}"
        
        # Calcular costo con tarifas de membresía
        tarifas = obtener_tarifas_usuario(self.request.user)
        distancia_km = serializer.validated_data.get('distancia_km', 0)
        
        if distancia_km:
            costo_km = float(distancia_km) * tarifas['tarifa_por_km']
            costo_total = max(tarifas['tarifa_base'] + costo_km, tarifas['tarifa_minima'])
        else:
            costo_total = tarifas['tarifa_minima']
        
        solicitud = serializer.save(
            cliente=self.request.user,
            numero_orden=numero_orden,
            costo_total=costo_total,
            estado='pendiente'
        )
        
        # Enviar notificación de Telegram (reutilizar función existente)
        try:
            from utils.telegram_notifications import send_telegram_notification, format_grua_notification
            from datetime import datetime
            
            notification_data = {
                'numero_orden': solicitud.numero_orden,
                'nombre': solicitud.cliente.get_full_name() or solicitud.cliente.username,
                'username': solicitud.cliente.username,
                'marca_vehiculo': solicitud.marca_vehiculo,
                'modelo_vehiculo': solicitud.modelo_vehiculo,
                'tipo_vehiculo': solicitud.tipo_vehiculo,
                'tipo_servicio': 'Inmediato',  # Por defecto desde app
                'metodo_pago': solicitud.metodo_pago,
                'direccion_origen': solicitud.direccion_origen,
                'direccion_destino': solicitud.direccion_destino,
                'comentarios': solicitud.descripcion_problema or 'Solicitud desde app móvil',
                'costo_total': int(solicitud.costo_total),
                'estado': solicitud.estado,
                'fecha_servicio': solicitud.fecha_servicio.strftime('%d/%m/%Y %H:%M') if solicitud.fecha_servicio else 'No especificada',
                'admin_url': f"https://www.gruastyle.com/admin/grua_app/solicitudservicio/{solicitud.id}/change/",
            }
            
            message = format_grua_notification(notification_data)
            send_telegram_notification(message)
            
        except Exception as e:
            print(f"Error enviando notificación desde API: {e}")

class SolicitudDetailAPIView(generics.RetrieveAPIView):
    """Detalle de una solicitud específica"""
    serializer_class = SolicitudServicioSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return SolicitudServicio.objects.filter(cliente=self.request.user)

# Membresías
class MembresiaAPIView(generics.RetrieveAPIView):
    """Obtener membresía activa del usuario"""
    serializer_class = MembresiaSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        try:
            return Membresia.objects.get(
                cliente__user=self.request.user,
                activa=True
            )
        except Membresia.DoesNotExist:
            return None
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance:
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        return Response({
            'message': 'No tienes membresía activa',
            'tiene_membresia': False
        })

# Tarifas
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def tarifas_api(request):
    """Obtener tarifas aplicables al usuario"""
    tarifas = obtener_tarifas_usuario(request.user)
    return Response(tarifas)