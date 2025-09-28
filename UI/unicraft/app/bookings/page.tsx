'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, DollarSign, User, MessageCircle, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { apiService } from "@/lib/api"
import { Booking } from "@/types/api"
import { useAuth } from "@/hooks/useAuth"

export default function BookingsPage() {
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'pending'>('upcoming');

  useEffect(() => {
    if (isAuthenticated) {
      loadBookings();
    }
  }, [isAuthenticated]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await apiService.getBookings();
      setBookings(response.results || []);
    } catch (error) {
      console.error('Failed to load bookings:', error);
      // Fallback to mock data if API fails
      const mockBookings: Booking[] = [
        {
          id: 1,
          student: {
            id: 1,
            email: 'student@example.com',
            first_name: 'John',
            last_name: 'Doe',
            user_type: 'student',
            is_active: true,
            date_joined: new Date().toISOString()
          },
          mentor: {
            id: 2,
            user: {
              id: 2,
              email: 'mentor@example.com',
              first_name: 'Jane',
              last_name: 'Smith',
              user_type: 'tutor',
              is_active: true,
              date_joined: new Date().toISOString(),
              profile_picture: '/professional-woman-ai-expert.jpg'
            },
            hourly_rate: 75,
            expertise_areas: ['Business', 'Technology'],
            experience_years: 5,
            education: 'MBA',
            certifications: [],
            languages: ['English'],
            availability: [],
            rating: 4.8,
            total_sessions: 100,
            is_approved: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          session_date: '2024-01-15',
          session_time: '14:00',
          duration_minutes: 60,
          status: 'accepted',
          subject: 'Business Strategy',
          description: 'Need help with business planning and strategy development.',
          meeting_link: 'https://zoom.us/j/123456789',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          student: {
            id: 1,
            email: 'student@example.com',
            first_name: 'John',
            last_name: 'Doe',
            user_type: 'student',
            is_active: true,
            date_joined: new Date().toISOString()
          },
          mentor: {
            id: 3,
            user: {
              id: 3,
              email: 'mentor2@example.com',
              first_name: 'Mike',
              last_name: 'Johnson',
              user_type: 'tutor',
              is_active: true,
              date_joined: new Date().toISOString(),
              profile_picture: '/professional-man-founder.png'
            },
            hourly_rate: 100,
            expertise_areas: ['Marketing', 'Sales'],
            experience_years: 8,
            education: 'MBA',
            certifications: [],
            languages: ['English'],
            availability: [],
            rating: 4.9,
            total_sessions: 150,
            is_approved: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          session_date: '2024-01-20',
          session_time: '10:00',
          duration_minutes: 90,
          status: 'pending',
          subject: 'Marketing Strategy',
          description: 'Looking for guidance on digital marketing strategies.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      setBookings(mockBookings);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    switch (activeTab) {
      case 'upcoming':
        return booking.status === 'accepted' && new Date(booking.session_date) > new Date();
      case 'past':
        return booking.status === 'completed' || new Date(booking.session_date) < new Date();
      case 'pending':
        return booking.status === 'pending';
      default:
        return true;
    }
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view your bookings</h1>
            <Link href="/signin">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <main className="flex-1 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
            <p className="text-gray-600">Manage your mentoring sessions</p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'upcoming'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'pending'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'past'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Past
            </button>
          </div>

          {/* Bookings List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading bookings...</p>
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="space-y-6">
              {filteredBookings.map((booking) => (
                <Card key={booking.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Mentor Info */}
                      <div className="flex items-start gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={booking.mentor.user.profile_picture || "/placeholder-user.jpg"} />
                          <AvatarFallback>
                            {booking.mentor.user.first_name[0]}{booking.mentor.user.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {booking.mentor.user.first_name} {booking.mentor.user.last_name}
                          </h3>
                          <p className="text-gray-600 mb-2">{booking.subject}</p>
                          <p className="text-gray-700 text-sm">{booking.description}</p>
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(booking.session_date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{booking.session_time} ({booking.duration_minutes} min)</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <DollarSign className="w-4 h-4" />
                            <span>${booking.mentor.hourly_rate}/hr</span>
                          </div>
                        </div>

                        {/* Status and Actions */}
                        <div className="flex flex-col items-end gap-3">
                          <Badge className={getStatusColor(booking.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(booking.status)}
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </div>
                          </Badge>
                          
                          <div className="flex gap-2">
                            {booking.status === 'accepted' && booking.meeting_link && (
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                Join Meeting
                              </Button>
                            )}
                            <Button variant="outline" size="sm">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              Message
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No {activeTab} bookings</h3>
              <p className="text-gray-600 mb-6">
                {activeTab === 'upcoming' && "You don't have any upcoming sessions."}
                {activeTab === 'pending' && "You don't have any pending booking requests."}
                {activeTab === 'past' && "You don't have any past sessions."}
              </p>
              <Link href="/find-mentor">
                <Button>Find a Mentor</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
