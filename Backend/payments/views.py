from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Transaction
from .serializers import TransactionSerializer


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all().order_by('-created_at')
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['post'])
    def initiate(self, request):
        """Placeholder endpoint to initiate a payment.

        Integration points: create Stripe PaymentIntent or PayPal order here.
        """
        return Response({
            "status": "skipped",
            "message": "Payment flow placeholder for MVP",
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Placeholder endpoint to confirm a payment."""
        return Response({
            "status": "skipped",
            "message": "Payment flow placeholder for MVP",
        }, status=status.HTTP_200_OK)

