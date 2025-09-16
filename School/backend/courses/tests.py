"""
Tests for permission system with new principal and superintendent roles.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory
from courses.permissions import is_administrative_user

User = get_user_model()


class PermissionTestCase(TestCase):
    """Test cases for permission system with new roles."""

    def setUp(self):
        """Set up test users with different roles."""
        self.factory = APIRequestFactory()
        
        self.student = User.objects.create_user(
            email='student@test.com',
            first_name='Student',
            last_name='User',
            role='student',
            password='testpass123'
        )
        
        self.teacher = User.objects.create_user(
            email='teacher@test.com',
            first_name='Teacher',
            last_name='User',
            role='teacher',
            password='testpass123'
        )
        
        self.principal = User.objects.create_user(
            email='principal@test.com',
            first_name='Principal',
            last_name='User',
            role='principal',
            password='testpass123'
        )
        
        self.superintendent = User.objects.create_user(
            email='superintendent@test.com',
            first_name='Superintendent',
            last_name='User',
            role='superintendent',
            password='testpass123'
        )
        
        self.admin = User.objects.create_user(
            email='admin@test.com',
            first_name='Admin',
            last_name='User',
            role='admin',
            password='testpass123'
        )

    def test_is_administrative_user_function(self):
        """Test the is_administrative_user helper function."""
        # Administrative users
        self.assertTrue(is_administrative_user(self.admin))
        self.assertTrue(is_administrative_user(self.principal))
        self.assertTrue(is_administrative_user(self.superintendent))
        
        # Non-administrative users
        self.assertFalse(is_administrative_user(self.student))
        self.assertFalse(is_administrative_user(self.teacher))

    def test_role_hierarchy(self):
        """Test that the role hierarchy is logical."""
        # Ensure all administrative roles have equal standing
        admin_users = [self.admin, self.principal, self.superintendent]
        for user in admin_users:
            self.assertTrue(is_administrative_user(user))
        
        # Ensure teachers have instructor privileges
        self.assertTrue(self.teacher.is_teacher)
        
        # Ensure students don't have administrative privileges
        self.assertFalse(is_administrative_user(self.student))

    def test_permission_inheritance(self):
        """Test that new roles inherit appropriate permissions."""
        # Principal should have administrative privileges
        self.assertTrue(self.principal.is_principal)
        self.assertTrue(is_administrative_user(self.principal))
        
        # Superintendent should have administrative privileges
        self.assertTrue(self.superintendent.is_superintendent)
        self.assertTrue(is_administrative_user(self.superintendent))
        
        # Both should be different from existing admin role
        self.assertFalse(self.principal.is_admin)
        self.assertFalse(self.superintendent.is_admin)
        self.assertFalse(self.admin.is_principal)
        self.assertFalse(self.admin.is_superintendent)