'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Wand2, 
  Eye, 
  Save, 
  Download, 
  Upload,
  Palette,
  Layout,
  Type,
  Image,
  Video,
  Music,
  Settings,
  Sparkles
} from 'lucide-react';

interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
  neurodivergentSupport: boolean;
}

const contentTemplates: ContentTemplate[] = [
  {
    id: 'superhero-lesson',
    name: 'SuperHero Learning Adventure',
    description: 'Interactive superhero-themed lesson with ADHD-friendly features',
    category: 'Primary Education',
    preview: '/templates/superhero-preview.jpg',
    neurodivergentSupport: true
  },
  {
    id: 'theater-workshop',
    name: 'Theater Arts Workshop',
    description: 'Stage prep lesson with performance tracking',
    category: 'Secondary Education',
    preview: '/templates/theater-preview.jpg',
    neurodivergentSupport: true
  },
  {
    id: 'legal-case-study',
    name: 'Interactive Legal Case',
    description: 'Law school case analysis with visual aids',
    category: 'Higher Education',
    preview: '/templates/legal-preview.jpg',
    neurodivergentSupport: false
  },
  {
    id: 'language-immersion',
    name: 'Cultural Language Journey',
    description: 'Immersive language learning with cultural context',
    category: 'Language Learning',
    preview: '/templates/language-preview.jpg',
    neurodivergentSupport: true
  }
];

const neurodivergentAdaptations = [
  { id: 'dyslexia', label: 'Dyslexia Support', description: 'OpenDyslexic font, increased spacing, high contrast' },
  { id: 'adhd', label: 'ADHD Features', description: 'Focus mode, break reminders, minimal distractions' },
  { id: 'autism', label: 'Autism Accommodations', description: 'Sensory breaks, visual schedules, clear structure' },
  { id: 'processing', label: 'Processing Aids', description: 'Extra time, step-by-step instructions, audio support' }
];

