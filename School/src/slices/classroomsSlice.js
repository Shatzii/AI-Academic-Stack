import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { classroomsAPI } from '../api'

export const fetchClassrooms = createAsyncThunk(
  'classrooms/fetchClassrooms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await classroomsAPI.getClassrooms()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch classrooms')
    }
  }
)

const initialState = {
  classrooms: [],
  currentClassroom: null,
  loading: false,
  error: null,
}

const classroomsSlice = createSlice({
  name: 'classrooms',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentClassroom: (state, action) => {
      state.currentClassroom = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClassrooms.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchClassrooms.fulfilled, (state, action) => {
        state.loading = false
        state.classrooms = action.payload
      })
      .addCase(fetchClassrooms.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, setCurrentClassroom } = classroomsSlice.actions
export default classroomsSlice.reducer
