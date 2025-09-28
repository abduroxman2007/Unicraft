// Notification and messaging utilities
import { toast } from 'sonner';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export class NotificationUtils {
  // Show success notification
  static showSuccess(title: string, message: string, action?: { label: string; onClick: () => void }) {
    toast.success(title, {
      description: message,
      action: action ? {
        label: action.label,
        onClick: action.onClick
      } : undefined,
      duration: 5000,
    });
  }

  // Show error notification
  static showError(title: string, message: string, action?: { label: string; onClick: () => void }) {
    toast.error(title, {
      description: message,
      action: action ? {
        label: action.label,
        onClick: action.onClick
      } : undefined,
      duration: 7000,
    });
  }

  // Show warning notification
  static showWarning(title: string, message: string, action?: { label: string; onClick: () => void }) {
    toast.warning(title, {
      description: message,
      action: action ? {
        label: action.label,
        onClick: action.onClick
      } : undefined,
      duration: 6000,
    });
  }

  // Show info notification
  static showInfo(title: string, message: string, action?: { label: string; onClick: () => void }) {
    toast.info(title, {
      description: message,
      action: action ? {
        label: action.label,
        onClick: action.onClick
      } : undefined,
      duration: 5000,
    });
  }

  // Show loading notification
  static showLoading(title: string, message: string) {
    return toast.loading(title, {
      description: message,
    });
  }

  // Dismiss notification
  static dismiss(toastId: string | number) {
    toast.dismiss(toastId);
  }

  // Show promise-based notification
  static showPromise<T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) {
    return toast.promise(promise, {
      loading,
      success,
      error,
    });
  }

  // Authentication-specific notifications
  static auth = {
    loginSuccess: (userName: string) => {
      NotificationUtils.showSuccess(
        'Welcome back!',
        `Hello ${userName}, you've successfully logged in.`,
        { label: 'Go to Dashboard', onClick: () => window.location.href = '/profile' }
      );
    },
    loginError: (error: string) => {
      NotificationUtils.showError(
        'Login Failed',
        error,
        { label: 'Try Again', onClick: () => window.location.href = '/signin' }
      );
    },
    registerSuccess: (userName: string) => {
      NotificationUtils.showSuccess(
        'Account Created!',
        `Welcome ${userName}! Your account has been created successfully.`,
        { label: 'Complete Profile', onClick: () => window.location.href = '/profile' }
      );
    },
    registerError: (error: string) => {
      NotificationUtils.showError(
        'Registration Failed',
        error,
        { label: 'Try Again', onClick: () => window.location.href = '/signup' }
      );
    },
    logoutSuccess: () => {
      NotificationUtils.showInfo(
        'Logged Out',
        'You have been successfully logged out.',
        { label: 'Login Again', onClick: () => window.location.href = '/signin' }
      );
    },
    sessionExpired: () => {
      NotificationUtils.showWarning(
        'Session Expired',
        'Your session has expired. Please log in again.',
        { label: 'Login', onClick: () => window.location.href = '/signin' }
      );
    },
  };

  // Booking-specific notifications
  static booking = {
    created: (mentorName: string) => {
      NotificationUtils.showSuccess(
        'Booking Created!',
        `Your session with ${mentorName} has been requested.`,
        { label: 'View Bookings', onClick: () => window.location.href = '/bookings' }
      );
    },
    accepted: (mentorName: string) => {
      NotificationUtils.showSuccess(
        'Booking Accepted!',
        `${mentorName} has accepted your session request.`,
        { label: 'View Details', onClick: () => window.location.href = '/bookings' }
      );
    },
    rejected: (mentorName: string) => {
      NotificationUtils.showWarning(
        'Booking Declined',
        `${mentorName} has declined your session request.`,
        { label: 'Find Another Mentor', onClick: () => window.location.href = '/find-mentor' }
      );
    },
    completed: (mentorName: string) => {
      NotificationUtils.showSuccess(
        'Session Completed!',
        `Your session with ${mentorName} has been completed.`,
        { label: 'Leave Review', onClick: () => window.location.href = '/bookings' }
      );
    },
    cancelled: (mentorName: string) => {
      NotificationUtils.showInfo(
        'Session Cancelled',
        `Your session with ${mentorName} has been cancelled.`,
        { label: 'Reschedule', onClick: () => window.location.href = '/find-mentor' }
      );
    },
  };

  // Payment-specific notifications
  static payment = {
    success: (amount: number) => {
      NotificationUtils.showSuccess(
        'Payment Successful!',
        `Payment of $${amount} has been processed successfully.`,
        { label: 'View Transaction', onClick: () => window.location.href = '/bookings' }
      );
    },
    failed: (error: string) => {
      NotificationUtils.showError(
        'Payment Failed',
        error,
        { label: 'Try Again', onClick: () => window.location.href = '/bookings' }
      );
    },
    refunded: (amount: number) => {
      NotificationUtils.showInfo(
        'Refund Processed',
        `A refund of $${amount} has been processed to your account.`,
        { label: 'View Details', onClick: () => window.location.href = '/bookings' }
      );
    },
  };

  // Profile-specific notifications
  static profile = {
    updated: () => {
      NotificationUtils.showSuccess(
        'Profile Updated!',
        'Your profile has been updated successfully.',
      );
    },
    updateError: (error: string) => {
      NotificationUtils.showError(
        'Update Failed',
        error,
        { label: 'Try Again', onClick: () => window.location.reload() }
      );
    },
  };
}
