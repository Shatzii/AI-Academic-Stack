# OpenEdTex System Administrator Training Manual

## Module 1: Platform Architecture Deep Dive

### 1.1 Backend Architecture (Django)
The OpenEdTex backend is built on Django with the following key components:

**Core Applications:**
- `users/` - User authentication and profiles
- `courses/` - Course management and content
- `assessment/` - Testing and evaluation systems
- `adaptive_learning/` - AI-powered personalization
- `ai_assistant/` - AI tutoring services
- `analytics/` - Learning analytics and reporting
- `gamification/` - Achievement and reward systems
- `classrooms/` - Virtual classroom management
- `whiteboard/` - Collaborative drawing tools
- `social_network/` - Student interaction features

**Database Schema:**
- PostgreSQL for production (SQLite for development)
- Key tables: User, Course, Lesson, Assessment, Progress, Analytics
- Redis for caching and session management
- Celery for background task processing

### 1.2 AI Services Architecture
**AI Service Components:**
- FastAPI-based AI service (`ai_service/main.py`)
- Hugging Face integration for NLP and computer vision
- Ollama/OpenAI for advanced AI capabilities
- Curriculum converter for document processing
- Recommendation engine for personalized learning

**AI Endpoints:**
- `/api/ai/classify-image` - Image classification
- `/api/ai/extract-text` - OCR functionality
- `/api/ai/generate-speech` - Text-to-speech
- `/api/ai/transcribe-audio` - Speech-to-text
- `/api/ai/convert-curriculum` - Document processing
- `/api/ai/generate-content` - AI content creation
- `/api/ai/recommend` - Learning recommendations

### 1.3 Frontend Architecture (React/TypeScript)
**Technology Stack:**
- React 18 with TypeScript
- Vite for build tooling
- Material-UI for component library
- Redux Toolkit for state management
- React Router for navigation
- Axios for API communication

**Key Components:**
- Student Dashboard
- Course Player
- Assessment Interface
- AI Assistant Chat
- Progress Analytics
- Admin Control Panel

## Module 2: Deployment Procedures

### 2.1 Production Deployment Checklist

**Pre-Deployment:**
- [ ] Environment variables configured in `.env.prod`
- [ ] SSL certificates installed and valid
- [ ] Database backups created
- [ ] Static files collected (`python manage.py collectstatic`)
- [ ] Dependencies installed and tested
- [ ] Health checks passing

**Deployment Steps:**
1. Pull latest code from repository
2. Build Docker images: `docker-compose -f docker-compose.prod.yml build`
3. Run database migrations: `docker-compose -f docker-compose.prod.yml run --rm backend python manage.py migrate`
4. Start services: `docker-compose -f docker-compose.prod.yml up -d`
5. Verify health endpoints
6. Update load balancer configuration
7. Monitor logs for errors

**Post-Deployment:**
- [ ] Run automated tests
- [ ] Verify user-facing functionality
- [ ] Check monitoring dashboards
- [ ] Update documentation
- [ ] Notify stakeholders

### 2.2 Rollback Procedures

**Emergency Rollback:**
1. Stop current deployment: `docker-compose -f docker-compose.prod.yml down`
2. Restore previous Docker images from registry
3. Restore database from backup if needed
4. Restart services with previous version
5. Verify system stability
6. Investigate root cause

**Gradual Rollback:**
1. Route portion of traffic to previous version
2. Monitor performance and errors
3. Complete rollback if issues persist
4. Full rollback if critical issues found

## Module 3: Monitoring and Alerting

### 3.1 Key Metrics to Monitor

**System Health:**
- CPU usage (< 80%)
- Memory usage (< 85%)
- Disk space (> 20% free)
- Network I/O
- Database connections

**Application Metrics:**
- Response times (< 500ms API, < 2s page loads)
- Error rates (< 1%)
- User session duration
- API endpoint usage
- Database query performance

**Business Metrics:**
- Active users
- Course completion rates
- Assessment scores
- AI service usage
- Support ticket volume

### 3.2 Alert Configuration

**Critical Alerts (Immediate Response):**
- System down/unreachable
- Database connection failures
- SSL certificate expiration (< 30 days)
- High error rates (> 5%)
- Security incidents

**Warning Alerts (Investigation Required):**
- High resource usage (> 90%)
- Slow response times (> 2s)
- Failed background jobs
- Unusual traffic patterns

**Info Alerts (Monitoring):**
- Deployment completions
- Backup successes/failures
- User milestone achievements

