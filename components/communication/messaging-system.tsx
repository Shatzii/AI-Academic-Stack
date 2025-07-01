'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Send, 
  Paperclip, 
  Search, 
  Star, 
  Archive, 
  Trash2, 
  MoreVertical,
  Phone,
  Video,
  Calendar,
  Bell,
  BellOff,
  Users,
  MessageCircle,
  Clock,
  Check,
  CheckCheck
} from 'lucide-react'

interface Message {
  id: string
  senderId: string
  senderName: string
  senderRole: 'student' | 'parent' | 'teacher' | 'admin'
  receiverId: string
  content: string
  subject?: string
  timestamp: Date
  isRead: boolean
  priority: 'low' | 'normal' | 'high' | 'urgent'
  attachments?: Attachment[]
  replyToId?: string
  threadId: string
}

interface Attachment {
  id: string
  fileName: string
  fileSize: string
  fileType: string
  downloadUrl: string
}

interface Conversation {
  id: string
  participants: Participant[]
  lastMessage: Message
  unreadCount: number
  isPinned: boolean
  isMuted: boolean
  type: 'direct' | 'group' | 'announcement'
  subject?: string
}

interface Participant {
  id: string
  name: string
  role: 'student' | 'parent' | 'teacher' | 'admin'
  avatar?: string
  status: 'online' | 'offline' | 'away'
}

