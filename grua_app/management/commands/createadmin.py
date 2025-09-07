from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Create admin superuser for Grúa Style'
    
    def handle(self, *args, **options):
        username = 'admin'
        email = 'admin@gruastyle.com'
        password = 'GruaStyleAdmin2024!'
        
        if not User.objects.filter(username=username).exists():
            try:
                user = User.objects.create_superuser(
                    username=username,
                    email=email,
                    password=password
                )
                self.stdout.write(
                    self.style.SUCCESS(
                        f'✅ Superusuario creado exitosamente: {username}'
                    )
                )
                self.stdout.write(
                    self.style.SUCCESS(
                        f'   Email: {email}'
                    )
                )
                self.stdout.write(
                    self.style.SUCCESS(
                        f'   Acceso: https://www.gruastyle.com/admin/'
                    )
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(
                        f'❌ Error creando superusuario: {e}'
                    )
                )
        else:
            existing_user = User.objects.get(username=username)
            self.stdout.write(
                self.style.WARNING(
                    f'⚠️ Superusuario "{username}" ya existe'
                )
            )
            self.stdout.write(
                self.style.WARNING(
                    f'   Email: {existing_user.email}'
                )
            )