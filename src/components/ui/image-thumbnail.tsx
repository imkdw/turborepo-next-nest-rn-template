"use client"

import Image from "next/image"
import { useState } from "react"

interface ImageThumbnailProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  onClick?: () => void
}

export default function ImageThumbnail({
  src,
  alt,
  width = 120,
  height = 80,
  className = "",
  onClick
}: ImageThumbnailProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  return (
    <div 
      className={`relative overflow-hidden rounded-lg border bg-gray-100 transition-transform hover:scale-105 cursor-pointer ${className}`}
      onClick={onClick}
      style={{ width, height }}
    >
      {!hasError ? (
        <Image
          src={src}
          alt={alt}
          fill
          className={`object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true)
            setIsLoading(false)
          }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gray-200">
          <div className="text-gray-400 text-center">
            <div className="w-8 h-8 mx-auto mb-1 bg-gray-300 rounded"></div>
            <span className="text-xs">이미지 없음</span>
          </div>
        </div>
      )}
      
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
}