## Module 4: Security Administration

### 4.1 Access Control

**User Roles and Permissions:**
- Student: Basic course access and AI features
- Instructor: Course creation and student management
- Administrator: Full system access
- Support: User assistance and troubleshooting

**Authentication Methods:**
- JWT tokens for API access
- Session-based authentication for web
- MFA for administrative accounts
- OAuth integration for third-party logins

### 4.2 Security Hardening

**Server Security:**
- Regular security updates
- Firewall configuration
- SSH key-only access
- Fail2Ban for brute force protection
- SELinux/AppArmor enforcement

**Application Security:**
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection
- Secure headers (HSTS, CSP, etc.)

**Data Security:**
- Encryption at rest and in transit
- Regular security audits
- Secrets management
- Data backup encryption

## Module 5: Troubleshooting Guide

### 5.1 Common Issues and Solutions

**Database Connection Issues:**
```
Symptoms: 500 errors, slow queries
Check: Database server status, connection pool
Solution: Restart database, check credentials, scale connections
```

**AI Service Failures:**
```
Symptoms: AI features not working
Check: AI service logs, API endpoints
Solution: Restart AI containers, check model loading
```

**Frontend Loading Issues:**
```
Symptoms: Blank pages, JavaScript errors
Check: Build status, CDN configuration
Solution: Rebuild assets, clear cache, check network
```

**Performance Degradation:**
```
Symptoms: Slow response times, high resource usage
Check: Monitoring dashboards, database queries
Solution: Optimize queries, scale resources, cache tuning
```

### 5.2 Diagnostic Commands

**System Diagnostics:**
```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f [service_name]

# Check resource usage
docker stats

# Test connectivity
curl -I https://your-domain.com/health/
```

**Database Diagnostics:**
```bash
# Check database connections
python manage.py dbshell
.show

# Run database checks
python manage.py check --database

# Monitor slow queries
# (Configure PostgreSQL logging)
```

**AI Service Diagnostics:**
```bash
# Check AI service health
curl http://localhost:8001/health/

# Test AI endpoints
curl -X POST http://localhost:8001/api/ai/test \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

## Module 6: Backup and Recovery

### 6.1 Backup Strategy

**Database Backups:**
- Daily full backups
- Hourly incremental backups
- Point-in-time recovery capability
- 30-day retention policy
- Encrypted backup storage

**File Backups:**
- Static/media files daily
- SSL certificates weekly
- Configuration files with each deployment

**Application Backups:**
- Docker images in registry
- Source code in Git
- Dependencies locked versions

### 6.2 Recovery Procedures

**Database Recovery:**
1. Stop application services
2. Restore database from backup
3. Run data integrity checks
4. Restart services
5. Verify data consistency

**Full System Recovery:**
1. Provision new infrastructure
2. Restore database and files
3. Deploy application code
4. Configure networking and security
5. Test and validate functionality

## Module 7: Performance Optimization

### 7.1 Database Optimization

**Query Optimization:**
- Add appropriate indexes
- Optimize complex queries
- Use database connection pooling
- Implement query result caching

**Schema Optimization:**
- Normalize data structures
- Use appropriate data types
- Implement partitioning for large tables
- Regular maintenance (VACUUM, ANALYZE)

### 7.2 Application Optimization

**Caching Strategy:**
- Redis for session and general caching
- CDN for static assets
- Database query result caching
- API response caching

**Code Optimization:**
- Minimize database queries
- Optimize image/file sizes
- Implement lazy loading
- Use efficient algorithms

### 7.3 Infrastructure Optimization

**Resource Scaling:**
- Horizontal scaling with load balancer
- Vertical scaling for resource-intensive services
- Auto-scaling based on metrics
- Geographic distribution for global users

**Network Optimization:**
- CDN for global content delivery
- Compression for text assets
- Optimized SSL/TLS configuration
- Connection pooling and keep-alive

## Certification Assessment

### Practical Skills Test
1. Perform a complete production deployment
2. Troubleshoot a simulated system failure
3. Configure monitoring alerts
4. Execute a backup and recovery operation
5. Optimize a slow-performing query

### Knowledge Assessment
- Multiple-choice questions on architecture
- Scenario-based troubleshooting questions
- Security configuration knowledge
- Performance optimization concepts

### Passing Criteria
- 85% on knowledge assessment
- Successful completion of all practical tasks
- Demonstrated understanding of procedures

---

*System Administrator Training Manual v2.0 - OpenEdTex Platform*