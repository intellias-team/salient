import { CallToAction } from '@/components/CallToAction'
import { Faqs } from '@/components/Faqs'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Pricing } from '@/components/Pricing'
import { About } from '@/components/About'
import { Ingredients } from '@/components/Ingredients'  // Updated import
import { Testimonials } from '@/components/Testimonials'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Ingredients />  
        <CallToAction />
        <Testimonials />
        <Pricing />
        <Faqs />
      </main>
      <Footer />
    </>
  )
}