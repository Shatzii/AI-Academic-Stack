'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function CommunicationsHub() {
  const [activeTab, setActiveTab] = useState('messages')
  const [composeOpen, setComposeOpen] = useState(false)

  // Sample message data
  const messages = [
    {
      id: '1',
      type: 'announcement',
      subject: 'School Picture Day Reminder',
      content: 'Tomorrow is school picture day. Please ensure students are dressed appropriately.',
      recipients: 'All Parents',
      sentBy: 'Principal Johnson',
      sentAt: '2025-01-23 09:30 AM',
      status: 'sent',
      readCount: 847,
      totalRecipients: 1205,
      language: 'English',
      hasTranslation: true
    },
    {
      id: '2',
      type: 'alert',
      subject: 'Weather Advisory - Early Dismissal',
      content: 'Due to incoming severe weather, school will dismiss 2 hours early today.',
      recipients: 'All Families',
      sentBy: 'System Alert',
      sentAt: '2025-01-23 11:15 AM',
      status: 'sent',
      readCount: 1150,
      totalRecipients: 1205,
      language: 'English',
      hasTranslation: true
    },
    {
      id: '3',
      type: 'individual',
      subject: 'IEP Meeting Scheduled',
      content: 'Your child\'s annual IEP meeting has been scheduled for February 5th at 2:00 PM.',
      recipients: 'Martinez Family',
      sentBy: 'Special Ed Coordinator',
      sentAt: '2025-01-23 02:45 PM',
      status: 'sent',
      readCount: 1,
      totalRecipients: 1,
      language: 'Spanish',
      hasTranslation: false
    }
  ]

  const templates = [
    { id: '1', name: 'Absence Notification', category: 'Attendance', usage: 45 },
    { id: '2', name: 'IEP Meeting Notice', category: 'Special Education', usage: 23 },
    { id: '3', name: 'Field Trip Permission', category: 'Activities', usage: 12 },
    { id: '4', name: 'Parent Conference Invite', category: 'Academic', usage: 89 },
    { id: '5', name: 'Emergency Alert', category: 'Safety', usage: 3 }
  ]

  const campaigns = [
    {
      id: '1',
      name: 'Back to School 2025',
      type: 'Information Series',
      status: 'active',
      startDate: '2025-01-15',
      endDate: '2025-02-01',
      messagesCount: 5,
      engagement: 94.2
    },
    {
      id: '2',
      name: 'STAAR Prep Information',
      type: 'Academic Support',
      status: 'scheduled',
      startDate: '2025-02-15',
      endDate: '2025-04-30',
      messagesCount: 8,
      engagement: 0
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/admin/dashboard" className="text-indigo-600 font-semibold text-lg hover:text-indigo-500">
              ← Admin Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Communications Hub</h1>
            <button 
              onClick={() => setComposeOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              + Compose Message
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📧</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Messages Sent Today</p>
                <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">👁️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Read Rate</p>
                <p className="text-2xl font-bold text-gray-900">87.3%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">🌍</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Languages Supported</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">📱</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Mobile Reach</p>
                <p className="text-2xl font-bold text-gray-900">92.1%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'messages', name: 'Messages', icon: '📧' },
                { id: 'templates', name: 'Templates', icon: '📝' },
                { id: 'campaigns', name: 'Campaigns', icon: '📊' },
                { id: 'analytics', name: 'Analytics', icon: '📈' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon} {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'messages' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Messages</h3>
                  <div className="flex space-x-2">
                    <select className="px-3 py-2 border border-gray-300 rounded-lg">
                      <option>All Types</option>
                      <option>Announcements</option>
                      <option>Alerts</option>
                      <option>Individual</option>
                    </select>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Today</option>
                      <option>This Week</option>
                      <option>This Month</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              message.type === 'announcement' ? 'bg-blue-100 text-blue-800' :
                              message.type === 'alert' ? 'bg-red-100 text-red-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {message.type.charAt(0).toUpperCase() + message.type.slice(1)}
                            </span>
                            {message.hasTranslation && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                                Multi-language
                              </span>
                            )}
                          </div>
                          <h4 className="font-semibold text-gray-900">{message.subject}</h4>
                          <p className="text-sm text-gray-600 mt-1">{message.content}</p>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <div>{message.sentAt}</div>
                          <div>by {message.sentBy}</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <div className="text-gray-600">
                          To: {message.recipients}
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-green-600">
                            {message.readCount}/{message.totalRecipients} read ({((message.readCount/message.totalRecipients)*100).toFixed(1)}%)
                          </span>
                          <div className="flex space-x-2">
                            <button className="text-indigo-600 hover:text-indigo-800">View</button>
                            <button className="text-indigo-600 hover:text-indigo-800">Resend</button>
                            <button className="text-indigo-600 hover:text-indigo-800">Analytics</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'templates' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Message Templates</h3>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    + Create Template
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates.map((template) => (
                    <div key={template.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{template.name}</h4>
                          <p className="text-sm text-gray-600">{template.category}</p>
                        </div>
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          Used {template.usage} times
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="flex-1 text-sm bg-indigo-50 text-indigo-700 px-3 py-2 rounded hover:bg-indigo-100">
                          Use Template
                        </button>
                        <button className="text-sm text-gray-600 hover:text-gray-800">Edit</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'campaigns' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Communication Campaigns</h3>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    + Create Campaign
                  </button>
                </div>
                
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="border rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-lg">{campaign.name}</h4>
                          <p className="text-sm text-gray-600">{campaign.type}</p>
                        </div>
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                          campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                          campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Start Date:</span>
                          <div className="font-medium">{campaign.startDate}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">End Date:</span>
                          <div className="font-medium">{campaign.endDate}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Messages:</span>
                          <div className="font-medium">{campaign.messagesCount}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Engagement:</span>
                          <div className="font-medium">{campaign.engagement}%</div>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-800">View Details</button>
                        <button className="text-indigo-600 hover:text-indigo-800">Edit</button>
                        <button className="text-indigo-600 hover:text-indigo-800">Analytics</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Communication Analytics</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-4">Engagement Metrics</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Overall Read Rate</span>
                        <span className="font-semibold text-green-600">87.3%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mobile Open Rate</span>
                        <span className="font-semibold text-blue-600">92.1%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Response Rate</span>
                        <span className="font-semibold text-purple-600">23.7%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Opt-out Rate</span>
                        <span className="font-semibold text-red-600">0.8%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-4">Language Distribution</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>English</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{width: '78%'}}></div>
                          </div>
                          <span className="text-sm">78%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Spanish</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{width: '15%'}}></div>
                          </div>
                          <span className="text-sm">15%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Vietnamese</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{width: '4%'}}></div>
                          </div>
                          <span className="text-sm">4%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Arabic</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{width: '2%'}}></div>
                          </div>
                          <span className="text-sm">2%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Other</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-gray-500 h-2 rounded-full" style={{width: '1%'}}></div>
                          </div>
                          <span className="text-sm">1%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Compose Modal */}
        {composeOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Compose New Message</h3>
                <button 
                  onClick={() => setComposeOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Announcement</option>
                      <option>Alert</option>
                      <option>Individual Message</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>All Parents</option>
                      <option>Grade Level</option>
                      <option>School</option>
                      <option>Custom Group</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter message subject..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea 
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Type your message..."
                  ></textarea>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Auto-translate to Spanish
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Schedule for later
                  </label>
                </div>
                <div className="flex justify-end space-x-3">
                  <button 
                    type="button"
                    onClick={() => setComposeOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}