'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Save, Upload } from 'lucide-react'

interface ProjectData {
  videoFile: File | null
  transcript: string
  translatedText: string
  targetLanguage: string
}

interface ProjectManagementModuleProps {
  projectData: ProjectData
  onLoadProject: (data: ProjectData) => void
}

export default function ProjectManagementModule({ 
  projectData, 
  onLoadProject 
}: ProjectManagementModuleProps) {
  const [projectName, setProjectName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSaveProject = () => {
    if (!projectName) {
      setError('Please enter a project name.')
      return
    }

    const projectToSave = {
      name: projectName,
      videoFile: projectData.videoFile,
      transcript: projectData.transcript,
      translatedText: projectData.translatedText,
      targetLanguage: projectData.targetLanguage,
    }

    // In a real implementation, we would save this to a database or file system
    localStorage.setItem(`project_${projectName}`, JSON.stringify(projectToSave))
    setError(null)
    setProjectName('')
  }

  const handleLoadProject = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const loadedData = JSON.parse(e.target?.result as string)
          onLoadProject(loadedData)
          setError(null)
        } catch (err) {
          setError('Failed to load project. Invalid file format.')
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <Button onClick={handleSaveProject}>
              <Save className="mr-2 h-4 w-4" />
              Save Project
            </Button>
          </div>
          <div>
            <Input
              type="file"
              accept=".json"
              onChange={handleLoadProject}
              className="hidden"
              id="load-project"
            />
            <Button asChild>
              <label htmlFor="load-project">
                <Upload className="mr-2 h-4 w-4" />
                Load Project
              </label>
            </Button>
          </div>
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
