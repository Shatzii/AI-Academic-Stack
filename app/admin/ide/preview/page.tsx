'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Monitor, Smartphone, Tablet, RefreshCw, ExternalLink, Code, Globe } from 'lucide-react';

export default function IDEPreviewPage() {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewUrl, setPreviewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const deviceDimensions = {
    desktop: { width: '100%', height: '100%' },
    tablet: { width: '768px', height: '1024px' },
    mobile: { width: '375px', height: '667px' }
  };

  const refreshPreview = () => {
    setIsLoading(true);
    // Simulate refresh delay
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const openInNewTab = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="border-b bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Live Preview</h1>
            <Badge variant="outline">IDE v3.1.0</Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button
                variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('desktop')}
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('tablet')}
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('mobile')}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>
            <Button onClick={refreshPreview} size="sm" disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={openInNewTab} size="sm" variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              Open
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4">
        <Tabs defaultValue="preview" className="h-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview">
              <Globe className="w-4 h-4 mr-2" />
              Live Preview
            </TabsTrigger>
            <TabsTrigger value="console">
              <Code className="w-4 h-4 mr-2" />
              Console
            </TabsTrigger>
            <TabsTrigger value="responsive">
              <Monitor className="w-4 h-4 mr-2" />
              Responsive
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-4">
            <Card className="h-[calc(100vh-200px)]">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Preview Output</CardTitle>
                  <Badge variant="outline" className="capitalize">
                    {previewMode}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="h-full p-0">
                <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-b-lg">
                  <div 
                    className="bg-white rounded-lg shadow-lg transition-all duration-300 mx-auto"
                    style={{
                      width: deviceDimensions[previewMode].width,
                      height: deviceDimensions[previewMode].height,
                      maxWidth: previewMode === 'desktop' ? '100%' : deviceDimensions[previewMode].width,
                      maxHeight: previewMode === 'desktop' ? '100%' : deviceDimensions[previewMode].height
                    }}
                  >
                    <div className="w-full h-full border-2 border-gray-300 rounded-lg overflow-hidden">
                      <iframe
                        src="/admin/ide"
                        className="w-full h-full border-0"
                        title="IDE Preview"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="console" className="mt-4">
            <Card className="h-[calc(100vh-200px)]">
              <CardHeader>
                <CardTitle>Console Output</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-black text-green-400 font-mono p-4 rounded-lg h-96 overflow-y-auto">
                  <div className="space-y-1">
                    <div>Universal One School IDE Console</div>
                    <div className="text-blue-400">🔧 Development Tools Ready</div>
                    <div className="text-yellow-400">⚡ Live Reload Enabled</div>
                    <div className="text-green-400">✅ Monaco Editor Loaded</div>
                    <div className="text-cyan-400">🎯 Templates Available</div>
                    <div className="text-white">Ready for educational content creation!</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="responsive" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
              {(['desktop', 'tablet', 'mobile'] as const).map((device) => (
                <Card key={device} className="flex-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm capitalize flex items-center gap-2">
                      {device === 'desktop' && <Monitor className="w-4 h-4" />}
                      {device === 'tablet' && <Tablet className="w-4 h-4" />}
                      {device === 'mobile' && <Smartphone className="w-4 h-4" />}
                      {device}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 h-64">
                      <div 
                        className="bg-white rounded border mx-auto"
                        style={{
                          width: device === 'desktop' ? '100%' : device === 'tablet' ? '80px' : '40px',
                          height: device === 'desktop' ? '100%' : device === 'tablet' ? '106px' : '71px',
                          minHeight: '60px'
                        }}
                      >
                        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded flex items-center justify-center text-xs text-gray-600">
                          {device} View
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}