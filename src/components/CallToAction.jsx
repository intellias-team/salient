
'use client'

import Image from 'next/image'
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import testimonialsImage from '@/images/testimonials.jpg' // Replace with your image path
import backgroundImage from '@/images/background-features.jpg'


export function CallToAction() {
  const videos = [
    { src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', title: 'Feature Video 1' },
    { src: 'https://www.youtube.com/embed/VIDEO_ID_2', title: 'Feature Video 2' },
    { src: 'https://www.youtube.com/embed/VIDEO_ID_3', title: 'Feature Video 3' },
  ]

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-black py-0"
    >
      <Image
        className="absolute top-1/2 left-1/2 max-w-none translate-x-[-44%] translate-y-[-42%]"
        src={backgroundImage}
        alt=""
        width={2245}
        height={1636}
        unoptimized
      />
      <Container className="relative">
        <Image
          src={testimonialsImage}
          alt="Testimonials banner"
          className="w-full mb-6"  
          priority
        />

        <div className="max-w-full mb-10">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            Testimonials
          </h2>
          <p className="mt-4 text-lg tracking-tight text-white">
            Learn what our product has done for professional athletes,  body builders, medical professionals and people like you!
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-center">
          {videos.map((video, index) => (
            <div
              key={index}
              className="w-full max-w-[400px] md:max-w-[500px] aspect-video"
            >
              <iframe
                className="w-full h-full rounded-lg shadow-lg"
                src={video.src}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
