"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import type { WebsiteSettings } from "../types"

/**
 * Gallery Grid Block - 6 image grid with lightbox
 */
export function GalleryGridBlock({
  columns = 3,
  showLightbox = true,
  data,
  settings,
}: {
  columns?: number
  showLightbox?: boolean
  data?: Record<string, unknown>
  settings?: WebsiteSettings
}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Get images from data binding or use defaults
  const images = ((data?.["listings"] as Record<string, unknown>)?.images || (data?.["property"] as Record<string, unknown>)?.images || [
    "/placeholder-1.jpg",
    "/placeholder-2.jpg",
    "/placeholder-3.jpg",
    "/placeholder-4.jpg",
    "/placeholder-5.jpg",
    "/placeholder-6.jpg",
  ]) as string[]

  const colsClass = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  }[columns] || "grid-cols-3"

  return (
    <div className="w-full py-12 px-4 md:px-8">
      <div className={`grid ${colsClass} gap-4 auto-rows-[250px]`}>
        {images.slice(0, 6).map((image, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden rounded-lg cursor-pointer group bg-gray-200"
            onClick={() => showLightbox && setSelectedImage(image)}
          >
            <img
              src={image}
              alt={`Gallery ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {showLightbox && (
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
            <img
              src={selectedImage}
              alt="Gallery"
              className="w-full h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
              onClick={() => setSelectedImage(null)}
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Carousel Block - Property carousel with thumbnails
 */
export function CarouselBlock({
  autoplay = true,
  showThumbnails = true,
  data,
  settings,
}: {
  autoplay?: boolean
  showThumbnails?: boolean
  data?: Record<string, unknown>
  settings?: WebsiteSettings
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const autoplayRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Get images from data binding or use defaults
  const images = ((data?.["listing"] as Record<string, unknown>)?.images || (data?.["listings"] as Record<string, unknown>)?.images || [
    "/placeholder-hero-1.jpg",
    "/placeholder-hero-2.jpg",
    "/placeholder-hero-3.jpg",
  ]) as string[]

  const startAutoplay = () => {
    if (autoplay) {
      autoplayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
      }, 5000)
    }
  }

  const stopAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current)
    }
  }

  const handlePrev = () => {
    stopAutoplay()
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    startAutoplay()
  }

  const handleNext = () => {
    stopAutoplay()
    setCurrentIndex((prev) => (prev + 1) % images.length)
    startAutoplay()
  }

  useEffect(() => {
    startAutoplay()
    return () => stopAutoplay()
  }, [autoplay])

  return (
    <div className="w-full bg-gray-900">
      {/* Main Carousel */}
      <div className="relative w-full h-96 md:h-[500px] overflow-hidden bg-gray-800">
        {/* Images */}
        {images.map((image, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-500 ${
              idx === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image}
              alt={`Carousel ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-200 rounded-full p-2 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-200 rounded-full p-2 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                stopAutoplay()
                setCurrentIndex(idx)
                startAutoplay()
              }}
              className={`w-2 h-2 rounded-full transition ${
                idx === currentIndex ? "bg-white w-8" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails */}
      {showThumbnails && (
        <div className="bg-gray-900 px-4 py-4 flex gap-3 overflow-x-auto">
          {images.map((image, idx) => (
            <button
              key={idx}
              onClick={() => {
                stopAutoplay()
                setCurrentIndex(idx)
                startAutoplay()
              }}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                idx === currentIndex ? "border-white" : "border-gray-700 opacity-60"
              }`}
            >
              <img src={image} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Before & After Slider Block
 */
export function BeforeAfterBlock({
  beforeImage = "/before.jpg",
  afterImage = "/after.jpg",
  data,
  settings,
}: {
  beforeImage?: string
  afterImage?: string
  data?: Record<string, unknown>
  settings?: WebsiteSettings
}) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const newPosition = ((e.clientX - rect.left) / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, newPosition)))
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const newPosition = ((e.touches[0].clientX - rect.left) / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, newPosition)))
  }

  return (
    <div className="w-full py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Before & After</h2>

        <div
          ref={containerRef}
          className="relative w-full bg-gray-200 rounded-lg overflow-hidden cursor-col-resize"
          style={{ aspectRatio: "16/9" }}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
        >
          {/* After Image (Full Background) */}
          <img
            src={afterImage}
            alt="After"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Before Image (Clipped) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <img src={beforeImage} alt="Before" className="w-full h-full object-cover" />
          </div>

          {/* Slider Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize transition-shadow hover:shadow-lg"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg p-2">
              <svg
                className="w-4 h-4 text-gray-700"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M15 18l-6-6 6-6M9 18l-6-6 6-6" />
              </svg>
            </div>
          </div>

          {/* Labels */}
          <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded text-sm font-semibold">
            Before
          </div>
          <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded text-sm font-semibold">
            After
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Virtual Tour / 360 View Block
 */
export function VirtualTourBlock({
  tourUrl = "",
  height = "600px",
  data,
  settings,
}: {
  tourUrl?: string
  height?: string
  data?: Record<string, unknown>
  settings?: WebsiteSettings
}) {
  return (
    <div className="w-full py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Virtual Tour</h2>

        {tourUrl ? (
          <iframe
            src={tourUrl}
            className="w-full rounded-lg border border-gray-200 shadow-lg"
            style={{ height }}
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <div
            className="w-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex flex-col items-center justify-center text-center"
            style={{ height }}
          >
            <svg
              className="w-16 h-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 001.591-.079 8.88 8.88 0 01-.981 4.334c-.106.341-.351.556-.707.556h-.26c-.662 0-1.306-.264-1.764-.744L12 16.5m21-12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V2.25z"
              />
            </svg>
            <p className="text-gray-600 text-lg">Virtual tour not configured</p>
            <p className="text-gray-400 text-sm mt-2">Add a Matterport or similar 360° tour URL</p>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Video Hero Block
 */
export function VideoHeroBlock({
  title = "Discover Your Dream Home",
  subtitle = "Watch our property showcase",
  videoUrl = "",
  overlayOpacity = 0.3,
  data,
  settings,
}: {
  title?: string
  subtitle?: string
  videoUrl?: string
  overlayOpacity?: number
  data?: Record<string, unknown>
  settings?: WebsiteSettings
}) {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {videoUrl ? (
        <>
          <video
            autoPlay
            muted
            loop
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black transition-opacity duration-300"
        style={{ opacity: overlayOpacity }}
      />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4 md:px-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 max-w-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-2xl text-gray-200 mb-8 max-w-2xl">{subtitle}</p>
        )}
        <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg">
          Learn More
        </button>
      </div>

      {/* Play Button (if no video) */}
      {!videoUrl && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button className="bg-white hover:bg-gray-100 rounded-full p-4 transition shadow-xl">
            <svg className="w-12 h-12 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
