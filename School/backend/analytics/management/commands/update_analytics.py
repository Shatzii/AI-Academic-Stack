from django.core.management.base import BaseCommand
from analytics.models import PlatformAnalytics, CourseAnalytics, UserAnalytics


class Command(BaseCommand):
    help = 'Update daily analytics data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--update-platform',
            action='store_true',
            help='Update platform analytics',
        )
        parser.add_argument(
            '--update-courses',
            action='store_true',
            help='Update course analytics',
        )
        parser.add_argument(
            '--update-users',
            action='store_true',
            help='Update user analytics',
        )
        parser.add_argument(
            '--all',
            action='store_true',
            help='Update all analytics',
        )

    def handle(self, *args, **options):
        if options['all'] or options['update_platform']:
            self.stdout.write('Updating platform analytics...')
            platform_analytics = PlatformAnalytics.update_daily_stats()
            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully updated platform analytics for {platform_analytics.date}'
                )
            )

        if options['all'] or options['update_courses']:
            self.stdout.write('Updating course analytics...')
            course_analytics = CourseAnalytics.objects.all()
            updated_count = 0
            for analytics in course_analytics:
                analytics.update_metrics()
                updated_count += 1
            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully updated {updated_count} course analytics'
                )
            )

        if options['all'] or options['update_users']:
            self.stdout.write('Updating user analytics...')
            user_analytics = UserAnalytics.objects.all()
            updated_count = 0
            for analytics in user_analytics:
                analytics.update_metrics()
                updated_count += 1
            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully updated {updated_count} user analytics'
                )
            )

        if not any([options['update_platform'], options['update_courses'], options['update_users'], options['all']]):
            self.stdout.write(
                self.style.WARNING(
                    'No update options specified. Use --help for available options.'
                )
            )
