'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, DollarSign, CheckCircle, ArrowLeft, CreditCard } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { apiService } from "@/lib/api"
import { Mentor, BookingRequest } from "@/types/api"
import { useAuth } from "@/hooks/useAuth"

export default function BookingConfirmPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [bookingData, setBookingData] = useState<BookingRequest>({
    mentor: 0,
    session_date: '',
    session_time: '',
    duration_minutes: 60,
    subject: '',
    description: ''
  });

  useEffect(() => {
    const mentorId = searchParams.get('mentor');
    const sessionDate = searchParams.get('date');
    const sessionTime = searchParams.get('time');
    const duration = searchParams.get('duration');
    const subject = searchParams.get('subject');
    const description = searchParams.get('description');

    if (mentorId && sessionDate && sessionTime) {
      setBookingData({
        mentor: Number(mentorId),
        session_date: sessionDate,
        session_time: sessionTime,
        duration_minutes: duration ? Number(duration) : 60,
        subject: subject || '',
        description: description || ''
      });
      loadMentor(Number(mentorId));
    } else {
      router.push('/find-mentor');
    }
  }, [searchParams, router]);

  const loadMentor = async (id: number) => {
    try {
      setLoading(true);
      // For now, use mock data. Later replace with: const mentorData = await apiService.getMentor(id)
      
      // Mock mentor data
      const mockMentor: Mentor = {
        id: id,
        user: {
          id: id,
          email: `mentor${id}@example.com`,
          first_name: "John",
          last_name: "Smith",
          user_type: 'tutor',
          is_active: true,
          date_joined: new Date().toISOString(),
          profile_picture: "/professional-man-founder.png",
          bio: "Experienced mentor with 10+ years in business development and entrepreneurship."
        },
        hourly_rate: 75,
        expertise_areas: ['Business Development', 'Entrepreneurship', 'Marketing'],
        experience_years: 10,
        education: 'MBA from Harvard Business School',
        certifications: ['Certified Business Advisor'],
        languages: ['English', 'Spanish'],
        availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        rating: 4.9,
        total_sessions: 250,
        is_approved: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setMentor(mockMentor);
    } catch (error) {
      console.error('Failed to load mentor:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!mentor) return 0;
    return (mentor.hourly_rate * bookingData.duration_minutes) / 60;
  };

  const handlePayment = async () => {
    if (!isAuthenticated) {
      router.push('/signin');
      return;
    }

    try {
      setProcessing(true);
      // Create booking
      const booking = await apiService.createBooking(bookingData as BookingRequest);
      
      // Initiate transaction
      const transaction = await apiService.initiateTransaction(booking.id);
      
      alert('Booking confirmed! You will receive a confirmation email shortly.');
      router.push('/bookings');
    } catch (error) {
      console.error('Failed to process booking:', error);
      alert('Failed to process booking. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to confirm your booking</h1>
            <Link href="/signin">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Mentor not found</h1>
          <Link href="/find-mentor">
            <Button>Back to Mentors</Button>
          </Link>
        </div>
      </div>
    );
  }

  const fullName = `${mentor.user.first_name} ${mentor.user.last_name}`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <main className="flex-1 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <div className="mb-6">
            <Link href="/find-mentor" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Mentors</span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Confirm Your Booking</h1>
            <p className="text-gray-600">Review your session details and complete payment</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Booking Details */}
            <Card>
              <CardHeader>
                <CardTitle>Session Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Mentor Info */}
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={mentor.user.profile_picture || "/placeholder-user.jpg"} />
                    <AvatarFallback>
                      {mentor.user.first_name[0]}{mentor.user.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{fullName}</h3>
                    <p className="text-gray-600">{mentor.expertise_areas.join(' • ')} Expert</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm text-gray-600">{mentor.rating} ({mentor.total_sessions} sessions)</span>
                    </div>
                  </div>
                </div>

                {/* Session Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-gray-600">{new Date(bookingData.session_date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Time</p>
                      <p className="text-gray-600">{bookingData.session_time} ({bookingData.duration_minutes} minutes)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">Rate</p>
                      <p className="text-gray-600">${mentor.hourly_rate}/hour</p>
                    </div>
                  </div>
                </div>

                {/* Subject and Description */}
                {bookingData.subject && (
                  <div>
                    <p className="font-medium mb-2">Subject</p>
                    <p className="text-gray-600">{bookingData.subject}</p>
                  </div>
                )}

                {bookingData.description && (
                  <div>
                    <p className="font-medium mb-2">Description</p>
                    <p className="text-gray-600">{bookingData.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Pricing Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Session Duration</span>
                    <span>{bookingData.duration_minutes} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hourly Rate</span>
                    <span>${mentor.hourly_rate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform Fee (5%)</span>
                    <span>${(calculateTotal() * 0.05).toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${(calculateTotal() * 1.05).toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <p className="font-medium mb-3">Payment Method</p>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-600">Credit/Debit Card</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Secure payment processing powered by Stripe
                    </p>
                  </div>
                </div>

                {/* Terms */}
                <div className="text-sm text-gray-600">
                  <p className="mb-2">
                    By confirming this booking, you agree to our Terms of Service and Privacy Policy.
                  </p>
                  <p>
                    You can cancel or reschedule up to 24 hours before your session.
                  </p>
                </div>

                {/* Confirm Button */}
                <Button 
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Confirm & Pay ${(calculateTotal() * 1.05).toFixed(2)}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
