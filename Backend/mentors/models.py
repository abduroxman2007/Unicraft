from django.db import models
from django.conf import settings


class MentorProfile(models.Model):
    """Mentor profile with university, program, languages, achievements, and rate.

    Availability is stored as a free-form JSON/text for MVP; later we can
    move to a normalized availability/slots schema.
    """

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='mentor_profile')
    university = models.CharField(max_length=255, blank=True)
    program = models.CharField(max_length=255, blank=True)
    year = models.IntegerField(blank=True, null=True, help_text='Study year or graduation year')
    achievements = models.TextField(blank=True)
    languages = models.CharField(max_length=255, blank=True, help_text='Comma-separated list')
    price_per_hour = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    availability = models.JSONField(default=list, blank=True)
    is_verified = models.BooleanField(default=False)
    verification_document_url = models.URLField(blank=True)

    def __str__(self) -> str:
        return f"MentorProfile of {self.user.username}"

# Create your models here.
