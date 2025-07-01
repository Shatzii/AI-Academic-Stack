'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { 
  Save, 
  Upload, 
  Eye, 
  Palette, 
  FileText, 
  Image, 
  Settings,
  Download,
  Trash2,
  Plus,
  Edit3
} from 'lucide-react';

interface CMSDashboardProps {
  schoolId: string;
}

interface PageContent {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: string[];
  callToAction?: {
    text: string;
    url: string;
  };
}

interface MediaFile {
  id: string;
  fileName: string;
  originalName: string;
  url: string;
  size: number;
  category: string;
  uploadedAt: string;
}

interface Branding {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
    size: string;
  };
  logo?: string;
  customCSS: string;
}

export default function CMSDashboard({ schoolId }: CMSDashboardProps) {
  const [activeTab, setActiveTab] = useState('content');
  const [landingPageContent, setLandingPageContent] = useState<PageContent>({});
  const [schoolInfo, setSchoolInfo] = useState<any>({});
  const [mediaLibrary, setMediaLibrary] = useState<MediaFile[]>([]);
  const [branding, setBranding] = useState<Branding>({
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#0ea5e9',
      background: '#ffffff',
      text: '#1f2937'
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
      size: 'medium'
    },
    customCSS: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, [schoolId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load dashboard data
      const response = await fetch(`/api/education/cms/dashboard/${schoolId}`);
      const data = await response.json();
      
      if (data.success) {
        setLandingPageContent(data.dashboard.content['landing-page'] || {});
        setSchoolInfo(data.dashboard.content['school-info'] || {});
        setMediaLibrary(data.dashboard.media.recentUploads || []);
        setBranding(data.dashboard.branding || branding);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async (contentType: string, content: any) => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/education/cms/content/${contentType}?schoolId=${schoolId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: 'Success',
          description: `${contentType} content saved successfully`
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to save ${contentType} content`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, category: string = 'general') => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('schoolId', schoolId);
      formData.append('category', category);
      
      const response = await fetch('/api/education/cms/media/upload', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMediaLibrary(prev => [result.media, ...prev]);
        toast({
          title: 'Success',
          description: 'File uploaded successfully'
        });
        return result.media;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload file',
        variant: 'destructive'
      });
    }
  };

  const saveBranding = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/education/cms/branding/${schoolId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(branding)
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Branding updated successfully'
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update branding',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const previewChanges = async () => {
    try {
      const response = await fetch(`/api/education/cms/render/${schoolId}`);
      const html = await response.text();
      
      // Open preview in new window
      const previewWindow = window.open('', '_blank');
      if (previewWindow) {
        previewWindow.document.write(html);
        previewWindow.document.close();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate preview',
        variant: 'destructive'
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    
    for (const file of Array.from(files)) {
      await uploadFile(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
            <p className="text-gray-600">Manage your school's website content and branding</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={previewChanges} variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={() => window.open(`/api/education/cms/export/${schoolId}`, '_blank')} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Media
            </TabsTrigger>
            <TabsTrigger value="branding" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Branding
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Landing Page Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Landing Page</CardTitle>
                  <CardDescription>
                    Update your main landing page content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Page Title</Label>
                    <Input
                      id="title"
                      value={landingPageContent.title || ''}
                      onChange={(e) => setLandingPageContent(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="AI-Powered Education Platform"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input
                      id="subtitle"
                      value={landingPageContent.subtitle || ''}
                      onChange={(e) => setLandingPageContent(prev => ({ ...prev, subtitle: e.target.value }))}
                      placeholder="Transform learning with personalized AI teachers"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={landingPageContent.description || ''}
                      onChange={(e) => setLandingPageContent(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Comprehensive educational platform..."
                      rows={3}
                    />
                  </div>
                  <Button 
                    onClick={() => saveContent('landing-page', landingPageContent)}
                    disabled={loading}
                    className="w-full"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Landing Page
                  </Button>
                </CardContent>
              </Card>

              {/* School Information */}
              <Card>
                <CardHeader>
                  <CardTitle>School Information</CardTitle>
                  <CardDescription>
                    Update your school's basic information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="schoolName">School Name</Label>
                    <Input
                      id="schoolName"
                      value={schoolInfo.schoolName || ''}
                      onChange={(e) => setSchoolInfo(prev => ({ ...prev, schoolName: e.target.value }))}
                      placeholder="Your School Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="districtName">District Name</Label>
                    <Input
                      id="districtName"
                      value={schoolInfo.districtName || ''}
                      onChange={(e) => setSchoolInfo(prev => ({ ...prev, districtName: e.target.value }))}
                      placeholder="Your District Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mission">Mission Statement</Label>
                    <Textarea
                      id="mission"
                      value={schoolInfo.mission || ''}
                      onChange={(e) => setSchoolInfo(prev => ({ ...prev, mission: e.target.value }))}
                      placeholder="Our mission is to..."
                      rows={3}
                    />
                  </div>
                  <Button 
                    onClick={() => saveContent('school-info', schoolInfo)}
                    disabled={loading}
                    className="w-full"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save School Info
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Media Library</CardTitle>
                <CardDescription>
                  Upload and manage images, videos, and documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Click to upload files or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF, MP4, PDF up to 10MB
                      </p>
                    </div>
                    <Input
                      id="file-upload"
                      type="file"
                      multiple
                      accept="image/*,video/mp4,application/pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </Label>
                </div>

                <ScrollArea className="h-80">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mediaLibrary.map((media) => (
                      <Card key={media.id} className="overflow-hidden">
                        <div className="aspect-video bg-gray-100 flex items-center justify-center">
                          {media.url.includes('image') ? (
                            <img 
                              src={media.url} 
                              alt={media.originalName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FileText className="h-8 w-8 text-gray-400" />
                          )}
                        </div>
                        <CardContent className="p-3">
                          <p className="text-sm font-medium truncate">{media.originalName}</p>
                          <div className="flex justify-between items-center mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {media.category}
                            </Badge>
                            <p className="text-xs text-gray-500">
                              {(media.size / 1024 / 1024).toFixed(1)} MB
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Colors</CardTitle>
                  <CardDescription>
                    Customize your school's color scheme
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primary-color">Primary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primary-color"
                          type="color"
                          value={branding.colors.primary}
                          onChange={(e) => setBranding(prev => ({
                            ...prev,
                            colors: { ...prev.colors, primary: e.target.value }
                          }))}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={branding.colors.primary}
                          onChange={(e) => setBranding(prev => ({
                            ...prev,
                            colors: { ...prev.colors, primary: e.target.value }
                          }))}
                          placeholder="#2563eb"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="secondary-color">Secondary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="secondary-color"
                          type="color"
                          value={branding.colors.secondary}
                          onChange={(e) => setBranding(prev => ({
                            ...prev,
                            colors: { ...prev.colors, secondary: e.target.value }
                          }))}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={branding.colors.secondary}
                          onChange={(e) => setBranding(prev => ({
                            ...prev,
                            colors: { ...prev.colors, secondary: e.target.value }
                          }))}
                          placeholder="#64748b"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Typography</CardTitle>
                  <CardDescription>
                    Choose fonts for your content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="heading-font">Heading Font</Label>
                    <select
                      id="heading-font"
                      value={branding.fonts.heading}
                      onChange={(e) => setBranding(prev => ({
                        ...prev,
                        fonts: { ...prev.fonts, heading: e.target.value }
                      }))}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Open Sans">Open Sans</option>
                      <option value="Poppins">Poppins</option>
                      <option value="Montserrat">Montserrat</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Custom CSS</CardTitle>
                  <CardDescription>
                    Add custom CSS for advanced styling
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={branding.customCSS}
                    onChange={(e) => setBranding(prev => ({ ...prev, customCSS: e.target.value }))}
                    placeholder="/* Add your custom CSS here */"
                    rows={8}
                    className="font-mono text-sm"
                  />
                  <Button 
                    onClick={saveBranding}
                    disabled={loading}
                    className="mt-4"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Branding
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Export & Import</CardTitle>
                <CardDescription>
                  Backup and restore your content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={() => window.open(`/api/education/cms/export/${schoolId}`, '_blank')}
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export All Content
                  </Button>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Content
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}