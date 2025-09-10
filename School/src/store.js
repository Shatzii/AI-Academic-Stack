import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import coursesReducer from './slices/coursesSlice'
import classroomsReducer from './slices/classroomsSlice'
import aiReducer from './slices/aiSlice'
import analyticsReducer from './slices/analyticsSlice'
import adaptiveReducer from './slices/adaptiveSlice'
import gamificationReducer from './slices/gamificationSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
    classrooms: classroomsReducer,
    ai: aiReducer,
    analytics: analyticsReducer,
    adaptive: adaptiveReducer,
    gamification: gamificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})
