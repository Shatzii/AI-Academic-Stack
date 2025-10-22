"""
Security middleware for OpenEdTex
"""
import re
from django.http import HttpResponseBadRequest, HttpResponseForbidden
from django.conf import settings


class SecurityMiddleware:
    """
    Additional security middleware for enhanced protection
    """

    def __init__(self, get_response):
        self.get_response = get_response

        # SQL injection patterns
        self.sql_patterns = [
            r'union.*select.*--',
            r'union.*select',
            r'/\*.*\*/',
            r'--',
            r';',
            r'xp_',
            r'sp_',
        ]

        # XSS patterns
        self.xss_patterns = [
            r'<script[^>]*>.*?</script>',
            r'javascript:',
            r'on\w+\s*=',
            r'<iframe[^>]*>.*?</iframe>',
            r'<object[^>]*>.*?</object>',
            r'<embed[^>]*>.*?</embed>',
        ]

        # Path traversal patterns
        self.path_traversal_patterns = [
            r'\.\./',
            r'\.\.\\',
            r'%2e%2e%2f',
            r'%2e%2e%5c',
        ]

    def __call__(self, request):
        # Check for suspicious patterns in request
        if self._contains_suspicious_patterns(request):
            return HttpResponseForbidden('Request blocked for security reasons')

        # Add security headers
        response = self.get_response(request)
        self._add_security_headers(response)

        return response

    def _contains_suspicious_patterns(self, request):
        """Check request for suspicious patterns"""
        # Check query parameters
        for key, values in request.GET.lists():
            for value in values:
                if self._is_suspicious(value):
                    return True

        # Check POST data
        if request.method == 'POST':
            for key, values in request.POST.lists():
                for value in values:
                    if self._is_suspicious(value):
                        return True

        # Check URL path
        if self._is_suspicious(request.path):
            return True

        return False

    def _is_suspicious(self, value):
        """Check if a value contains suspicious patterns"""
        if not isinstance(value, str):
            return False

        # Check SQL injection patterns
        for pattern in self.sql_patterns:
            if re.search(pattern, value, re.IGNORECASE):
                return True

        # Check XSS patterns
        for pattern in self.xss_patterns:
            if re.search(pattern, value, re.IGNORECASE):
                return True

        # Check path traversal patterns
        for pattern in self.path_traversal_patterns:
            if re.search(pattern, value, re.IGNORECASE):
                return True

        return False

    def _add_security_headers(self, response):
        """Add security headers to response"""
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        response['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'

        # Content Security Policy
        csp = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https:; "
            "font-src 'self' data:; "
            "connect-src 'self' https: wss:; "
            "media-src 'self' https:; "
            "object-src 'none'; "
            "frame-src 'none'; "
            "base-uri 'self'; "
            "form-action 'self';"
        )
        response['Content-Security-Policy'] = csp