export default function MessagingSystem() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCompose, setShowCompose] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation)
    }
  }, [selectedConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadConversations = async () => {
    // Mock data - in production, fetch from API
    const mockConversations: Conversation[] = [
      {
        id: 'conv_1',
        participants: [
          { id: 'teacher_1', name: 'Ms. Johnson', role: 'teacher', status: 'online' },
          { id: 'parent_1', name: 'Maria Rodriguez', role: 'parent', status: 'online' }
        ],
        lastMessage: {
          id: 'msg_1',
          senderId: 'teacher_1',
          senderName: 'Ms. Johnson',
          senderRole: 'teacher',
          receiverId: 'parent_1',
          content: 'Emma had an excellent performance in today\'s theater workshop. She\'s really developing her stage presence!',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          isRead: false,
          priority: 'normal',
          threadId: 'thread_1'
        },
        unreadCount: 1,
        isPinned: false,
        isMuted: false,
        type: 'direct',
        subject: 'Emma\'s Progress Update'
      },
      {
        id: 'conv_2',
        participants: [
          { id: 'admin_1', name: 'School Administration', role: 'admin', status: 'online' }
        ],
        lastMessage: {
          id: 'msg_2',
          senderId: 'admin_1',
          senderName: 'School Administration',
          senderRole: 'admin',
          receiverId: 'all_parents',
          content: 'Reminder: Parent-teacher conferences are scheduled for next week. Please check your calendar for your assigned time slot.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isRead: true,
          priority: 'high',
          threadId: 'thread_2'
        },
        unreadCount: 0,
        isPinned: true,
        isMuted: false,
        type: 'announcement',
        subject: 'Parent-Teacher Conference Reminder'
      },
      {
        id: 'conv_3',
        participants: [
          { id: 'tutor_1', name: 'Dean Wonder', role: 'teacher', status: 'away' },
          { id: 'student_1', name: 'Lucas Rodriguez', role: 'student', status: 'online' }
        ],
        lastMessage: {
          id: 'msg_3',
          senderId: 'student_1',
          senderName: 'Lucas Rodriguez',
          senderRole: 'student',
          receiverId: 'tutor_1',
          content: 'Thanks for helping me with the math problem! I understand fractions much better now.',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          isRead: true,
          priority: 'normal',
          threadId: 'thread_3'
        },
        unreadCount: 0,
        isPinned: false,
        isMuted: false,
        type: 'direct',
        subject: 'Math Tutoring Session'
      }
    ]
    setConversations(mockConversations)
  }

  const loadMessages = async (conversationId: string) => {
    // Mock messages for the conversation
    const mockMessages: Message[] = [
      {
        id: 'msg_1',
        senderId: 'teacher_1',
        senderName: 'Ms. Johnson',
        senderRole: 'teacher',
        receiverId: 'parent_1',
        content: 'Hello Maria! I wanted to reach out about Emma\'s progress in our theater program.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: true,
        priority: 'normal',
        threadId: 'thread_1'
      },
      {
        id: 'msg_2',
        senderId: 'parent_1',
        senderName: 'Maria Rodriguez',
        senderRole: 'parent',
        receiverId: 'teacher_1',
        content: 'Hi Ms. Johnson! I\'d love to hear about how Emma is doing. She talks about your class all the time at home.',
        timestamp: new Date(Date.now() - 90 * 60 * 1000),
        isRead: true,
        priority: 'normal',
        threadId: 'thread_1'
      },
      {
        id: 'msg_3',
        senderId: 'teacher_1',
        senderName: 'Ms. Johnson',
        senderRole: 'teacher',
        receiverId: 'parent_1',
        content: 'Emma had an excellent performance in today\'s theater workshop. She\'s really developing her stage presence! Her confidence has grown tremendously, and she\'s becoming a natural leader in group exercises.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isRead: false,
        priority: 'normal',
        threadId: 'thread_1'
      }
    ]
    setMessages(mockMessages)
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: `msg_${Date.now()}`,
      senderId: 'current_user',
      senderName: 'You',
      senderRole: 'parent',
      receiverId: 'teacher_1',
      content: newMessage,
      timestamp: new Date(),
      isRead: false,
      priority: 'normal',
      threadId: 'thread_1'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Update conversation last message
    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation 
          ? { ...conv, lastMessage: message }
          : conv
      )
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600'
      case 'high': return 'text-orange-600'
      case 'normal': return 'text-gray-600'
      case 'low': return 'text-gray-400'
      default: return 'text-gray-600'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'teacher': return '👨‍🏫'
      case 'student': return '🎓'
      case 'parent': return '👨‍👩‍👧‍👦'
      case 'admin': return '🏫'
      default: return '👤'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.participants.some(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || 
    conv.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedConv = conversations.find(c => c.id === selectedConversation)

  return (
    <div className="h-full flex">
      {/* Sidebar - Conversations List */}
      <div className="w-80 border-r bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b bg-white">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Messages</h2>
            <Button size="sm" onClick={() => setShowCompose(true)}>
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Conversation Filters */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mx-4 mt-2">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="starred">Starred</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="flex-1 overflow-y-auto">
            <div className="space-y-1 p-2">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedConversation === conversation.id
                      ? 'bg-blue-100 border border-blue-200'
                      : 'hover:bg-white'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {getRoleIcon(conversation.participants[0]?.role)}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(conversation.participants[0]?.status)}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm truncate">
                          {conversation.type === 'group' ? conversation.subject : conversation.participants[0]?.name}
                        </h3>
                        <div className="flex items-center space-x-1">
                          {conversation.isPinned && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                          {conversation.unreadCount > 0 && (
                            <Badge variant="default" className="h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-600 mb-1">
                        {conversation.subject && conversation.type !== 'direct' && (
                          <span className="font-medium">{conversation.subject}</span>
                        )}
                      </p>
                      
                      <p className="text-sm text-gray-700 truncate">
                        {conversation.lastMessage.content}
                      </p>
                      
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">
                          {conversation.lastMessage.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        <div className="flex items-center space-x-1">
                          {conversation.isMuted && <BellOff className="h-3 w-3 text-gray-400" />}
                          <span className={`text-xs ${getPriorityColor(conversation.lastMessage.priority)}`}>
                            {conversation.lastMessage.priority !== 'normal' && conversation.lastMessage.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="unread">
            <div className="p-4 text-center text-gray-500">
              <MessageCircle className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">No unread messages</p>
            </div>
          </TabsContent>

          <TabsContent value="starred">
            <div className="p-4 text-center text-gray-500">
              <Star className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">No starred conversations</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {getRoleIcon(selectedConv.participants[0]?.role)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">
                    {selectedConv.type === 'group' ? selectedConv.subject : selectedConv.participants[0]?.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedConv.participants[0]?.role} • {selectedConv.participants[0]?.status}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Calendar className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === 'current_user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.senderId === 'current_user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {message.senderId !== 'current_user' && (
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium">{message.senderName}</span>
                        <Badge variant="outline" className="text-xs">
                          {message.senderRole}
                        </Badge>
                      </div>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {message.senderId === 'current_user' && (
                        <div className="ml-2">
                          {message.isRead ? (
                            <CheckCheck className="h-3 w-3 opacity-70" />
                          ) : (
                            <Check className="h-3 w-3 opacity-70" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}