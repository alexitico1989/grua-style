# grua_app/context_processors.py
from .models import DisponibilidadServicio

def disponibilidad_context(request):
    """Context processor para mostrar el estado de disponibilidad del servicio"""
    
    # DEBUG TEMPORAL
    print("🔍 DEBUG: Context processor ejecutándose")
    
    try:
        # Obtener el estado actual de disponibilidad
        servicio_disponible = DisponibilidadServicio.esta_disponible()
        mensaje_no_disponible = DisponibilidadServicio.obtener_mensaje()
        
        print(f"🔍 Servicio disponible: {servicio_disponible}")
        
        return {
            'servicio_disponible': servicio_disponible,
            'mensaje_no_disponible': mensaje_no_disponible,
            'estado_servicio_texto': 'DISPONIBLE' if servicio_disponible else 'NO DISPONIBLE',
            'clase_estado': 'active' if servicio_disponible else 'inactive'
        }
        
    except Exception as e:
        print(f"❌ Error en context processor: {e}")
        # VALORES POR DEFECTO EN CASO DE ERROR
        return {
            'servicio_disponible': True,
            'mensaje_no_disponible': 'Servicio temporalmente no disponible',
            'estado_servicio_texto': 'DISPONIBLE',
            'clase_estado': 'active'
        }