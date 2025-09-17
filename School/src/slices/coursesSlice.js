import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { coursesAPI } from '../api'

export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (params, { rejectWithValue }) => {
    try {
      const response = await coursesAPI.getCourses(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch courses')
    }
  }
)

export const fetchCourse = createAsyncThunk(
  'courses/fetchCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await coursesAPI.getCourse(courseId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch course')
    }
  }
)

export const enrollInCourse = createAsyncThunk(
  'courses/enrollInCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await coursesAPI.enrollInCourse(courseId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to enroll in course')
    }
  }
)

const initialState = {
  courses: [],
  currentCourse: null,
  loading: false,
  error: null,
  pagination: null,
}

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentCourse: (state, action) => {
      state.currentCourse = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false
        state.courses = action.payload.results || action.payload
        state.pagination = action.payload.count ? {
          count: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous,
        } : null
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchCourse.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCourse.fulfilled, (state, action) => {
        state.loading = false
        state.currentCourse = action.payload
      })
      .addCase(fetchCourse.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(enrollInCourse.pending, (state) => {
        state.loading = true
      })
      .addCase(enrollInCourse.fulfilled, (state) => {
        state.loading = false
        // You can update the enrolled courses list here if needed
      })
      .addCase(enrollInCourse.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, setCurrentCourse } = coursesSlice.actions
export default coursesSlice.reducer
