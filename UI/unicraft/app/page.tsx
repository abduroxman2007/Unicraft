import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Heart, Users, Briefcase, DollarSign, TrendingUp, BarChart3, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { ExpertsSection } from "@/components/experts-section"
import { HelpCategoriesSection } from "@/components/help-categories-section"
import { QuoteSection } from "@/components/quote-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section
        className="relative h-screen bg-cover bg-center"
        style={{ backgroundImage: "url(/images/campus-aerial.jpg)" }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-20 flex items-end h-full">
          <div className="text-white max-w-4xl px-6 pb-20 ml-6">
            <h1 className="text-6xl font-bold mb-6 text-balance">
              Get Professional Help
              <br />
              in Your University Journey
            </h1>
            <p className="text-xl opacity-90 max-w-2xl">
              Find the right mentors to guide you through your academic and professional development with personalized
              support.
            </p>
          </div>
        </div>
      </section>

      {/* Trusted by Section */}
      <section className="py-20 bg-white">
        <div className="max-w-full mx-auto px-6">
          <p className="text-left text-black mb-12 text-xl font-medium">Trusted by advisors from</p>
          
          {/* Company Logos */}
          <div className="flex items-center justify-between mb-20">
            <div className="bg-stone-100 rounded-xl px-8 py-6 flex items-center justify-center">
              <span className="text-3xl font-bold text-black">a16z</span>
            </div>
            <div className="bg-stone-100 rounded-xl px-8 py-6 flex items-center justify-center gap-3">
              <div className="w-8 h-8 bg-black rounded-lg"></div>
              <span className="text-3xl font-bold text-black">CURSOR</span>
            </div>
            <div className="bg-stone-100 rounded-xl px-8 py-6 flex items-center justify-center">
              <span className="text-5xl">🍎</span>
            </div>
            <div className="bg-stone-100 rounded-xl px-8 py-6 flex items-center justify-center gap-3">
              <span className="text-3xl">❤️</span>
              <span className="text-3xl font-bold text-black">Lovable</span>
            </div>
            <div className="bg-stone-100 rounded-xl px-8 py-6 flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">Y</span>
              </div>
              <span className="text-3xl font-bold text-black">Combinator</span>
            </div>
          </div>
        </div>
      </section>

      {/* Experts Section */}
      <section className="py-20 bg-white">
        <div className="max-w-full mx-auto px-6">
          {/* Main Content */}
          <div className="flex items-start justify-between mb-12">
            <div className="flex-1 max-w-2xl">
              <h2 className="text-5xl font-bold mb-6 text-black font-serif">
                Experts who've done the work.
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                They've built, scaled, failed, pivoted, and launched again. Now they're here to help you do the same—with clear, honest advice from lived experience.
              </p>
            </div>
            
            <div className="ml-8">
              <Link href="/find-mentor" className="text-black font-medium text-lg hover:text-gray-700 transition-colors flex items-center gap-2" style={{ color: 'black' }}>
                Find your expert
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'black' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Experts Swiper */}
          <ExpertsSection />
        </div>
      </section>

      {/* Help Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-full mx-auto px-6">
          <div className="flex items-start justify-between mb-12">
            <div className="flex-1 max-w-3xl">
              <h2 className="text-5xl font-bold mb-6 text-black font-serif">
                Not sure how to start? Get help from Professionals
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                You don't lack knowledge. You lack context. That's why Google, AI, and endless Twitter threads aren't breaking the cycle.
              </p>
            </div>
            
            <div className="ml-8">
              <button className="text-black font-medium text-lg hover:text-gray-700 transition-colors flex items-center gap-2" style={{ color: 'black' }}>
                Find your expert
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'black' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Categories Swiper */}
          <HelpCategoriesSection />
        </div>
      </section>

      {/* Ready Section */}
      <section className="py-8">
        <div className="max-w-full mx-auto px-6">
          <div className="relative h-[90vh] bg-cover bg-center rounded-3xl overflow-hidden" style={{ backgroundImage: "url(/images/workspace.jpg)" }}>
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10 h-full flex flex-col justify-between p-12">
              {/* UniCraft Logo - Top Left */}
              <div className="flex items-start">
                <Image 
                  src="/logo-blue.png" 
                  alt="UniCraft" 
                  width={200} 
                  height={60}
                  className="w-36 h-14"
                />
              </div>

              {/* Content - Bottom Left */}
              <div className="flex flex-col items-start max-w-md">
                <h2 className="text-5xl font-bold text-white mb-6 whitespace-nowrap">Ready when you are.</h2>
                <p className="text-white/90 mb-8 text-lg leading-relaxed">
                  Search real experts who've solved what you're facing, and get honest advice that actually helps.
                </p>
                <Link href="/find-mentor">
                  <Button className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-8 py-3 text-lg font-medium rounded-lg">
                    Find your expert
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <QuoteSection />

      {/* FAQ Section */}
      <section className="py-18 bg-gray-50">
        <div className="max-w-full mx-auto px-6">
          <div className="grid grid-cols-2 gap-14">
            <div>
              <h2 className="text-5xl font-bold mb-10 font-serif">Question we get asked the most.</h2>
            </div>
            <div>
              <Accordion type="single" collapsible className="space-y-5">
                {[1, 2, 3, 4, 5].map((num) => (
                  <AccordionItem key={num} value={`item-${num}`} className="bg-blue-100 rounded-xl px-7 py-3">
                    <AccordionTrigger className="text-left font-semibold text-lg">Question {num}</AccordionTrigger>
                    <AccordionContent className="text-gray-600 text-base leading-relaxed">
                      This is the answer to question {num}. It provides helpful information about our services and how
                      we can assist you.
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="font-semibold mb-4">Let us always inform you of the best</h3>
              <p className="text-gray-400 text-sm mb-6">
                We share important information, sales and recommendations via email so you don't miss out on the best.
              </p>
              <div className="flex gap-2">
                <Input placeholder="Your email address" className="bg-gray-800 border-gray-700 text-white" />
                <Button>Join</Button>
              </div>

            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Find Mentors</li>
                <li>Categories</li>
                <li>Pricing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>About</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Social</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Twitter</li>
                <li>LinkedIn</li>
                <li>Instagram</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex justify-between items-center text-sm text-gray-400">
            <p>© 2024 Unicraft</p>
            <div className="flex gap-6">
              <span>Terms of Service</span>
              <span>Privacy Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
