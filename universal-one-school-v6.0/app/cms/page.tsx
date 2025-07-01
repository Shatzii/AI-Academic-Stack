'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Eye, 
  Trash2,
  Settings,
  Users,
  FileText,
  Image,
  Layout,
  Layers,
  Workflow,
  Database,
  Globe,
  BarChart3
} from 'lucide-react';

interface ContentItem {
  id: string;
  type: string;
  title: string;
  status: 'draft' | 'published' | 'archived';
  author: string;
  lastModified: string;
  views?: number;
}

const CMSAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('content');
  const [contentItems, setContentItems] = useState<ContentItem[]>([
    {
      id: '1',
      type: 'page',
      title: 'SuperHero School Landing Page',
      status: 'published',
      author: 'Admin',
      lastModified: '2025-06-28',
      views: 1250
    },
    {
      id: '2', 
      type: 'course',
      title: 'Advanced Mathematics - Grade 8',
      status: 'published',
      author: 'Ms. Johnson',
      lastModified: '2025-06-27',
      views: 340
    },
    {
      id: '3',
      type: 'template',
      title: 'School Event Template',
      status: 'draft',
      author: 'Design Team',
      lastModified: '2025-06-26',
      views: 45
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const tabs = [
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'pages', label: 'Pages', icon: Layout },
    { id: 'widgets', label: 'Widgets', icon: Layers },
    { id: 'templates', label: 'Templates', icon: Workflow },
    { id: 'media', label: 'Media', icon: Image },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const contentTypes = [
    { id: 'page', label: 'Page', color: 'bg-blue-100 text-blue-800' },
    { id: 'course', label: 'Course', color: 'bg-green-100 text-green-800' },
    { id: 'lesson', label: 'Lesson', color: 'bg-purple-100 text-purple-800' },
    { id: 'template', label: 'Template', color: 'bg-orange-100 text-orange-800' },
    { id: 'widget', label: 'Widget', color: 'bg-pink-100 text-pink-800' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderContentTab = () => (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Create Content
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map((item) => (
          <div key={item.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      contentTypes.find(t => t.id === item.type)?.color || 'bg-gray-100 text-gray-800'
                    }`}>
                      {contentTypes.find(t => t.id === item.type)?.label || item.type}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">
                    by {item.author} • {item.lastModified}
                  </p>
                  {item.views && (
                    <p className="text-sm text-gray-500 mt-1">
                      {item.views} views
                    </p>
                  )}
                </div>
                <div className="relative">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100">
                  <Edit className="h-3 w-3" />
                  Edit
                </button>
                <button className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-50 text-gray-700 rounded hover:bg-gray-100">
                  <Eye className="h-3 w-3" />
                  View
                </button>
                <button className="flex items-center gap-1 px-3 py-1 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100">
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWidgetsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Widget Library</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Create Widget
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Hero Section', description: 'Full-width hero with background image', category: 'Layout' },
          { name: 'Course Card', description: 'Display course information with enrollment', category: 'Educational' },
          { name: 'Student Progress', description: 'Visual progress tracking widget', category: 'Analytics' },
          { name: 'AI Tutor Chat', description: 'Interactive AI conversation widget', category: 'AI Features' },
          { name: 'Social Media Feed', description: 'Display recent social activity safely', category: 'Social' },
          { name: 'Achievement Badge', description: 'Show student achievements and badges', category: 'Gamification' }
        ].map((widget, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{widget.name}</h3>
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">{widget.category}</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">{widget.description}</p>
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100">
                Add to Page
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50">
                Preview
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Content Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Pages', value: '156', change: '+12%', color: 'text-blue-600' },
          { label: 'Active Users', value: '1,247', change: '+8%', color: 'text-green-600' },
          { label: 'Page Views', value: '24,891', change: '+15%', color: 'text-purple-600' },
          { label: 'Engagement Rate', value: '87%', change: '+3%', color: 'text-orange-600' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <div className="flex items-center justify-between">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <span className="text-sm text-green-600">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Top Performing Content</h3>
        <div className="space-y-3">
          {[
            { title: 'SuperHero School - Mathematics Adventures', views: 2450, engagement: '92%' },
            { title: 'Stage Prep - Drama Workshop Series', views: 1890, engagement: '88%' },
            { title: 'AI Tutor - Personalized Learning Path', views: 1567, engagement: '95%' },
            { title: 'Social Media Safety Dashboard', views: 1234, engagement: '87%' }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div>
                <p className="font-medium text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-600">{item.views} views • {item.engagement} engagement</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm">View Details</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'content': return renderContentTab();
      case 'widgets': return renderWidgetsTab();
      case 'analytics': return renderAnalyticsTab();
      case 'pages': return (
        <div className="text-center py-12">
          <Layout className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Page Builder</h3>
          <p className="text-gray-600">Visual page builder coming soon</p>
        </div>
      );
      case 'templates': return (
        <div className="text-center py-12">
          <Workflow className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Template Manager</h3>
          <p className="text-gray-600">Template creation tools coming soon</p>
        </div>
      );
      case 'media': return (
        <div className="text-center py-12">
          <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Media Library</h3>
          <p className="text-gray-600">Asset management coming soon</p>
        </div>
      );
      case 'users': return (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">User Management</h3>
          <p className="text-gray-600">Role and permission management coming soon</p>
        </div>
      );
      case 'settings': return (
        <div className="text-center py-12">
          <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">CMS Settings</h3>
          <p className="text-gray-600">Configuration options coming soon</p>
        </div>
      );
      default: return renderContentTab();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Database className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Universal One School CMS</h1>
                <p className="text-sm text-gray-600">Content Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Globe className="h-4 w-4" />
                Visit Site
              </button>
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMSAdminDashboard;