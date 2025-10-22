# Enterprise Secrets Management

## Overview
This document outlines the secure management of secrets and sensitive configuration for the OpenEdTex platform.

## Required Secrets
- SECRET_KEY: Django secret key (auto-generated)
- DB_PASSWORD: Database password
- JWT_SECRET_KEY: JWT signing key
- OPENAI_API_KEY: OpenAI API key
- SENTRY_DSN: Sentry error tracking DSN
- ENCRYPTION_KEY: Data encryption key
- EMAIL_HOST_PASSWORD: Email service password
- REDIS_PASSWORD: Redis password (if applicable)

## Setup Instructions
1. Run the secrets manager: `python backend/secrets_manager.py`
2. Set environment variables in production
3. Use encrypted storage for sensitive data
4. Rotate secrets regularly (quarterly)

## Security Best Practices
- Never commit secrets to version control
- Use different secrets for each environment
- Implement secret rotation policies
- Monitor secret access logs
- Use hardware security modules (HSM) for production

## Compliance
- SOC 2 Type II compliant
- ISO 27001 certified processes
- Regular security audits

Last updated: September 1, 2025