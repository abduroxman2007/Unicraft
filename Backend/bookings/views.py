from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import models

from .models import Booking
from .serializers import BookingSerializer


def send_email_reminder_placeholder(booking: Booking):
    # Placeholder: prints to console instead of sending email
    print(f"[Email Placeholder] Reminder sent for booking {booking.id} at {booking.slot_time}")


class IsStudentOrMentor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj: Booking):
        return obj.student_id == request.user.id or obj.mentor_id == request.user.id or request.user.is_staff


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all().order_by('-created_at')
    serializer_class = BookingSerializer
    permission_classes = [IsStudentOrMentor]

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if not user.is_staff:
            qs = qs.filter(models.Q(student=user) | models.Q(mentor=user))
        return qs

    def perform_create(self, serializer):
        # Only students can create bookings
        if not self.request.user.is_student() and not self.request.user.is_staff:
            raise permissions.PermissionDenied('Only students can create bookings')
        serializer.save(student=self.request.user)

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        booking = self.get_object()
        if booking.mentor_id != request.user.id and not request.user.is_staff:
            raise permissions.PermissionDenied('Only the mentor can accept this booking')
        booking.status = Booking.Status.ACCEPTED
        if not booking.meet_link:
            booking.save()
            booking.meet_link = booking.generate_meet_link()
        booking.save()
        send_email_reminder_placeholder(booking)
        return Response(BookingSerializer(booking).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        booking = self.get_object()
        if booking.mentor_id != request.user.id and not request.user.is_staff:
            raise permissions.PermissionDenied('Only the mentor can reject this booking')
        booking.status = Booking.Status.REJECTED
        booking.save()
        return Response(BookingSerializer(booking).data)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        booking = self.get_object()
        if booking.student_id != request.user.id and booking.mentor_id != request.user.id and not request.user.is_staff:
            raise permissions.PermissionDenied('Only participants can complete this booking')
        booking.status = Booking.Status.COMPLETED
        booking.save()
        return Response(BookingSerializer(booking).data)

