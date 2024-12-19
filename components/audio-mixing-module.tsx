'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, RotateCcw } from 'lucide-react'

interface AudioMixingModuleProps {
  synthesizedAudio: ArrayBuffer | null
  originalVideoFile: File | null
  onMixingComplete: () => void
}

export default function AudioMixingModule({ 
  synthesizedAudio, 
  originalVideoFile, 
  onMixingComplete 
}: AudioMixingModuleProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMixing, setIsMixing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mixedAudioUrl, setMixedAudioUrl] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [originalVolume, setOriginalVolume] = useState(50)
  const [translatedVolume, setTranslatedVolume] = useState(50)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (synthesizedAudio && originalVideoFile) {
      mixAudio(synthesizedAudio, originalVideoFile)
    }
  }, [synthesizedAudio, originalVideoFile])

  const mixAudio = async (synthesizedAudio: ArrayBuffer, originalVideo: File) => {
    setIsMixing(true)
    setError(null)
    setProgress(0)

    try {
      for (let i = 0; i <= 100; i += 5) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setProgress(i)
      }

      // In a real implementation, we would mix the audio here
      // For now, we'll just use the synthesized audio
      const blob = new Blob([synthesizedAudio], { type: 'audio/wav' })
      const url = URL.createObjectURL(blob)
      setMixedAudioUrl(url)
      setError(null)
      onMixingComplete()
    } catch (err) {
      setError('Failed to mix audio. Please try again.')
    } finally {
      setIsMixing(false)
    }
  }

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(err => {
          setError('Failed to play audio. Please try again.')
        })
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleReset = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const handleVolumeChange = (type: 'original' | 'translated', value: number[]) => {
    if (type === 'original') {
      setOriginalVolume(value[0])
    } else {
      setTranslatedVolume(value[0])
    }
    // In a real implementation, we would adjust the audio mix here
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audio Mixing Module</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isMixing ? (
            <div>
              <p>Mixing audio...</p>
              <Progress value={progress} className="mt-2" />
            </div>
          ) : mixedAudioUrl ? (
            <>
              <audio ref={audioRef} src={mixedAudioUrl} onEnded={() => setIsPlaying(false)} />
              <div className="flex justify-center space-x-2">
                <Button onClick={handlePlayPause}>
                  {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
                <Button onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
              <div className="space-y-2">
                <p>Original Audio Volume</p>
                <Slider
                  value={[originalVolume]}
                  onValueChange={(value) => handleVolumeChange('original', value)}
                  max={100}
                  step={1}
                />
                <p>Translated Audio Volume</p>
                <Slider
                  value={[translatedVolume]}
                  onValueChange={(value) => handleVolumeChange('translated', value)}
                  max={100}
                  step={1}
                />
              </div>
            </>
          ) : (
            <p>Waiting for synthesized audio and original video...</p>
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
