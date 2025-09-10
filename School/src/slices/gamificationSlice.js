import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Async thunks for API calls
export const fetchUserAchievements = createAsyncThunk(
  'gamification/fetchUserAchievements',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/gamification/user-achievements/')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch achievements')
    }
  }
)

export const fetchUserBadges = createAsyncThunk(
  'gamification/fetchUserBadges',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/gamification/user-badges/')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch badges')
    }
  }
)

export const fetchGamificationStats = createAsyncThunk(
  'gamification/fetchGamificationStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/gamification/profiles/stats/')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats')
    }
  }
)

export const fetchLeaderboards = createAsyncThunk(
  'gamification/fetchLeaderboards',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/gamification/leaderboards/')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leaderboards')
    }
  }
)

export const fetchLeaderboardEntries = createAsyncThunk(
  'gamification/fetchLeaderboardEntries',
  async (leaderboardId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/gamification/leaderboards/${leaderboardId}/entries/`)
      return { leaderboardId, entries: response.data }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leaderboard entries')
    }
  }
)

export const fetchAvailableRewards = createAsyncThunk(
  'gamification/fetchAvailableRewards',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/gamification/rewards/')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch rewards')
    }
  }
)

export const recordActivity = createAsyncThunk(
  'gamification/recordActivity',
  async (activityData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/gamification/profiles/record_activity/', activityData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to record activity')
    }
  }
)

export const redeemReward = createAsyncThunk(
  'gamification/redeemReward',
  async (rewardId, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/gamification/user-rewards/redeem/', { reward_id: rewardId })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to redeem reward')
    }
  }
)

const gamificationSlice = createSlice({
  name: 'gamification',
  initialState: {
    achievements: [],
    badges: [],
    stats: null,
    leaderboards: [],
    leaderboardEntries: {},
    rewards: [],
    loading: false,
    error: null,
    lastActivityResult: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearLastActivityResult: (state) => {
      state.lastActivityResult = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Achievements
      .addCase(fetchUserAchievements.fulfilled, (state, action) => {
        state.achievements = action.payload
      })

      // Badges
      .addCase(fetchUserBadges.fulfilled, (state, action) => {
        state.badges = action.payload
      })

      // Stats
      .addCase(fetchGamificationStats.fulfilled, (state, action) => {
        state.stats = action.payload
      })

      // Leaderboards
      .addCase(fetchLeaderboards.fulfilled, (state, action) => {
        state.leaderboards = action.payload
      })
      .addCase(fetchLeaderboardEntries.fulfilled, (state, action) => {
        state.leaderboardEntries[action.payload.leaderboardId] = action.payload.entries
      })

      // Rewards
      .addCase(fetchAvailableRewards.fulfilled, (state, action) => {
        state.rewards = action.payload
      })

      // Activity Recording
      .addCase(recordActivity.pending, (state) => {
        state.loading = true
      })
      .addCase(recordActivity.fulfilled, (state, action) => {
        state.loading = false
        state.lastActivityResult = action.payload
        // Update stats if available
        if (action.payload.total_points !== undefined) {
          if (state.stats) {
            state.stats.total_points = action.payload.total_points
            state.stats.current_level = action.payload.current_level
          }
        }
      })
      .addCase(recordActivity.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Reward Redemption
      .addCase(redeemReward.fulfilled, (state, action) => {
        // Refresh rewards and stats after redemption
        // This would trigger refetch in the component
      })

      // Loading states
      .addCase(fetchUserAchievements.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUserAchievements.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchUserAchievements.fulfilled, (state) => {
        state.loading = false
      })

      .addCase(fetchGamificationStats.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchGamificationStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchGamificationStats.fulfilled, (state) => {
        state.loading = false
      })
  },
})

export const { clearError, clearLastActivityResult } = gamificationSlice.actions
export default gamificationSlice.reducer
