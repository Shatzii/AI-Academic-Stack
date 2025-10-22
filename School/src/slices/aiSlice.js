import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { aiAPI } from '../api'

export const sendMessage = createAsyncThunk(
  'ai/sendMessage',
  async ({ message, conversationId, courseId }, { rejectWithValue }) => {
    try {
      const response = await aiAPI.chat({
        message,
        conversation_id: conversationId,
        course_id: courseId,
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to send message')
    }
  }
)

export const fetchConversations = createAsyncThunk(
  'ai/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await aiAPI.getConversations()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch conversations')
    }
  }
)

export const fetchConversation = createAsyncThunk(
  'ai/fetchConversation',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await aiAPI.getConversation(conversationId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch conversation')
    }
  }
)

const initialState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  loading: false,
  error: null,
  stats: null,
  aiServiceInfo: {
    model: null,
    tokensUsed: 0,
    responseTime: 0,
    serviceType: null, // 'ollama', 'openai', or 'hybrid'
  },
}

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    clearConversation: (state) => {
      state.currentConversation = null
      state.messages = []
      state.error = null
      state.aiServiceInfo = {
        model: null,
        tokensUsed: 0,
        responseTime: 0,
        serviceType: null,
      }
    },
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload)
    },
    updateAIServiceInfo: (state, action) => {
      state.aiServiceInfo = {
        ...state.aiServiceInfo,
        ...action.payload,
      }
    },
    clearAIServiceInfo: (state) => {
      state.aiServiceInfo = {
        model: null,
        tokensUsed: 0,
        responseTime: 0,
        serviceType: null,
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false
        if (!state.currentConversation) {
          state.currentConversation = action.payload.conversation_id
        }
        // Update AI service info if available in response
        if (action.payload.tokens_used !== undefined || action.payload.response_time !== undefined || action.payload.service_type || action.payload.model) {
          state.aiServiceInfo = {
            ...state.aiServiceInfo,
            tokensUsed: action.payload.tokens_used || state.aiServiceInfo.tokensUsed,
            responseTime: action.payload.response_time || state.aiServiceInfo.responseTime,
            serviceType: action.payload.service_type || state.aiServiceInfo.serviceType,
            model: action.payload.model || state.aiServiceInfo.model,
          }
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false
        state.conversations = action.payload
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchConversation.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchConversation.fulfilled, (state, action) => {
        state.loading = false
        state.currentConversation = action.payload
        state.messages = action.payload.messages || []
      })
      .addCase(fetchConversation.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearConversation, setCurrentConversation, addMessage, updateAIServiceInfo, clearAIServiceInfo } = aiSlice.actions
export default aiSlice.reducer
