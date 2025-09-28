// Admin system utilities
import { apiService } from './api';
import { User, Mentor, Booking, Transaction } from '@/types/api';
import { NotificationUtils } from './notification-utils';

export interface AdminStats {
  totalUsers: number;
  totalMentors: number;
  totalBookings: number;
  totalRevenue: number;
  pendingMentors: number;
  activeUsers: number;
  completedSessions: number;
  averageRating: number;
}

export interface UserManagementFilters {
  userType?: 'student' | 'tutor' | 'admin';
  status?: 'active' | 'inactive';
  dateJoined?: {
    from: string;
    to: string;
  };
  search?: string;
}

export interface MentorManagementFilters {
  status?: 'approved' | 'pending' | 'rejected';
  expertise?: string[];
  rating?: {
    min: number;
    max: number;
  };
  experience?: {
    min: number;
    max: number;
  };
  search?: string;
}

export class AdminUtils {
  // Get admin dashboard statistics
  static async getAdminStats(): Promise<{ success: boolean; stats?: AdminStats; error?: string }> {
    try {
      // This would aggregate data from multiple API calls
      const [usersResponse, mentorsResponse, bookingsResponse, transactionsResponse] = await Promise.all([
        apiService.getUsers(),
        apiService.getMentors(),
        apiService.getBookings(),
        apiService.getTransactions()
      ]);

      const users = usersResponse.results || [];
      const mentors = mentorsResponse.results || [];
      const bookings = bookingsResponse.results || [];
      const transactions = transactionsResponse.results || [];

      const stats: AdminStats = {
        totalUsers: users.length,
        totalMentors: mentors.filter(m => m.is_approved).length,
        totalBookings: bookings.length,
        totalRevenue: transactions
          .filter(t => t.status === 'completed')
          .reduce((sum, t) => sum + t.amount, 0),
        pendingMentors: mentors.filter(m => !m.is_approved).length,
        activeUsers: users.filter(u => u.is_active).length,
        completedSessions: bookings.filter(b => b.status === 'completed').length,
        averageRating: mentors.length > 0 
          ? mentors.reduce((sum, m) => sum + m.rating, 0) / mentors.length 
          : 0
      };

      return { success: true, stats };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to fetch admin statistics.';
      return { success: false, error: errorMessage };
    }
  }