export default function ContentCreatorPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [contentTitle, setContentTitle] = useState('');
  const [contentDescription, setContentDescription] = useState('');
  const [selectedAdaptations, setSelectedAdaptations] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  const handleGenerateContent = async () => {
    setIsGenerating(true);
    // Simulate AI content generation
    setTimeout(() => {
      setGeneratedContent(`
# ${contentTitle || 'AI-Generated Educational Content'}

## Overview
${contentDescription || 'This is an automatically generated educational content piece designed for neurodivergent learners.'}

## Learning Objectives
- Engage students with interactive elements
- Provide multiple learning modalities
- Support diverse learning needs
- Ensure accessibility compliance

## Content Structure

### Introduction
Welcome to this innovative learning experience! This content has been specially designed with neurodivergent learners in mind.

### Main Content
[Interactive elements will be embedded here based on your template selection]

### Activities
1. **Interactive Quiz** - Test your knowledge
2. **Visual Learning** - Explore concepts through diagrams
3. **Hands-on Practice** - Apply what you've learned

### Neurodivergent Adaptations
${selectedAdaptations.map(id => {
        const adaptation = neurodivergentAdaptations.find(a => a.id === id);
        return adaptation ? `- **${adaptation.label}**: ${adaptation.description}` : '';
      }).filter(Boolean).join('\n')}

### Assessment
- Formative assessments throughout
- Multiple choice and open-ended questions
- Visual and audio feedback options

### Resources
- Additional reading materials
- Video supplements
- Interactive simulations
      `);
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="border-b bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">AI Content Creator</h1>
            <Badge variant="outline">Educational Templates</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleGenerateContent} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Content
                </>
              )}
            </Button>
            <Button variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-screen">
        {/* Configuration Panel */}
        <div className="w-80 border-r bg-white dark:bg-gray-800 p-6 overflow-y-auto">
          <Tabs defaultValue="templates" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="adaptations">Support</TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Content Title</label>
                <Input
                  placeholder="Enter content title..."
                  value={contentTitle}
                  onChange={(e) => setContentTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  placeholder="Describe your content..."
                  rows={3}
                  value={contentDescription}
                  onChange={(e) => setContentDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Content Template</label>
                <div className="space-y-2">
                  {contentTemplates.map((template) => (
                    <Card 
                      key={template.id} 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{template.name}</h4>
                            <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                            <Badge variant="outline" className="text-xs mt-2">
                              {template.category}
                            </Badge>
                          </div>
                          {template.neurodivergentSupport && (
                            <Badge variant="secondary" className="text-xs">
                              Accessible
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Content Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lesson">Interactive Lesson</SelectItem>
                    <SelectItem value="quiz">Assessment Quiz</SelectItem>
                    <SelectItem value="activity">Learning Activity</SelectItem>
                    <SelectItem value="game">Educational Game</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Difficulty Level</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Target School</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select school" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="superhero">SuperHero School (K-6)</SelectItem>
                    <SelectItem value="stage-prep">Stage Prep (7-12)</SelectItem>
                    <SelectItem value="law">Law School</SelectItem>
                    <SelectItem value="language">Language Academy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Media Elements</label>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    <Image className="w-4 h-4 mr-1" />
                    Images
                  </Button>
                  <Button variant="outline" size="sm">
                    <Video className="w-4 h-4 mr-1" />
                    Videos
                  </Button>
                  <Button variant="outline" size="sm">
                    <Music className="w-4 h-4 mr-1" />
                    Audio
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="adaptations" className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-3 block">Neurodivergent Support Features</label>
                <div className="space-y-3">
                  {neurodivergentAdaptations.map((adaptation) => (
                    <Card 
                      key={adaptation.id}
                      className={`cursor-pointer transition-all ${
                        selectedAdaptations.includes(adaptation.id) ? 'ring-2 ring-green-500 bg-green-50' : ''
                      }`}
                      onClick={() => {
                        setSelectedAdaptations(prev => 
                          prev.includes(adaptation.id) 
                            ? prev.filter(id => id !== adaptation.id)
                            : [...prev, adaptation.id]
                        );
                      }}
                    >
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm">{adaptation.label}</h4>
                        <p className="text-xs text-gray-600 mt-1">{adaptation.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Content Preview */}
        <div className="flex-1 flex flex-col">
          <Tabs defaultValue="preview" className="flex-1 flex flex-col">
            <TabsList className="w-full justify-start border-b rounded-none">
              <TabsTrigger value="preview">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="code">
                <Type className="w-4 h-4 mr-2" />
                Generated Code
              </TabsTrigger>
              <TabsTrigger value="design">
                <Palette className="w-4 h-4 mr-2" />
                Design
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="flex-1 m-0">
              <div className="h-full p-6">
                {isGenerating ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Sparkles className="w-16 h-16 mx-auto text-blue-400 mb-4 animate-pulse" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        AI is Creating Your Content
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Generating personalized educational content with neurodivergent adaptations...
                      </p>
                    </div>
                  </div>
                ) : generatedContent ? (
                  <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 h-full overflow-auto">
                    <pre className="whitespace-pre-wrap text-sm">{generatedContent}</pre>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Wand2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Ready to Create
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Configure your content settings and click "Generate Content" to begin
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="code" className="flex-1 m-0">
              <div className="h-full p-6">
                <div className="bg-black text-green-400 font-mono rounded-lg p-4 h-full overflow-auto">
                  <div className="text-sm">
                    <div className="text-blue-400">// AI-Generated Educational Content</div>
                    <div className="text-yellow-400">// Neurodivergent-Friendly Design</div>
                    <div className="text-white mt-4">
                      {`const educationalContent = {
  title: "${contentTitle || 'Educational Content'}",
  adaptations: [${selectedAdaptations.map(a => `"${a}"`).join(', ')}],
  interactive: true,
  accessibility: "WCAG 2.1 AA",
  neurodivergentSupport: true
};`}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="design" className="flex-1 m-0">
              <div className="h-full p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Color Scheme</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-4 gap-2">
                        <div className="w-full h-12 bg-blue-500 rounded"></div>
                        <div className="w-full h-12 bg-green-500 rounded"></div>
                        <div className="w-full h-12 bg-purple-500 rounded"></div>
                        <div className="w-full h-12 bg-orange-500 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Layout Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-32 flex items-center justify-center">
                        <Layout className="w-8 h-8 text-gray-400" />
                        <span className="ml-2 text-gray-500">Content Layout</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}