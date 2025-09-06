from rest_framework import serializers

from .models import Transaction


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'booking', 'amount', 'payment_provider', 'status', 'external_id', 'created_at']
        read_only_fields = ['id', 'status', 'created_at']


