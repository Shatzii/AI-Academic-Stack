# OpenEdTex - AI-Powered Educational Platform

A comprehensive educational platform built with React, Django, and AI integration for modern learning experiences.

## 🚀 Features

### Core Functionality
- **AI-Powered Learning Assistant** - Get personalized help with studies, explanations, and study tips
- **Interactive Courses** - Comprehensive course management with TEKS-aligned content
- **Real-time Classrooms** - Live collaboration and communication features
- **Advanced Analytics** - Track progress and learning patterns
- **User Authentication** - Secure login/registration with role-based access

### Technology Stack
- **Frontend**: React 18, Redux Toolkit, React Router DOM
- **Backend**: Django REST Framework, PostgreSQL
- **AI Integration**: OpenAI API for intelligent tutoring
- **Real-time Features**: Socket.io for live classrooms
- **UI Framework**: Bootstrap 5 with custom styling
- **State Management**: Redux with async thunks
- **Authentication**: JWT tokens with refresh mechanism

## 🏗️ Architecture

### Frontend Structure
```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── common/         # Shared components (Home, Dashboard)
│   ├── courses/        # Course management
│   ├── classrooms/     # Classroom features
│   ├── ai/            # AI assistant interface
│   └── layout/        # Navigation and layout
├── slices/            # Redux state slices
├── context/           # React context providers
├── api.js            # API client configuration
└── store.js          # Redux store setup
```

### Backend Structure
```
backend/
├── ai_assistant/      # AI integration module
├── analytics/         # Analytics and reporting
├── classrooms/        # Real-time classroom management
├── courses/          # Course content management
├── users/            # User management and authentication
└── config/           # Django settings and configuration
```

## 🛠️ Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- PostgreSQL
- Docker (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd OpenEdTex
   ```

2. **Frontend Setup**
   ```bash
   cd School
   npm install
   npm run dev
   ```

3. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

4. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Configure database settings
   - Add OpenAI API key
   - Set JWT secret keys

## 🔧 Development

### Available Scripts

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Backend
python manage.py runserver     # Start Django server
python manage.py makemigrations # Create database migrations
python manage.py migrate       # Apply migrations
```

### Key Components

#### Authentication System
- JWT-based authentication
- Role-based access control (Student/Teacher)
- Secure password handling
- Automatic token refresh

#### AI Assistant
- Context-aware conversations
- Subject-specific assistance
- Study plan generation
- Quiz creation and evaluation

#### Course Management
- CRUD operations for courses
- TEKS standard alignment
- Progress tracking
- Multimedia content support

#### Real-time Classrooms
- Live chat functionality
- Collaborative features
- Teacher-student interaction
- Session recording

## 📊 Analytics & Reporting

- Student progress tracking
- Learning pattern analysis
- Performance metrics
- Engagement statistics
- Custom report generation

## 🔒 Security

- JWT token authentication
- Password encryption
- Role-based permissions
- Input validation and sanitization
- CORS configuration
- Rate limiting

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Static files collected
- [ ] SSL certificates installed
- [ ] Domain configured
- [ ] Monitoring tools set up

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🎯 Roadmap

- [ ] Mobile app development
- [ ] Advanced AI features (voice interaction, image recognition)
- [ ] Integration with learning management systems
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Offline learning capabilities

---

**Built with ❤️ for modern education**
