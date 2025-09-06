from rest_framework import viewsets, permissions

from .models import Review
from .serializers import ReviewSerializer


class IsStudentOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj: Review):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.student_id == request.user.id or request.user.is_staff


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsStudentOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        mentor_id = self.request.query_params.get('mentor')
        if mentor_id:
            qs = qs.filter(mentor_id=mentor_id)
        return qs

    def perform_create(self, serializer):
        # Only students can create reviews
        if not self.request.user.is_student() and not self.request.user.is_staff:
            raise permissions.PermissionDenied('Only students can leave reviews')
        serializer.save(student=self.request.user)

