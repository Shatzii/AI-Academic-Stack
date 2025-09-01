import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { analyticsAPI } from '../api'

export const fetchAnalyticsSummary = createAsyncThunk(
  'analytics/fetchSummary',
  async (params, { rejectWithValue }) => {
    try {
      const response = await analyticsAPI.getSummary(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch analytics')
    }
  }
)

export const fetchUserAnalytics = createAsyncThunk(
  'analytics/fetchUserAnalytics',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await analyticsAPI.getUserAnalytics(userId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch user analytics')
    }
  }
)

const initialState = {
  summary: null,
  userAnalytics: null,
  courseAnalytics: [],
  loading: false,
  error: null,
}

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearAnalytics: (state) => {
      state.summary = null
      state.userAnalytics = null
      state.courseAnalytics = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalyticsSummary.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAnalyticsSummary.fulfilled, (state, action) => {
        state.loading = false
        state.summary = action.payload
      })
      .addCase(fetchAnalyticsSummary.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchUserAnalytics.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserAnalytics.fulfilled, (state, action) => {
        state.loading = false
        state.userAnalytics = action.payload
      })
      .addCase(fetchUserAnalytics.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, clearAnalytics } = analyticsSlice.actions
export default analyticsSlice.reducer
