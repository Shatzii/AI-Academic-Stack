# OpenEdTex Backend

A comprehensive Django REST API backend for the OpenEdTex AI-powered educational platform.

## Features

- **User Management**: JWT-based authentication with role-based access control
- **Course Management**: Full CRUD operations for courses, lessons, and enrollments
- **Real-time Classrooms**: WebSocket support for live classrooms with chat and polling
- **AI Assistant**: OpenAI-powered conversational AI for educational support
- **Analytics**: Comprehensive platform and user analytics
- **File Storage**: AWS S3 integration for media files
- **Docker Support**: Containerized deployment with Docker Compose

## Tech Stack

- **Framework**: Django 4.2.7 with Django REST Framework
- **Database**: PostgreSQL
- **Cache**: Redis
- **Real-time**: Django Channels with WebSockets
- **AI**: OpenAI GPT models
- **Authentication**: JWT tokens
- **File Storage**: AWS S3
- **Containerization**: Docker & Docker Compose

## Quick Start

### Prerequisites

- Python 3.11+
- PostgreSQL
- Redis
- Docker & Docker Compose (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Database setup**
   ```bash
   python manage.py migrate
   ```

6. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run the server**
   ```bash
   python manage.py runserver
   ```

### Docker Setup

1. **Using Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Run migrations**
   ```bash
   docker-compose exec web python manage.py migrate
   ```

3. **Create superuser**
   ```bash
   docker-compose exec web python manage.py createsuperuser
   ```

## API Documentation

- **Swagger UI**: http://localhost:8000/swagger/
- **ReDoc**: http://localhost:8000/redoc/

## API Endpoints

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `POST /api/auth/refresh/` - Refresh JWT token

### Courses
- `GET /api/courses/` - List courses
- `POST /api/courses/` - Create course
- `GET /api/courses/{id}/` - Course details
- `PUT /api/courses/{id}/` - Update course
- `DELETE /api/courses/{id}/` - Delete course

### AI Assistant
- `POST /api/ai/chat/` - AI chat interaction
- `GET /api/ai/conversations/` - List conversations
- `POST /api/ai/study-plans/` - Generate study plan
- `POST /api/ai/quizzes/` - Generate quiz

### Analytics
- `GET /api/analytics/summary/` - Platform summary
- `GET /api/analytics/users/` - User analytics
- `GET /api/analytics/courses/` - Course analytics

## Project Structure

```
backend/
├── config/                 # Django project settings
├── users/                  # User management app
├── courses/                # Course management app
├── classrooms/             # Real-time classrooms app
├── ai_assistant/           # AI assistant app
├── analytics/              # Analytics app
├── manage.py              # Django management script
├── requirements.txt       # Python dependencies
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose configuration
└── .env.example         # Environment variables template
```

## Development

### Running Tests
```bash
python manage.py test
```

### Code Formatting
```bash
# Install black and isort
pip install black isort

# Format code
black .
isort .
```

### Update Analytics
```bash
# Update all analytics
python manage.py update_analytics --all

# Update specific analytics
python manage.py update_analytics --update-platform
python manage.py update_analytics --update-courses
python manage.py update_analytics --update-users
```

## Deployment

### Production Checklist

1. **Environment Variables**
   - Set `DEBUG=False`
   - Configure production database
   - Set strong `SECRET_KEY`
   - Configure email settings
   - Set up AWS S3 for file storage

2. **Security**
   - Use HTTPS
   - Configure CORS properly
   - Set up proper firewall rules
   - Use environment variables for secrets

3. **Performance**
   - Set up Redis caching
   - Configure database connection pooling
   - Set up monitoring and logging
   - Use CDN for static files

### Docker Production

```bash
# Build for production
docker-compose -f docker-compose.prod.yml up -d
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation
