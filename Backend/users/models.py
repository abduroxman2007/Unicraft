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

    # Make email unique and required
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True, blank=True, null=True)
    
    # Google OAuth fields
    google_id = models.CharField(max_length=100, unique=True, blank=True, null=True)
    profile_picture = models.URLField(blank=True, null=True)
    
    role = models.CharField(
        max_length=16,
        choices=Role.choices,
        default=Role.STUDENT,
        help_text="Role of the user for authorization flows",
    )

    # Override USERNAME_FIELD to use email
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def is_student(self) -> bool:
        return self.role == self.Role.STUDENT

    def is_mentor(self) -> bool:
        return self.role == self.Role.MENTOR

    def is_admin(self) -> bool:
        return self.role == self.Role.ADMIN

    def __str__(self) -> str:
        return f"{self.email} ({self.role})"

# Create your models here.
