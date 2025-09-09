# grua_platform/settings_railway.py
import os
import dj_database_url
from pathlib import Path

# Build paths inside the project
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-fallback-key')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = ['*']

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'whitenoise.runserver_nostatic',
    'django.contrib.staticfiles',
    'grua_app',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'grua_platform.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'grua_app.views.disponibilidad_context',
            ],
        },
    },
]

WSGI_APPLICATION = 'grua_platform.wsgi.application'

# Database configuration with error handling
DATABASE_URL = os.environ.get('DATABASE_URL')
if not DATABASE_URL:
    raise ValueError("DATABASE_URL no está configurada en las variables de entorno")

# Validar que la URL no esté corrupta
if 'b\'\'' in str(DATABASE_URL) or len(str(DATABASE_URL)) < 20:
    raise ValueError(f"DATABASE_URL parece estar corrupta: {repr(DATABASE_URL)}")

try:
    DATABASES = {
        'default': dj_database_url.parse(DATABASE_URL)
    }
except Exception as e:
    raise ValueError(f"Error parseando DATABASE_URL: {e}. URL: {repr(DATABASE_URL)}")

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'es'
TIME_ZONE = 'America/Santiago'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = '/app/staticfiles'
STATICFILES_DIRS = [BASE_DIR / 'static']
STATICFILES_STORAGE = 'whitenoise.storage.CompressedStaticFilesStorage'

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Security settings for production
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True

# Email configuration - Mailjet API
MAILJET_API_KEY = os.environ.get('MAILJET_API_KEY')
MAILJET_SECRET_KEY = os.environ.get('MAILJET_SECRET_KEY')
DEFAULT_FROM_EMAIL = 'contacto@www.gruastyle.com'

# Deshabilitar SMTP backend
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

print(f"Mailjet API configured: {bool(MAILJET_API_KEY and MAILJET_SECRET_KEY)}")

# Application specific settings
BASE_HOST = f"https://{os.environ.get('RAILWAY_PUBLIC_DOMAIN', 'localhost:8000')}"
MERCADOPAGO_PUBLIC_KEY = os.environ.get('MERCADOPAGO_PUBLIC_KEY')
MERCADOPAGO_ACCESS_TOKEN = os.environ.get('MERCADOPAGO_ACCESS_TOKEN')
MERCADOPAGO_SANDBOX = False

# Telegram settings
TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN')
TELEGRAM_ADMIN_CHAT_ID = os.environ.get('TELEGRAM_ADMIN_CHAT_ID')

# Notifications
NOTIFICATIONS_ADMIN_EMAIL = os.environ.get('NOTIFICATIONS_ADMIN_EMAIL')

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}

print("🚀 SETTINGS RAILWAY CARGADO - MODO PRODUCCIÓN")
print(f"🔍 DEBUG: {DEBUG}")
print(f"🔍 DATABASE: {DATABASES['default']['ENGINE']}")
print(f"🔍 ALLOWED_HOSTS: {ALLOWED_HOSTS}")
print(f"🔍 BASE_HOST: {BASE_HOST}")
