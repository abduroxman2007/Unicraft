// Booking system utilities
import { apiService } from './api';
import { Booking, BookingRequest, Mentor } from '@/types/api';
import { NotificationUtils } from './notification-utils';

export interface BookingStatus {
  id: string;
  label: string;
  color: string;
  description: string;
}

export interface BookingWorkflow {
  step: number;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

export class BookingUtils {
  // Booking statuses
  static readonly STATUSES: Record<string, BookingStatus> = {
    pending: {
      id: 'pending',
      label: 'Pending',
      color: 'bg-yellow-100 text-yellow-800',
      description: 'Waiting for mentor approval'
    },
    accepted: {
      id: 'accepted',
      label: 'Accepted',
      color: 'bg-green-100 text-green-800',
      description: 'Mentor has accepted your request'
    },
    rejected: {
      id: 'rejected',
      label: 'Rejected',
      color: 'bg-red-100 text-red-800',
      description: 'Mentor has declined your request'
    },
    completed: {
      id: 'completed',
      label: 'Completed',
      color: 'bg-blue-100 text-blue-800',
      description: 'Session has been completed'
    },
    cancelled: {
      id: 'cancelled',
      label: 'Cancelled',
      color: 'bg-gray-100 text-gray-800',
      description: 'Session has been cancelled'
    }
  };

  // Create a new booking
  static async createBooking(bookingData: BookingRequest): Promise<{ success: boolean; booking?: Booking; error?: string }> {
    try {
      const booking = await apiService.createBooking(bookingData);
      NotificationUtils.booking.created(booking.mentor.user.first_name);
      return { success: true, booking };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to create booking. Please try again.';
      NotificationUtils.showError('Booking Failed', errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  // Get user's bookings
  static async getUserBookings(): Promise<{ success: boolean; bookings?: Booking[]; error?: string }> {
    try {
      const response = await apiService.getBookings();
      return { success: true, bookings: response.results || [] };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to fetch bookings.';
      return { success: false, error: errorMessage };
    }
  }

  // Accept a booking (for mentors)
  static async acceptBooking(bookingId: number): Promise<{ success: boolean; booking?: Booking; error?: string }> {
    try {
      const booking = await apiService.acceptBooking(bookingId);
      NotificationUtils.booking.accepted(booking.mentor.user.first_name);
      return { success: true, booking };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to accept booking.';
      NotificationUtils.showError('Action Failed', errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  // Reject a booking (for mentors)
  static async rejectBooking(bookingId: number): Promise<{ success: boolean; booking?: Booking; error?: string }> {
    try {
      const booking = await apiService.rejectBooking(bookingId);
      NotificationUtils.booking.rejected(booking.mentor.user.first_name);
      return { success: true, booking };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to reject booking.';
      NotificationUtils.showError('Action Failed', errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  // Complete a booking (for mentors)
  static async completeBooking(bookingId: number): Promise<{ success: boolean; booking?: Booking; error?: string }> {
    try {
      const booking = await apiService.completeBooking(bookingId);
      NotificationUtils.booking.completed(booking.mentor.user.first_name);
      return { success: true, booking };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to complete booking.';
      NotificationUtils.showError('Action Failed', errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  // Cancel a booking
  static async cancelBooking(bookingId: number): Promise<{ success: boolean; booking?: Booking; error?: string }> {
    try {
      // This would be implemented in your backend
      // const booking = await apiService.cancelBooking(bookingId);
      NotificationUtils.booking.cancelled('Mentor');
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to cancel booking.';
      NotificationUtils.showError('Action Failed', errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  // Get booking workflow steps
  static getBookingWorkflow(status: string): BookingWorkflow[] {
    const workflows: BookingWorkflow[] = [
      {
        step: 1,
        title: 'Request Sent',
        description: 'Your booking request has been sent to the mentor',
        completed: true,
        current: false
      },
      {
        step: 2,
        title: 'Mentor Review',
        description: 'Mentor is reviewing your request',
        completed: status !== 'pending',
        current: status === 'pending'
      },
      {
        step: 3,
        title: 'Session Scheduled',
        description: 'Session has been confirmed and scheduled',
        completed: ['accepted', 'completed'].includes(status),
        current: status === 'accepted'
      },
      {
        step: 4,
        title: 'Session Completed',
        description: 'Session has been completed successfully',
        completed: status === 'completed',
        current: status === 'completed'
      }
    ];

    return workflows;
  }

  // Format booking date and time
  static formatBookingDateTime(booking: Booking): string {
    const date = new Date(booking.session_date);
    const time = booking.session_time;
    return `${date.toLocaleDateString()} at ${time}`;
  }

  // Calculate booking duration in hours
  static getBookingDuration(booking: Booking): number {
    return booking.duration_minutes / 60;
  }

  // Calculate total cost
  static calculateTotalCost(booking: Booking): number {
    const hours = this.getBookingDuration(booking);
    return hours * booking.mentor.hourly_rate;
  }

  // Check if booking can be cancelled
  static canCancelBooking(booking: Booking): boolean {
    const now = new Date();
    const sessionDate = new Date(booking.session_date);
    const hoursUntilSession = (sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    return ['pending', 'accepted'].includes(booking.status) && hoursUntilSession > 24;
  }

  // Check if booking can be rescheduled
  static canRescheduleBooking(booking: Booking): boolean {
    const now = new Date();
    const sessionDate = new Date(booking.session_date);
    const hoursUntilSession = (sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    return ['accepted'].includes(booking.status) && hoursUntilSession > 48;
  }

  // Get upcoming bookings
  static getUpcomingBookings(bookings: Booking[]): Booking[] {
    const now = new Date();
    return bookings.filter(booking => {
      const sessionDate = new Date(booking.session_date);
      return sessionDate > now && ['accepted', 'pending'].includes(booking.status);
    }).sort((a, b) => new Date(a.session_date).getTime() - new Date(b.session_date).getTime());
  }

  // Get past bookings
  static getPastBookings(bookings: Booking[]): Booking[] {
    const now = new Date();
    return bookings.filter(booking => {
      const sessionDate = new Date(booking.session_date);
      return sessionDate < now || ['completed', 'cancelled', 'rejected'].includes(booking.status);
    }).sort((a, b) => new Date(b.session_date).getTime() - new Date(a.session_date).getTime());
  }

  // Validate booking request
  static validateBookingRequest(bookingData: BookingRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!bookingData.mentor) {
      errors.push('Please select a mentor');
    }

    if (!bookingData.session_date) {
      errors.push('Please select a session date');
    } else {
      const sessionDate = new Date(bookingData.session_date);
      const now = new Date();
      if (sessionDate <= now) {
        errors.push('Session date must be in the future');
      }
    }

    if (!bookingData.session_time) {
      errors.push('Please select a session time');
    }

    if (!bookingData.duration_minutes || bookingData.duration_minutes < 30) {
      errors.push('Session duration must be at least 30 minutes');
    }

    if (!bookingData.subject || bookingData.subject.trim().length < 3) {
      errors.push('Please provide a subject for the session');
    }

    if (!bookingData.description || bookingData.description.trim().length < 10) {
      errors.push('Please provide a detailed description (at least 10 characters)');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
