'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Calendar, Clock, DollarSign, Star, Users, TrendingUp, MessageCircle, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { apiService } from "@/lib/api"
import { Booking, Mentor, Review } from "@/types/api"

export default function TutorProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const [mentorProfile, setMentorProfile] = useState<Mentor | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user?.user_type === 'tutor') {
      loadTutorData();
    }
  }, [isAuthenticated, user]);

  const loadTutorData = async () => {
    try {
      setLoading(true);
      
      // Load mentor profile
      const mentorResponse = await apiService.getMentors();
      const myMentorProfile = mentorResponse.results?.find(m => m.user.id === user?.id);
      setMentorProfile(myMentorProfile || null);
      
      // Load bookings
      const bookingsResponse = await apiService.getBookings();
      setBookings(bookingsResponse.results || []);
      
      // Load reviews
      const reviewsResponse = await apiService.getReviews();
      setReviews(reviewsResponse.results || []);
      
    } catch (error) {
      console.error('Failed to load tutor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptBooking = async (bookingId: number) => {
    try {
      await apiService.acceptBooking(bookingId);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'accepted' } : b));
    } catch (error) {
      console.error('Failed to accept booking:', error);
    }
  };

  const handleRejectBooking = async (bookingId: number) => {
    try {
      await apiService.rejectBooking(bookingId);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'rejected' } : b));
    } catch (error) {
      console.error('Failed to reject booking:', error);
    }
  };

  const handleCompleteBooking = async (bookingId: number) => {
    try {
      await apiService.completeBooking(bookingId);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'completed' } : b));
    } catch (error) {
      console.error('Failed to complete booking:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view your profile</h1>
            <Button>Sign In</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (user?.user_type !== 'tutor') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-4">This page is only accessible to tutors.</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const pendingBookings = bookings.filter(booking => booking.status === 'pending');
  const upcomingBookings = bookings.filter(booking => booking.status === 'accepted' && new Date(booking.session_date) > new Date());
  const completedBookings = bookings.filter(booking => booking.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <main className="flex-1 max-w-7xl mx-auto p-6">
        {/* Tutor Header */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user?.profile_picture || "/placeholder-user.jpg"} />
              <AvatarFallback className="text-2xl">
                {user?.first_name[0]}{user?.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-3xl font-bold">{user?.first_name} {user?.last_name}</h1>
                <Badge className="bg-blue-100 text-blue-800">Tutor/Mentor</Badge>
                {mentorProfile?.is_approved && (
                  <Badge className="bg-green-100 text-green-800">Approved</Badge>
                )}
              </div>
              <p className="text-gray-600 mb-2">{user?.university || 'Professional Mentor'}</p>
              <p className="text-gray-500 mb-4">
                {user?.bio || 'Experienced mentor dedicated to helping students achieve their goals.'}
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(user?.date_joined || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{completedBookings.length} Sessions Completed</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  <span>{mentorProfile?.rating || 0} Average Rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span>${mentorProfile?.hourly_rate || 0}/hr</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <MessageCircle className="w-4 h-4 mr-2" />
                Messages
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completedBookings.length}</div>
                  <p className="text-xs text-muted-foreground">Completed sessions</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingBookings.length}</div>
                  <p className="text-xs text-muted-foreground">Awaiting response</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mentorProfile?.rating?.toFixed(1) || '0.0'}</div>
                  <p className="text-xs text-muted-foreground">Based on {reviews.length} reviews</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Hourly Rate</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${mentorProfile?.hourly_rate || 0}</div>
                  <p className="text-xs text-muted-foreground">Per hour</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingBookings.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingBookings.slice(0, 5).map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{booking.subject}</p>
                            <p className="text-sm text-gray-600">
                              with {booking.student.first_name} {booking.student.last_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(booking.session_date).toLocaleDateString()} at {booking.session_time}
                            </p>
                          </div>
                          <Badge variant="default">Upcoming</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No upcoming sessions</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  {reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.slice(0, 5).map((review) => (
                        <div key={review.id} className="p-3 border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">
                              {review.student.first_name} {review.student.last_name}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No reviews yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pending Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle>Pending Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingBookings.length > 0 ? (
                    <div className="space-y-4">
                      {pendingBookings.map((booking) => (
                        <div key={booking.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{booking.subject}</h4>
                            <Badge variant="secondary">Pending</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            from {booking.student.first_name} {booking.student.last_name}
                          </p>
                          <p className="text-sm text-gray-500 mb-2">
                            {new Date(booking.session_date).toLocaleDateString()} at {booking.session_time} ({booking.duration_minutes} min)
                          </p>
                          <p className="text-sm text-gray-700 mb-3">{booking.description}</p>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleAcceptBooking(booking.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Accept
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleRejectBooking(booking.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                      <p className="text-gray-600">No pending requests</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Upcoming Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingBookings.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingBookings.map((booking) => (
                        <div key={booking.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{booking.subject}</h4>
                            <Badge variant="default">Confirmed</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            with {booking.student.first_name} {booking.student.last_name}
                          </p>
                          <p className="text-sm text-gray-500 mb-2">
                            {new Date(booking.session_date).toLocaleDateString()} at {booking.session_time} ({booking.duration_minutes} min)
                          </p>
                          <div className="flex gap-2">
                            {booking.meeting_link && (
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                Join Meeting
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleCompleteBooking(booking.id)}
                            >
                              Mark Complete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No upcoming sessions</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={review.student.profile_picture || "/placeholder-user.jpg"} />
                              <AvatarFallback>
                                {review.student.first_name[0]}{review.student.last_name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold">{review.student.first_name} {review.student.last_name}</h4>
                              <p className="text-sm text-gray-600">{new Date(review.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
                    <p className="text-gray-600">Complete sessions to start receiving reviews from students.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    ${completedBookings.reduce((total, booking) => total + (booking.mentor.hourly_rate * booking.duration_minutes / 60), 0).toFixed(2)}
                  </div>
                  <p className="text-sm text-gray-600">All time earnings</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    ${completedBookings
                      .filter(booking => new Date(booking.session_date).getMonth() === new Date().getMonth())
                      .reduce((total, booking) => total + (booking.mentor.hourly_rate * booking.duration_minutes / 60), 0).toFixed(2)}
                  </div>
                  <p className="text-sm text-gray-600">Current month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Average per Session</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">
                    ${completedBookings.length > 0 ? (completedBookings.reduce((total, booking) => total + (booking.mentor.hourly_rate * booking.duration_minutes / 60), 0) / completedBookings.length).toFixed(2) : '0.00'}
                  </div>
                  <p className="text-sm text-gray-600">Per completed session</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Earnings History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedBookings.slice(0, 10).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{booking.subject}</p>
                        <p className="text-sm text-gray-600">
                          with {booking.student.first_name} {booking.student.last_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(booking.session_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          ${(booking.mentor.hourly_rate * booking.duration_minutes / 60).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">{booking.duration_minutes} min</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}