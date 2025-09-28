// API Response Types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'student' | 'tutor' | 'admin';
  university?: string;
  is_active: boolean;
  date_joined: string;
  profile_picture?: string;
  bio?: string;
  phone?: string;
  location?: string;
  is_google_user?: boolean;
}

export interface Mentor {
  id: number;
  user: User;
  hourly_rate: number;
  expertise_areas: string[];
  experience_years: number;
  education: string;
  certifications: string[];
  languages: string[];
  availability: string[];
  rating: number;
  total_sessions: number;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: number;
  student: User;
  mentor: Mentor;
  session_date: string;
  session_time: string;
  duration_minutes: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  subject: string;
  description: string;
  meeting_link?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  booking: number;
  student: User;
  mentor: Mentor;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Transaction {
  id: number;
  booking: number;
  student: User;
  mentor: Mentor;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: string;
  transaction_id: string;
  created_at: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface ApiResponse<T> {
  results?: T[];
  count?: number;
  next?: string;
  previous?: string;
}

// Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  user_type: 'student' | 'tutor' | 'admin';
  university?: string;
  profile_picture?: string;
  is_google_user?: boolean;
}

export interface BookingRequest {
  mentor: number;
  session_date: string;
  session_time: string;
  duration_minutes: number;
  subject: string;
  description: string;
}

export interface ReviewRequest {
  booking: number;
  rating: number;
  comment: string;
}

export interface MentorUpdateRequest {
  hourly_rate?: number;
  expertise_areas?: string[];
  experience_years?: number;
  education?: string;
  certifications?: string[];
  languages?: string[];
  availability?: string[];
  bio?: string;
}

export interface UserUpdateRequest {
  first_name?: string;
  last_name?: string;
  university?: string;
  bio?: string;
  phone?: string;
  location?: string;
  profile_picture?: string;
}
