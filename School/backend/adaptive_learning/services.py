import numpy as np
from datetime import datetime, timedelta
from django.contrib.auth import get_user_model
from django.db.models import Avg, Count, Q
from .models import LearningProfile, PerformanceMetrics, AdaptivePath, StudySession, LearningGoal
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

class AdaptiveLearningEngine:
    """Core adaptive learning engine that personalizes learning paths"""

    def __init__(self, user):
        self.user = user
        self.profile = self._get_or_create_profile()
        self.path = self._get_or_create_path()

    def _get_or_create_profile(self):
        """Get or create learning profile for user"""
        profile, created = LearningProfile.objects.get_or_create(
            user=self.user,
            defaults={
                'learning_style': 'visual',
                'difficulty_preference': 'adaptive'
            }
        )
        return profile

    def _get_or_create_path(self):
        """Get or create adaptive learning path for user"""
        path, created = AdaptivePath.objects.get_or_create(
            user=self.user,
            defaults={'path_data': {}}
        )
        return path

    def analyze_performance(self, subject, topic, correct, time_taken):
        """Analyze student performance and update metrics"""
        try:
            metric, created = PerformanceMetrics.objects.get_or_create(
                user=self.user,
                subject=subject,
                topic=topic,
                defaults={'difficulty_level': 1.0}
            )

            # Update performance metrics
            metric.update_performance(correct, time_taken)

            # Adjust difficulty based on performance
            self._adjust_difficulty(metric)

            # Update learning profile
            self._update_learning_profile(metric)

            return metric

        except Exception as e:
            logger.error(f"Error analyzing performance: {e}")
            return None

    def _adjust_difficulty(self, metric):
        """Adjust difficulty level based on performance"""
        accuracy = metric.accuracy_rate
        avg_time = metric.average_time

        if accuracy > 0.85 and avg_time < 30:  # Excellent performance
            metric.difficulty_level = min(5.0, metric.difficulty_level + 0.2)
        elif accuracy > 0.7 and avg_time < 60:  # Good performance
            metric.difficulty_level = min(5.0, metric.difficulty_level + 0.1)
        elif accuracy < 0.5 or avg_time > 120:  # Struggling
            metric.difficulty_level = max(0.1, metric.difficulty_level - 0.2)
        elif accuracy < 0.7:  # Needs improvement
            metric.difficulty_level = max(0.1, metric.difficulty_level - 0.1)

        metric.save()

    def _update_learning_profile(self, metric):
        """Update learning profile based on performance patterns"""
        # Analyze strengths and weaknesses
        subject_performance = PerformanceMetrics.objects.filter(
            user=self.user,
            subject=metric.subject
        ).aggregate(
            avg_accuracy=Avg('correct_answers') / Avg('total_questions'),
            avg_time=Avg('average_time')
        )

        if subject_performance['avg_accuracy'] and subject_performance['avg_accuracy'] > 0.8:
            if metric.subject not in self.profile.strengths:
                self.profile.strengths.append(metric.subject)
        elif subject_performance['avg_accuracy'] and subject_performance['avg_accuracy'] < 0.6:
            if metric.subject not in self.profile.weaknesses:
                self.profile.weaknesses.append(metric.subject)

        # Adjust learning pace based on performance
        if subject_performance['avg_time'] and subject_performance['avg_time'] < 45:
            self.profile.learning_pace = min(2.0, self.profile.learning_pace + 0.1)
        elif subject_performance['avg_time'] and subject_performance['avg_time'] > 90:
            self.profile.learning_pace = max(0.5, self.profile.learning_pace - 0.1)

        self.profile.save()

    def get_next_recommendation(self):
        """Get the next recommended topic for the student"""
        try:
            # Get current performance across all subjects
            performance_data = PerformanceMetrics.objects.filter(
                user=self.user
            ).values('subject', 'topic').annotate(
                accuracy=Avg('correct_answers') / Avg('total_questions'),
                mastery=Avg('mastery_level'),
                last_practiced=Avg('last_practiced')
            ).order_by('accuracy')

            if not performance_data:
                return self._get_default_recommendation()

            # Find weakest areas
            weakest_topics = []
            for data in performance_data:
                if data['accuracy'] and data['accuracy'] < 0.7:
                    weakest_topics.append(data)

            if weakest_topics:
                # Recommend review of weak topics
                topic = weakest_topics[0]
                return {
                    'type': 'review',
                    'subject': topic['subject'],
                    'topic': topic['topic'],
                    'reason': 'Low accuracy detected - review recommended'
                }

            # If all topics are strong, recommend advancement
            strong_topics = [data for data in performance_data if data['accuracy'] and data['accuracy'] > 0.8]
            if strong_topics:
                topic = strong_topics[0]
                return {
                    'type': 'advance',
                    'subject': topic['subject'],
                    'topic': topic['topic'],
                    'reason': 'Strong performance - ready for advanced topics'
                }

            return self._get_default_recommendation()

        except Exception as e:
            logger.error(f"Error getting recommendation: {e}")
            return self._get_default_recommendation()

    def _get_default_recommendation(self):
        """Get default recommendation when no performance data available"""
        return {
            'type': 'exploration',
            'subject': 'General',
            'topic': 'Getting Started',
            'reason': 'Welcome to adaptive learning!'
        }

    def generate_study_plan(self, subject, duration_days=30):
        """Generate a personalized study plan"""
        try:
            # Get performance data for subject
            topics = PerformanceMetrics.objects.filter(
                user=self.user,
                subject=subject
            ).order_by('accuracy')

            study_plan = []
            daily_topics = self._distribute_topics(topics, duration_days)

            for day, day_topics in enumerate(daily_topics, 1):
                study_plan.append({
                    'day': day,
                    'date': (datetime.now() + timedelta(days=day-1)).date(),
                    'topics': day_topics,
                    'estimated_duration': len(day_topics) * 45,  # 45 minutes per topic
                    'focus_areas': self._identify_focus_areas(day_topics)
                })

            return study_plan

        except Exception as e:
            logger.error(f"Error generating study plan: {e}")
            return []

    def _distribute_topics(self, topics, duration_days):
        """Distribute topics across study days"""
        if not topics:
            return []

        # Prioritize weak topics
        weak_topics = [t for t in topics if t.accuracy_rate < 0.7]
        medium_topics = [t for t in topics if 0.7 <= t.accuracy_rate < 0.85]
        strong_topics = [t for t in topics if t.accuracy_rate >= 0.85]

        daily_topics = []
        topics_per_day = max(1, len(topics) // duration_days)

        all_topics = weak_topics + medium_topics + strong_topics

        for i in range(duration_days):
            start_idx = i * topics_per_day
            end_idx = min(start_idx + topics_per_day, len(all_topics))
            daily_topics.append(all_topics[start_idx:end_idx])

        return daily_topics

    def _identify_focus_areas(self, topics):
        """Identify focus areas for the day"""
        if not topics:
            return []

        focus_areas = []
        for topic in topics:
            if topic.accuracy_rate < 0.7:
                focus_areas.append(f"Review {topic.topic}")
            elif topic.accuracy_rate > 0.85:
                focus_areas.append(f"Advance in {topic.topic}")
            else:
                focus_areas.append(f"Practice {topic.topic}")

        return focus_areas

    def predict_success_probability(self, subject, target_date):
        """Predict probability of achieving mastery by target date"""
        try:
            # Get current performance
            current_metrics = PerformanceMetrics.objects.filter(
                user=self.user,
                subject=subject
            ).aggregate(
                avg_accuracy=Avg('correct_answers') / Avg('total_questions'),
                avg_mastery=Avg('mastery_level'),
                topic_count=Count('topic', distinct=True)
            )

            if not current_metrics['topic_count']:
                return 0.5  # Default probability

            # Calculate days available
            days_available = (target_date - datetime.now().date()).days
            if days_available <= 0:
                return 0.0

            # Estimate required study time
            topics_to_master = max(1, current_metrics['topic_count'] - (current_metrics['avg_mastery'] or 0) * current_metrics['topic_count'])
            estimated_days_needed = topics_to_master / self.profile.learning_pace

            # Calculate success probability
            if estimated_days_needed <= days_available:
                success_prob = min(0.95, 0.7 + (current_metrics['avg_accuracy'] or 0) * 0.3)
            else:
                ratio = days_available / estimated_days_needed
                success_prob = max(0.1, ratio * 0.8)

            return round(success_prob, 2)

        except Exception as e:
            logger.error(f"Error predicting success: {e}")
            return 0.5
