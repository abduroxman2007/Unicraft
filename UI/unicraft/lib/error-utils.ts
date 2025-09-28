// Comprehensive error handling utilities
import { NotificationUtils } from './notification-utils';

export interface ErrorInfo {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  userAction?: string;
  context?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

export class ErrorUtils {
  // Error types
  static readonly ERROR_TYPES = {
    NETWORK: 'NETWORK_ERROR',
    AUTHENTICATION: 'AUTH_ERROR',
    VALIDATION: 'VALIDATION_ERROR',
    PERMISSION: 'PERMISSION_ERROR',
    NOT_FOUND: 'NOT_FOUND_ERROR',
    SERVER: 'SERVER_ERROR',
    CLIENT: 'CLIENT_ERROR',
    UNKNOWN: 'UNKNOWN_ERROR'
  };

  // Error codes
  static readonly ERROR_CODES = {
    // Network errors
    NETWORK_TIMEOUT: 'NETWORK_TIMEOUT',
    NETWORK_OFFLINE: 'NETWORK_OFFLINE',
    NETWORK_CONNECTION_FAILED: 'NETWORK_CONNECTION_FAILED',
    
    // Authentication errors
    AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
    AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
    AUTH_UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
    AUTH_FORBIDDEN: 'AUTH_FORBIDDEN',
    
    // Validation errors
    VALIDATION_REQUIRED_FIELD: 'VALIDATION_REQUIRED_FIELD',
    VALIDATION_INVALID_FORMAT: 'VALIDATION_INVALID_FORMAT',
    VALIDATION_CONSTRAINT_VIOLATION: 'VALIDATION_CONSTRAINT_VIOLATION',
    
    // Permission errors
    PERMISSION_DENIED: 'PERMISSION_DENIED',
    PERMISSION_INSUFFICIENT_ROLE: 'PERMISSION_INSUFFICIENT_ROLE',
    
    // Not found errors
    NOT_FOUND_USER: 'NOT_FOUND_USER',
    NOT_FOUND_MENTOR: 'NOT_FOUND_MENTOR',
    NOT_FOUND_BOOKING: 'NOT_FOUND_BOOKING',
    
    // Server errors
    SERVER_INTERNAL_ERROR: 'SERVER_INTERNAL_ERROR',
    SERVER_MAINTENANCE: 'SERVER_MAINTENANCE',
    SERVER_RATE_LIMIT: 'SERVER_RATE_LIMIT',
    
    // Client errors
    CLIENT_VALIDATION_ERROR: 'CLIENT_VALIDATION_ERROR',
    CLIENT_STATE_ERROR: 'CLIENT_STATE_ERROR'
  };

  // Handle API errors
  static handleApiError(error: any, context?: string): ErrorInfo {
    const errorInfo: ErrorInfo = {
      code: this.ERROR_CODES.UNKNOWN_ERROR,
      message: 'An unexpected error occurred',
      timestamp: new Date(),
      context
    };

    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 400:
          errorInfo.code = this.ERROR_CODES.VALIDATION_REQUIRED_FIELD;
          errorInfo.message = data?.detail || 'Invalid request data';
          break;
        case 401:
          errorInfo.code = this.ERROR_CODES.AUTH_UNAUTHORIZED;
          errorInfo.message = 'Authentication required';
          break;
        case 403:
          errorInfo.code = this.ERROR_CODES.PERMISSION_DENIED;
          errorInfo.message = 'Access denied';
          break;
        case 404:
          errorInfo.code = this.ERROR_CODES.NOT_FOUND_USER;
          errorInfo.message = 'Resource not found';
          break;
        case 429:
          errorInfo.code = this.ERROR_CODES.SERVER_RATE_LIMIT;
          errorInfo.message = 'Too many requests. Please try again later';
          break;
        case 500:
          errorInfo.code = this.ERROR_CODES.SERVER_INTERNAL_ERROR;
          errorInfo.message = 'Server error. Please try again later';
          break;
        case 503:
          errorInfo.code = this.ERROR_CODES.SERVER_MAINTENANCE;
          errorInfo.message = 'Service temporarily unavailable';
          break;
        default:
          errorInfo.code = this.ERROR_CODES.SERVER_INTERNAL_ERROR;
          errorInfo.message = data?.detail || `Server error (${status})`;
      }

      errorInfo.details = data;
    } else if (error.request) {
      // Network error
      errorInfo.code = this.ERROR_CODES.NETWORK_CONNECTION_FAILED;
      errorInfo.message = 'Network error. Please check your connection';
      errorInfo.details = error.request;
    } else {
      // Other error
      errorInfo.code = this.ERROR_CODES.CLIENT_ERROR;
      errorInfo.message = error.message || 'An unexpected error occurred';
      errorInfo.details = error;
    }

    // Log error
    this.logError(errorInfo);

