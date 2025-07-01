'use client';

import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileCode, 
  FolderOpen, 
  Plus, 
  Save, 
  Play, 
  Terminal, 
  Eye, 
  Download,
  Upload,
  Settings,
  Trash2,
  Copy,
  FileText,
  Globe
} from 'lucide-react';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  language?: string;
  children?: FileNode[];
  parent?: string;
}

const defaultFiles: FileNode[] = [
  {
    id: 'project',
    name: 'Project',
    type: 'folder',
    children: [
      {
        id: 'index.html',
        name: 'index.html',
        type: 'file',
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Universal One School - IDE Project</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Welcome to Universal One School IDE</h1>
        <p>Start building amazing educational content!</p>
        <button onclick="showMessage()">Click Me!</button>
    </div>
    <script src="script.js"></script>
</body>
</html>`
      },
      {
        id: 'styles.css',
        name: 'styles.css',
        type: 'file',
        language: 'css',
        content: `.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Arial', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: white;
}

h1 {
    text-align: center;
    color: #fff;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    margin-bottom: 20px;
}

button {
    background: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.3s;
}

button:hover {
    background: #45a049;
}`
      },
      {
        id: 'script.js',
        name: 'script.js',
        type: 'file',
        language: 'javascript',
        content: `function showMessage() {
    alert('Hello from Universal One School IDE!');
}

// Educational content helpers
const EducationUtils = {
    createQuiz: function(questions) {
        return {
            questions: questions,
            currentQuestion: 0,
            score: 0,
            
            start: function() {
                console.log('Starting quiz with', this.questions.length, 'questions');
            },
            
            answer: function(questionIndex, answer) {
                if (this.questions[questionIndex].correct === answer) {
                    this.score++;
                    return true;
                }
                return false;
            }
        };
    },
    
    adaptForNeurodivergent: function(content, type) {
        const adaptations = {
            'dyslexia': {
                font: 'OpenDyslexic',
                spacing: '1.5em',
                background: '#fefefe'
            },
            'adhd': {
                breakTime: 300000, // 5 minutes
                focusMode: true,
                distractionFilter: true
            },
            'autism': {
                sensoryBreaks: true,
                visualSchedule: true,
                socialStories: true
            }
        };
        
        return {
            ...content,
            adaptations: adaptations[type] || {}
        };
    }
};

console.log('Universal One School IDE - Ready for educational content creation!');`
      }
    ]
  }
];

const projectTemplates = [
  {
    id: 'superhero-game',
    name: 'SuperHero Learning Game',
    description: 'Interactive superhero-themed educational game',
    files: [
      { name: 'index.html', language: 'html', content: '<!-- SuperHero Game Template -->' },
      { name: 'game.js', language: 'javascript', content: '// SuperHero game logic' },
      { name: 'styles.css', language: 'css', content: '/* SuperHero theme styles */' }
    ]
  },
  {
    id: 'stage-prep',
    name: 'Theater Learning Module',
    description: 'Stage prep educational content',
    files: [
      { name: 'index.html', language: 'html', content: '<!-- Theater Module Template -->' },
      { name: 'theater.js', language: 'javascript', content: '// Theater learning logic' },
      { name: 'stage.css', language: 'css', content: '/* Stage prep styles */' }
    ]
  },
  {
    id: 'law-case',
    name: 'Legal Case Study',
    description: 'Interactive legal case analysis tool',
    files: [
      { name: 'index.html', language: 'html', content: '<!-- Legal Case Template -->' },
      { name: 'case-analysis.js', language: 'javascript', content: '// Case analysis logic' },
      { name: 'legal.css', language: 'css', content: '/* Legal theme styles */' }
    ]
  }
];

export default function IDEPage() {
  const [files, setFiles] = useState<FileNode[]>(defaultFiles);
  const [activeFile, setActiveFile] = useState<FileNode | null>(null);
  const [editorValue, setEditorValue] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    'Universal One School IDE Terminal v3.1.0',
    'Type "help" for available commands',
    '> '
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');
  const [newFileName, setNewFileName] = useState('');

  useEffect(() => {
    if (activeFile && activeFile.content !== editorValue) {
      setEditorValue(activeFile.content || '');
    }
  }, [activeFile]);

  const findFileById = (files: FileNode[], id: string): FileNode | null => {
    for (const file of files) {
      if (file.id === id) return file;
      if (file.children) {
        const found = findFileById(file.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const updateFileContent = (files: FileNode[], id: string, content: string): FileNode[] => {
    return files.map(file => {
      if (file.id === id) {
        return { ...file, content };
      }
      if (file.children) {
        return { ...file, children: updateFileContent(file.children, id, content) };
      }
      return file;
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && activeFile) {
      setEditorValue(value);
      setFiles(updateFileContent(files, activeFile.id, value));
      
      // Update preview for HTML files
      if (activeFile.language === 'html') {
        setPreviewHtml(value);
      }
    }
  };

  const handleSave = () => {
    if (activeFile) {
      setFiles(updateFileContent(files, activeFile.id, editorValue));
      addTerminalOutput(`File saved: ${activeFile.name}`);
    }
  };

  const addTerminalOutput = (output: string) => {
    setTerminalOutput(prev => [...prev, output, '> ']);
  };

  const handleTerminalCommand = (command: string) => {
    const cmd = command.trim().toLowerCase();
    addTerminalOutput(command);
    
    switch (cmd) {
      case 'help':
        addTerminalOutput('Available commands:');
        addTerminalOutput('  help - Show this help');
        addTerminalOutput('  clear - Clear terminal');
        addTerminalOutput('  files - List files');
        addTerminalOutput('  preview - Generate preview');
        addTerminalOutput('  build - Build project');
        break;
      case 'clear':
        setTerminalOutput(['Universal One School IDE Terminal v3.1.0', '> ']);
        break;
      case 'files':
        const fileList = getAllFiles(files);
        fileList.forEach(file => addTerminalOutput(`  ${file.name} (${file.language || 'folder'})`));
        break;
      case 'preview':
        generatePreview();
        addTerminalOutput('Preview generated');
        break;
      case 'build':
        addTerminalOutput('Building project...');
        setTimeout(() => addTerminalOutput('Build completed successfully!'), 1000);
        break;
      default:
        addTerminalOutput(`Command not found: ${command}`);
    }
  };

  const getAllFiles = (fileNodes: FileNode[]): FileNode[] => {
    let allFiles: FileNode[] = [];
    fileNodes.forEach(node => {
      if (node.type === 'file') {
        allFiles.push(node);
      }
      if (node.children) {
        allFiles = [...allFiles, ...getAllFiles(node.children)];
      }
    });
    return allFiles;
  };

  const generatePreview = () => {
    const htmlFile = findFileById(files, 'index.html');
    if (htmlFile && htmlFile.content) {
      setPreviewHtml(htmlFile.content);
    }
  };

  const createNewFile = () => {
    if (!newFileName) return;
    
    const extension = newFileName.split('.').pop() || '';
    const languageMap: { [key: string]: string } = {
      'html': 'html',
      'css': 'css',
      'js': 'javascript',
      'ts': 'typescript',
      'py': 'python',
      'json': 'json'
    };

    const newFile: FileNode = {
      id: newFileName,
      name: newFileName,
      type: 'file',
      language: languageMap[extension] || 'text',
      content: `// New ${extension.toUpperCase()} file\n`
    };

    setFiles(prev => {
      const projectFolder = prev[0];
      if (projectFolder.children) {
        projectFolder.children.push(newFile);
      }
      return [...prev];
    });
    
    setNewFileName('');
    addTerminalOutput(`Created new file: ${newFileName}`);
  };

  const loadTemplate = (templateId: string) => {
    const template = projectTemplates.find(t => t.id === templateId);
    if (!template) return;

    const templateFiles = template.files.map(file => ({
      id: file.name,
      name: file.name,
      type: 'file' as const,
      language: file.language,
      content: file.content
    }));

    setFiles([{
      id: 'project',
      name: 'Project',
      type: 'folder',
      children: templateFiles
    }]);

    addTerminalOutput(`Loaded template: ${template.name}`);
  };

  const renderFileTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map(node => (
      <div key={node.id} style={{ marginLeft: depth * 16 }}>
        <div
          className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
            activeFile?.id === node.id ? 'bg-blue-100 dark:bg-blue-900' : ''
          }`}
          onClick={() => node.type === 'file' && setActiveFile(node)}
        >
          {node.type === 'folder' ? <FolderOpen className="w-4 h-4" /> : <FileCode className="w-4 h-4" />}
          <span className="text-sm">{node.name}</span>
          {node.type === 'file' && (
            <Badge variant="outline" className="text-xs">
              {node.language}
            </Badge>
          )}
        </div>
        {node.children && renderFileTree(node.children, depth + 1)}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="border-b bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Universal One School IDE</h1>
            <Badge variant="outline">v3.1.0</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New File
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New File</DialogTitle>
                </DialogHeader>
                <div className="flex gap-2">
                  <Input
                    placeholder="filename.ext"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                  />
                  <Button onClick={createNewFile}>Create</Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Templates
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Project Templates</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectTemplates.map(template => (
                    <Card key={template.id} className="cursor-pointer hover:shadow-md" onClick={() => loadTemplate(template.id)}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
                        <div className="flex gap-1 mt-2">
                          {template.files.map(file => (
                            <Badge key={file.name} variant="outline" className="text-xs">
                              {file.name}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            <Button onClick={handleSave} size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button onClick={generatePreview} size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-screen">
        {/* File Explorer */}
        <div className="w-64 border-r bg-white dark:bg-gray-800">
          <div className="p-3 border-b">
            <h3 className="font-semibold text-sm">File Explorer</h3>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2">
              {renderFileTree(files)}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Tabs defaultValue="editor" className="flex-1 flex flex-col">
            <TabsList className="w-full justify-start border-b rounded-none">
              <TabsTrigger value="editor">
                <FileCode className="w-4 h-4 mr-2" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="preview">
                <Globe className="w-4 h-4 mr-2" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="terminal">
                <Terminal className="w-4 h-4 mr-2" />
                Terminal
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="flex-1 m-0">
              <div className="h-full">
                {activeFile ? (
                  <div className="h-full flex flex-col">
                    <div className="flex items-center gap-2 p-2 border-b bg-gray-50 dark:bg-gray-800">
                      <FileCode className="w-4 h-4" />
                      <span className="font-medium">{activeFile.name}</span>
                      <Badge variant="outline">{activeFile.language}</Badge>
                    </div>
                    <div className="flex-1">
                      <Editor
                        height="100%"
                        language={activeFile.language}
                        value={editorValue}
                        onChange={handleEditorChange}
                        theme="vs-dark"
                        options={{
                          minimap: { enabled: false },
                          fontSize: 14,
                          wordWrap: 'on',
                          automaticLayout: true,
                          scrollBeyondLastLine: false,
                          renderWhitespace: 'selection',
                          suggestOnTriggerCharacters: true,
                          acceptSuggestionOnEnter: 'on',
                          tabSize: 2,
                          insertSpaces: true
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No File Selected
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Select a file from the explorer to start editing
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="preview" className="flex-1 m-0">
              <div className="h-full border">
                {previewHtml ? (
                  <iframe
                    srcDoc={previewHtml}
                    className="w-full h-full border-0"
                    title="Preview"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Globe className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No Preview Available
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Create an HTML file and click Preview to see your work
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="terminal" className="flex-1 m-0">
              <div className="h-full bg-black text-green-400 font-mono flex flex-col">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-1">
                    {terminalOutput.map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="border-t border-gray-700 p-2 flex items-center">
                  <span className="mr-2">&gt;</span>
                  <Input
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleTerminalCommand(terminalInput);
                        setTerminalInput('');
                      }
                    }}
                    className="bg-transparent border-0 text-green-400 font-mono focus-visible:ring-0"
                    placeholder="Type a command..."
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}