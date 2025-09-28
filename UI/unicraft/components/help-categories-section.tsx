"use client"

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Heart, Users, Briefcase, DollarSign, TrendingUp, BarChart3, Handshake } from "lucide-react"

const categories = [
  { icon: Heart, title: "Mental Health" },
  { icon: Users, title: "Hiring & Team Building" },
  { icon: Briefcase, title: "Business & Money" },
  { icon: DollarSign, title: "Fundraising 101" },
  { icon: TrendingUp, title: "Scaling the Business" },
  { icon: BarChart3, title: "Sales & Growth" },
  { icon: Handshake, title: "Brand & Product" }
]

export function HelpCategoriesSection() {
  return (
    <div className="relative">
      <Swiper
        modules={[Navigation]}
        spaceBetween={24}
        slidesPerView="auto"
        navigation={{
          nextEl: '.categories-swiper-next',
          prevEl: '.categories-swiper-prev',
        }}
        className="categories-swiper"
      >
        {categories.map((category, index) => (
          <SwiperSlide key={index} className="!w-64">
            <div className="bg-stone-100 rounded-xl p-6 h-32 flex flex-col justify-between hover:bg-stone-200 transition-colors">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <category.icon className="h-5 w-5 text-black" />
              </div>
              <h3 className="text-base font-semibold text-black text-left">{category.title}</h3>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons - Bottom Right */}
      <div className="flex gap-2 mt-6 justify-end">
        <Button 
          variant="outline" 
          size="icon" 
          className="categories-swiper-prev border-gray-300 hover:border-gray-400"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="categories-swiper-next border-gray-300 hover:border-gray-400"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
