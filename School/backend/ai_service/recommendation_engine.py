"""
AI-Powered Recommendation Engine
Recommends courses, study materials, and learning resources based on user behavior and performance
"""

import os
import logging
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timedelta
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from django.contrib.auth import get_user_model
from django.db.models import Avg, Count, Q
from adaptive_learning.models import PerformanceMetrics, LearningProfile
from ai_assistant.models import AIConversation, AIMessage

logger = logging.getLogger(__name__)
User = get_user_model()

class RecommendationEngine:
    """AI-powered recommendation system for educational content"""

    def __init__(self):
        self.user_similarity_matrix = None
        self.content_similarity_matrix = None
        self.user_profiles = {}
        self.content_features = {}

    def get_course_recommendations(self, user_id: int, limit: int = 5) -> List[Dict[str, Any]]:
        """Get personalized course recommendations for a user"""
        try:
            user = User.objects.get(id=user_id)

            # Get user's learning profile and performance data
            profile = self._get_user_profile(user)
            performance_data = self._get_user_performance(user)

            # Find similar users
            similar_users = self._find_similar_users(user, limit=10)

            # Get courses that similar users performed well on
            recommended_courses = self._get_collaborative_recommendations(similar_users, user)

            # Get content-based recommendations
            content_recommendations = self._get_content_based_recommendations(profile, performance_data)

            # Combine and rank recommendations
            final_recommendations = self._combine_recommendations(
                recommended_courses, content_recommendations, limit
            )

            return final_recommendations

        except Exception as e:
            logger.error(f"Course recommendation failed: {e}")
            return []

    def get_study_material_recommendations(self, user_id: int, topic: str = None,
                                         limit: int = 10) -> List[Dict[str, Any]]:
        """Get study material recommendations"""
        try:
            user = User.objects.get(id=user_id)

            # Get user's current performance in the topic
            performance_data = self._get_topic_performance(user, topic) if topic else {}

            # Get user's learning preferences
            profile = self._get_user_profile(user)

            # Generate material recommendations based on performance and preferences
            materials = self._generate_study_materials(user, topic, profile, performance_data, limit)

            return materials

        except Exception as e:
            logger.error(f"Study material recommendation failed: {e}")
            return []

    def get_learning_path_recommendations(self, user_id: int, subject: str,
                                        current_level: str) -> Dict[str, Any]:
        """Get recommended learning path for a subject"""
        try:
            user = User.objects.get(id=user_id)

            # Analyze current performance
            performance_analysis = self._analyze_subject_performance(user, subject)

            # Determine optimal learning path
            learning_path = self._create_learning_path(
                subject, current_level, performance_analysis
            )

            return learning_path

        except Exception as e:
            logger.error(f"Learning path recommendation failed: {e}")
            return {"error": str(e)}

    def _get_user_profile(self, user) -> Dict[str, Any]:
        """Get comprehensive user learning profile"""
        try:
            profile, created = LearningProfile.objects.get_or_create(
                user=user,
                defaults={
                    'learning_style': 'visual',
                    'difficulty_preference': 'adaptive'
                }
            )

            return {
                'learning_style': profile.learning_style,
                'preferred_difficulty': profile.difficulty_preference,
                'study_duration': profile.study_duration_preference,
                'strengths': profile.strengths,
                'weaknesses': profile.weaknesses,
                'learning_pace': profile.learning_pace,
                'preferred_study_time': profile.preferred_study_time
            }

        except Exception as e:
            logger.error(f"Failed to get user profile: {e}")
            return {}

    def _get_user_performance(self, user) -> Dict[str, Any]:
        """Get user's performance metrics across subjects"""
        try:
            performance = PerformanceMetrics.objects.filter(user=user).values('subject').annotate(
                avg_accuracy=Avg('correct_answers') / Avg('total_questions'),
                avg_mastery=Avg('mastery_level'),
                total_questions=Sum('total_questions'),
                avg_time=Avg('average_time')
            )

            return {p['subject']: p for p in performance}

        except Exception as e:
            logger.error(f"Failed to get user performance: {e}")
            return {}

    def _find_similar_users(self, user, limit: int = 10) -> List[int]:
        """Find users with similar learning profiles and performance"""
        try:
            # Get all users with learning profiles
            all_profiles = LearningProfile.objects.exclude(user=user).select_related('user')

            similar_users = []
            user_profile = self._get_user_profile(user)

            for profile in all_profiles:
                similarity_score = self._calculate_profile_similarity(user_profile, {
                    'learning_style': profile.learning_style,
                    'preferred_difficulty': profile.difficulty_preference,
                    'strengths': profile.strengths,
                    'weaknesses': profile.weaknesses,
                    'learning_pace': profile.learning_pace
                })

                if similarity_score > 0.6:  # Similarity threshold
                    similar_users.append((profile.user.id, similarity_score))

            # Sort by similarity and return top users
            similar_users.sort(key=lambda x: x[1], reverse=True)
            return [user_id for user_id, score in similar_users[:limit]]

        except Exception as e:
            logger.error(f"Failed to find similar users: {e}")
            return []

    def _calculate_profile_similarity(self, profile1: Dict, profile2: Dict) -> float:
        """Calculate similarity between two learning profiles"""
        try:
            score = 0.0
            total_factors = 0

            # Learning style similarity
            if profile1.get('learning_style') == profile2.get('learning_style'):
                score += 1.0
            total_factors += 1

            # Difficulty preference similarity
            if profile1.get('preferred_difficulty') == profile2.get('preferred_difficulty'):
                score += 1.0
            total_factors += 1

            # Learning pace similarity (within 20% range)
            pace1 = profile1.get('learning_pace', 1.0)
            pace2 = profile2.get('learning_pace', 1.0)
            if abs(pace1 - pace2) <= 0.2:
                score += 1.0
            total_factors += 1

            # Subject strengths overlap
            strengths1 = set(profile1.get('strengths', []))
            strengths2 = set(profile2.get('strengths', []))
            if strengths1 and strengths2:
                overlap = len(strengths1.intersection(strengths2))
                score += overlap / max(len(strengths1), len(strengths2))
                total_factors += 1

            return score / total_factors if total_factors > 0 else 0.0

        except Exception as e:
            logger.error(f"Profile similarity calculation failed: {e}")
            return 0.0

    def _get_collaborative_recommendations(self, similar_users: List[int], current_user) -> List[Dict]:
        """Get collaborative filtering recommendations"""
        try:
            recommendations = []

            # Get subjects that similar users perform well in
            for user_id in similar_users:
                try:
                    similar_user = User.objects.get(id=user_id)
                    performance = PerformanceMetrics.objects.filter(
                        user=similar_user
                    ).values('subject').annotate(
                        avg_accuracy=Avg('correct_answers') / Avg('total_questions'),
                        avg_mastery=Avg('mastery_level')
                    ).filter(avg_accuracy__gte=0.8)  # High performers only

                    for perf in performance:
                        # Check if current user hasn't mastered this subject
                        user_perf = PerformanceMetrics.objects.filter(
                            user=current_user,
                            subject=perf['subject']
                        ).aggregate(avg_mastery=Avg('mastery_level'))

                        if not user_perf['avg_mastery'] or user_perf['avg_mastery'] < 0.7:
                            recommendations.append({
                                'subject': perf['subject'],
                                'reason': 'Similar students excel in this subject',
                                'confidence': min(perf['avg_accuracy'], 0.95),
                                'type': 'collaborative'
                            })

                except User.DoesNotExist:
                    continue

            return recommendations

        except Exception as e:
            logger.error(f"Collaborative recommendations failed: {e}")
            return []

    def _get_content_based_recommendations(self, profile: Dict, performance: Dict) -> List[Dict]:
        """Get content-based recommendations"""
        try:
            recommendations = []

            # Recommend based on weaknesses
            weaknesses = profile.get('weaknesses', [])
            for weakness in weaknesses:
                recommendations.append({
                    'subject': weakness,
                    'reason': 'Focus on improving weak areas',
                    'confidence': 0.8,
                    'type': 'content_based'
                })

            # Recommend advanced topics for strengths
            strengths = profile.get('strengths', [])
            for strength in strengths:
                perf_data = performance.get(strength, {})
                if perf_data.get('avg_mastery', 0) > 0.8:
                    recommendations.append({
                        'subject': f"Advanced {strength}",
                        'reason': 'Build on existing strengths',
                        'confidence': 0.9,
                        'type': 'content_based'
                    })

            return recommendations

        except Exception as e:
            logger.error(f"Content-based recommendations failed: {e}")
            return []

    def _combine_recommendations(self, collaborative: List[Dict],
                               content_based: List[Dict], limit: int) -> List[Dict]:
        """Combine and rank different types of recommendations"""
        try:
            all_recommendations = collaborative + content_based

            # Remove duplicates and boost collaborative recommendations
            seen_subjects = set()
            unique_recommendations = []

            for rec in all_recommendations:
                subject = rec['subject']
                if subject not in seen_subjects:
                    # Boost collaborative recommendations
                    if rec.get('type') == 'collaborative':
                        rec['confidence'] = min(rec['confidence'] * 1.2, 1.0)

                    unique_recommendations.append(rec)
                    seen_subjects.add(subject)

            # Sort by confidence and return top recommendations
            unique_recommendations.sort(key=lambda x: x['confidence'], reverse=True)
            return unique_recommendations[:limit]

        except Exception as e:
            logger.error(f"Recommendation combination failed: {e}")
            return []

    def _get_topic_performance(self, user, topic: str) -> Dict[str, Any]:
        """Get user's performance in a specific topic"""
        try:
            performance = PerformanceMetrics.objects.filter(
                user=user, topic=topic
            ).aggregate(
                avg_accuracy=Avg('correct_answers') / Avg('total_questions'),
                avg_mastery=Avg('mastery_level'),
                total_attempts=Count('id'),
                avg_time=Avg('average_time')
            )

            return performance

        except Exception as e:
            logger.error(f"Failed to get topic performance: {e}")
            return {}

    def _generate_study_materials(self, user, topic: str, profile: Dict,
                                performance: Dict, limit: int) -> List[Dict]:
        """Generate study material recommendations"""
        try:
            materials = []

            # Base recommendations on learning style
            learning_style = profile.get('learning_style', 'visual')

            if learning_style == 'visual':
                materials.extend([
                    {
                        'type': 'video_tutorial',
                        'title': f'Visual Guide to {topic}',
                        'description': 'Step-by-step visual explanations',
                        'difficulty': 'beginner'
                    },
                    {
                        'type': 'diagram',
                        'title': f'{topic} Concept Map',
                        'description': 'Visual concept relationships',
                        'difficulty': 'intermediate'
                    }
                ])

            elif learning_style == 'auditory':
                materials.extend([
                    {
                        'type': 'podcast',
                        'title': f'{topic} Audio Lecture',
                        'description': 'Comprehensive audio explanations',
                        'difficulty': 'intermediate'
                    },
                    {
                        'type': 'discussion',
                        'title': f'{topic} Q&A Session',
                        'description': 'Interactive audio discussions',
                        'difficulty': 'advanced'
                    }
                ])

            # Add practice materials based on performance
            if performance.get('avg_accuracy', 1.0) < 0.7:
                materials.append({
                    'type': 'practice_quiz',
                    'title': f'{topic} Practice Questions',
                    'description': 'Targeted practice for improvement',
                    'difficulty': 'adaptive'
                })

            # Add advanced materials for high performers
            if performance.get('avg_mastery', 0) > 0.8:
                materials.append({
                    'type': 'advanced_project',
                    'title': f'Advanced {topic} Project',
                    'description': 'Challenge yourself with advanced applications',
                    'difficulty': 'advanced'
                })

            return materials[:limit]

        except Exception as e:
            logger.error(f"Study material generation failed: {e}")
            return []

    def _analyze_subject_performance(self, user, subject: str) -> Dict[str, Any]:
        """Analyze user's performance in a subject"""
        try:
            topics = PerformanceMetrics.objects.filter(
                user=user, subject=subject
            ).values('topic').annotate(
                avg_accuracy=Avg('correct_answers') / Avg('total_questions'),
                avg_mastery=Avg('mastery_level'),
                total_questions=Sum('total_questions')
            )

            analysis = {
                'overall_mastery': 0.0,
                'weak_topics': [],
                'strong_topics': [],
                'recommended_focus': []
            }

            if topics:
                accuracies = [t['avg_accuracy'] or 0 for t in topics]
                masteries = [t['avg_mastery'] or 0 for t in topics]

                analysis['overall_mastery'] = np.mean(masteries)

                for topic in topics:
                    accuracy = topic['avg_accuracy'] or 0
                    if accuracy < 0.6:
                        analysis['weak_topics'].append(topic['topic'])
                    elif accuracy > 0.8:
                        analysis['strong_topics'].append(topic['topic'])

                # Recommend focus areas
                if analysis['weak_topics']:
                    analysis['recommended_focus'] = analysis['weak_topics'][:3]
                elif analysis['overall_mastery'] > 0.8:
                    analysis['recommended_focus'] = ['advanced_topics']

            return analysis

        except Exception as e:
            logger.error(f"Subject performance analysis failed: {e}")
            return {}

    def _create_learning_path(self, subject: str, current_level: str,
                            performance_analysis: Dict) -> Dict[str, Any]:
        """Create a personalized learning path"""
        try:
            learning_path = {
                'subject': subject,
                'current_level': current_level,
                'recommended_path': [],
                'estimated_duration': 0,
                'milestones': []
            }

            # Define level progression
            levels = ['beginner', 'intermediate', 'advanced', 'expert']
            current_idx = levels.index(current_level) if current_level in levels else 0

            # Create path based on performance
            if performance_analysis.get('weak_topics'):
                # Focus on weaknesses first
                learning_path['recommended_path'] = [
                    {
                        'phase': 'Foundation Building',
                        'topics': performance_analysis['weak_topics'][:3],
                        'duration_weeks': 4,
                        'focus': 'Master fundamentals'
                    },
                    {
                        'phase': 'Skill Development',
                        'topics': performance_analysis.get('strong_topics', [])[:2],
                        'duration_weeks': 3,
                        'focus': 'Build on strengths'
                    }
                ]
            else:
                # Progress to next level
                next_level = levels[min(current_idx + 1, len(levels) - 1)]
                learning_path['recommended_path'] = [
                    {
                        'phase': f'Level {current_level.title()} to {next_level.title()}',
                        'topics': [f'Advanced {subject} concepts'],
                        'duration_weeks': 6,
                        'focus': f'Progress from {current_level} to {next_level}'
                    }
                ]

            # Calculate total duration
            learning_path['estimated_duration'] = sum(
                phase['duration_weeks'] for phase in learning_path['recommended_path']
            )

            # Add milestones
            learning_path['milestones'] = [
                {
                    'name': f'Complete {phase["phase"]}',
                    'description': phase['focus'],
                    'duration': phase['duration_weeks']
                }
                for phase in learning_path['recommended_path']
            ]

            return learning_path

        except Exception as e:
            logger.error(f"Learning path creation failed: {e}")
            return {"error": str(e)}