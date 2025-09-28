import Image from "next/image"
import { Star, Check } from "lucide-react"

interface MentorCardProps {
  mentor: {
    name: string
    title: string
    image: string
    rating?: number
    price?: string
    badge?: string
    badgeColor?: string
    verified?: boolean
    university?: string
  }
}

export function MentorCard({ mentor }: MentorCardProps) {
  return (
    <div>
      <div className="relative mb-4">
        <Image 
          src={mentor.image} 
          alt={mentor.name}
          width={180}
          height={240}
          className="w-full h-64 object-cover rounded-lg"
        />
        
        {/* University Badge */}
        {mentor.university && (
          <div className="absolute top-2 right-2">
            <div className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
              {mentor.university}
            </div>
          </div>
        )}
        
        {/* Top Advisor Badge */}
        {mentor.badge && (
          <div className="absolute top-2 left-2">
            <div className={`${mentor.badgeColor || 'bg-yellow-500'} text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
              <Star className="w-3 h-3 fill-current" />
              {mentor.badge}
            </div>
          </div>
        )}
        
        {/* UA C Badge */}
        <div className="absolute top-2 right-2">
          <div className="bg-[#1C2E5C] text-white px-2 py-1 rounded text-xs font-bold">
            UA C
          </div>
        </div>
      </div>
      
      <div className="text-left">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-unicraft-text-primary">{mentor.name}</h3>
          {mentor.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <span className="text-base font-bold text-unicraft-text-primary">{mentor.rating}</span>
            </div>
          )}
        </div>
        
        <p className="text-unicraft-text-primary text-sm font-bold leading-relaxed mb-2">
          {mentor.title}
        </p>
        
        {mentor.price && (
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-black">{mentor.price}</span>
            <span className="text-xs text-gray-500">Starting from</span>
          </div>
        )}
      </div>
    </div>
  )
}
