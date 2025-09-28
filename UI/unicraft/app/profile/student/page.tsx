'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Calendar, Target, Clock, Star, TrendingUp, Users, MessageCircle, Award, GraduationCap, DollarSign } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { apiService } from "@/lib/api"
import { Booking } from "@/types/api"

const upcomingSessions = [
  {
    mentor: "Katie Dunn",
    topic: "Career Planning",
    date: "Today, 2:00 PM",
    duration: "60 min",
    type: "Video Call",
  },
  {
    mentor: "Ben Rodriguez",
    topic: "Technical Interview Prep",
    date: "Tomorrow, 10:00 AM",
    duration: "45 min",
    type: "Video Call",
  },
  {
    mentor: "Dr. Sarah Chen",
    topic: "Research Methods",
    date: "Friday, 3:30 PM",
    duration: "90 min",
    type: "In-Person",
  },
]

const recentSessions = [
  {
    mentor: "Justin Garrard",
    topic: "Business Strategy",
    date: "2 days ago",
    rating: 5,
    feedback: "Excellent session on market analysis techniques",
  },
  {
    mentor: "Emma Wilson",
    topic: "Academic Writing",
    date: "1 week ago",
    rating: 4,
    feedback: "Very helpful for improving my thesis structure",
  },
  {
    mentor: "Prof. Michael Brown",
    topic: "Data Science Fundamentals",
    date: "2 weeks ago",
    rating: 5,
    feedback: "Clear explanations of complex statistical concepts",
  },
]

const goals = [
  {
    title: "Complete Data Science Certification",
    progress: 75,
    deadline: "Dec 2024",
    status: "In Progress",
  },
  {
    title: "Secure Summer Internship",
    progress: 40,
    deadline: "Mar 2025",
    status: "In Progress",
  },
  {
    title: "Improve Public Speaking",
    progress: 90,
    deadline: "Nov 2024",
    status: "Almost Complete",
  },
]

export default function StudentProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

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
          student: user!,
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
        }
      ];
      
      setBookings(mockBookings);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view your profile</h1>
            <Link href="/signin">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const upcomingBookings = bookings.filter(booking => 
    booking.status === 'accepted' && new Date(booking.session_date) > new Date()
  );

  const completedBookings = bookings.filter(booking => 
    booking.status === 'completed' || new Date(booking.session_date) < new Date()
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <main className="flex-1 max-w-7xl mx-auto p-6">
        {/* Profile Header */}
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
                <Badge className="bg-green-100 text-green-800">Active Student</Badge>
              </div>
              <p className="text-gray-600 mb-2">{user?.university || 'University Student'}</p>
              <p className="text-gray-500 mb-4">
                {user?.bio || 'Passionate about learning and personal development.'}
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(user?.date_joined || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{bookings.length} Sessions</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{bookings.reduce((total, booking) => total + booking.duration_minutes, 0) / 60} Hours</span>
                </div>
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Link href="/find-mentor">Find New Mentor</Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="mentors">My Mentors</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bookings.length}</div>
                  <p className="text-xs text-muted-foreground">All time sessions</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Hours Learned</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(bookings.reduce((total, booking) => total + booking.duration_minutes, 0) / 60)}</div>
                  <p className="text-xs text-muted-foreground">Total learning time</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${bookings.reduce((total, booking) => total + (booking.mentor.hourly_rate * booking.duration_minutes / 60), 0).toFixed(0)}</div>
                  <p className="text-xs text-muted-foreground">Investment in learning</p>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={booking.mentor.user.profile_picture || "/placeholder-user.jpg"} />
                            <AvatarFallback>
                              {booking.mentor.user.first_name[0]}{booking.mentor.user.last_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{booking.subject}</h4>
                            <p className="text-sm text-gray-600">with {booking.mentor.user.first_name} {booking.mentor.user.last_name}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(booking.session_date).toLocaleDateString()} • {booking.session_time} ({booking.duration_minutes} min)
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Video Call</Badge>
                          {booking.meeting_link && (
                            <Button size="sm">Join</Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No upcoming sessions</p>
                    <Link href="/find-mentor">
                      <Button className="mt-4">Book a Session</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Current Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Current Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {goals.slice(0, 2).map((goal, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{goal.title}</h4>
                        <Badge variant={goal.progress > 80 ? "default" : "secondary"}>{goal.status}</Badge>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                      <p className="text-sm text-gray-500">Due: {goal.deadline}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingSessions.map((session, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{session.topic}</h4>
                          <Badge variant="outline">{session.type}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">with {session.mentor}</p>
                        <p className="text-sm text-gray-500">
                          {session.date} • {session.duration}
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" className="flex-1">
                            Join Session
                          </Button>
                          <Button size="sm" variant="outline">
                            Reschedule
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentSessions.map((session, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{session.topic}</h4>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < session.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">with {session.mentor}</p>
                        <p className="text-sm text-gray-500 mb-2">{session.date}</p>
                        <p className="text-sm text-gray-700">{session.feedback}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    My Goals
                  </CardTitle>
                  <Button>Add New Goal</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {goals.map((goal, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg">{goal.title}</h3>
                        <Badge variant={goal.progress > 80 ? "default" : "secondary"}>{goal.status}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-3" />
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Deadline: {goal.deadline}</span>
                          <Button variant="ghost" size="sm">
                            Edit Goal
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Learning Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Data Science</span>
                        <span className="text-sm text-gray-500">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Career Development</span>
                        <span className="text-sm text-gray-500">70%</span>
                      </div>
                      <Progress value={70} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Communication Skills</span>
                        <span className="text-sm text-gray-500">90%</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                      <Award className="w-6 h-6 text-yellow-600" />
                      <div>
                        <h4 className="font-medium">First Session Complete</h4>
                        <p className="text-sm text-gray-600">Completed your first mentoring session</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <GraduationCap className="w-6 h-6 text-blue-600" />
                      <div>
                        <h4 className="font-medium">Learning Streak</h4>
                        <p className="text-sm text-gray-600">7 days of continuous learning</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Star className="w-6 h-6 text-green-600" />
                      <div>
                        <h4 className="font-medium">Top Rated Student</h4>
                        <p className="text-sm text-gray-600">Received 5-star ratings from mentors</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="mentors" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    My Mentors
                  </CardTitle>
                  <Button>
                    <Link href="/find-mentor">Find More Mentors</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: "Katie Dunn", expertise: "Career Coach", sessions: 8, rating: 5.0 },
                    { name: "Ben Rodriguez", expertise: "Tech Mentor", sessions: 5, rating: 4.9 },
                    { name: "Dr. Sarah Chen", expertise: "Research Methods", sessions: 3, rating: 5.0 },
                    { name: "Justin Garrard", expertise: "Business Strategy", sessions: 6, rating: 4.8 },
                    { name: "Emma Wilson", expertise: "Academic Writing", sessions: 4, rating: 4.7 },
                    { name: "Prof. Michael Brown", expertise: "Data Science", sessions: 7, rating: 5.0 },
                  ].map((mentor, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar>
                          <AvatarFallback>
                            {mentor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{mentor.name}</h4>
                          <p className="text-sm text-gray-600">{mentor.expertise}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span>Sessions:</span>
                          <span>{mentor.sessions}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Rating:</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{mentor.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" className="flex-1">
                          Book Session
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  )
}
