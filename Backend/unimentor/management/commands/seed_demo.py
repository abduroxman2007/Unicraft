from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = 'Seed demo data: users, mentor profiles, bookings, reviews'

    def handle(self, *args, **options):
        User = get_user_model()
        # Create demo users
        student, _ = User.objects.get_or_create(username='student1', defaults={'email': 'student1@example.com', 'role': 'student'})
        if not student.has_usable_password():
            student.set_password('studentpass')
            student.save()
        mentor, _ = User.objects.get_or_create(username='mentor1', defaults={'email': 'mentor1@example.com', 'role': 'mentor'})
        if not mentor.has_usable_password():
            mentor.set_password('mentorpass')
            mentor.save()
        # Mentor profile
        from mentors.models import MentorProfile
        MentorProfile.objects.get_or_create(
            user=mentor,
            defaults={
                'university': 'Demo University',
                'program': 'Computer Science',
                'year': 3,
                'languages': 'English,Spanish',
                'price_per_hour': 50,
                'availability': [{'start': '2025-01-01T10:00:00Z', 'end': '2025-01-01T11:00:00Z'}],
            },
        )
        self.stdout.write(self.style.SUCCESS('Seeded demo users and mentor profile'))

