import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Async thunks for API calls
export const fetchLearningProfile = createAsyncThunk(
  'adaptive/fetchLearningProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/adaptive/profiles/')
      return response.data[0] || null
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch learning profile')
    }
  }
)

export const updateLearningProfile = createAsyncThunk(
  'adaptive/updateLearningProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/adaptive/profiles/${profileData.id}/`, profileData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update learning profile')
    }
  }
)

export const fetchPerformanceMetrics = createAsyncThunk(
  'adaptive/fetchPerformanceMetrics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/adaptive/metrics/')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch performance metrics')
    }
  }
)

export const updatePerformance = createAsyncThunk(
  'adaptive/updatePerformance',
  async (performanceData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/adaptive/metrics/update_performance/', performanceData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update performance')
    }
  }
)

export const getRecommendation = createAsyncThunk(
  'adaptive/getRecommendation',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/adaptive/paths/recommendation/')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get recommendation')
    }
  }
)

export const generateStudyPlan = createAsyncThunk(
  'adaptive/generateStudyPlan',
  async (planData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/adaptive/paths/generate_plan/', planData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate study plan')
    }
  }
)

export const predictSuccess = createAsyncThunk(
  'adaptive/predictSuccess',
  async (predictionData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/adaptive/paths/predict_success/', predictionData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to predict success')
    }
  }
)

export const fetchLearningGoals = createAsyncThunk(
  'adaptive/fetchLearningGoals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/adaptive/goals/')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch learning goals')
    }
  }
)

export const createLearningGoal = createAsyncThunk(
  'adaptive/createLearningGoal',
  async (goalData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/adaptive/goals/', goalData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create learning goal')
    }
  }
)

export const updateLearningGoal = createAsyncThunk(
  'adaptive/updateLearningGoal',
  async ({ id, ...goalData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/adaptive/goals/${id}/`, goalData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update learning goal')
    }
  }
)

export const markGoalCompleted = createAsyncThunk(
  'adaptive/markGoalCompleted',
  async (goalId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/adaptive/goals/${goalId}/mark_completed/`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark goal as completed')
    }
  }
)

const adaptiveSlice = createSlice({
  name: 'adaptive',
  initialState: {
    profile: null,
    metrics: [],
    recommendation: null,
    studyPlan: null,
    goals: [],
    loading: false,
    error: null,
    successProbability: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearRecommendation: (state) => {
      state.recommendation = null
    },
    clearStudyPlan: (state) => {
      state.studyPlan = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Learning Profile
      .addCase(fetchLearningProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLearningProfile.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload
      })
      .addCase(fetchLearningProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateLearningProfile.fulfilled, (state, action) => {
        state.profile = action.payload
      })

      // Performance Metrics
      .addCase(fetchPerformanceMetrics.fulfilled, (state, action) => {
        state.metrics = action.payload
      })
      .addCase(updatePerformance.fulfilled, (state, action) => {
        // Update the specific metric in the array
        const index = state.metrics.findIndex(m => m.id === action.payload.id)
        if (index !== -1) {
          state.metrics[index] = action.payload
        } else {
          state.metrics.push(action.payload)
        }
      })

      // Recommendations
      .addCase(getRecommendation.fulfilled, (state, action) => {
        state.recommendation = action.payload
      })

      // Study Plans
      .addCase(generateStudyPlan.fulfilled, (state, action) => {
        state.studyPlan = action.payload
      })

      // Success Prediction
      .addCase(predictSuccess.fulfilled, (state, action) => {
        state.successProbability = action.payload.success_probability
      })

      // Learning Goals
      .addCase(fetchLearningGoals.fulfilled, (state, action) => {
        state.goals = action.payload
      })
      .addCase(createLearningGoal.fulfilled, (state, action) => {
        state.goals.push(action.payload)
      })
      .addCase(updateLearningGoal.fulfilled, (state, action) => {
        const index = state.goals.findIndex(g => g.id === action.payload.id)
        if (index !== -1) {
          state.goals[index] = action.payload
        }
      })
      .addCase(markGoalCompleted.fulfilled, (state, action) => {
        const index = state.goals.findIndex(g => g.id === action.payload.id)
        if (index !== -1) {
          state.goals[index] = action.payload
        }
      })
  },
})

export const { clearError, clearRecommendation, clearStudyPlan } = adaptiveSlice.actions
export default adaptiveSlice.reducer
