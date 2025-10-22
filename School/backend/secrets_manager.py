# Create a secrets management utility

import os
import json
import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import secrets
from pathlib import Path

class SecretsManager:
    """Secure secrets management for OpenEdTex platform"""
    
    def __init__(self, key_file='.secrets.key', secrets_file='.secrets.enc'):
        self.key_file = Path(key_file)
        self.secrets_file = Path(secrets_file)
        self.fernet = None
        self._load_or_create_key()
    
    def _load_or_create_key(self):
        """Load existing key or create a new one"""
        if self.key_file.exists():
            with open(self.key_file, 'rb') as f:
                key = f.read()
        else:
            # Generate a new key
            key = Fernet.generate_key()
            with open(self.key_file, 'wb') as f:
                f.write(key)
        
        self.fernet = Fernet(key)
    
    def encrypt_secret(self, secret_name, secret_value):
        """Encrypt and store a secret"""
        secrets_data = self._load_secrets()
        secrets_data[secret_name] = secret_value
        
        encrypted_data = self.fernet.encrypt(json.dumps(secrets_data).encode())
        
        with open(self.secrets_file, 'wb') as f:
            f.write(encrypted_data)
        
        print(f"✅ Secret '{secret_name}' encrypted and stored securely")
    
    def decrypt_secret(self, secret_name):
        """Decrypt and retrieve a secret"""
        secrets_data = self._load_secrets()
        return secrets_data.get(secret_name)
    
    def _load_secrets(self):
        """Load encrypted secrets"""
        if not self.secrets_file.exists():
            return {}
        
        with open(self.secrets_file, 'rb') as f:
            encrypted_data = f.read()
        
        decrypted_data = self.fernet.decrypt(encrypted_data)
        return json.loads(decrypted_data.decode())
    
    def list_secrets(self):
        """List all stored secret names (without values)"""
        secrets_data = self._load_secrets()
        return list(secrets_data.keys())
    
    def delete_secret(self, secret_name):
        """Delete a stored secret"""
        secrets_data = self._load_secrets()
        if secret_name in secrets_data:
            del secrets_data[secret_name]
            self._save_secrets(secrets_data)
            print(f"🗑️  Secret '{secret_name}' deleted")
        else:
            print(f"❌ Secret '{secret_name}' not found")
    
    def _save_secrets(self, secrets_data):
        """Save secrets data"""
        encrypted_data = self.fernet.encrypt(json.dumps(secrets_data).encode())
        
        with open(self.secrets_file, 'wb') as f:
            f.write(encrypted_data)
    
    @staticmethod
    def generate_secure_key(length=32):
        """Generate a secure random key"""
        return secrets.token_hex(length)
    
    @staticmethod
    def generate_password(length=16):
        """Generate a secure password"""
        alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
        return ''.join(secrets.choice(alphabet) for _ in range(length))

# CLI interface for secrets management
def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='OpenEdTex Secrets Manager')
    parser.add_argument('action', choices=['store', 'get', 'list', 'delete', 'generate-key', 'generate-password'])
    parser.add_argument('--name', help='Secret name')
    parser.add_argument('--value', help='Secret value')
    parser.add_argument('--length', type=int, default=32, help='Length for generated keys/passwords')
    
    args = parser.parse_args()
    
    manager = SecretsManager()
    
    if args.action == 'store':
        if not args.name or not args.value:
            print("❌ Please provide --name and --value")
            return
        manager.encrypt_secret(args.name, args.value)
    
    elif args.action == 'get':
        if not args.name:
            print("❌ Please provide --name")
            return
        value = manager.decrypt_secret(args.name)
        if value:
            print(f"🔑 {args.name}: {value}")
        else:
            print(f"❌ Secret '{args.name}' not found")
    
    elif args.action == 'list':
        secrets = manager.list_secrets()
        if secrets:
            print("📋 Stored secrets:")
            for secret in secrets:
                print(f"  • {secret}")
        else:
            print("📭 No secrets stored")
    
    elif args.action == 'delete':
        if not args.name:
            print("❌ Please provide --name")
            return
        manager.delete_secret(args.name)
    
    elif args.action == 'generate-key':
        key = manager.generate_secure_key(args.length)
        print(f"🔐 Generated secure key: {key}")
    
    elif args.action == 'generate-password':
        password = manager.generate_password(args.length)
        print(f"🔒 Generated secure password: {password}")

if __name__ == '__main__':
    main()