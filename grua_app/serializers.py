from rest_framework import serializers
from django.contrib.auth.models import User
from .models import SolicitudServicio, Cliente, Membresia

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']
        read_only_fields = ['id', 'date_joined']

class ClienteSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Cliente
        fields = ['user', 'telefono', 'fecha_registro']
        read_only_fields = ['fecha_registro']

class MembresiaSerializer(serializers.ModelSerializer):
    cliente = ClienteSerializer(read_only=True)
    
    class Meta:
        model = Membresia
        fields = ['id', 'cliente', 'tipo', 'fecha_inicio', 'fecha_vencimiento', 
                 'activa', 'precio_pagado']

class SolicitudServicioSerializer(serializers.ModelSerializer):
    cliente_info = serializers.SerializerMethodField()
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)
    
    class Meta:
        model = SolicitudServicio
        fields = [
            'id', 'numero_orden', 'cliente', 'cliente_info',
            'direccion_origen', 'direccion_destino', 'fecha_servicio',
            'tipo_vehiculo', 'marca_vehiculo', 'modelo_vehiculo', 'placa_vehiculo',
            'descripcion_problema', 'estado', 'estado_display', 'metodo_pago',
            'costo_total', 'fecha_solicitud', 'fecha_confirmacion',
            'distancia_km', 'tipo_servicio_categoria'
        ]
        read_only_fields = ['numero_orden', 'fecha_solicitud', 'fecha_confirmacion']
    
    def get_cliente_info(self, obj):
        return {
            'nombre': obj.cliente.get_full_name() or obj.cliente.username,
            'telefono': getattr(obj.cliente, 'telefono', ''),
            'email': obj.cliente.email
        }

class SolicitudCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SolicitudServicio
        fields = [
            'direccion_origen', 'direccion_destino', 'fecha_servicio',
            'tipo_vehiculo', 'marca_vehiculo', 'modelo_vehiculo', 'placa_vehiculo',
            'descripcion_problema', 'metodo_pago', 'distancia_km',
            'tipo_servicio_categoria'
        ]
    
    def create(self, validated_data):
        # El cliente se asigna en la vista
        return super().create(validated_data)