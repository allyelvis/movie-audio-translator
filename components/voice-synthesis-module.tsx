'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface VoiceSynthesisModuleProps {
  text: string
  targetLanguage: string
  onSynthesized: (audio: ArrayBuffer) => void
}

export default function VoiceSynthesisModule({ 
  text, 
  targetLanguage, 
  onSynthesized 
}: VoiceSynthesisModuleProps) {
  const [isSynthesizing, setIsSynthesizing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (text) {
      handleSynthesis()
    }
  }, [text, targetLanguage])

  const handleSynthesis = async () => {
    setIsSynthesizing(true)
    setError(null)
    setProgress(0)

    try {
      for (let i = 0; i <= 100; i += 5) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setProgress(i)
      }

      const audioBuffer = await mockSynthesize(text, targetLanguage)
      onSynthesized(audioBuffer)
    } catch (err) {
      setError('Voice synthesis failed. Please try again.')
    } finally {
      setIsSynthesizing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Voice Synthesis Module</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isSynthesizing ? (
            <div>
              <p>Synthesizing voice...</p>
              <Progress value={progress} className="mt-2" />
            </div>
          ) : (
            <Button 
              onClick={handleSynthesis} 
              disabled={isSynthesizing || !text}
              className="w-full"
            >
              Synthesize Voice
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

// Mock voice synthesis function (replace with actual API call in production)
async function mockSynthesize(text: string, targetLang: string): Promise<ArrayBuffer> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500))

  // Create a mock ArrayBuffer (in reality, this would be audio data)
  const buffer = new ArrayBuffer(text.length * 2)
  const view = new Uint16Array(buffer)
  for (let i = 0; i < text.length; i++) {
    view[i] = text.charCodeAt(i)
  }

  return buffer
}
