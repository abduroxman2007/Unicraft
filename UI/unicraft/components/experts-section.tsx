"use client"

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"

const experts = [
  {
    name: "Katie Dunn",
    image: "/images/mentor-katie.jpg",
    description: "Angel Investor In 25+ Startups across...",
    rating: "5.0",
    badge: "Top Advisor"
  },
  {
    name: "Ben Lang", 
    image: "/images/mentor-ben.jpg",
    description: "Head of Community at Cursor | Angel ...",
    rating: "5.0",
    badge: "Top Advisor"
  },
  {
    name: "Justin Gerrard",
    image: "/images/mentor-justin.jpg", 
    description: "3X Startup Exits | Alum: Discord, Twit...",
    rating: "5.0",
    badge: "Top Advisor"
  },
  {
    name: "Terri Yo",
    image: "/images/mentor-jerri.jpg",
    description: "Marketing Lead at...",
    rating: "5.0", 
    badge: "Top Advisor"
  },
  {
    name: "Sarah Johnson",
    image: "/images/mentor-katie.jpg",
    description: "AI Expert & Tech Lead at Google",
    rating: "5.0",
    badge: "Top Advisor"
  },
  {
    name: "Michael Chen",
    image: "/images/mentor-ben.jpg",
    description: "Senior Developer at Microsoft",
    rating: "5.0",
    badge: "Top Advisor"
  },
  {
    name: "Emily Rodriguez",
    image: "/images/mentor-jerri.jpg",
    description: "Education Technology Specialist",
    rating: "5.0",
    badge: "Top Advisor"
  },
  {
    name: "David Kim",
    image: "/images/mentor-justin.jpg",
    description: "Healthcare Innovation Expert",
    rating: "5.0",
    badge: "Top Advisor"
  }
]

export function ExpertsSection() {
  return (
    <div className="relative">
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView="auto"
        navigation={{
          nextEl: '.expert-swiper-next',
          prevEl: '.expert-swiper-prev',
        }}
        className="experts-swiper"
      >
        {experts.map((expert, index) => (
          <SwiperSlide key={index} className="!w-80">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="relative h-[500px]">
                <img
                  src={expert.image}
                  alt={expert.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <Badge className="bg-black text-white text-xs font-medium px-2 py-1">
                    {expert.rating}
                  </Badge>
                  <Badge className="bg-green-500 text-white text-xs font-medium px-2 py-1">
                    {expert.badge}
                  </Badge>
                </div>

                {/* Gradient Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-white font-semibold text-lg">{expert.name}</h3>
                    <Check className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {expert.description}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      <div className="flex gap-2 mt-6 justify-end">
        <Button 
          variant="outline" 
          size="icon" 
          className="expert-swiper-prev border-gray-300 hover:border-gray-400"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="expert-swiper-next border-gray-300 hover:border-gray-400"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}