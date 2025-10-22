from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from users.models_student_id import StudentIDCard

User = get_user_model()

class Command(BaseCommand):
    help = 'Create student ID cards for all existing students who don\'t have one'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be done without making changes',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']

        # Find all students without ID cards
        students_without_cards = User.objects.filter(
            role='student'
        ).exclude(
            id_card__isnull=False
        )

        total_students = students_without_cards.count()

        if total_students == 0:
            self.stdout.write(
                self.style.SUCCESS('All students already have ID cards!')
            )
            return

        self.stdout.write(
            self.style.WARNING(
                f'Found {total_students} students without ID cards'
            )
        )

        if dry_run:
            self.stdout.write('DRY RUN - Would create ID cards for:')
            for student in students_without_cards[:10]:  # Show first 10
                self.stdout.write(f'  - {student.get_full_name()} ({student.email})')
            if total_students > 10:
                self.stdout.write(f'  ... and {total_students - 10} more')
            return

        # Create ID cards for all students
        created_count = 0
        failed_count = 0

        for student in students_without_cards:
            try:
                id_card = StudentIDCard.objects.create(
                    student=student,
                    card_type='standard',
                    status='active',
                    emergency_contact_name='',
                    emergency_contact_phone=student.phone_number or '',
                    medical_info='',
                    created_by=None,  # System-generated
                    notes=f'Auto-generated ID card for {student.get_full_name()}'
                )
                created_count += 1
                self.stdout.write(
                    f'✓ Created ID card {id_card.card_number} for {student.get_full_name()}'
                )
            except Exception as e:
                failed_count += 1
                self.stdout.write(
                    self.style.ERROR(
                        f'✗ Failed to create ID card for {student.get_full_name()}: {str(e)}'
                    )
                )

        # Summary
        self.stdout.write('\n' + '='*50)
        self.stdout.write('SUMMARY:')
        self.stdout.write(f'Total students processed: {total_students}')
        self.stdout.write(
            self.style.SUCCESS(f'ID cards created: {created_count}')
        )
        if failed_count > 0:
            self.stdout.write(
                self.style.ERROR(f'Failed: {failed_count}')
            )
        self.stdout.write('='*50)
