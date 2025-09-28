// Mentor system utilities
import { apiService } from './api';
import { Mentor, User } from '@/types/api';
import { NotificationUtils } from './notification-utils';

export interface MentorFilters {
  expertise?: string[];
  languages?: string[];
  hourlyRateMin?: number;
  hourlyRateMax?: number;
  experienceMin?: number;
  ratingMin?: number;
  availability?: string[];
  university?: string;
  location?: string;
}

export interface MentorSearchResult {
  mentors: Mentor[];
  total: number;
  page: number;
  hasMore: boolean;
}

export interface MentorSortOption {
  value: string;
  label: string;
  description: string;
}

export class MentorUtils {
  // Get all mentors with filtering and pagination
  static async getMentors(
    filters: MentorFilters = {},
    page: number = 1,
    limit: number = 12,
    sortBy: string = 'rating'
  ): Promise<{ success: boolean; result?: MentorSearchResult; error?: string }> {
    try {
      const response = await apiService.getMentors();
      let mentors = response.results || [];

      // Apply filters
      mentors = this.applyFilters(mentors, filters);

      // Apply sorting
      mentors = this.applySorting(mentors, sortBy);

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedMentors = mentors.slice(startIndex, endIndex);

      return {
        success: true,
        result: {
          mentors: paginatedMentors,
          total: mentors.length,
          page,
          hasMore: endIndex < mentors.length
        }
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to fetch mentors.';
      return { success: false, error: errorMessage };
    }
  }

  // Get mentor by ID
  static async getMentorById(id: number): Promise<{ success: boolean; mentor?: Mentor; error?: string }> {
    try {
      const mentor = await apiService.getMentor(id);
      return { success: true, mentor };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to fetch mentor details.';
      return { success: false, error: errorMessage };
    }
  }

  // Search mentors by query
  static async searchMentors(
    query: string,
    filters: MentorFilters = {},
    page: number = 1,
    limit: number = 12
  ): Promise<{ success: boolean; result?: MentorSearchResult; error?: string }> {
    try {
      const response = await apiService.getMentors();
      let mentors = response.results || [];

      // Apply text search
      if (query.trim()) {
        const searchTerms = query.toLowerCase().split(' ');
        mentors = mentors.filter(mentor => {
          const searchableText = [
            mentor.user.first_name,
            mentor.user.last_name,
            mentor.user.bio,
            mentor.education,
            ...mentor.expertise_areas,
            ...mentor.certifications
          ].join(' ').toLowerCase();

          return searchTerms.every(term => searchableText.includes(term));
        });
      }

      // Apply filters
      mentors = this.applyFilters(mentors, filters);

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedMentors = mentors.slice(startIndex, endIndex);

      return {
        success: true,
        result: {
          mentors: paginatedMentors,
          total: mentors.length,
          page,
          hasMore: endIndex < mentors.length
        }
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to search mentors.';
      return { success: false, error: errorMessage };
    }
  }

  // Apply filters to mentors
  static applyFilters(mentors: Mentor[], filters: MentorFilters): Mentor[] {
    return mentors.filter(mentor => {
      // Expertise filter
      if (filters.expertise && filters.expertise.length > 0) {
        const hasExpertise = filters.expertise.some(expertise =>
          mentor.expertise_areas.some(area => 
            area.toLowerCase().includes(expertise.toLowerCase())
          )
        );
        if (!hasExpertise) return false;
      }

      // Languages filter
      if (filters.languages && filters.languages.length > 0) {
        const hasLanguage = filters.languages.some(language =>
          mentor.languages.includes(language)
        );
        if (!hasLanguage) return false;
      }

      // Hourly rate filter
      if (filters.hourlyRateMin !== undefined && mentor.hourly_rate < filters.hourlyRateMin) {
        return false;
      }
      if (filters.hourlyRateMax !== undefined && mentor.hourly_rate > filters.hourlyRateMax) {
        return false;
      }

      // Experience filter
      if (filters.experienceMin !== undefined && mentor.experience_years < filters.experienceMin) {
        return false;
      }

      // Rating filter
      if (filters.ratingMin !== undefined && mentor.rating < filters.ratingMin) {
        return false;
      }

      // Availability filter
      if (filters.availability && filters.availability.length > 0) {
        const hasAvailability = filters.availability.some(availability =>
          mentor.availability.includes(availability)
        );
        if (!hasAvailability) return false;
      }

      // University filter
      if (filters.university && mentor.user.university) {
        if (!mentor.user.university.toLowerCase().includes(filters.university.toLowerCase())) {
          return false;
        }
      }

      // Location filter
      if (filters.location && mentor.user.location) {
        if (!mentor.user.location.toLowerCase().includes(filters.location.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }

  // Apply sorting to mentors
  static applySorting(mentors: Mentor[], sortBy: string): Mentor[] {
    return [...mentors].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price_low':
          return a.hourly_rate - b.hourly_rate;
        case 'price_high':
          return b.hourly_rate - a.hourly_rate;
        case 'experience':
          return b.experience_years - a.experience_years;
        case 'sessions':
          return b.total_sessions - a.total_sessions;
        case 'name':
          return `${a.user.first_name} ${a.user.last_name}`.localeCompare(`${b.user.first_name} ${b.user.last_name}`);
        default:
          return 0;
      }
    });
  }

  // Get sort options
  static getSortOptions(): MentorSortOption[] {
    return [
      {
        value: 'rating',
        label: 'Highest Rated',
        description: 'Sort by mentor rating'
      },
      {
        value: 'price_low',
        label: 'Price: Low to High',
        description: 'Sort by hourly rate (ascending)'
      },
      {
        value: 'price_high',
        label: 'Price: High to Low',
        description: 'Sort by hourly rate (descending)'
      },
      {
        value: 'experience',
        label: 'Most Experienced',
        description: 'Sort by years of experience'
      },
      {
        value: 'sessions',
        label: 'Most Sessions',
        description: 'Sort by total sessions completed'
      },
      {
        value: 'name',
        label: 'Name: A to Z',
        description: 'Sort alphabetically by name'
      }
    ];
  }

  // Get featured mentors
  static async getFeaturedMentors(limit: number = 6): Promise<{ success: boolean; mentors?: Mentor[]; error?: string }> {
    try {
      const response = await apiService.getMentors();
      let mentors = response.results || [];

      // Filter for approved mentors with good ratings
      mentors = mentors.filter(mentor => 
        mentor.is_approved && mentor.rating >= 4.0 && mentor.total_sessions > 0
      );

      // Sort by rating and sessions
      mentors = this.applySorting(mentors, 'rating');

      // Take top mentors
      const featuredMentors = mentors.slice(0, limit);

      return { success: true, mentors: featuredMentors };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to fetch featured mentors.';
      return { success: false, error: errorMessage };
    }
  }

  // Get similar mentors
  static async getSimilarMentors(mentorId: number, limit: number = 4): Promise<{ success: boolean; mentors?: Mentor[]; error?: string }> {
    try {
      const mentorResponse = await this.getMentorById(mentorId);
      if (!mentorResponse.success || !mentorResponse.mentor) {
        return { success: false, error: 'Mentor not found' };
      }

      const targetMentor = mentorResponse.mentor;
      const response = await apiService.getMentors();
      let mentors = response.results || [];

      // Filter out the target mentor and get approved mentors
      mentors = mentors.filter(m => m.id !== mentorId && m.is_approved);

      // Find mentors with similar expertise
      const similarMentors = mentors.filter(mentor => {
        const commonExpertise = mentor.expertise_areas.filter(expertise =>
          targetMentor.expertise_areas.includes(expertise)
        );
        return commonExpertise.length > 0;
      });

      // Sort by similarity (common expertise) and rating
      similarMentors.sort((a, b) => {
        const aCommonExpertise = a.expertise_areas.filter(expertise =>
          targetMentor.expertise_areas.includes(expertise)
        ).length;
        const bCommonExpertise = b.expertise_areas.filter(expertise =>
          targetMentor.expertise_areas.includes(expertise)
        ).length;

        if (aCommonExpertise !== bCommonExpertise) {
          return bCommonExpertise - aCommonExpertise;
        }
        return b.rating - a.rating;
      });

      return { success: true, mentors: similarMentors.slice(0, limit) };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to fetch similar mentors.';
      return { success: false, error: errorMessage };
    }
  }

  // Get mentor statistics
  static getMentorStats(mentor: Mentor): {
    totalSessions: number;
    totalHours: number;
    averageRating: number;
    responseRate: number;
    completionRate: number;
  } {
    return {
      totalSessions: mentor.total_sessions,
      totalHours: mentor.total_sessions * 1.5, // Assuming average 1.5 hours per session
      averageRating: mentor.rating,
      responseRate: 95, // Mock data - would be calculated from actual data
      completionRate: 98 // Mock data - would be calculated from actual data
    };
  }

  // Check if mentor is available
  static isMentorAvailable(mentor: Mentor, date: string, time: string): boolean {
    // This would check against mentor's actual availability
    // For now, return true for approved mentors
    return mentor.is_approved;
  }

  // Get mentor availability for a specific date
  static getMentorAvailability(mentor: Mentor, date: string): string[] {
    // This would return actual available time slots
    // For now, return mock availability
    return [
      '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
    ];
  }

  // Calculate mentor response time
  static getMentorResponseTime(mentor: Mentor): string {
    // This would be calculated from actual response data
    // For now, return mock data
    const responseTimes = ['Within 1 hour', 'Within 4 hours', 'Within 24 hours'];
    return responseTimes[Math.floor(Math.random() * responseTimes.length)];
  }

  // Get mentor specialties
  static getMentorSpecialties(mentor: Mentor): string[] {
    return mentor.expertise_areas.slice(0, 3); // Top 3 expertise areas
  }

  // Format mentor hourly rate
  static formatHourlyRate(rate: number): string {
    return `$${rate}/hour`;
  }

  // Get mentor experience level
  static getExperienceLevel(years: number): string {
    if (years < 2) return 'Beginner';
    if (years < 5) return 'Intermediate';
    if (years < 10) return 'Advanced';
    return 'Expert';
  }

  // Check if mentor is verified
  static isMentorVerified(mentor: Mentor): boolean {
    return mentor.is_approved && mentor.total_sessions > 0;
  }

  // Get mentor badge
  static getMentorBadge(mentor: Mentor): { label: string; color: string } | null {
    if (mentor.rating >= 4.8 && mentor.total_sessions >= 50) {
      return { label: 'Top Mentor', color: 'bg-yellow-100 text-yellow-800' };
    }
    if (mentor.rating >= 4.5 && mentor.total_sessions >= 20) {
      return { label: 'Highly Rated', color: 'bg-green-100 text-green-800' };
    }
    if (mentor.total_sessions >= 100) {
      return { label: 'Experienced', color: 'bg-blue-100 text-blue-800' };
    }
    return null;
  }
}
