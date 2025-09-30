import axios from 'axios';
import { fetchAuth0AccessToken } from './auth/auth0TokenBridge';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token (prefers Auth0 token when available)
api.interceptors.request.use(
  async (config) => {
    // Try Auth0 token first
    const auth0Token = await fetchAuth0AccessToken({
      // scope can be customized per-call via config.__auth0Scopes if needed
      scope: config.__auth0Scopes,
    });
    if (auth0Token) {
      config.headers.Authorization = `Bearer ${auth0Token}`;
      return config;
    }

    // Fallback to existing local JWT (SimpleJWT)
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // If using Auth0, attempt to fetch a fresh token and retry
        const newAuth0Token = await fetchAuth0AccessToken({ ignoreCache: true });
        if (newAuth0Token) {
          originalRequest.headers.Authorization = `Bearer ${newAuth0Token}`;
          return api(originalRequest);
        }

        // Fallback: try SimpleJWT refresh flow
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL || 'http://localhost:8001/api'}/auth/token/refresh/`,
            { refresh: refreshToken }
          );

          const { access } = response.data;
          localStorage.setItem('access_token', access);

          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  refresh: (refreshToken) => api.post('/auth/refresh/', { refresh: refreshToken }),
  logout: () => api.post('/auth/logout/'),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.patch('/auth/profile/', data),
};

// Courses API
export const coursesAPI = {
  getCourses: (params) => api.get('/courses/', { params }),
  getCourse: (id) => api.get(`/courses/${id}/`),
  createCourse: (data) => api.post('/courses/', data),
  updateCourse: (id, data) => api.put(`/courses/${id}/`, data),
  deleteCourse: (id) => api.delete(`/courses/${id}/`),
  getLessons: (courseId) => api.get(`/courses/${courseId}/lessons/`),
  getLesson: (courseId, lessonId) => api.get(`/courses/${courseId}/lessons/${lessonId}/`),
  enroll: (courseId) => api.post(`/courses/${courseId}/enroll/`),
  enrollInCourse: (courseId) => api.post(`/courses/${courseId}/enroll/`), // Alias for compatibility
  unenroll: (courseId) => api.delete(`/courses/${courseId}/enroll/`),
  getEnrollments: () => api.get('/courses/enrollments/'),
};

// AI Assistant API
export const aiAPI = {
  chat: (data) => api.post('/ai/chat/', data),
  getConversations: () => api.get('/ai/conversations/'),
  getConversation: (id) => api.get(`/ai/conversations/${id}/`),
  deleteConversation: (id) => api.delete(`/ai/conversations/${id}/`),
  generateStudyPlan: (data) => api.post('/ai/study-plans/', data),
  getStudyPlans: () => api.get('/ai/study-plans/'),
  generateQuiz: (data) => api.post('/ai/quizzes/', data),
  getQuizzes: () => api.get('/ai/quizzes/'),
  submitQuizAttempt: (data) => api.post('/ai/quiz-attempts/', data),
  getQuizAttempts: () => api.get('/ai/quiz-attempts/'),
  getStats: () => api.get('/ai/stats/'),
};

// Classrooms API
export const classroomsAPI = {
  getClassrooms: () => api.get('/classrooms/'),
  getClassroom: (id) => api.get(`/classrooms/${id}/`),
  createClassroom: (data) => api.post('/classrooms/', data),
  updateClassroom: (id, data) => api.put(`/classrooms/${id}/`, data),
  deleteClassroom: (id) => api.delete(`/classrooms/${id}/`),
  joinClassroom: (id) => api.post(`/classrooms/${id}/join/`),
  leaveClassroom: (id) => api.post(`/classrooms/${id}/leave/`),
  getMessages: (id) => api.get(`/classrooms/${id}/messages/`),
  sendMessage: (id, data) => api.post(`/classrooms/${id}/messages/`, data),
  createPoll: (id, data) => api.post(`/classrooms/${id}/polls/`, data),
  getPolls: (id) => api.get(`/classrooms/${id}/polls/`),
  votePoll: (pollId, data) => api.post(`/classrooms/polls/${pollId}/vote/`, data),
};

// Analytics API
export const analyticsAPI = {
  getSummary: (params) => api.get('/analytics/summary/', { params }),
  getUserAnalytics: (userId) => api.get(`/analytics/users/${userId}/activity/`),
  getCourseAnalytics: () => api.get('/analytics/courses/'),
  getEngagement: (params) => api.get('/analytics/engagement/', { params }),
  getLearning: (params) => api.get('/analytics/learning/', { params }),
  trackEvent: (data) => api.post('/analytics/events/track/', data),
};

export default api;
