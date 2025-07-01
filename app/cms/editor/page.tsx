'use client';

import React, { useState, useRef, useCallback } from 'react';
import { 
  Save, 
  Eye, 
  Undo, 
  Redo, 
  Plus, 
  Trash2, 
  Move, 
  Settings,
  Type,
  Image,
  Video,
  Layout,
  Grid,
  Layers,
  Palette,
  Monitor,
  Tablet,
  Smartphone
} from 'lucide-react';

interface PageElement {
  id: string;
  type: 'text' | 'image' | 'video' | 'button' | 'card' | 'grid' | 'hero' | 'widget';
  content: any;
  styles: {
    position?: { x: number; y: number };
    size?: { width: string; height: string };
    margin?: string;
    padding?: string;
    backgroundColor?: string;
    textColor?: string;
    fontSize?: string;
    fontWeight?: string;
    borderRadius?: string;
    border?: string;
  };
  children?: PageElement[];
}

interface PageData {
  id: string;
  title: string;
  slug: string;
  elements: PageElement[];
  settings: {
    layout: 'fluid' | 'boxed';
    maxWidth: string;
    backgroundColor: string;
    backgroundImage?: string;
  };
}

const CMSPageEditor: React.FC = () => {
  const [pageData, setPageData] = useState<PageData>({
    id: '1',
    title: 'New Page',
    slug: 'new-page',
    elements: [
      {
        id: 'hero-1',
        type: 'hero',
        content: {
          title: 'Welcome to Universal One School',
          subtitle: 'Empowering neurodivergent learners through innovative education',
          backgroundImage: '/api/placeholder/1200/400'
        },
        styles: {
          backgroundColor: '#1e40af',
          textColor: '#ffffff',
          padding: '4rem 2rem'
        }
      },
      {
        id: 'grid-1',
        type: 'grid',
        content: {},
        styles: {
          padding: '3rem 2rem'
        },
        children: [
          {
            id: 'card-1',
            type: 'card',
            content: {
              title: 'SuperHero School',
              description: 'Primary education with superhero themes and gamified learning',
              icon: '🦸‍♂️'
            },
            styles: {
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '1.5rem'
            }
          },
          {
            id: 'card-2',
            type: 'card',
            content: {
              title: 'Stage Prep School',
              description: 'Secondary education focused on theater and performance arts',
              icon: '🎭'
            },
            styles: {
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '1.5rem'
            }
          }
        ]
      }
    ],
    settings: {
      layout: 'fluid',
      maxWidth: '1200px',
      backgroundColor: '#f9fafb'
    }
  });

  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showSettings, setShowSettings] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  const elementTypes = [
    { type: 'text', label: 'Text', icon: Type, description: 'Add text content' },
    { type: 'image', label: 'Image', icon: Image, description: 'Add image' },
    { type: 'video', label: 'Video', icon: Video, description: 'Embed video' },
    { type: 'card', label: 'Card', icon: Layout, description: 'Content card' },
    { type: 'grid', label: 'Grid', icon: Grid, description: 'Layout grid' },
    { type: 'hero', label: 'Hero Section', icon: Layers, description: 'Hero banner' },
  ];

  const addElement = useCallback((type: string) => {
    const newElement: PageElement = {
      id: `${type}-${Date.now()}`,
      type: type as any,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type)
    };

    setPageData(prev => ({
      ...prev,
      elements: [...prev.elements, newElement]
    }));
  }, []);

  const updateElement = useCallback((elementId: string, updates: Partial<PageElement>) => {
    setPageData(prev => ({
      ...prev,
      elements: updateElementInTree(prev.elements, elementId, updates)
    }));
  }, []);

  const deleteElement = useCallback((elementId: string) => {
    setPageData(prev => ({
      ...prev,
      elements: removeElementFromTree(prev.elements, elementId)
    }));
    setSelectedElement(null);
  }, []);

  function getDefaultContent(type: string) {
    switch (type) {
      case 'text':
        return { text: 'Enter your text here...' };
      case 'image':
        return { src: '/api/placeholder/300/200', alt: 'Image' };
      case 'video':
        return { src: '', poster: '/api/placeholder/400/225' };
      case 'card':
        return { title: 'Card Title', description: 'Card description...' };
      case 'grid':
        return { columns: 2 };
      case 'hero':
        return { title: 'Hero Title', subtitle: 'Hero subtitle' };
      default:
        return {};
    }
  }

  function getDefaultStyles(type: string) {
    const base = {
      margin: '0',
      padding: '1rem',
      backgroundColor: 'transparent',
      textColor: '#374151'
    };

    switch (type) {
      case 'hero':
        return {
          ...base,
          backgroundColor: '#1e40af',
          textColor: '#ffffff',
          padding: '4rem 2rem'
        };
      case 'card':
        return {
          ...base,
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          padding: '1.5rem'
        };
      default:
        return base;
    }
  }

  function updateElementInTree(elements: PageElement[], elementId: string, updates: Partial<PageElement>): PageElement[] {
    return elements.map(element => {
      if (element.id === elementId) {
        return { ...element, ...updates };
      }
      if (element.children) {
        return {
          ...element,
          children: updateElementInTree(element.children, elementId, updates)
        };
      }
      return element;
    });
  }

  function removeElementFromTree(elements: PageElement[], elementId: string): PageElement[] {
    return elements.filter(element => {
      if (element.id === elementId) {
        return false;
      }
      if (element.children) {
        element.children = removeElementFromTree(element.children, elementId);
      }
      return true;
    });
  }

  const handleElementClick = (elementId: string) => {
    setSelectedElement(elementId);
  };

  const renderElement = (element: PageElement): JSX.Element => {
    const isSelected = selectedElement === element.id;
    const className = `
      relative cursor-pointer transition-all
      ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:ring-1 hover:ring-gray-300'}
    `;

    const style = {
      margin: element.styles.margin,
      padding: element.styles.padding,
      backgroundColor: element.styles.backgroundColor,
      color: element.styles.textColor,
      fontSize: element.styles.fontSize,
      fontWeight: element.styles.fontWeight,
      borderRadius: element.styles.borderRadius,
      border: element.styles.border,
      ...element.styles.size
    };

    const content = (() => {
      switch (element.type) {
        case 'text':
          return (
            <div
              className={className}
              style={style}
              onClick={() => handleElementClick(element.id)}
            >
              <p>{element.content.text}</p>
            </div>
          );

        case 'hero':
          return (
            <div
              className={`${className} text-center`}
              style={style}
              onClick={() => handleElementClick(element.id)}
            >
              <h1 className="text-4xl font-bold mb-4">{element.content.title}</h1>
              <p className="text-xl opacity-90">{element.content.subtitle}</p>
            </div>
          );

        case 'card':
          return (
            <div
              className={className}
              style={style}
              onClick={() => handleElementClick(element.id)}
            >
              {element.content.icon && (
                <div className="text-2xl mb-2">{element.content.icon}</div>
              )}
              <h3 className="font-semibold mb-2">{element.content.title}</h3>
              <p className="text-sm opacity-80">{element.content.description}</p>
            </div>
          );

        case 'grid':
          return (
            <div
              className={className}
              style={style}
              onClick={() => handleElementClick(element.id)}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {element.children?.map(child => (
                  <div key={child.id}>
                    {renderElement(child)}
                  </div>
                ))}
              </div>
            </div>
          );

        case 'image':
          return (
            <div
              className={className}
              style={style}
              onClick={() => handleElementClick(element.id)}
            >
              <img
                src={element.content.src}
                alt={element.content.alt}
                className="w-full h-auto rounded"
              />
            </div>
          );

        default:
          return (
            <div
              className={className}
              style={style}
              onClick={() => handleElementClick(element.id)}
            >
              <div className="p-4 bg-gray-100 rounded text-center">
                <p className="text-gray-600">Element: {element.type}</p>
              </div>
            </div>
          );
      }
    })();

    return content;
  };

  const renderCanvas = () => {
    const canvasStyle = {
      maxWidth: viewMode === 'desktop' ? pageData.settings.maxWidth : 
                viewMode === 'tablet' ? '768px' : '375px',
      backgroundColor: pageData.settings.backgroundColor,
      transition: 'all 0.3s ease'
    };

    return (
      <div className="flex-1 overflow-auto p-4 bg-gray-100">
        <div className="mx-auto" style={canvasStyle}>
          <div
            ref={canvasRef}
            className="bg-white min-h-screen shadow-lg"
            style={{ backgroundColor: pageData.settings.backgroundColor }}
          >
            {pageData.elements.map(element => renderElement(element))}
            
            {pageData.elements.length === 0 && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center text-gray-400">
                  <Layout className="mx-auto h-12 w-12 mb-4" />
                  <p>Drag elements here to start building your page</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderPropertiesPanel = () => {
    if (!selectedElement) {
      return (
        <div className="text-center py-8">
          <Settings className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <p className="text-gray-500">Select an element to edit properties</p>
        </div>
      );
    }

    const element = findElementById(pageData.elements, selectedElement);
    if (!element) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Element Properties</h3>
          <button
            onClick={() => deleteElement(selectedElement)}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          {element.type === 'text' && (
            <div>
              <label className="block text-sm font-medium mb-1">Text Content</label>
              <textarea
                value={element.content.text}
                onChange={(e) => updateElement(selectedElement, {
                  content: { ...element.content, text: e.target.value }
                })}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                rows={3}
              />
            </div>
          )}

          {(element.type === 'hero' || element.type === 'card') && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={element.content.title}
                  onChange={(e) => updateElement(selectedElement, {
                    content: { ...element.content, title: e.target.value }
                  })}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>
              {element.content.subtitle !== undefined && (
                <div>
                  <label className="block text-sm font-medium mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={element.content.subtitle}
                    onChange={(e) => updateElement(selectedElement, {
                      content: { ...element.content, subtitle: e.target.value }
                    })}
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              )}
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Background Color</label>
            <input
              type="color"
              value={element.styles.backgroundColor || '#ffffff'}
              onChange={(e) => updateElement(selectedElement, {
                styles: { ...element.styles, backgroundColor: e.target.value }
              })}
              className="w-full h-8 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Text Color</label>
            <input
              type="color"
              value={element.styles.textColor || '#000000'}
              onChange={(e) => updateElement(selectedElement, {
                styles: { ...element.styles, textColor: e.target.value }
              })}
              className="w-full h-8 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Padding</label>
            <input
              type="text"
              value={element.styles.padding || '1rem'}
              onChange={(e) => updateElement(selectedElement, {
                styles: { ...element.styles, padding: e.target.value }
              })}
              placeholder="e.g., 1rem, 10px 20px"
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Border Radius</label>
            <input
              type="text"
              value={element.styles.borderRadius || '0'}
              onChange={(e) => updateElement(selectedElement, {
                styles: { ...element.styles, borderRadius: e.target.value }
              })}
              placeholder="e.g., 0.5rem, 8px"
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>
      </div>
    );
  };

  function findElementById(elements: PageElement[], id: string): PageElement | null {
    for (const element of elements) {
      if (element.id === id) {
        return element;
      }
      if (element.children) {
        const found = findElementById(element.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">Page Editor</h1>
          <input
            type="text"
            value={pageData.title}
            onChange={(e) => setPageData(prev => ({ ...prev, title: e.target.value }))}
            className="px-3 py-1 border border-gray-300 rounded text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Viewport Toggle */}
          <div className="flex bg-gray-100 rounded">
            {[
              { mode: 'desktop', icon: Monitor },
              { mode: 'tablet', icon: Tablet },
              { mode: 'mobile', icon: Smartphone }
            ].map(({ mode, icon: Icon }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`p-2 rounded ${
                  viewMode === mode ? 'bg-blue-600 text-white' : 'text-gray-600'
                }`}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-gray-300" />

          <button className="flex items-center gap-2 px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">
            <Undo className="h-4 w-4" />
          </button>
          <button className="flex items-center gap-2 px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">
            <Redo className="h-4 w-4" />
          </button>

          <div className="h-6 w-px bg-gray-300" />

          <button className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">
            <Save className="h-4 w-4" />
            Save
          </button>
          <button className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
            <Eye className="h-4 w-4" />
            Preview
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Sidebar - Elements */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h2 className="font-semibold mb-4">Elements</h2>
            <div className="space-y-2">
              {elementTypes.map((element) => {
                const Icon = element.icon;
                return (
                  <button
                    key={element.type}
                    onClick={() => addElement(element.type)}
                    className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded hover:bg-gray-50"
                  >
                    <Icon className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-sm">{element.label}</p>
                      <p className="text-xs text-gray-500">{element.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Canvas */}
        {renderCanvas()}

        {/* Right Sidebar - Properties */}
        <div className="w-64 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h2 className="font-semibold mb-4">Properties</h2>
            {renderPropertiesPanel()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMSPageEditor;