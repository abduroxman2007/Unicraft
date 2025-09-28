"use client"

import { Search, ArrowLeft, RotateCcw, Check, ChevronLeft, ChevronRight, Star, MapPin, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { MentorCard } from "@/components/mentor-card"
import { MentorProfileCard } from "@/components/mentor-profile-card"
import { useState, useEffect } from "react"
import { apiService } from "@/lib/api"
import { Mentor } from "@/types/api"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function FindMentorPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([])

  // Mock data for now - will be replaced with API calls
  const mockMentors = [
    { name: "Colin Gardiner", title: "Solo-GP at Yonder | Marketplace Geek", image: "/professional-man-founder.png" },
    { name: "Pankaj Kedia", title: "Founder and Managing Partner at 2468 Ven...", image: "/professional-man-partner.jpg" },
    { name: "Erik Poldroo", title: "Co-Founder @ The Zone | Former NCAA Athl...", image: "/professional-man-athlete.jpg" },
    { name: "Sean Ellis", title: "Growth Behind Dropbox, Eventbrite & \"Hac...", image: "/professional-man-marketing.png" },
    { name: "Dario de Wet", title: "VCJ 40 Under 40 | LP, Angel & Fund Advis...", image: "/professional-man-fund-advisor.jpg" },
    { name: "Sarah Johnson", title: "AI Expert & Tech Entrepreneur", image: "/professional-woman-ai-expert.jpg" }
  ]

  useEffect(() => {
    loadMentors()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = mentors.filter(mentor => 
        mentor.user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.expertise_areas.some(area => area.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      setFilteredMentors(filtered)
    } else {
      setFilteredMentors(mentors)
    }
  }, [searchTerm, mentors])

  const loadMentors = async () => {
    try {
      setLoading(true)
      const response = await apiService.getMentors()
      setMentors(response.results || [])
      setFilteredMentors(response.results || [])
    } catch (error) {
      console.error('Failed to load mentors:', error)
      // Fallback to mock data if API fails
      const mockApiMentors: Mentor[] = mockMentors.map((mentor, index) => ({
        id: index + 1,
        user: {
          id: index + 1,
          email: `mentor${index + 1}@example.com`,
          first_name: mentor.name.split(' ')[0],
          last_name: mentor.name.split(' ').slice(1).join(' '),
          user_type: 'tutor' as const,
          is_active: true,
          date_joined: new Date().toISOString(),
          profile_picture: mentor.image
        },
        hourly_rate: 50 + (index * 10),
        expertise_areas: ['Business', 'Technology', 'Marketing'],
        experience_years: 5 + index,
        education: 'MBA from Top University',
        certifications: ['Certified Professional'],
        languages: ['English', 'Spanish'],
        availability: ['Monday', 'Tuesday', 'Wednesday'],
        rating: 4.8 + (index * 0.1),
        total_sessions: 100 + (index * 20),
        is_approved: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))
      
      setMentors(mockApiMentors)
      setFilteredMentors(mockApiMentors)
    } finally {
      setLoading(false)
    }
  }
  
  const nextSlide = () => {
    setCurrentSlide((prev) => {
      // Right button: move images to the left (show next mentor)
      if (prev === 0) return 1 // Go to slide 1 (show 6th mentor)
      return 0 // Go back to slide 0 (show first 5 mentors)
    })
  }
  
  const prevSlide = () => {
    setCurrentSlide((prev) => {
      // Left button: move images to the right (show previous mentor)
      if (prev === 1) return 0 // Go to slide 0 (show first 5 mentors)
      return 1 // Go to slide 1 (show 6th mentor)
    })
  }
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      {/* Main Content */}
      <main className="flex-1 px-6 pt-8">
        {/* Back Link */}
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Main Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-12">
            One to One Meetings With Professionals
          </h1>
          
          {/* Search Bar */}
          <div className="relative max-w-5xl mx-auto">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 z-10" />
            <input 
              type="text"
              placeholder="Find mentors by name, expertise or industry"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-3 text-xl bg-gray-100 text-gray-900 placeholder:text-gray-500 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
            />
          </div>
        </div>

        {/* Search Results */}
        {searchTerm && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Search Results for "{searchTerm}"
            </h2>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Searching mentors...</p>
              </div>
            ) : filteredMentors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMentors.map((mentor) => (
                  <MentorProfileCard key={mentor.id} mentor={mentor} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No mentors found matching your search.</p>
              </div>
            )}
          </div>
        )}

        {/* Secondary Section */}
        {!searchTerm && (
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Browse Our Top Mentors
            </h2>
          </div>
        )}

        {/* Featured Mentors Section */}
        {!searchTerm && (
          <>
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-2xl font-semibold text-gray-900">Featured Mentors</h3>
                <RotateCcw className="w-6 h-6 text-gray-600" />
              </div>
              <p className="text-gray-600 text-lg mb-4">
                Validate your CVs, create strong Recommendation letters, get early traction, and achieve your goals.
              </p>
            </div>

            {/* Featured Mentor Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {mentors.slice(0, 6).map((mentor) => (
                <MentorProfileCard key={mentor.id} mentor={mentor} />
              ))}
            </div>
          </>
        )}

        {/* All Mentors Section */}
        {!searchTerm && (
          <>
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-2xl font-semibold text-gray-900">All Mentors</h3>
                <RotateCcw className="w-6 h-6 text-gray-600" />
              </div>
              <p className="text-gray-600 text-lg mb-4">
                Browse through all our available mentors and find the perfect match for your needs.
              </p>
            </div>

            {/* All Mentor Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {mentors.map((mentor) => (
                <MentorProfileCard key={mentor.id} mentor={mentor} />
              ))}
            </div>
          </>
        )}

        {/* Become a Mentor Section */}
        <section className="text-center py-20 bg-gray-100 rounded-3xl mb-16">
          <h2 className="text-4xl font-bold mb-8 text-gray-900">Have Mentorship Expertise?</h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto text-xl leading-relaxed">
            Share your knowledge and help people achieve their dreams
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-xl font-semibold rounded-lg transition-colors">
            Become a Mentor
          </button>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}