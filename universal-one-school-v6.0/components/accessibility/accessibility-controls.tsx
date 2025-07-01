'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Eye, 
  Ear, 
  Hand, 
  Brain, 
  Monitor, 
  Type, 
  Palette, 
  Volume2,
  MousePointer,
  Keyboard,
  Zap,
  Settings,
  RotateCcw,
  Save
} from 'lucide-react'

interface AccessibilitySettings {
  visual: {
    fontSize: number
    contrast: 'normal' | 'high' | 'inverted'
    dyslexiaFont: boolean
    reduceMotion: boolean
    colorBlindness: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'
    focusIndicator: boolean
    screenReader: boolean
  }
  auditory: {
    captionsEnabled: boolean
    audioDescriptions: boolean
    soundEffects: boolean
    voiceSpeed: number
    voicePitch: number
    backgroundAudio: boolean
  }
  motor: {
    keyboardNavigation: boolean
    stickyKeys: boolean
    slowKeys: boolean
    mouseKeys: boolean
    clickAssist: boolean
    hoverDelay: number
  }
  cognitive: {
    simplifiedInterface: boolean
    focusMode: boolean
    readingGuide: boolean
    autoSave: boolean
    sessionTimeouts: boolean
    breakReminders: boolean
    progressIndicators: boolean
  }
}

