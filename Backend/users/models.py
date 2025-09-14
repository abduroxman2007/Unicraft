from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """Custom user model extending Django's AbstractUser with a role field.

    Roles:
    - student: Default role for users booking mentorship sessions
    - mentor: Users offering mentorship
    - admin: Staff/admin users
    """

    class Role(models.TextChoices):
        STUDENT = 'student', 'Student'
        MENTOR = 'mentor', 'Mentor'
        ADMIN = 'admin', 'Admin'

    role = models.CharField(
        max_length=16,
        choices=Role.choices,
        default=Role.STUDENT,
        help_text="Role of the user for authorization flows",
    )

    google_id = models.CharField(max_length=100, unique=True, blank=True, null=True)
    profile_picture = models.URLField(blank=True, null=True)

    # Add fields from backup for import compatibility
    full_name = models.CharField(max_length=255, blank=True, null=True)
    avatar = models.CharField(max_length=100, blank=True, null=True)
    c_username = models.CharField(max_length=255, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    facebook = models.CharField(max_length=255, blank=True, null=True)
    instagram = models.CharField(max_length=255, blank=True, null=True)
    linkedin = models.CharField(max_length=255, blank=True, null=True)
    telegram = models.CharField(max_length=255, blank=True, null=True)
    website = models.CharField(max_length=255, blank=True, null=True)
    youtube = models.CharField(max_length=255, blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    degree = models.CharField(max_length=1, blank=True, null=True)
    date_of_birth = models.DateField(null=True, blank=True)
    phone_number = models.CharField(max_length=50, blank=True, null=True)
    background_img = models.CharField(max_length=100, blank=True, null=True)
    can_create_consultation = models.BooleanField(default=False)
    telegram_id = models.BigIntegerField(null=True, blank=True)

    def is_student(self) -> bool:
        return self.role == self.Role.STUDENT

    def is_mentor(self) -> bool:
        return self.role == self.Role.MENTOR

    def is_admin(self) -> bool:
        return self.role == self.Role.ADMIN

    def __str__(self) -> str:
        return f"{self.username} ({self.role})"

# Create your models here.
