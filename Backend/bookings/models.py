from django.db import models
from django.conf import settings
from django.utils import timezone


class Booking(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        ACCEPTED = 'accepted', 'Accepted'
        REJECTED = 'rejected', 'Rejected'
        COMPLETED = 'completed', 'Completed'

    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='student_bookings')
    mentor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='mentor_bookings')
    slot_time = models.DateTimeField()
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.PENDING)
    payment_id = models.CharField(max_length=64, blank=True)
    meet_link = models.URLField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self) -> str:
        return f"Booking {self.id} {self.student} -> {self.mentor} at {self.slot_time} ({self.status})"

    def generate_meet_link(self) -> str:
        # Dummy meet link as requested
        return f"https://meet.google.com/test-session-{self.id}"

# Create your models here.
