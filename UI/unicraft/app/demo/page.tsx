"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                <span className="text-sm font-bold text-blue-600">U</span>
              </div>
            </div>
            <div className="text-blue-600">
              <div className="font-bold text-lg">UNICRAFT</div>
              <div className="text-sm">PORTAL</div>
            </div>
          </Link>
          <h1 className="text-4xl font-bold mb-4">UNICRAFT Portal Demo</h1>
          <p className="text-gray-600 mb-8">
            Explore all the different user interfaces and features of the UNICRAFT mentoring platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Homepage */}
          <Card>
            <CardHeader>
              <CardTitle>Homepage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Main landing page with hero section, mentor showcase, and platform features
              </p>
              <Link href="/">
                <Button className="w-full">View Homepage</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Find Mentor */}
          <Card>
            <CardHeader>
              <CardTitle>Find Mentors</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Browse and search through available mentors by category and expertise
              </p>
              <Link href="/find-mentor">
                <Button className="w-full">Browse Mentors</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Authentication */}
          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Sign in and sign up pages with social login options</p>
              <div className="flex gap-2">
                <Link href="/signin" className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Student Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Student Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Student dashboard with sessions, goals, progress tracking, and mentor management
              </p>
              <Link href="/profile/student">
                <Button className="w-full bg-green-600 hover:bg-green-700">View Student Profile</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Tutor Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Tutor Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Tutor dashboard with earnings, student management, session scheduling, and analytics
              </p>
              <Link href="/profile/tutor">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">View Tutor Profile</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Admin Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Administrative panel with user management, content moderation, and platform analytics
              </p>
              <Link href="/profile/admin">
                <Button className="w-full bg-red-600 hover:bg-red-700">View Admin Panel</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            This is a complete mentoring platform with role-based interfaces and full navigation between pages.
          </p>
          <Link href="/">
            <Button variant="outline">Back to Homepage</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
