from rest_framework import viewsets, permissions, filters, status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import MentorProfile
from .serializers import MentorProfileSerializer
from unimentor.permissions import IsMentor, IsAdmin
from users.models import User


class MentorProfileViewSet(viewsets.ModelViewSet):
    queryset = MentorProfile.objects.select_related('user').all()
    serializer_class = MentorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['university', 'program', 'year']
    search_fields = ['languages', 'user__first_name', 'user__last_name']
    ordering_fields = []

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user

        # Admin users can see all profiles
        if user.is_staff:
            return qs

        # Authenticated users see only approved profiles
        qs = qs.filter(status=MentorProfile.Status.APPROVED)

        language = self.request.query_params.get('language')
        if language:
            qs = qs.filter(languages__icontains=language)
        return qs

    def perform_create(self, serializer):
        # Any authenticated user can apply to be a mentor.
        # Their profile will be pending until approved by an admin.
        if MentorProfile.objects.filter(user=self.request.user).exists():
            raise permissions.PermissionDenied('You already have a mentor profile.')
        serializer.save(user=self.request.user, status=MentorProfile.Status.PENDING)

    def perform_update(self, serializer):
        # Only the owner mentor or admin can update
        instance = self.get_object()
        user = self.request.user
        if instance.user_id != user.id and not user.is_staff:
            raise permissions.PermissionDenied('Not allowed to modify this profile')
        serializer.save()

    @action(detail=False, methods=['get'], permission_classes=[IsAdmin])
    def pending(self, request):
        """List all mentor profiles that are pending approval."""
        pending_profiles = self.get_queryset().filter(status=MentorProfile.Status.PENDING)
        serializer = self.get_serializer(pending_profiles, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def approve(self, request, pk=None):
        """Approve a mentor application."""
        profile = self.get_object()
        if profile.status != MentorProfile.Status.PENDING:
            return Response({'error': 'Profile is not pending approval.'}, status=status.HTTP_400_BAD_REQUEST)

        profile.status = MentorProfile.Status.APPROVED
        profile.save(update_fields=['status'])

        # Promote user to Mentor role
        user = profile.user
        user.role = User.Role.MENTOR
        user.save(update_fields=['role'])

        return Response(self.get_serializer(profile).data)

    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def reject(self, request, pk=None):
        """Reject a mentor application."""
        profile = self.get_object()
        if profile.status != MentorProfile.Status.PENDING:
            return Response({'error': 'Profile is not pending approval.'}, status=status.HTTP_400_BAD_REQUEST)

        profile.status = MentorProfile.Status.REJECTED
        profile.save(update_fields=['status'])
        return Response(self.get_serializer(profile).data)

    @action(detail=False, methods=['get'], permission_classes=[IsMentor])
    def earnings(self, request):
        # Sum of confirmed (accepted/completed) bookings for the current mentor
        from bookings.models import Booking
        total = (
            Booking.objects.filter(mentor=request.user, status__in=[Booking.Status.ACCEPTED, Booking.Status.COMPLETED])
            .count()
        )
        # Placeholder for fixed rate, e.g., from settings
        fixed_rate = 25.00  # Example fixed rate
        amount = float(fixed_rate) * float(total)
        return Response({"sessions": total, "rate": float(fixed_rate), "amount": amount})

