// User profile management utilities
import { apiService } from './api';
import { User, UserUpdateRequest, Mentor, MentorUpdateRequest } from '@/types/api';
import { NotificationUtils } from './notification-utils';

export interface ProfileValidation {
  valid: boolean;
  errors: string[];
}

export interface ProfileStats {
  totalSessions: number;
  totalHours: number;
  totalSpent: number;
  averageRating: number;
  completedGoals: number;
  totalGoals: number;
}

export class ProfileUtils {
  // Get user profile
  static async getUserProfile(): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const user = await apiService.getCurrentUser();
      return { success: true, user };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to fetch profile.';
      return { success: false, error: errorMessage };
    }
  }

  // Update user profile
  static async updateUserProfile(updateData: UserUpdateRequest): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // This would be implemented in your backend
      // const user = await apiService.updateUserProfile(updateData);
      NotificationUtils.profile.updated();
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to update profile.';
      NotificationUtils.profile.updateError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  // Update mentor profile
  static async updateMentorProfile(updateData: MentorUpdateRequest): Promise<{ success: boolean; mentor?: Mentor; error?: string }> {
    try {
      // This would be implemented in your backend
      // const mentor = await apiService.updateMentorProfile(updateData);
      NotificationUtils.profile.updated();
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to update mentor profile.';
      NotificationUtils.profile.updateError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  // Validate user profile data
  static validateUserProfile(userData: Partial<User>): ProfileValidation {
    const errors: string[] = [];

    if (userData.first_name && userData.first_name.trim().length < 2) {
      errors.push('First name must be at least 2 characters long');
    }

    if (userData.last_name && userData.last_name.trim().length < 2) {
      errors.push('Last name must be at least 2 characters long');
    }

    if (userData.email && !this.validateEmail(userData.email)) {
      errors.push('Please enter a valid email address');
    }

    if (userData.phone && !this.validatePhone(userData.phone)) {
      errors.push('Please enter a valid phone number');
    }

    if (userData.bio && userData.bio.trim().length < 10) {
      errors.push('Bio must be at least 10 characters long');
    }

    if (userData.university && userData.university.trim().length < 2) {
      errors.push('University name must be at least 2 characters long');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Validate mentor profile data
  static validateMentorProfile(mentorData: Partial<Mentor>): ProfileValidation {
    const errors: string[] = [];

    if (mentorData.hourly_rate && mentorData.hourly_rate < 10) {
      errors.push('Hourly rate must be at least $10');
    }

    if (mentorData.experience_years && mentorData.experience_years < 0) {
      errors.push('Experience years cannot be negative');
    }

    if (mentorData.expertise_areas && mentorData.expertise_areas.length === 0) {
      errors.push('Please select at least one expertise area');
    }

    if (mentorData.education && mentorData.education.trim().length < 5) {
      errors.push('Education must be at least 5 characters long');
    }

    if (mentorData.languages && mentorData.languages.length === 0) {
      errors.push('Please select at least one language');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Validate email format
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate phone number
  static validatePhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  // Calculate profile completion percentage
  static calculateProfileCompletion(user: User, mentor?: Mentor): number {
    let completedFields = 0;
    let totalFields = 0;

    // User fields
    const userFields = ['first_name', 'last_name', 'email', 'university', 'bio', 'phone', 'location', 'profile_picture'];
    userFields.forEach(field => {
      totalFields++;
      if (user[field as keyof User] && String(user[field as keyof User]).trim().length > 0) {
        completedFields++;
      }
    });

    // Mentor fields (if user is a mentor)
    if (mentor) {
      const mentorFields = ['hourly_rate', 'expertise_areas', 'experience_years', 'education', 'certifications', 'languages', 'availability'];
      mentorFields.forEach(field => {
        totalFields++;
        const value = mentor[field as keyof Mentor];
        if (value && (Array.isArray(value) ? value.length > 0 : String(value).trim().length > 0)) {
          completedFields++;
        }
      });
    }

    return Math.round((completedFields / totalFields) * 100);
  }

  // Get profile completion suggestions
  static getProfileCompletionSuggestions(user: User, mentor?: Mentor): string[] {
    const suggestions: string[] = [];

    if (!user.profile_picture) {
      suggestions.push('Add a profile picture to make your profile more personal');
    }

    if (!user.bio || user.bio.trim().length < 50) {
      suggestions.push('Write a detailed bio to help others understand your background');
    }

    if (!user.university) {
      suggestions.push('Add your university information');
    }

    if (!user.phone) {
      suggestions.push('Add your phone number for better communication');
    }

    if (!user.location) {
      suggestions.push('Add your location to help with local connections');
    }

    if (mentor) {
      if (!mentor.certifications || mentor.certifications.length === 0) {
        suggestions.push('Add your certifications to build credibility');
      }

      if (!mentor.availability || mentor.availability.length === 0) {
        suggestions.push('Set your availability to help students book sessions');
      }
    }

    return suggestions;
  }

  // Format user name
  static formatUserName(user: User): string {
    return `${user.first_name} ${user.last_name}`.trim();
  }

  // Get user initials
  static getUserInitials(user: User): string {
    const firstInitial = user.first_name?.charAt(0).toUpperCase() || '';
    const lastInitial = user.last_name?.charAt(0).toUpperCase() || '';
    return firstInitial + lastInitial;
  }

  // Get user type display name
  static getUserTypeDisplay(userType: string): string {
    const types: Record<string, string> = {
      student: 'Student',
      tutor: 'Mentor/Tutor',
      admin: 'Administrator'
    };
    return types[userType] || userType;
  }

  // Get user join date
  static getJoinDate(user: User): string {
    return new Date(user.date_joined).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Check if user is new (joined within last 30 days)
  static isNewUser(user: User): boolean {
    const joinDate = new Date(user.date_joined);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return joinDate > thirtyDaysAgo;
  }

  // Get profile stats (mock data for now)
  static getProfileStats(user: User): ProfileStats {
    // This would be calculated from actual booking and session data
    return {
      totalSessions: 12,
      totalHours: 24,
      totalSpent: 480,
      averageRating: 4.8,
      completedGoals: 8,
      totalGoals: 10
    };
  }

  // Upload profile picture
  static async uploadProfilePicture(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      // This would integrate with your file upload service (AWS S3, Cloudinary, etc.)
      // const url = await apiService.uploadProfilePicture(file);
      const mockUrl = URL.createObjectURL(file);
      return { success: true, url: mockUrl };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to upload profile picture.';
      return { success: false, error: errorMessage };
    }
  }

  // Delete profile picture
  static async deleteProfilePicture(): Promise<{ success: boolean; error?: string }> {
    try {
      // await apiService.deleteProfilePicture();
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to delete profile picture.';
      return { success: false, error: errorMessage };
    }
  }

  // Get expertise areas options
  static getExpertiseAreas(): string[] {
    return [
      'Computer Science',
      'Mathematics',
      'Physics',
      'Chemistry',
      'Biology',
      'Engineering',
      'Business',
      'Economics',
      'Psychology',
      'Literature',
      'History',
      'Art & Design',
      'Music',
      'Languages',
      'Medicine',
      'Law',
      'Architecture',
      'Marketing',
      'Finance',
      'Data Science',
      'Machine Learning',
      'Web Development',
      'Mobile Development',
      'Cybersecurity',
      'Project Management'
    ];
  }

  // Get language options
  static getLanguages(): string[] {
    return [
      'English',
      'Spanish',
      'French',
      'German',
      'Italian',
      'Portuguese',
      'Russian',
      'Chinese',
      'Japanese',
      'Korean',
      'Arabic',
      'Hindi',
      'Dutch',
      'Swedish',
      'Norwegian',
      'Danish',
      'Finnish',
      'Polish',
      'Czech',
      'Hungarian',
      'Turkish',
      'Greek',
      'Hebrew',
      'Thai',
      'Vietnamese'
    ];
  }

  // Get availability options
  static getAvailabilityOptions(): string[] {
    return [
      'Monday Morning',
      'Monday Afternoon',
      'Monday Evening',
      'Tuesday Morning',
      'Tuesday Afternoon',
      'Tuesday Evening',
      'Wednesday Morning',
      'Wednesday Afternoon',
      'Wednesday Evening',
      'Thursday Morning',
      'Thursday Afternoon',
      'Thursday Evening',
      'Friday Morning',
      'Friday Afternoon',
      'Friday Evening',
      'Saturday Morning',
      'Saturday Afternoon',
      'Saturday Evening',
      'Sunday Morning',
      'Sunday Afternoon',
      'Sunday Evening'
    ];
  }
}
