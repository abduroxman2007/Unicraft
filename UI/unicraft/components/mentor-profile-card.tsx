'use client';

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Clock, DollarSign, Users, Award } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Mentor } from "@/types/api"

interface MentorProfileCardProps {
  mentor: Mentor;
}

export function MentorProfileCard({ mentor }: MentorProfileCardProps) {
  const fullName = `${mentor.user.first_name} ${mentor.user.last_name}`
  
  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0">
        <div className="relative">
          <Image
            src={mentor.user.profile_picture || "/placeholder-user.jpg"}
            alt={fullName}
            width={300}
            height={200}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <Badge className="bg-green-500 text-white">
              Available
            </Badge>
          </div>
          
          {/* Rating Badge */}
          <div className="absolute top-3 left-3">
            <Badge className="bg-black text-white flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              {mentor.rating.toFixed(1)}
            </Badge>
          </div>
        </div>
        
        <div className="p-6">
          {/* Name and Title */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{fullName}</h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {mentor.expertise_areas.join(' • ')} Expert
            </p>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>{mentor.total_sessions} sessions</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Award className="w-4 h-4" />
              <span>{mentor.experience_years} years exp</span>
            </div>
          </div>
          
          {/* Expertise Areas */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {mentor.expertise_areas.slice(0, 3).map((area, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {area}
                </Badge>
              ))}
              {mentor.expertise_areas.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{mentor.expertise_areas.length - 3} more
                </Badge>
              )}
            </div>
          </div>
          
          {/* Price and Action */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-lg font-bold text-green-600">
                ${mentor.hourly_rate}/hr
              </span>
            </div>
            <Link href={`/mentor/${mentor.id}`}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                View Profile
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
