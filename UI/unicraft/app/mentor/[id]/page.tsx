'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Clock, DollarSign, Users, Award, Calendar, MessageCircle, ArrowLeft, Check } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { apiService } from "@/lib/api"
import { Mentor, BookingRequest } from "@/types/api"
import { useAuth } from "@/hooks/useAuth"

export default function MentorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState<Partial<BookingRequest>>({
    session_date: '',
    session_time: '',
    duration_minutes: 60,
    subject: '',
    description: ''
  });

  useEffect(() => {
    if (params.id) {
      loadMentor(Number(params.id));
    }
  }, [params.id]);

  const loadMentor = async (id: number) => {
    try {
      setLoading(true);
      const mentorData = await apiService.getMentor(id);
      setMentor(mentorData);
    } catch (error) {
      console.error('Failed to load mentor:', error);
      // Fallback to mock data if API fails
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
          bio: "Experienced mentor with 10+ years in business development and entrepreneurship. I help students and professionals achieve their goals through personalized guidance and strategic advice."
        },
        hourly_rate: 75,
        expertise_areas: ['Business Development', 'Entrepreneurship', 'Marketing', 'Strategy'],
        experience_years: 10,
        education: 'MBA from Harvard Business School',
        certifications: ['Certified Business Advisor', 'PMP Certified'],
        languages: ['English', 'Spanish', 'French'],
        availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        rating: 4.9,
        total_sessions: 250,
        is_approved: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setMentor(mockMentor);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentor || !isAuthenticated) return;

    try {
      // Redirect to booking confirmation page with form data
      const params = new URLSearchParams({
        mentor: mentor.id.toString(),
        date: bookingData.session_date || '',
        time: bookingData.session_time || '',
        duration: bookingData.duration_minutes?.toString() || '60',
        subject: bookingData.subject || '',
        description: bookingData.description || ''
      });
      
      router.push(`/bookings/confirm?${params.toString()}`);
    } catch (error) {
      console.error('Failed to create booking:', error);
      alert('Failed to create booking. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading mentor profile...</p>
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
        {/* Back Link */}
        <div className="mb-6">
          <Link href="/find-mentor" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Mentors</span>
          </Link>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Mentor Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main Profile Card */}
              <Card>
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <Image
                        src={mentor.user.profile_picture || "/placeholder-user.jpg"}
                        alt={fullName}
                        width={200}
                        height={200}
                        className="w-48 h-48 object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h1 className="text-3xl font-bold text-gray-900 mb-2">{fullName}</h1>
                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-1">
                              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                              <span className="text-lg font-semibold">{mentor.rating}</span>
                              <span className="text-gray-600">({mentor.total_sessions} sessions)</span>
                            </div>
                            <Badge className="bg-green-500 text-white">
                              Available
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-3xl font-bold text-green-600 mb-1">
                            ${mentor.hourly_rate}/hr
                          </div>
                          <p className="text-gray-600">per hour</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 text-lg leading-relaxed mb-6">
                        {mentor.user.bio || "Experienced mentor dedicated to helping students and professionals achieve their goals."}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {mentor.expertise_areas.map((area, index) => (
                          <Badge key={index} variant="secondary" className="text-sm">
                            {area}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex gap-4">
                        {isAuthenticated ? (
                          <Button 
                            onClick={() => setShowBookingForm(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                          >
                            <Calendar className="w-5 h-5 mr-2" />
                            Book Session
                          </Button>
                        ) : (
                          <Link href="/signin">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                              Sign In to Book
                            </Button>
                          </Link>
                        )}
                        <Button variant="outline" className="px-8 py-3">
                          <MessageCircle className="w-5 h-5 mr-2" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Experience & Education */}
              <Card>
                <CardHeader>
                  <CardTitle>Experience & Education</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-semibold">{mentor.experience_years} years of experience</p>
                      <p className="text-gray-600">Professional experience in the field</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-semibold">{mentor.education}</p>
                      <p className="text-gray-600">Educational background</p>
                    </div>
                  </div>
                  
                  {mentor.certifications.length > 0 && (
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-blue-600 mt-1" />
                      <div>
                        <p className="font-semibold">Certifications</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {mentor.certifications.map((cert, index) => (
                            <Badge key={index} variant="outline">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Languages */}
              <Card>
                <CardHeader>
                  <CardTitle>Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {mentor.languages.map((language, index) => (
                      <Badge key={index} variant="secondary">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Booking & Availability */}
            <div className="space-y-6">
              {/* Availability */}
              <Card>
                <CardHeader>
                  <CardTitle>Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {mentor.availability.map((day, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>{day}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{mentor.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Sessions</span>
                    <span className="font-semibold">{mentor.total_sessions}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Experience</span>
                    <span className="font-semibold">{mentor.experience_years} years</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Rate</span>
                    <span className="font-semibold text-green-600">${mentor.hourly_rate}/hr</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />

      {/* Booking Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Book a Session with {fullName}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Session Date</label>
                  <input
                    type="date"
                    value={bookingData.session_date}
                    onChange={(e) => setBookingData({...bookingData, session_date: e.target.value})}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Session Time</label>
                  <input
                    type="time"
                    value={bookingData.session_time}
                    onChange={(e) => setBookingData({...bookingData, session_time: e.target.value})}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                  <select
                    value={bookingData.duration_minutes}
                    onChange={(e) => setBookingData({...bookingData, duration_minutes: Number(e.target.value)})}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    value={bookingData.subject}
                    onChange={(e) => setBookingData({...bookingData, subject: e.target.value})}
                    className="w-full p-2 border rounded-md"
                    placeholder="What do you want to discuss?"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={bookingData.description}
                    onChange={(e) => setBookingData({...bookingData, description: e.target.value})}
                    className="w-full p-2 border rounded-md h-24"
                    placeholder="Tell the mentor more about your goals..."
                    required
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Send Booking Request
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowBookingForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
