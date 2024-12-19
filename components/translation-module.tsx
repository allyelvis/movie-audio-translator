'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface TranslationModuleProps {
  transcript: string
  targetLanguage: string
  onTranslation: (translatedText: string) => void
  onLanguageChange: (language: string) => void
}

const LANGUAGES = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'sw', name: 'Kiswahili' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
]

export default function TranslationModule({ 
  transcript, 
  targetLanguage, 
  onTranslation, 
  onLanguageChange 
}: TranslationModuleProps) {
  const [isTranslating, setIsTranslating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (transcript) {
      handleTranslation()
    }
  }, [transcript, targetLanguage])

  const handleTranslation = async () => {
    setIsTranslating(true)
    setError(null)
    setProgress(0)

    try {
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200))
        setProgress(i)
      }

      const translatedText = await mockTranslate(transcript, targetLanguage)
      onTranslation(translatedText)
    } catch (err) {
      setError('Translation failed. Please try again.')
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Translation Module</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select value={targetLanguage} onValueChange={onLanguageChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select target language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map(lang => (
                <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isTranslating ? (
            <div>
              <p>Translating...</p>
              <Progress value={progress} className="mt-2" />
            </div>
          ) : (
            <Button 
              onClick={handleTranslation} 
              disabled={isTranslating || !transcript}
              className="w-full"
            >
              Translate
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

// Mock translation function (replace with actual API call in production)
async function mockTranslate(text: string, targetLang: string): Promise<string> {
  const translations: { [key: string]: string } = {
    es: 'Este es un texto traducido al español.',
    fr: 'Ceci est un texte traduit en français.',
    de: 'Dies ist ein ins Deutsche übersetzter Text.',
    it: 'Questo è un testo tradotto in italiano.',
    ja: 'これは日本語に翻訳されたテキストです。',
    ko: '이것은 한국어로 번역된 텍스트입니다.',
    zh: '这是翻译成中文的文本。',
    sw: 'Huu ni mfano wa maandishi yaliyotafsiriwa kwa Kiswahili.',
    ar: 'هذا نص مترجم إلى اللغة العربية.',
    hi: 'यह हिंदी में अनुवादित पाठ है।',
    pt: 'Este é um texto traduzido para o português.',
    ru: 'Это текст, переведенный на русский язык.',
  }

  return translations[targetLang] || 'Translation not available for this language.'
}
