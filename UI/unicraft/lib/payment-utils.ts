// Payment system utilities
import { apiService } from './api';
import { Transaction, Booking } from '@/types/api';
import { NotificationUtils } from './notification-utils';

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank_transfer' | 'wallet';
  name: string;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
  clientSecret: string;
  paymentMethodId?: string;
}

export interface RefundRequest {
  transactionId: string;
  amount?: number;
  reason: string;
}

export class PaymentUtils {
  // Payment statuses
  static readonly PAYMENT_STATUSES = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded',
    CANCELLED: 'cancelled'
  };

  // Payment methods
  static readonly PAYMENT_METHODS = {
    CARD: 'card',
    PAYPAL: 'paypal',
    BANK_TRANSFER: 'bank_transfer',
    WALLET: 'wallet'
  };

  // Create payment intent
  static async createPaymentIntent(
    amount: number,
    currency: string = 'USD',
    bookingId?: number
  ): Promise<{ success: boolean; paymentIntent?: PaymentIntent; error?: string }> {
    try {
      // This would integrate with Stripe, PayPal, or your payment processor
      const mockPaymentIntent: PaymentIntent = {
        id: `pi_${Date.now()}`,
        amount,
        currency,
        status: 'requires_payment_method',
        clientSecret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`
      };

      return { success: true, paymentIntent: mockPaymentIntent };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to create payment intent.';
      return { success: false, error: errorMessage };
    }
  }

  // Process payment
  static async processPayment(
    paymentIntentId: string,
    paymentMethodId: string
  ): Promise<{ success: boolean; transaction?: Transaction; error?: string }> {
    try {
      // This would integrate with your payment processor
      const mockTransaction: Transaction = {
        id: Math.floor(Math.random() * 1000000),
        booking: 1, // This would be the actual booking ID
        student: {} as any,
        mentor: {} as any,
        amount: 100,
        currency: 'USD',
        status: this.PAYMENT_STATUSES.COMPLETED,
        payment_method: 'card',
        transaction_id: paymentIntentId,
        created_at: new Date().toISOString()
      };

      NotificationUtils.payment.success(mockTransaction.amount);
      return { success: true, transaction: mockTransaction };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Payment failed. Please try again.';
      NotificationUtils.payment.failed(errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  // Initiate transaction for booking
  static async initiateTransaction(bookingId: number): Promise<{ success: boolean; transaction?: Transaction; error?: string }> {
    try {
      const transaction = await apiService.initiateTransaction(bookingId);
      return { success: true, transaction };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to initiate transaction.';
      return { success: false, error: errorMessage };
    }
  }

  // Get user's payment methods
  static async getPaymentMethods(): Promise<{ success: boolean; methods?: PaymentMethod[]; error?: string }> {
    try {
      // This would fetch from your payment processor
      const mockMethods: PaymentMethod[] = [
        {
          id: 'pm_1',
          type: 'card',
          name: 'Visa ending in 4242',
          last4: '4242',
          brand: 'visa',
          expiryMonth: 12,
          expiryYear: 2025,
          isDefault: true
        },
        {
          id: 'pm_2',
          type: 'card',
          name: 'Mastercard ending in 5555',
          last4: '5555',
          brand: 'mastercard',
          expiryMonth: 8,
          expiryYear: 2026,
          isDefault: false
        }
      ];

      return { success: true, methods: mockMethods };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to fetch payment methods.';
      return { success: false, error: errorMessage };
    }
  }

  // Add payment method
  static async addPaymentMethod(
    type: string,
    details: any
  ): Promise<{ success: boolean; method?: PaymentMethod; error?: string }> {
    try {
      // This would integrate with your payment processor
      const mockMethod: PaymentMethod = {
        id: `pm_${Date.now()}`,
        type: type as any,
        name: `${type} ending in ${details.last4}`,
        last4: details.last4,
        brand: details.brand,
        expiryMonth: details.expiryMonth,
        expiryYear: details.expiryYear,
        isDefault: false
      };

      NotificationUtils.showSuccess('Payment Method Added', 'Your payment method has been added successfully.');
      return { success: true, method: mockMethod };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to add payment method.';
      NotificationUtils.showError('Add Payment Method Failed', errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  // Remove payment method
  static async removePaymentMethod(methodId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // This would remove from your payment processor
      NotificationUtils.showSuccess('Payment Method Removed', 'Your payment method has been removed successfully.');
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to remove payment method.';
      NotificationUtils.showError('Remove Payment Method Failed', errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  // Set default payment method
  static async setDefaultPaymentMethod(methodId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // This would update in your payment processor
      NotificationUtils.showSuccess('Default Payment Method Updated', 'Your default payment method has been updated.');
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to update default payment method.';
      NotificationUtils.showError('Update Failed', errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  // Get transaction history
  static async getTransactionHistory(): Promise<{ success: boolean; transactions?: Transaction[]; error?: string }> {
    try {
      const response = await apiService.getTransactions();
      return { success: true, transactions: response.results || [] };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to fetch transaction history.';
      return { success: false, error: errorMessage };
    }
  }

  // Process refund
  static async processRefund(refundRequest: RefundRequest): Promise<{ success: boolean; transaction?: Transaction; error?: string }> {
    try {
      // This would integrate with your payment processor
      const mockRefundedTransaction: Transaction = {
        id: Math.floor(Math.random() * 1000000),
        booking: 1,
        student: {} as any,
        mentor: {} as any,
        amount: refundRequest.amount || 100,
        currency: 'USD',
        status: this.PAYMENT_STATUSES.REFUNDED,
        payment_method: 'card',
        transaction_id: refundRequest.transactionId,
        created_at: new Date().toISOString()
      };

      NotificationUtils.payment.refunded(mockRefundedTransaction.amount);
      return { success: true, transaction: mockRefundedTransaction };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to process refund.';
      NotificationUtils.showError('Refund Failed', errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  // Calculate booking total
  static calculateBookingTotal(booking: Booking): number {
    const hours = booking.duration_minutes / 60;
    return hours * booking.mentor.hourly_rate;
  }

  // Calculate platform fee
  static calculatePlatformFee(amount: number, feePercentage: number = 0.1): number {
    return amount * feePercentage;
  }

  // Calculate mentor earnings
  static calculateMentorEarnings(amount: number, feePercentage: number = 0.1): number {
    return amount - this.calculatePlatformFee(amount, feePercentage);
  }

  // Format currency
  static formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  // Validate payment amount
  static validatePaymentAmount(amount: number): { valid: boolean; message?: string } {
    if (amount <= 0) {
      return { valid: false, message: 'Payment amount must be greater than zero' };
    }
    if (amount < 1) {
      return { valid: false, message: 'Minimum payment amount is $1.00' };
    }
    if (amount > 10000) {
      return { valid: false, message: 'Maximum payment amount is $10,000.00' };
    }
    return { valid: true };
  }

  // Get payment status color
  static getPaymentStatusColor(status: string): string {
    switch (status) {
      case this.PAYMENT_STATUSES.COMPLETED:
        return 'bg-green-100 text-green-800';
      case this.PAYMENT_STATUSES.PROCESSING:
        return 'bg-blue-100 text-blue-800';
      case this.PAYMENT_STATUSES.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case this.PAYMENT_STATUSES.FAILED:
        return 'bg-red-100 text-red-800';
      case this.PAYMENT_STATUSES.REFUNDED:
        return 'bg-purple-100 text-purple-800';
      case this.PAYMENT_STATUSES.CANCELLED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Get payment method icon
  static getPaymentMethodIcon(type: string): string {
    switch (type) {
      case 'card':
        return '💳';
      case 'paypal':
        return '🅿️';
      case 'bank_transfer':
        return '🏦';
      case 'wallet':
        return '💰';
      default:
        return '💳';
    }
  }

  // Check if payment is refundable
  static isRefundable(transaction: Transaction): boolean {
    return transaction.status === this.PAYMENT_STATUSES.COMPLETED;
  }

  // Get refund window (in days)
  static getRefundWindow(): number {
    return 30; // 30 days refund window
  }

  // Check if transaction is within refund window
  static isWithinRefundWindow(transaction: Transaction): boolean {
    const transactionDate = new Date(transaction.created_at);
    const refundDeadline = new Date(transactionDate.getTime() + (this.getRefundWindow() * 24 * 60 * 60 * 1000));
    return new Date() <= refundDeadline;
  }

  // Generate payment receipt
  static generatePaymentReceipt(transaction: Transaction): string {
    return `
Payment Receipt
================
Transaction ID: ${transaction.transaction_id}
Amount: ${this.formatCurrency(transaction.amount, transaction.currency)}
Status: ${transaction.status}
Date: ${new Date(transaction.created_at).toLocaleDateString()}
Payment Method: ${transaction.payment_method}
    `.trim();
  }

  // Setup payment webhooks (for production)
  static setupPaymentWebhooks(): void {
    // This would setup webhooks for payment events
    // Stripe, PayPal, etc. would send events to your backend
    console.log('Payment webhooks setup (mock)');
  }
}
