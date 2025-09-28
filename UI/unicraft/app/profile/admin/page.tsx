'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Users, UserCheck, UserX, Calendar, DollarSign, TrendingUp, AlertCircle, CheckCircle, Clock, Star } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { apiService } from "@/lib/api"
import { Mentor, User, Booking, Transaction } from "@/types/api"

export default function AdminProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const [pendingMentors, setPendingMentors] = useState<Mentor[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user?.user_type === 'admin') {
      loadAdminData();
    }
  }, [isAuthenticated, user]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      // Load pending mentors
      const pendingResponse = await apiService.getPendingMentors();
      setPendingMentors(pendingResponse.results || []);
      
      // Load all users
      const usersResponse = await apiService.getUsers();
      setAllUsers(usersResponse.results || []);
      
      // Load recent bookings
      const bookingsResponse = await apiService.getBookings();
      setRecentBookings(bookingsResponse.results?.slice(0, 10) || []);
      
      // Load transactions
      const transactionsResponse = await apiService.getTransactions();
      setTransactions(transactionsResponse.results || []);
      
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveMentor = async (mentorId: number) => {
    try {
      await apiService.approveMentor(mentorId);
      setPendingMentors(prev => prev.filter(m => m.id !== mentorId));
    } catch (error) {
      console.error('Failed to approve mentor:', error);
    }
  };

  const handleRejectMentor = async (mentorId: number) => {
    try {
      await apiService.rejectMentor(mentorId);
      setPendingMentors(prev => prev.filter(m => m.id !== mentorId));
    } catch (error) {
      console.error('Failed to reject mentor:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view admin panel</h1>
            <Button>Sign In</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (user?.user_type !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-4">You don't have admin privileges to access this page.</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <main className="flex-1 max-w-7xl mx-auto p-6">
        {/* Admin Header */}
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
                <Badge className="bg-red-100 text-red-800">Administrator</Badge>
              </div>
              <p className="text-gray-600 mb-2">System Administrator</p>
              <p className="text-gray-500 mb-4">
                Manage users, mentors, and platform operations
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{allUsers.length} Total Users</span>
                </div>
                <div className="flex items-center gap-1">
                  <UserCheck className="w-4 h-4" />
                  <span>{pendingMentors.length} Pending Approvals</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{recentBookings.length} Recent Bookings</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="mentors">Mentor Management</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{allUsers.length}</div>
                  <p className="text-xs text-muted-foreground">Registered users</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Mentors</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingMentors.length}</div>
                  <p className="text-xs text-muted-foreground">Awaiting approval</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{recentBookings.length}</div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${transactions.reduce((sum, t) => sum + t.amount, 0).toFixed(0)}</div>
                  <p className="text-xs text-muted-foreground">Total platform revenue</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{booking.subject}</p>
                          <p className="text-sm text-gray-600">
                            {booking.student.first_name} {booking.student.last_name} → {booking.mentor.user.first_name} {booking.mentor.user.last_name}
                          </p>
                        </div>
                        <Badge variant={booking.status === 'accepted' ? 'default' : 'secondary'}>
                          {booking.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">${transaction.amount}</p>
                          <p className="text-sm text-gray-600">
                            Booking #{transaction.booking}
                          </p>
                        </div>
                        <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                          {transaction.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="mentors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Mentor Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingMentors.length > 0 ? (
                  <div className="space-y-4">
                    {pendingMentors.map((mentor) => (
                      <div key={mentor.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={mentor.user.profile_picture || "/placeholder-user.jpg"} />
                            <AvatarFallback>
                              {mentor.user.first_name[0]}{mentor.user.last_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{mentor.user.first_name} {mentor.user.last_name}</h4>
                            <p className="text-sm text-gray-600">{mentor.expertise_areas.join(', ')}</p>
                            <p className="text-sm text-gray-500">${mentor.hourly_rate}/hr • {mentor.experience_years} years exp</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleApproveMentor(mentor.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleRejectMentor(mentor.id)}
                          >
                            <UserX className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-600">No pending mentor approvals</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={user.profile_picture || "/placeholder-user.jpg"} />
                          <AvatarFallback>
                            {user.first_name[0]}{user.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{user.first_name} {user.last_name}</h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-sm text-gray-500">{user.university || 'No university'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={user.user_type === 'admin' ? 'destructive' : user.user_type === 'tutor' ? 'default' : 'secondary'}>
                          {user.user_type}
                        </Badge>
                        <Badge variant={user.is_active ? 'default' : 'secondary'}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Students</span>
                      <span className="font-semibold">{allUsers.filter(u => u.user_type === 'student').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tutors</span>
                      <span className="font-semibold">{allUsers.filter(u => u.user_type === 'tutor').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Admins</span>
                      <span className="font-semibold">{allUsers.filter(u => u.user_type === 'admin').length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Revenue</span>
                      <span className="font-semibold">${transactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed Transactions</span>
                      <span className="font-semibold">{transactions.filter(t => t.status === 'completed').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Transaction</span>
                      <span className="font-semibold">${transactions.length > 0 ? (transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length).toFixed(2) : '0'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}