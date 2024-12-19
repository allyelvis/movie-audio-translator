'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Play } from 'lucide-react'

interface SpeechRecognitionModuleProps {
  onTranscriptUpdate: (transcript: string) => void
  videoFile: File | null
}

export default function SpeechRecognitionModule({ onTranscriptUpdate, videoFile }: SpeechRecognitionModuleProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (videoFile) {
      processVideoFile(videoFile)
    }
  }, [videoFile])

  const processVideoFile = async (file: File) => {
    setIsProcessing(true)
    setError(null)
    setTranscript('')
    setProgress(0)

    try {
      // Simulate video processing and transcription
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 500))
        setProgress(i)
      }

      const mockTranscript = "This is a mock transcript of the video file. It simulates the result of speech recognition processing on the uploaded video."
      setTranscript(mockTranscript)
      onTranscriptUpdate(mockTranscript)
    } catch (err) {
      setError('Failed to process video file. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Speech Recognition Module</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isProcessing ? (
            <div>
              <p>Processing video file...</p>
              <Progress value={progress} className="mt-2" />
            </div>
          ) : (
            <Button 
              onClick={() => videoFile && processVideoFile(videoFile)} 
              disabled={!videoFile || isProcessing}
              className="w-full"
            >
              <Play className="mr-2 h-4 w-4" /> Process Video
            </Button>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="p-4 bg-gray-100 rounded-md h-[200px] overflow-y-auto">
            <p className="whitespace-pre-wrap">{transcript}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
