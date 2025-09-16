"""
Tests for the new principal and superintendent roles.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model

User = get_user_model()


class UserRoleTestCase(TestCase):
    """Test cases for user roles including new principal and superintendent roles."""

    def setUp(self):
        """Set up test users with different roles."""
        self.student = User.objects.create_user(
            email='student@test.com',
            first_name='Test',
            last_name='Student',
            role='student',
            password='testpass123'
        )
        
        self.teacher = User.objects.create_user(
            email='teacher@test.com',
            first_name='Test',
            last_name='Teacher',
            role='teacher',
            password='testpass123'
        )
        
        self.principal = User.objects.create_user(
            email='principal@test.com',
            first_name='Test',
            last_name='Principal',
            role='principal',
            password='testpass123'
        )
        
        self.superintendent = User.objects.create_user(
            email='superintendent@test.com',
            first_name='Test',
            last_name='Superintendent',
            role='superintendent',
            password='testpass123'
        )
        
        self.admin = User.objects.create_user(
            email='admin@test.com',
            first_name='Test',
            last_name='Admin',
            role='admin',
            password='testpass123'
        )
        
        self.parent = User.objects.create_user(
            email='parent@test.com',
            first_name='Test',
            last_name='Parent',
            role='parent',
            password='testpass123'
        )

    def test_role_properties(self):
        """Test that role properties return correct values."""
        # Test student role
        self.assertTrue(self.student.is_student)
        self.assertFalse(self.student.is_teacher)
        self.assertFalse(self.student.is_principal)
        self.assertFalse(self.student.is_superintendent)
        self.assertFalse(self.student.is_admin)
        self.assertFalse(self.student.is_parent)
        
        # Test teacher role
        self.assertFalse(self.teacher.is_student)
        self.assertTrue(self.teacher.is_teacher)
        self.assertFalse(self.teacher.is_principal)
        self.assertFalse(self.teacher.is_superintendent)
        self.assertFalse(self.teacher.is_admin)
        self.assertFalse(self.teacher.is_parent)
        
        # Test principal role
        self.assertFalse(self.principal.is_student)
        self.assertFalse(self.principal.is_teacher)
        self.assertTrue(self.principal.is_principal)
        self.assertFalse(self.principal.is_superintendent)
        self.assertFalse(self.principal.is_admin)
        self.assertFalse(self.principal.is_parent)
        
        # Test superintendent role
        self.assertFalse(self.superintendent.is_student)
        self.assertFalse(self.superintendent.is_teacher)
        self.assertFalse(self.superintendent.is_principal)
        self.assertTrue(self.superintendent.is_superintendent)
        self.assertFalse(self.superintendent.is_admin)
        self.assertFalse(self.superintendent.is_parent)
        
        # Test admin role
        self.assertFalse(self.admin.is_student)
        self.assertFalse(self.admin.is_teacher)
        self.assertFalse(self.admin.is_principal)
        self.assertFalse(self.admin.is_superintendent)
        self.assertTrue(self.admin.is_admin)
        self.assertFalse(self.admin.is_parent)
        
        # Test parent role
        self.assertFalse(self.parent.is_student)
        self.assertFalse(self.parent.is_teacher)
        self.assertFalse(self.parent.is_principal)
        self.assertFalse(self.parent.is_superintendent)
        self.assertFalse(self.parent.is_admin)
        self.assertTrue(self.parent.is_parent)

    def test_role_choices_valid(self):
        """Test that all role choices are valid."""
        valid_roles = ['student', 'teacher', 'principal', 'superintendent', 'admin', 'parent']
        
        for role in valid_roles:
            user = User.objects.create_user(
                email=f'{role}@test.com',
                first_name='Test',
                last_name=role.title(),
                role=role,
                password='testpass123'
            )
            self.assertEqual(user.role, role)

    def test_role_string_representation(self):
        """Test string representation of users includes their role info."""
        self.assertIn('principal@test.com', str(self.principal))
        self.assertIn('superintendent@test.com', str(self.superintendent))

    def test_administrative_roles_hierarchy(self):
        """Test that administrative roles have appropriate permissions."""
        from courses.permissions import is_administrative_user
        
        # Test that principal and superintendent are considered administrative users
        self.assertTrue(is_administrative_user(self.principal))
        self.assertTrue(is_administrative_user(self.superintendent))
        self.assertTrue(is_administrative_user(self.admin))
        
        # Test that non-administrative roles are not considered administrative
        self.assertFalse(is_administrative_user(self.student))
        self.assertFalse(is_administrative_user(self.teacher))
        self.assertFalse(is_administrative_user(self.parent))