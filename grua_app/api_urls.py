from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import api_views

urlpatterns = [
    # Autenticación
    path('auth/login/', api_views.login_api, name='api_login'),
    path('auth/register/', api_views.register_api, name='api_register'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='api_token_refresh'),
    
    # Perfil de usuario
    path('perfil/', api_views.PerfilAPIView.as_view(), name='api_perfil'),
    
    # Solicitudes de servicio
    path('solicitudes/', api_views.SolicitudListCreateAPIView.as_view(), name='api_solicitudes'),
    path('solicitudes/<int:pk>/', api_views.SolicitudDetailAPIView.as_view(), name='api_solicitud_detail'),
    
    # Membresías
    path('membresia/', api_views.MembresiaAPIView.as_view(), name='api_membresia'),
    
    # Tarifas
    path('tarifas/', api_views.tarifas_api, name='api_tarifas'),
]