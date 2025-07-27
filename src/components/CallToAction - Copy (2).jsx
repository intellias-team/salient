
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
      id="get-started-today"
      className="relative overflow-hidden bg-blue-600 py-32"
    >
      <Container className="relative">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-center mb-10">
          {videos.map((video, index) => (
            <div
              key={index}
              className="w-full md:w-1/3 max-w-xs md:max-w-sm aspect-video"
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
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            Get started today
          </h2>
          <p className="mt-4 text-lg tracking-tight text-white">
            It’s time to take control of your books. Buy our software so you can
            feel like you’re doing something productive.
          </p>
          <Button href="/register" color="white" className="mt-10">
            Get 6 months free
          </Button>
        </div>
      </Container>
    </section>
  )
}
