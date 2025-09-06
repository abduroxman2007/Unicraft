from django.db import models
from django.conf import settings


class Transaction(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        SUCCESS = 'success', 'Success'
        FAILED = 'failed', 'Failed'
        SKIPPED = 'skipped', 'Skipped'

    booking = models.ForeignKey('bookings.Booking', on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_provider = models.CharField(max_length=50, blank=True, help_text='e.g., stripe, paypal')
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.PENDING)
    external_id = models.CharField(max_length=128, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"Txn {self.id} booking={self.booking_id} {self.status} {self.amount}"

# Create your models here.
