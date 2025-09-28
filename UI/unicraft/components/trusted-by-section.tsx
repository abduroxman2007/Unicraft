"use client"

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import Link from "next/link"

const companies = [
  { name: "a16z", logo: "a16z" },
  { name: "CURSOR", logo: "CURSOR" },
  { name: "Apple", logo: "🍎" },
  { name: "Lovable", logo: "Lovable" },
  { name: "Y Combinator", logo: "Y Combinator" }
]

export function TrustedBySection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-gray-600 mb-8 text-sm">Trusted by advisors from</p>
        
        {/* Company Logos Swiper */}
        <div className="mb-16">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            slidesPerView={5}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            loop={true}
            breakpoints={{
              320: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              640: {
                slidesPerView: 3,
                spaceBetween: 25,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 30,
              },
            }}
            className="company-swiper"
          >
            {companies.map((company, index) => (
              <SwiperSlide key={index}>
                <div className="bg-stone-100 rounded-lg p-6 h-20 flex items-center justify-center opacity-60 hover:opacity-80 transition-opacity">
                  <span className="text-lg font-semibold text-black">
                    {company.logo}
                  </span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Main Content */}
        <div className="flex items-start justify-between">
          <div className="flex-1 max-w-2xl">
            <h2 className="text-5xl font-bold mb-6 text-black font-serif">
              Experts who've done the work.
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              They've built, scaled, failed, pivoted, and launched again. Now they're here to help you do the same—with clear, honest advice from lived experience.
            </p>
          </div>
          
          <div className="ml-8">
            <Link href="/find-mentor" className="text-blue-600 font-medium text-lg hover:text-blue-700 transition-colors flex items-center gap-2">
              Find your expert
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

    </section>
  )
}
