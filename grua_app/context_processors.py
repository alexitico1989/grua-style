from .models import DisponibilidadServicio

def disponibilidad_context(request):
    """Context processor para mostrar el estado de disponibilidad del servicio"""
    try:
        # Obtener el estado actual de disponibilidad
        servicio_disponible = DisponibilidadServicio.esta_disponible()
        mensaje_no_disponible = DisponibilidadServicio.obtener_mensaje()
        
        return {
            'servicio_disponible': servicio_disponible,
            'mensaje_no_disponible': mensaje_no_disponible,
            'estado_servicio_texto': 'DISPONIBLE' if servicio_disponible else 'NO DISPONIBLE',
            'clase_estado': 'active' if servicio_disponible else 'inactive'
        }
        
    except Exception as e:
        # Valores por defecto en caso de error
        return {
            'servicio_disponible': True,
            'mensaje_no_disponible': 'Servicio temporalmente no disponible',
            'estado_servicio_texto': 'DISPONIBLE',
            'clase_estado': 'active'
        }