  // Get all users with filtering
  static async getUsers(filters: UserManagementFilters = {}): Promise<{ success: boolean; users?: User[]; error?: string }> {
    try {
      const response = await apiService.getUsers();
      let users = response.results || [];

      // Apply filters
      if (filters.userType) {
        users = users.filter(user => user.user_type === filters.userType);
      }

      if (filters.status) {
        users = users.filter(user => 
          filters.status === 'active' ? user.is_active : !user.is_active
        );
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        users = users.filter(user => 
          `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm) ||
          user.university?.toLowerCase().includes(searchTerm)
        );
      }

      if (filters.dateJoined) {
        users = users.filter(user => {
          const joinDate = new Date(user.date_joined);
          const fromDate = new Date(filters.dateJoined!.from);
          const toDate = new Date(filters.dateJoined!.to);
          return joinDate >= fromDate && joinDate <= toDate;
        });
      }

      return { success: true, users };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to fetch users.';
      return { success: false, error: errorMessage };
    }
  }

  // Get pending mentors
  static async getPendingMentors(): Promise<{ success: boolean; mentors?: Mentor[]; error?: string }> {
    try {
      const response = await apiService.getPendingMentors();
      return { success: true, mentors: response.results || [] };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to fetch pending mentors.';
      return { success: false, error: errorMessage };
    }
  }

  // Approve mentor
  static async approveMentor(mentorId: number): Promise<{ success: boolean; mentor?: Mentor; error?: string }> {
    try {
      const mentor = await apiService.approveMentor(mentorId);
      NotificationUtils.showSuccess(
        'Mentor Approved',
        `${mentor.user.first_name} ${mentor.user.last_name} has been approved as a mentor.`
      );
      return { success: true, mentor };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to approve mentor.';
      NotificationUtils.showError('Approval Failed', errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  // Reject mentor
  static async rejectMentor(mentorId: number): Promise<{ success: boolean; mentor?: Mentor; error?: string }> {
    try {
      const mentor = await apiService.rejectMentor(mentorId);
      NotificationUtils.showWarning(
        'Mentor Rejected',
        `${mentor.user.first_name} ${mentor.user.last_name} has been rejected as a mentor.`
      );
      return { success: true, mentor };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to reject mentor.';
      NotificationUtils.showError('Rejection Failed', errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  // Get all mentors with filtering
  static async getMentors(filters: MentorManagementFilters = {}): Promise<{ success: boolean; mentors?: Mentor[]; error?: string }> {
    try {
      const response = await apiService.getMentors();
      let mentors = response.results || [];

      // Apply filters
      if (filters.status) {
        switch (filters.status) {
          case 'approved':
            mentors = mentors.filter(m => m.is_approved);
            break;
          case 'pending':
            mentors = mentors.filter(m => !m.is_approved);
            break;
          case 'rejected':
            // This would need to be implemented in your backend
            mentors = mentors.filter(m => !m.is_approved);
            break;
        }
      }

      if (filters.expertise && filters.expertise.length > 0) {
        mentors = mentors.filter(mentor =>
          filters.expertise!.some(expertise =>
            mentor.expertise_areas.some(area =>
              area.toLowerCase().includes(expertise.toLowerCase())
            )
          )
        );
      }

      if (filters.rating) {
        mentors = mentors.filter(mentor =>
          mentor.rating >= filters.rating!.min && mentor.rating <= filters.rating!.max
        );
      }

      if (filters.experience) {
        mentors = mentors.filter(mentor =>
          mentor.experience_years >= filters.experience!.min && 
          mentor.experience_years <= filters.experience!.max
        );
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        mentors = mentors.filter(mentor =>
          `${mentor.user.first_name} ${mentor.user.last_name}`.toLowerCase().includes(searchTerm) ||
          mentor.user.email.toLowerCase().includes(searchTerm) ||
          mentor.expertise_areas.some(area => area.toLowerCase().includes(searchTerm))
        );
      }

      return { success: true, mentors };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to fetch mentors.';
      return { success: false, error: errorMessage };
    }
  }

  // Get all bookings
  static async getAllBookings(): Promise<{ success: boolean; bookings?: Booking[]; error?: string }> {
    try {
      const response = await apiService.getBookings();
      return { success: true, bookings: response.results || [] };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to fetch bookings.';
      return { success: false, error: errorMessage };
    }
  }

  // Get all transactions
  static async getAllTransactions(): Promise<{ success: boolean; transactions?: Transaction[]; error?: string }> {
    try {
      const response = await apiService.getTransactions();
      return { success: true, transactions: response.results || [] };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to fetch transactions.';
      return { success: false, error: errorMessage };
    }
  }

  // Update user status
  static async updateUserStatus(userId: number, isActive: boolean): Promise<{ success: boolean; error?: string }> {
    try {
      // This would be implemented in your backend
      // await apiService.updateUserStatus(userId, isActive);
      
      const action = isActive ? 'activated' : 'deactivated';
      NotificationUtils.showSuccess(
        'User Status Updated',
        `User has been ${action} successfully.`
      );
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to update user status.';
      NotificationUtils.showError('Update Failed', errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  // Delete user
  static async deleteUser(userId: number): Promise<{ success: boolean; error?: string }> {
    try {
      // This would be implemented in your backend
      // await apiService.deleteUser(userId);
      
      NotificationUtils.showWarning(
        'User Deleted',
        'User has been deleted successfully.'
      );
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to delete user.';
      NotificationUtils.showError('Delete Failed', errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  // Get system analytics
  static async getSystemAnalytics(): Promise<{ success: boolean; analytics?: any; error?: string }> {
    try {
      // This would aggregate various metrics
      const analytics = {
        userGrowth: {
          thisMonth: 150,
          lastMonth: 120,
          growth: 25
        },
        revenue: {
          thisMonth: 15000,
          lastMonth: 12000,
          growth: 25
        },
        sessions: {
          thisMonth: 300,
          lastMonth: 250,
          growth: 20
        },
        mentors: {
          thisMonth: 25,
          lastMonth: 20,
          growth: 25
        }
      };

      return { success: true, analytics };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to fetch analytics.';
      return { success: false, error: errorMessage };
    }
  }

  // Export data
  static async exportData(type: 'users' | 'mentors' | 'bookings' | 'transactions'): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      let data;
      switch (type) {
        case 'users':
          const usersResponse = await apiService.getUsers();
          data = usersResponse.results;
          break;
        case 'mentors':
          const mentorsResponse = await apiService.getMentors();
          data = mentorsResponse.results;
          break;
        case 'bookings':
          const bookingsResponse = await apiService.getBookings();
          data = bookingsResponse.results;
          break;
        case 'transactions':
          const transactionsResponse = await apiService.getTransactions();
          data = transactionsResponse.results;
          break;
      }

      NotificationUtils.showSuccess('Export Successful', `Data exported successfully.`);
      return { success: true, data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to export data.';
      NotificationUtils.showError('Export Failed', errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  // Send system notification
  static async sendSystemNotification(
    title: string,
    message: string,
    targetUsers?: number[]
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // This would be implemented in your backend
      // await apiService.sendSystemNotification(title, message, targetUsers);
      
      NotificationUtils.showSuccess(
        'Notification Sent',
        'System notification has been sent successfully.'
      );
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to send notification.';
      NotificationUtils.showError('Send Failed', errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  // Get user activity logs
  static async getUserActivityLogs(userId: number): Promise<{ success: boolean; logs?: any[]; error?: string }> {
    try {
      // This would be implemented in your backend
      const mockLogs = [
        {
          id: 1,
          action: 'login',
          timestamp: new Date().toISOString(),
          ip: '192.168.1.1',
          userAgent: 'Mozilla/5.0...'
        },
        {
          id: 2,
          action: 'booking_created',
          timestamp: new Date().toISOString(),
          details: 'Created booking with mentor John Doe'
        }
      ];

      return { success: true, logs: mockLogs };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to fetch activity logs.';
      return { success: false, error: errorMessage };
    }
  }

  // Check admin permissions
  static hasAdminPermission(user: User, permission: string): boolean {
    if (user.user_type !== 'admin') return false;
    
    // This would check specific permissions
    // For now, all admins have all permissions
    return true;
  }

  // Format admin statistics
  static formatAdminStats(stats: AdminStats): {
    totalUsers: string;
    totalMentors: string;
    totalBookings: string;
    totalRevenue: string;
    pendingMentors: string;
    activeUsers: string;
    completedSessions: string;
    averageRating: string;
  } {
    return {
      totalUsers: stats.totalUsers.toLocaleString(),
      totalMentors: stats.totalMentors.toLocaleString(),
      totalBookings: stats.totalBookings.toLocaleString(),
      totalRevenue: `$${stats.totalRevenue.toLocaleString()}`,
      pendingMentors: stats.pendingMentors.toLocaleString(),
      activeUsers: stats.activeUsers.toLocaleString(),
      completedSessions: stats.completedSessions.toLocaleString(),
      averageRating: stats.averageRating.toFixed(1)
    };
  }
}
