from django.urls import path
from . import views

app_name = 'ai_assistant'

urlpatterns = [
    # AI Conversations
    path('conversations/', views.AIConversationListView.as_view(), name='conversation-list'),
    path('conversations/<int:pk>/', views.AIConversationDetailView.as_view(), name='conversation-detail'),

    # AI Chat
    path('chat/', views.AIChatView.as_view(), name='ai-chat'),

    # AI Prompt Templates
    path('prompt-templates/', views.AIPromptTemplateListView.as_view(), name='prompt-template-list'),

    # AI Study Plans
    path('study-plans/', views.AIStudyPlanListView.as_view(), name='study-plan-list'),

    # AI Quizzes
    path('quizzes/', views.AIQuizListView.as_view(), name='quiz-list'),

    # AI Quiz Attempts
    path('quiz-attempts/', views.AIQuizAttemptListView.as_view(), name='quiz-attempt-list'),

    # AI Statistics
    path('stats/', views.ai_stats, name='ai-stats'),
]
