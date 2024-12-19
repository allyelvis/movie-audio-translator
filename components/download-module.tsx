'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Download } from 'lucide-react'

interface DownloadModuleProps {
  synthesizedAudio: ArrayBuffer | null
  originalVideoFile: File | null
  translatedText: string
}

export default function DownloadModule({ 
  synthesizedAudio, 
  originalVideoFile, 
  translatedText 
}: DownloadModuleProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async () => {
    if (!synthesizedAudio || !originalVideoFile) {
      setError('No audio or video file available for download.')
      return
    }

    setIsProcessing(true)
    setError(null)
    setProgress(0)

    try {
      // Simulate processing time
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200))
        setProgress(i)
      }

      // In a real implementation, we would merge the synthesized audio with the original video
      // For now, we'll just create a simple text file with the translated text
      const blob = new Blob([translatedText], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'translated_output.txt'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      setError('Failed to process download. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Download Translated Video</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isProcessing ? (
            <div>
              <p>Processing download...</p>
              <Progress value={progress} className="mt-2" />
            </div>
          ) : (
            <Button 
              onClick={handleDownload} 
              disabled={!synthesizedAudio || !originalVideoFile}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Translated Video
            </Button>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
