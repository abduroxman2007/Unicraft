from rest_framework import serializers

from .models import MentorProfile
from users.serializers import UserSerializer


class MentorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = MentorProfile
        fields = [
            'id', 'user', 'university', 'program', 'year', 'achievements',
            'languages', 'availability', 'status', 'verification_document_url',
        ]
        read_only_fields = ['id', 'status']

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)

    def validate_availability(self, value):
        # Expect a list of objects with start/end ISO strings for MVP
        if not isinstance(value, list):
            raise serializers.ValidationError('Availability must be a list')
        for slot in value:
            if not isinstance(slot, dict) or 'start' not in slot or 'end' not in slot:
                raise serializers.ValidationError('Each availability item must have start and end')
        return value


