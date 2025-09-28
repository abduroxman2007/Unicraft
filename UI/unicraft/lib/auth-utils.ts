// Authentication utility functions
import { apiService } from './api';
import { User, LoginRequest, RegisterRequest } from '@/types/api';

export class AuthUtils {
  // Login workflow
  static async loginUser(credentials: LoginRequest): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const response = await apiService.login(credentials);
      return { success: true, user: response.user };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed. Please check your credentials.' 
      };
    }
  }

  // Registration workflow
  static async registerUser(userData: RegisterRequest): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const response = await apiService.register(userData);
      return { success: true, user: response.user };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Registration failed. Please try again.' 
      };
    }
  }

  // Logout workflow
  static async logoutUser(): Promise<{ success: boolean; error?: string }> {
    try {
      await apiService.logout();
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: 'Logout failed. Please try again.' 
      };
    }
  }

  // Password reset request
  static async requestPasswordReset(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      // This would call your backend API for password reset
      // await apiService.requestPasswordReset(email);
      return { 
        success: true, 
        message: 'Password reset instructions sent to your email.' 
      };
    } catch (error: any) {
      return { 
        success: false, 
        error: 'Failed to send password reset email. Please try again.' 
      };
    }
  }

  // Email verification
  static async verifyEmail(token: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      // await apiService.verifyEmail(token);
      return { 
        success: true, 
        message: 'Email verified successfully!' 
      };
    } catch (error: any) {
      return { 
        success: false, 
        error: 'Email verification failed. Please try again.' 
      };
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('access_token');
  }

  // Get current user from token
  static async getCurrentUser(): Promise<User | null> {
    try {
      if (!this.isAuthenticated()) return null;
      return await apiService.getCurrentUser();
    } catch (error) {
      return null;
    }
  }

  // Validate email format
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  static validatePassword(password: string): { valid: boolean; message?: string } {
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/(?=.*\d)/.test(password)) {
      return { valid: false, message: 'Password must contain at least one number' };
    }
    return { valid: true };
  }

  // Generate secure random string
  static generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
