'use client'

import { useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface VideoDisplayModuleProps {
  videoUrl: string | null
}

export default function VideoDisplayModule({ videoUrl }: VideoDisplayModuleProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current && videoUrl) {
      videoRef.current.src = videoUrl
    }
  }, [videoUrl])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Video Display</CardTitle>
      </CardHeader>
      <CardContent>
        {videoUrl ? (
          <video 
            ref={videoRef} 
            controls 
            className="w-full h-auto"
            aria-label="Uploaded video"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
            No video uploaded
          </div>
        )}
      </CardContent>
    </Card>
  )
}
