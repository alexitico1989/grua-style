import requests
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def send_telegram_notification(message):
    """
    Envía notificación al bot de Telegram
    """
    try:
        bot_token = getattr(settings, 'TELEGRAM_BOT_TOKEN', None)
        chat_id = getattr(settings, 'TELEGRAM_CHAT_ID', None)
        
        if not bot_token or not chat_id:
            logger.warning("Configuración de Telegram no encontrada")
            return False
        
        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        
        payload = {
            'chat_id': chat_id,
            'text': message,
            'parse_mode': 'HTML'
        }
        
        response = requests.post(url, json=payload, timeout=10)
        
        if response.status_code == 200:
            logger.info("Notificación de Telegram enviada exitosamente")
            return True
        else:
            logger.error(f"Error al enviar notificación: {response.text}")
            return False
            
    except Exception as e:
        logger.error(f"Excepción al enviar notificación de Telegram: {str(e)}")
        return False
    
def format_grua_notification(data):
    """
    Formatea mensaje para solicitud de grúa - Formato exacto como sistema anterior
    """
    message = f"""
🚨 <b>NUEVA SOLICITUD URGENTE</b>
🆔 <b>Orden:</b>
{data.get('numero_orden', 'No disponible')}
🔧 <b>Servicio:</b> SERVICIO DE GRÚA

👤 <b>Cliente:</b> {data.get('nombre', 'No especificado')}
📱 <b>Usuario:</b> @{data.get('username', 'No especificado')}
🚗 <b>Vehículo:</b> {data.get('marca_vehiculo', '')} {data.get('modelo_vehiculo', '')}
🔧 <b>Tipo:</b> {data.get('tipo_vehiculo', 'No especificado')}
📍 <b>Origen:</b> {data.get('direccion_origen', 'No especificada')}
🎯 <b>Destino:</b> {data.get('direccion_destino', 'No especificado')}

💰 <b>Valor:</b> $${data.get('costo_total', '0'):,}
💳 <b>Pago:</b> {data.get('metodo_pago', 'No especificado').title()}
⏰ <b>Fecha Servicio:</b> {data.get('fecha_servicio', 'No especificada')}
📋 <b>Estado:</b> {data.get('estado', 'Pendiente').title()}

📝 <b>Problema:</b> {data.get('comentarios', 'Solicitud de servicio de grúa')}

🔗 <a href="{data.get('admin_url', '#')}">Ver en Admin</a>
    """
    return message.strip()

def format_asistencia_notification(data):
    """
    Formatea mensaje para asistencia mecánica - Formato exacto como sistema anterior
    """
    message = f"""
🚨 <b>NUEVA SOLICITUD URGENTE</b>
🆔 <b>Orden:</b>
{data.get('numero_orden', 'No disponible')}
🔧 <b>Servicio:</b> ASISTENCIA MECÁNICA

👤 <b>Cliente:</b> {data.get('nombre', 'No especificado')}
📱 <b>Usuario:</b> @{data.get('username', 'No especificado')}
🚗 <b>Vehículo:</b> {data.get('marca_vehiculo', '')} {data.get('modelo_vehiculo', '')}
🔧 <b>Tipo:</b> {data.get('tipo_vehiculo', 'No especificado')}
📍 <b>Origen:</b> {data.get('direccion', 'No especificada')}

💰 <b>Valor:</b> $${data.get('costo_total', '0'):,}
💳 <b>Pago:</b> {data.get('metodo_pago', 'No especificado').title()}
⏰ <b>Fecha Servicio:</b> {data.get('fecha_servicio', 'No especificada')}
📋 <b>Estado:</b> {data.get('estado', 'Pendiente').title()}

📝 <b>Problema:</b> {data.get('tipo_problema', 'No especificado')} - {data.get('comentarios', 'Sin comentarios')}

🔗 <a href="{data.get('admin_url', '#')}">Ver en Admin</a>
    """
    return message.strip()