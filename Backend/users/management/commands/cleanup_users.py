from django.core.management.base import BaseCommand
from users.models import User

class Command(BaseCommand):
    help = 'Finds users with empty usernames and updates them to their email address.'

    def handle(self, *args, **options):
        users_to_fix = User.objects.filter(username='')
        self.stdout.write(f"Found {len(users_to_fix)} user(s) with an empty username.")

        for user in users_to_fix:
            if user.email:
                if not User.objects.filter(username=user.email).exists():
                    user.username = user.email
                    user.save()
                    self.stdout.write(self.style.SUCCESS(f"Updated username for user {user.id} to {user.email}"))
                else:
                    self.stdout.write(self.style.WARNING(f"Could not update username for user {user.id} to {user.email} as it is already taken."))
            else:
                self.stdout.write(self.style.ERROR(f"User {user.id} has an empty email and username. Manual intervention required."))