    return errorInfo;
  }

  // Handle validation errors
  static handleValidationError(errors: string[]): ErrorInfo {
    const errorInfo: ErrorInfo = {
      code: this.ERROR_CODES.VALIDATION_REQUIRED_FIELD,
      message: errors.join(', '),
      timestamp: new Date(),
      context: 'validation'
    };

    this.logError(errorInfo);
    return errorInfo;
  }

  // Handle authentication errors
  static handleAuthError(error: any): ErrorInfo {
    const errorInfo: ErrorInfo = {
      code: this.ERROR_CODES.AUTH_INVALID_CREDENTIALS,
      message: 'Authentication failed',
      timestamp: new Date(),
      context: 'authentication'
    };

    if (error.response?.status === 401) {
      errorInfo.code = this.ERROR_CODES.AUTH_TOKEN_EXPIRED;
      errorInfo.message = 'Session expired. Please log in again';
    }

    this.logError(errorInfo);
    return errorInfo;
  }

  // Show user-friendly error message
  static showUserError(errorInfo: ErrorInfo, userAction?: string): void {
    const action = userAction || 'Please try again';
    
    switch (errorInfo.code) {
      case this.ERROR_CODES.AUTH_TOKEN_EXPIRED:
        NotificationUtils.auth.sessionExpired();
        break;
      case this.ERROR_CODES.AUTH_UNAUTHORIZED:
        NotificationUtils.showError('Authentication Required', 'Please log in to continue');
        break;
      case this.ERROR_CODES.PERMISSION_DENIED:
        NotificationUtils.showError('Access Denied', 'You do not have permission to perform this action');
        break;
      case this.ERROR_CODES.NETWORK_CONNECTION_FAILED:
        NotificationUtils.showError('Connection Error', 'Please check your internet connection and try again');
        break;
      case this.ERROR_CODES.SERVER_MAINTENANCE:
        NotificationUtils.showWarning('Service Unavailable', 'We are currently performing maintenance. Please try again later');
        break;
      case this.ERROR_CODES.SERVER_RATE_LIMIT:
        NotificationUtils.showWarning('Rate Limit Exceeded', 'Too many requests. Please wait a moment and try again');
        break;
      default:
        NotificationUtils.showError('Error', errorInfo.message, {
          label: action,
          onClick: () => window.location.reload()
        });
    }
  }

  // Log error for debugging
  static logError(errorInfo: ErrorInfo): void {
    console.error('Error occurred:', {
      code: errorInfo.code,
      message: errorInfo.message,
      context: errorInfo.context,
      timestamp: errorInfo.timestamp,
      details: errorInfo.details
    });

    // In production, you would send this to an error tracking service
    // like Sentry, LogRocket, or your own logging service
    if (process.env.NODE_ENV === 'production') {
      // this.sendToErrorTracking(errorInfo);
    }
  }

  // Retry mechanism for failed requests
  static async retryRequest<T>(
    requestFn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          throw error;
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }

    throw lastError;
  }

  // Check if error is retryable
  static isRetryableError(error: any): boolean {
    if (!error.response) return true; // Network errors are retryable
    
    const status = error.response.status;
    return [408, 429, 500, 502, 503, 504].includes(status);
  }

  // Get error message for user display
  static getUserErrorMessage(error: any): string {
    const errorInfo = this.handleApiError(error);
    
    // Return user-friendly messages
    switch (errorInfo.code) {
      case this.ERROR_CODES.AUTH_TOKEN_EXPIRED:
        return 'Your session has expired. Please log in again.';
      case this.ERROR_CODES.AUTH_INVALID_CREDENTIALS:
        return 'Invalid email or password. Please try again.';
      case this.ERROR_CODES.PERMISSION_DENIED:
        return 'You do not have permission to perform this action.';
      case this.ERROR_CODES.NETWORK_CONNECTION_FAILED:
        return 'Unable to connect to the server. Please check your internet connection.';
      case this.ERROR_CODES.SERVER_MAINTENANCE:
        return 'The service is temporarily unavailable. Please try again later.';
      case this.ERROR_CODES.SERVER_RATE_LIMIT:
        return 'Too many requests. Please wait a moment and try again.';
      case this.ERROR_CODES.NOT_FOUND_USER:
        return 'The requested resource was not found.';
      default:
        return errorInfo.message;
    }
  }

  // Handle form validation errors
  static handleFormErrors(errors: Record<string, string[]>): string[] {
    const allErrors: string[] = [];
    
    Object.entries(errors).forEach(([field, fieldErrors]) => {
      fieldErrors.forEach(error => {
        allErrors.push(`${field}: ${error}`);
      });
    });

    return allErrors;
  }

  // Create error boundary state
  static createErrorBoundaryState(error: Error, errorInfo: any): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo
    };
  }

  // Reset error boundary state
  static resetErrorBoundaryState(): ErrorBoundaryState {
    return {
      hasError: false
    };
  }

  // Check if user is online
  static isOnline(): boolean {
    return navigator.onLine;
  }

  // Handle offline errors
  static handleOfflineError(): void {
    NotificationUtils.showWarning(
      'You are offline',
      'Please check your internet connection and try again.',
      {
        label: 'Retry',
        onClick: () => window.location.reload()
      }
    );
  }

  // Global error handler
  static setupGlobalErrorHandler(): void {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.handleApiError(event.reason, 'unhandled-promise-rejection');
    });

    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      console.error('JavaScript error:', event.error);
      this.handleApiError(event.error, 'javascript-error');
    });

    // Handle network status changes
    window.addEventListener('online', () => {
      NotificationUtils.showSuccess('Connection Restored', 'You are back online!');
    });

    window.addEventListener('offline', () => {
      this.handleOfflineError();
    });
  }
}
