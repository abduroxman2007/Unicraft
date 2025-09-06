from rest_framework import serializers

from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            'id', 'student', 'mentor', 'slot_time', 'status', 'payment_id', 'meet_link', 'created_at',
        ]
        read_only_fields = ['id', 'status', 'meet_link', 'created_at', 'student']

    def create(self, validated_data):
        request = self.context['request']
        validated_data['student'] = request.user
        booking = super().create(validated_data)
        # Generate meet link upon creation if status is accepted; for MVP, generate on accept
        return booking