export default function AccessibilityControls() {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    visual: {
      fontSize: 16,
      contrast: 'normal',
      dyslexiaFont: false,
      reduceMotion: false,
      colorBlindness: 'none',
      focusIndicator: true,
      screenReader: false
    },
    auditory: {
      captionsEnabled: true,
      audioDescriptions: false,
      soundEffects: true,
      voiceSpeed: 1.0,
      voicePitch: 1.0,
      backgroundAudio: false
    },
    motor: {
      keyboardNavigation: true,
      stickyKeys: false,
      slowKeys: false,
      mouseKeys: false,
      clickAssist: false,
      hoverDelay: 500
    },
    cognitive: {
      simplifiedInterface: false,
      focusMode: false,
      readingGuide: false,
      autoSave: true,
      sessionTimeouts: false,
      breakReminders: true,
      progressIndicators: true
    }
  })

  const [activePreset, setActivePreset] = useState<string>('custom')
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    loadUserSettings()
  }, [])

  useEffect(() => {
    applySettings()
    setHasChanges(true)
  }, [settings])

  const loadUserSettings = async () => {
    // In production, load from user preferences API
    const savedSettings = localStorage.getItem('accessibility_settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }

  const applySettings = () => {
    const root = document.documentElement

    // Apply visual settings
    root.style.setProperty('--base-font-size', `${settings.visual.fontSize}px`)
    
    if (settings.visual.contrast === 'high') {
      root.classList.add('high-contrast')
      root.classList.remove('inverted-contrast')
    } else if (settings.visual.contrast === 'inverted') {
      root.classList.add('inverted-contrast')
      root.classList.remove('high-contrast')
    } else {
      root.classList.remove('high-contrast', 'inverted-contrast')
    }

    if (settings.visual.dyslexiaFont) {
      root.classList.add('dyslexia-font')
    } else {
      root.classList.remove('dyslexia-font')
    }

    if (settings.visual.reduceMotion) {
      root.classList.add('reduce-motion')
    } else {
      root.classList.remove('reduce-motion')
    }

    // Apply cognitive settings
    if (settings.cognitive.simplifiedInterface) {
      root.classList.add('simplified-ui')
    } else {
      root.classList.remove('simplified-ui')
    }

    if (settings.cognitive.focusMode) {
      root.classList.add('focus-mode')
    } else {
      root.classList.remove('focus-mode')
    }

    // Apply motor settings
    if (settings.motor.keyboardNavigation) {
      root.classList.add('keyboard-nav')
    } else {
      root.classList.remove('keyboard-nav')
    }
  }

  const saveSettings = async () => {
    localStorage.setItem('accessibility_settings', JSON.stringify(settings))
    // In production, save to user preferences API
    setHasChanges(false)
  }

  const resetToDefaults = () => {
    setSettings({
      visual: {
        fontSize: 16,
        contrast: 'normal',
        dyslexiaFont: false,
        reduceMotion: false,
        colorBlindness: 'none',
        focusIndicator: true,
        screenReader: false
      },
      auditory: {
        captionsEnabled: true,
        audioDescriptions: false,
        soundEffects: true,
        voiceSpeed: 1.0,
        voicePitch: 1.0,
        backgroundAudio: false
      },
      motor: {
        keyboardNavigation: true,
        stickyKeys: false,
        slowKeys: false,
        mouseKeys: false,
        clickAssist: false,
        hoverDelay: 500
      },
      cognitive: {
        simplifiedInterface: false,
        focusMode: false,
        readingGuide: false,
        autoSave: true,
        sessionTimeouts: false,
        breakReminders: true,
        progressIndicators: true
      }
    })
    setActivePreset('default')
  }

  const applyPreset = (preset: string) => {
    setActivePreset(preset)
    
    switch (preset) {
      case 'dyslexia':
        setSettings(prev => ({
          ...prev,
          visual: {
            ...prev.visual,
            dyslexiaFont: true,
            fontSize: 18,
            contrast: 'normal',
            reduceMotion: true
          },
          cognitive: {
            ...prev.cognitive,
            simplifiedInterface: true,
            readingGuide: true,
            focusMode: true
          }
        }))
        break
      
      case 'adhd':
        setSettings(prev => ({
          ...prev,
          visual: {
            ...prev.visual,
            reduceMotion: true,
            focusIndicator: true
          },
          cognitive: {
            ...prev.cognitive,
            focusMode: true,
            breakReminders: true,
            progressIndicators: true,
            simplifiedInterface: true
          },
          auditory: {
            ...prev.auditory,
            backgroundAudio: false,
            soundEffects: false
          }
        }))
        break
      
      case 'autism':
        setSettings(prev => ({
          ...prev,
          visual: {
            ...prev.visual,
            reduceMotion: true,
            contrast: 'normal'
          },
          cognitive: {
            ...prev.cognitive,
            simplifiedInterface: true,
            focusMode: true,
            progressIndicators: true
          },
          auditory: {
            ...prev.auditory,
            soundEffects: false,
            backgroundAudio: false
          },
          motor: {
            ...prev.motor,
            hoverDelay: 1000
          }
        }))
        break
      
      case 'low_vision':
        setSettings(prev => ({
          ...prev,
          visual: {
            ...prev.visual,
            fontSize: 24,
            contrast: 'high',
            focusIndicator: true,
            screenReader: true
          },
          auditory: {
            ...prev.auditory,
            audioDescriptions: true,
            captionsEnabled: true
          }
        }))
        break
      
      case 'motor_impairment':
        setSettings(prev => ({
          ...prev,
          motor: {
            ...prev.motor,
            keyboardNavigation: true,
            stickyKeys: true,
            slowKeys: true,
            clickAssist: true,
            hoverDelay: 1500
          },
          cognitive: {
            ...prev.cognitive,
            autoSave: true,
            sessionTimeouts: false
          }
        }))
        break
    }
  }

  const updateVisualSetting = (key: keyof AccessibilitySettings['visual'], value: any) => {
    setSettings(prev => ({
      ...prev,
      visual: { ...prev.visual, [key]: value }
    }))
  }

  const updateAuditorySetting = (key: keyof AccessibilitySettings['auditory'], value: any) => {
    setSettings(prev => ({
      ...prev,
      auditory: { ...prev.auditory, [key]: value }
    }))
  }

  const updateMotorSetting = (key: keyof AccessibilitySettings['motor'], value: any) => {
    setSettings(prev => ({
      ...prev,
      motor: { ...prev.motor, [key]: value }
    }))
  }

  const updateCognitiveSetting = (key: keyof AccessibilitySettings['cognitive'], value: any) => {
    setSettings(prev => ({
      ...prev,
      cognitive: { ...prev.cognitive, [key]: value }
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-6 w-6 text-blue-600" />
            <span>Accessibility Controls</span>
          </CardTitle>
          <CardDescription>
            Customize your learning experience with personalized accessibility features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={activePreset === 'custom' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActivePreset('custom')}
            >
              Custom
            </Button>
            <Button
              variant={activePreset === 'dyslexia' ? 'default' : 'outline'}
              size="sm"
              onClick={() => applyPreset('dyslexia')}
            >
              Dyslexia Support
            </Button>
            <Button
              variant={activePreset === 'adhd' ? 'default' : 'outline'}
              size="sm"
              onClick={() => applyPreset('adhd')}
            >
              ADHD Support
            </Button>
            <Button
              variant={activePreset === 'autism' ? 'default' : 'outline'}
              size="sm"
              onClick={() => applyPreset('autism')}
            >
              Autism Support
            </Button>
            <Button
              variant={activePreset === 'low_vision' ? 'default' : 'outline'}
              size="sm"
              onClick={() => applyPreset('low_vision')}
            >
              Low Vision
            </Button>
            <Button
              variant={activePreset === 'motor_impairment' ? 'default' : 'outline'}
              size="sm"
              onClick={() => applyPreset('motor_impairment')}
            >
              Motor Support
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <Badge variant={hasChanges ? 'destructive' : 'secondary'}>
              {hasChanges ? 'Unsaved Changes' : 'All Changes Saved'}
            </Badge>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={resetToDefaults}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={saveSettings} disabled={!hasChanges}>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Tabs */}
      <Tabs defaultValue="visual" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="visual" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Visual</span>
          </TabsTrigger>
          <TabsTrigger value="auditory" className="flex items-center space-x-2">
            <Ear className="h-4 w-4" />
            <span>Auditory</span>
          </TabsTrigger>
          <TabsTrigger value="motor" className="flex items-center space-x-2">
            <Hand className="h-4 w-4" />
            <span>Motor</span>
          </TabsTrigger>
          <TabsTrigger value="cognitive" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>Cognitive</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Type className="h-5 w-5" />
                <span>Text & Display</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Font Size: {settings.visual.fontSize}px</label>
                <Slider
                  value={[settings.visual.fontSize]}
                  onValueChange={([value]) => updateVisualSetting('fontSize', value)}
                  min={12}
                  max={32}
                  step={2}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Dyslexia-Friendly Font</label>
                <Switch
                  checked={settings.visual.dyslexiaFont}
                  onCheckedChange={(checked) => updateVisualSetting('dyslexiaFont', checked)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Contrast</label>
                <div className="flex space-x-2">
                  <Button
                    variant={settings.visual.contrast === 'normal' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateVisualSetting('contrast', 'normal')}
                  >
                    Normal
                  </Button>
                  <Button
                    variant={settings.visual.contrast === 'high' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateVisualSetting('contrast', 'high')}
                  >
                    High
                  </Button>
                  <Button
                    variant={settings.visual.contrast === 'inverted' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateVisualSetting('contrast', 'inverted')}
                  >
                    Inverted
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Reduce Motion</label>
                <Switch
                  checked={settings.visual.reduceMotion}
                  onCheckedChange={(checked) => updateVisualSetting('reduceMotion', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Enhanced Focus Indicators</label>
                <Switch
                  checked={settings.visual.focusIndicator}
                  onCheckedChange={(checked) => updateVisualSetting('focusIndicator', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Screen Reader Support</label>
                <Switch
                  checked={settings.visual.screenReader}
                  onCheckedChange={(checked) => updateVisualSetting('screenReader', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auditory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Volume2 className="h-5 w-5" />
                <span>Audio & Sound</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Closed Captions</label>
                <Switch
                  checked={settings.auditory.captionsEnabled}
                  onCheckedChange={(checked) => updateAuditorySetting('captionsEnabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Audio Descriptions</label>
                <Switch
                  checked={settings.auditory.audioDescriptions}
                  onCheckedChange={(checked) => updateAuditorySetting('audioDescriptions', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Sound Effects</label>
                <Switch
                  checked={settings.auditory.soundEffects}
                  onCheckedChange={(checked) => updateAuditorySetting('soundEffects', checked)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Voice Speed: {settings.auditory.voiceSpeed}x</label>
                <Slider
                  value={[settings.auditory.voiceSpeed]}
                  onValueChange={([value]) => updateAuditorySetting('voiceSpeed', value)}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Background Audio</label>
                <Switch
                  checked={settings.auditory.backgroundAudio}
                  onCheckedChange={(checked) => updateAuditorySetting('backgroundAudio', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="motor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MousePointer className="h-5 w-5" />
                <span>Navigation & Control</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Keyboard Navigation</label>
                <Switch
                  checked={settings.motor.keyboardNavigation}
                  onCheckedChange={(checked) => updateMotorSetting('keyboardNavigation', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Sticky Keys</label>
                <Switch
                  checked={settings.motor.stickyKeys}
                  onCheckedChange={(checked) => updateMotorSetting('stickyKeys', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Slow Keys</label>
                <Switch
                  checked={settings.motor.slowKeys}
                  onCheckedChange={(checked) => updateMotorSetting('slowKeys', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Click Assistance</label>
                <Switch
                  checked={settings.motor.clickAssist}
                  onCheckedChange={(checked) => updateMotorSetting('clickAssist', checked)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Hover Delay: {settings.motor.hoverDelay}ms</label>
                <Slider
                  value={[settings.motor.hoverDelay]}
                  onValueChange={([value]) => updateMotorSetting('hoverDelay', value)}
                  min={0}
                  max={2000}
                  step={100}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cognitive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Learning Support</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Simplified Interface</label>
                <Switch
                  checked={settings.cognitive.simplifiedInterface}
                  onCheckedChange={(checked) => updateCognitiveSetting('simplifiedInterface', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Focus Mode</label>
                <Switch
                  checked={settings.cognitive.focusMode}
                  onCheckedChange={(checked) => updateCognitiveSetting('focusMode', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Reading Guide</label>
                <Switch
                  checked={settings.cognitive.readingGuide}
                  onCheckedChange={(checked) => updateCognitiveSetting('readingGuide', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Auto-Save</label>
                <Switch
                  checked={settings.cognitive.autoSave}
                  onCheckedChange={(checked) => updateCognitiveSetting('autoSave', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Break Reminders</label>
                <Switch
                  checked={settings.cognitive.breakReminders}
                  onCheckedChange={(checked) => updateCognitiveSetting('breakReminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Progress Indicators</label>
                <Switch
                  checked={settings.cognitive.progressIndicators}
                  onCheckedChange={(checked) => updateCognitiveSetting('progressIndicators', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Extended Session Timeouts</label>
                <Switch
                  checked={!settings.cognitive.sessionTimeouts}
                  onCheckedChange={(checked) => updateCognitiveSetting('sessionTimeouts', !checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}