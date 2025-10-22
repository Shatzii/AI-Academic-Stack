# Create a secrets validation utility

import os
import logging
from pathlib import Path
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

class SecretsValidator:
    """Validate that all required secrets are properly configured"""
    
    REQUIRED_SECRETS = {
        'SECRET_KEY': 'Django secret key for cryptographic signing',
        'DB_PASSWORD': 'Database password',
        'EMAIL_HOST_PASSWORD': 'Email service password',
        'OPENAI_API_KEY': 'OpenAI API key for AI features',
        'STRIPE_SECRET_KEY': 'Stripe secret key for payments',
        'AWS_SECRET_ACCESS_KEY': 'AWS secret access key',
        'JWT_SECRET_KEY': 'JWT signing key',
        'ENCRYPTION_KEY': 'Encryption key for sensitive data',
    }
    
    OPTIONAL_SECRETS = {
        'SENTRY_DSN': 'Sentry DSN for error tracking',
        'GOOGLE_CLIENT_ID': 'Google OAuth client ID',
        'FACEBOOK_APP_ID': 'Facebook OAuth app ID',
    }
    
    def __init__(self, env_file='.env'):
        self.env_file = Path(env_file)
        load_dotenv(self.env_file)
        
        # Import secrets manager for fallback
        try:
            from secrets_manager import SecretsManager
            self.secrets_manager = SecretsManager()
        except ImportError:
            self.secrets_manager = None
    
    def validate_all(self):
        """Validate all secrets and return validation results"""
        results = {
            'required': {},
            'optional': {},
            'missing_required': [],
            'missing_optional': [],
            'weak_secrets': [],
        }
        
        # Check required secrets
        for secret, description in self.REQUIRED_SECRETS.items():
            value = os.getenv(secret)
            
            # If not in env or is placeholder, try secrets manager
            if not value or value.startswith('your-') or value == '':
                if self.secrets_manager:
                    try:
                        value = self.secrets_manager.decrypt_secret(secret)
                    except:
                        value = None
            
            if not value or value.startswith('your-') or value == '':
                results['missing_required'].append({
                    'name': secret,
                    'description': description
                })
            else:
                results['required'][secret] = self._validate_secret_strength(secret, value)
        
        # Check optional secrets
        for secret, description in self.OPTIONAL_SECRETS.items():
            value = os.getenv(secret)
            
            # If not in env or is placeholder, try secrets manager
            if not value or value.startswith('your-') or value == '':
                if self.secrets_manager:
                    try:
                        value = self.secrets_manager.decrypt_secret(secret)
                        if value:
                            results['optional'][secret] = self._validate_secret_strength(secret, value)
                            continue
                    except Exception as e:
                        logger.warning(f"Failed to decrypt secret {secret}: {e}")
                        pass
            
            if value and not value.startswith('your-') and value != '':
                results['optional'][secret] = self._validate_secret_strength(secret, value)
            else:
                results['missing_optional'].append({
                    'name': secret,
                    'description': description
                })
        
        return results
    
    def _validate_secret_strength(self, name, value):
        """Validate the strength of a secret"""
        issues = []
        
        if len(value) < 16:
            issues.append('Too short (minimum 16 characters recommended)')
        
        if name in ['SECRET_KEY', 'JWT_SECRET_KEY', 'ENCRYPTION_KEY']:
            if len(value) < 32:
                issues.append('Should be at least 32 characters for cryptographic keys')
        
        if name == 'DB_PASSWORD':
            if not any(c.isupper() for c in value):
                issues.append('Should contain uppercase letters')
            if not any(c.islower() for c in value):
                issues.append('Should contain lowercase letters')
            if not any(c.isdigit() for c in value):
                issues.append('Should contain numbers')
        
        return {
            'valid': len(issues) == 0,
            'issues': issues,
            'length': len(value)
        }
    
    def print_validation_report(self):
        """Print a formatted validation report"""
        results = self.validate_all()
        
        print("🔐 OpenEdTex Secrets Validation Report")
        print("=" * 50)
        
        # Required secrets
        print(f"\n✅ Required Secrets ({len(results['required'])}/{len(self.REQUIRED_SECRETS)} configured):")
        for name, validation in results['required'].items():
            status = "✅" if validation['valid'] else "⚠️"
            print(f"  {status} {name}: {validation['length']} chars")
            if not validation['valid']:
                for issue in validation['issues']:
                    print(f"    • {issue}")
        
        # Missing required
        if results['missing_required']:
            print(f"\n❌ Missing Required Secrets ({len(results['missing_required'])}):")
            for secret in results['missing_required']:
                print(f"  • {secret['name']}: {secret['description']}")
        
        # Optional secrets
        if results['optional']:
            print(f"\nℹ️  Optional Secrets ({len(results['optional'])} configured):")
            for name, validation in results['optional'].items():
                status = "✅" if validation['valid'] else "⚠️"
                print(f"  {status} {name}: {validation['length']} chars")
        
        # Summary
        total_required = len(self.REQUIRED_SECRETS)
        configured_required = len(results['required'])
        missing_required = len(results['missing_required'])
        
        print(f"\n📊 Summary:")
        print(f"  • Required: {configured_required}/{total_required} configured")
        print(f"  • Missing: {missing_required} required, {len(results['missing_optional'])} optional")
        
        if missing_required == 0:
            print("🎉 All required secrets are configured!")
        else:
            print("⚠️  Please configure missing secrets before deployment.")

def main():
    validator = SecretsValidator()
    validator.print_validation_report()

if __name__ == '__main__':
    main()