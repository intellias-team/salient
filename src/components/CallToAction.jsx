
'use client'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'

export function CallToAction() {
  const videos = [
    { src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', title: 'Feature Video 1' },
    { src: 'https://www.youtube.com/embed/VIDEO_ID_2', title: 'Feature Video 2' },
    { src: 'https://www.youtube.com/embed/VIDEO_ID_3', title: 'Feature Video 3' },
  ]

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-blue-600 py-10"
    >
       <Container className="relative">
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
