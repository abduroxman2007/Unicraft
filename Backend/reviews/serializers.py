from rest_framework import serializers

from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'student', 'mentor', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'student', 'created_at']

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError('Rating must be between 1 and 5')
        return value

    def create(self, validated_data):
        validated_data['student'] = self.context['request'].user
        return super().create(validated_data)


