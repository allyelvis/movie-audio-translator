'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import SpeechRecognitionModule from './speech-recognition-module'
import TranslationModule from './translation-module'
import VoiceSynthesisModule from './voice-synthesis-module'
import AudioMixingModule from './audio-mixing-module'
import VideoDisplayModule from './video-display-module'
import DownloadModule from './download-module'
import ProjectManagementModule from './project-management-module'

export default function MovieAudioTranslator() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [transcript, setTranscript] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [synthesizedAudio, setSynthesizedAudio] = useState<ArrayBuffer | null>(null)
  const [targetLanguage, setTargetLanguage] = useState('es')
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file)
      setVideoUrl(URL.createObjectURL(file))
      setError(null)
      setProgress(0)
      setTranscript('')
      setTranslatedText('')
      setSynthesizedAudio(null)
    } else {
      setError('Please select a valid video file.')
    }
  }

  const handleTranscriptUpdate = (newTranscript: string) => {
    setTranscript(newTranscript)
    setProgress(25)
  }

  const handleTranslation = (translatedText: string) => {
    setTranslatedText(translatedText)
    setProgress(50)
  }

  const handleSynthesizedAudio = (audio: ArrayBuffer) => {
    setSynthesizedAudio(audio)
    setProgress(75)
  }

  const handleMixingComplete = () => {
    setProgress(100)
  }

  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  const handleLoadProject = (projectData: {
    videoFile: File | null
    transcript: string
    translatedText: string
    targetLanguage: string
  }) => {
    setVideoFile(projectData.videoFile)
    setVideoUrl(projectData.videoFile ? URL.createObjectURL(projectData.videoFile) : null)
    setTranscript(projectData.transcript)
    setTranslatedText(projectData.translatedText)
    setTargetLanguage(projectData.targetLanguage)
    setProgress(50) // Assuming translation is complete when loading a project
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Movie Audio Translator</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload Video</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
            />
            <Button onClick={handleUpload}>Select Video File</Button>
            <Label>{videoFile ? videoFile.name : 'No file selected'}</Label>
          </div>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Progress value={progress} className="mt-4" />
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VideoDisplayModule videoUrl={videoUrl} />
        <SpeechRecognitionModule onTranscriptUpdate={handleTranscriptUpdate} videoFile={videoFile} />
        <TranslationModule 
          transcript={transcript} 
          targetLanguage={targetLanguage} 
          onTranslation={handleTranslation}
          onLanguageChange={setTargetLanguage}
        />
        <VoiceSynthesisModule 
          text={translatedText} 
          targetLanguage={targetLanguage}
          onSynthesized={handleSynthesizedAudio}
        />
        <AudioMixingModule 
          synthesizedAudio={synthesizedAudio} 
          originalVideoFile={videoFile}
          onMixingComplete={handleMixingComplete}
        />
        <DownloadModule
          synthesizedAudio={synthesizedAudio}
          originalVideoFile={videoFile}
          translatedText={translatedText}
        />
        <ProjectManagementModule
          projectData={{
            videoFile,
            transcript,
            translatedText,
            targetLanguage,
          }}
          onLoadProject={handleLoadProject}
        />
      </div>
      <Card className="mt-6">
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">Original Transcript</h2>
          <p className="whitespace-pre-wrap mb-4">{transcript}</p>
          <h2 className="text-xl font-semibold mb-2">Translated Text</h2>
          <p className="whitespace-pre-wrap">{translatedText}</p>
        </CardContent>
      </Card>
    </div>
  )
}
