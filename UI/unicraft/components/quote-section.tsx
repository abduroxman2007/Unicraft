"use client"

import { useState } from "react"
import Image from "next/image"

const quotes = [
  {
    id: 1,
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    name: "Winston Churchill",
    position: "Former Prime Minister",
    image: "/placeholder-user.jpg"
  },
  {
    id: 2,
    quote: "The only way to do great work is to love what you do.",
    name: "Steve Jobs",
    position: "Co-founder of Apple",
    image: "/placeholder-user.jpg"
  },
  {
    id: 3,
    quote: "Innovation distinguishes between a leader and a follower.",
    name: "Steve Jobs",
    position: "Technology Visionary",
    image: "/placeholder-user.jpg"
  }
]

export function QuoteSection() {
  const [activeQuote, setActiveQuote] = useState(0)

  return (
    <section className="py-8">
      <div className="max-w-full mx-auto px-6">
        <div className="bg-blue-950 text-white p-12 rounded-3xl">
          <div className="flex flex-col justify-between h-[90vh]">
            {/* Top Section - Quote of the day text */}
            <div className="pt-4">
              <p className="text-sm text-gray-300">The quote of the day:</p>
            </div>

            {/* Middle Section - Main Quote */}
            <div className="flex-1 flex flex-col justify-center">
              <blockquote className="text-6xl font-bold text-white leading-tight transition-all duration-500 ease-in-out">
                "{quotes[activeQuote].quote}"
              </blockquote>
            </div>

            {/* Bottom Section - Profile Images and Info */}
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-4 mb-4">
                {quotes.map((quote, index) => (
                  <button
                    key={quote.id}
                    onClick={() => setActiveQuote(index)}
                    className={`w-12 h-12 rounded-full transition-all duration-300 ${
                      activeQuote === index 
                        ? 'ring-4 ring-white ring-opacity-50 scale-110' 
                        : 'opacity-60 hover:opacity-80'
                    }`}
                  >
                    <Image
                      src={quote.image}
                      alt={quote.name}
                      width={48}
                      height={48}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </button>
                ))}
              </div>
              <div className="text-left transition-all duration-500 ease-in-out">
                <p className="text-lg text-white font-medium">{quotes[activeQuote].name}</p>
                <p className="text-sm text-gray-300">{quotes[activeQuote].position}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
