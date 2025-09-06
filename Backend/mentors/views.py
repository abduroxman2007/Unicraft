from rest_framework import viewsets, permissions, filters, status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import MentorProfile
from .serializers import MentorProfileSerializer
from unimentor.permissions import IsMentor, IsAdmin


class MentorProfileViewSet(viewsets.ModelViewSet):
    queryset = MentorProfile.objects.select_related('user').all()
    serializer_class = MentorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['university', 'program', 'year']
    search_fields = ['languages', 'user__first_name', 'user__last_name']
    ordering_fields = ['price_per_hour']

    def get_queryset(self):
        qs = super().get_queryset()
        language = self.request.query_params.get('language')
        max_price = self.request.query_params.get('max_price')
        min_price = self.request.query_params.get('min_price')
        if language:
            qs = qs.filter(languages__icontains=language)
        if min_price:
            qs = qs.filter(price_per_hour__gte=min_price)
        if max_price:
            qs = qs.filter(price_per_hour__lte=max_price)
        return qs

    def perform_create(self, serializer):
        # Only mentors can create their profile
        if not self.request.user.is_mentor() and not self.request.user.is_staff:
            raise permissions.PermissionDenied('Only mentors can create a mentor profile')
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        # Only the owner mentor or admin can update
        instance = self.get_object()
        user = self.request.user
        if instance.user_id != user.id and not user.is_staff:
            raise permissions.PermissionDenied('Not allowed to modify this profile')
        serializer.save()

    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def verify(self, request, pk=None):
        profile = self.get_object()
        profile.is_verified = True
        profile.save(update_fields=['is_verified'])
        return Response(MentorProfileSerializer(profile).data)

    @action(detail=False, methods=['get'], permission_classes=[IsMentor])
    def earnings(self, request):
        # Sum of confirmed (accepted/completed) bookings for the current mentor
        from bookings.models import Booking
        total = (
            Booking.objects.filter(mentor=request.user, status__in=[Booking.Status.ACCEPTED, Booking.Status.COMPLETED])
            .count()
        )
        # Placeholder: using count as sessions and price_per_hour if present
        profile = getattr(request.user, 'mentor_profile', None)
        rate = profile.price_per_hour if profile else 0
        amount = float(rate) * float(total)
        return Response({"sessions": total, "rate": float(rate), "amount": amount})

