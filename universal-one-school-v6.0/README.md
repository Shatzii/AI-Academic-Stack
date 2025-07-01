# 🏫 Universal One School - Revolutionary AI-Powered Education Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.3-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![AI Powered](https://img.shields.io/badge/AI-Powered-green?logo=openai)](https://platform.openai.com/)

A revolutionary educational platform featuring **5 specialized schools** with AI-powered personalized learning, neurodivergent support, and global campus operations. Serving 1,999+ students across Dallas, Vienna, and hybrid international programs.

## 🌟 Latest Features (June 29, 2025)

### Interactive Landing Page Enhancements
- **🎯 Interactive School Filtering**: Real-time filtering by K-12, Higher Education, Athletic, and Neurodivergent Support
- **📊 Expandable School Comparison**: Comprehensive table with tuition, specializations, AI agents, and locations
- **⭐ Success Stories**: Real testimonials from Marcus (SuperHero), Sofia (S.T.A.G.E Prep), and Alex (Go4it Sports)
- **🌍 Global Campus Network**: Interactive showcase of all campus locations with statistics
- **🚀 Quick Enrollment Flow**: 4-step process with AI assessment and personalized matching
- **✨ JavaScript Interactivity**: Smooth animations, parallax effects, and responsive design

### Go4it Sports Academy Integration
- **🏆 Elite Athletic Education**: $95M Vienna campus with 800 student capacity
- **🤖 Coach Elite AI**: Specialized coaching for athletic and academic performance
- **🏟️ Residential Facilities**: Complete integration with international sports programs
- **🌐 Global Sports Network**: International partnerships and Division I recruitment

## 🏫 Our Five Schools

| School | Ages | Focus | AI Agent | Tuition | Campus |
|--------|------|-------|----------|---------|---------|
| 🦸 **SuperHero School** | K-6 | Neurodivergent Support | Dean Wonder | $2,500 | Dallas, TX |
| 🎭 **S.T.A.G.E Prep** | 7-12 | Executive Function | Dean Sterling | $2,500 | Dallas, TX |
| ⚖️ **Law School** | 18+ | Legal Education | Professor Barrett | $3,500 | Online + Dallas |
| 🌍 **LIOTA Language** | All Ages | Multilingual | Professor Lingua | $2,800 | Global Network |
| 🏆 **Go4it Sports Academy** | 14-18 | Athletic Excellence | Coach Elite | $4,500 | Vienna, Austria |

## 🌍 Global Operations

### Campus Network
- **Dallas, Texas**: 687 projected students across Primary & Secondary schools
- **Vienna, Austria**: $95M elite sports facility with 800 student capacity
- **Merida, Mexico**: 312 students in bilingual hybrid programs
- **Vienna Partnerships**: 1,000+ students in after-hours programs

### Student Categories
- **On-Site ($2,500/semester)**: Full campus access with in-person classes
- **Online Premium ($1,800/semester)**: Live teacher interaction and full features
- **Online Free ($0)**: Limited AI tools and recorded content
- **Hybrid ($2,000/semester)**: Flexible on-site/online combination

## 🤖 AI-Powered Education

### Specialized AI Agents
1. **Dean Wonder** - Gamified learning for K-6 with ADHD support
2. **Dean Sterling** - Executive function support for grades 7-12
3. **Professor Barrett** - Legal education and bar exam preparation
4. **Professor Lingua** - Multilingual education with cultural immersion
5. **Coach Elite** - Athletic performance and academic integration

### Advanced Features
- **Real-time Difficulty Adjustment**: AI adapts content based on performance
- **Neurodivergent Accommodations**: Specialized support for ADHD, dyslexia, autism
- **Predictive Analytics**: Early intervention and personalized recommendations
- **Virtual Classroom Hub**: Live AI-enhanced collaborative learning sessions

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- PostgreSQL (optional - uses in-memory storage by default)
- AI service API keys

### Installation
```bash
git clone https://github.com/yourusername/universal-one-school.git
cd universal-one-school
npm install
npm run dev
```

### Environment Variables
```env
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key
PERPLEXITY_API_KEY=your_perplexity_key
DATABASE_URL=your_postgres_url (optional)
SESSION_SECRET=your_session_secret
```

## 💻 Tech Stack

- **Frontend**: Next.js 15.3, React 18, TypeScript 5.6
- **Styling**: Tailwind CSS 3.4, shadcn/ui components
- **Backend**: Express.js with Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: Anthropic Claude 4.0, OpenAI GPT-4o, Perplexity
- **Deployment**: Vercel, Docker, or self-hosted options

## 🏗️ Architecture

### School Structure
```
app/
├── page.tsx                 # Interactive landing page
├── schools/
│   ├── primary-school/      # SuperHero School (K-6)
│   ├── secondary-school/    # S.T.A.G.E Prep (7-12)
│   └── law-school/         # Legal Education
├── go4it-academy/          # Elite Sports Academy
├── global-language/        # LIOTA Language School
├── virtual-classroom/      # Live AI sessions
├── student-dashboard/      # Learning interface
└── campus-3d-model/       # Vienna campus tour
```

### Key Features
- **Progressive Server Loading**: Handles hosting timeouts with immediate port binding
- **Hybrid Architecture**: Multiple server strategies for reliable deployment
- **Real-time Interactivity**: JavaScript-powered animations and filtering
- **Responsive Design**: Mobile-first approach with accessibility features
- **Deployment**: PM2, Nginx, SSL with Let's Encrypt

## Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL 13+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone git@github.com:Shatzii/ShatziiEDU.git
cd ShatziiEDU
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Set up the database:
```bash
npm run db:push
node database-setup.js
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`.

## Deployment

### Production Deployment

1. Use the deployment script:
```bash
chmod +x deploy-to-schools-shatzii.sh
./deploy-to-schools-shatzii.sh
```

2. Or deploy manually:
```bash
npm run build
npm start
```

### Environment Variables

Create a `.env.production` file with:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/database
SESSION_SECRET=your-secure-session-secret
ANTHROPIC_API_KEY=your-anthropic-api-key
DOMAIN=your-domain.com
```

## Project Structure

```
├── app/                    # Next.js app directory
├── components/             # React components
├── server/                 # Custom server configuration
├── lib/                    # Utility libraries
├── public/                 # Static assets
├── styles/                 # CSS styles
├── api/                    # API routes
├── hooks/                  # Custom React hooks
├── data/                   # Static data files
├── docs/                   # Documentation
└── scripts/                # Build and deployment scripts
```

## API Documentation

### Education APIs

- `/api/curriculum` - Curriculum management
- `/api/progress` - Student progress tracking
- `/api/ai-tutor` - AI tutoring interactions
- `/api/assessments` - Assessment and testing

### User Management

- `/api/auth` - Authentication and authorization
- `/api/users` - User management
- `/api/schools` - School administration

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For support, email admin@shatzii.com or create an issue in this repository.

## Deployment Status

- **Production**: https://schools.shatzii.com
- **Status**: Active
- **Last Updated**: $(date '+%Y-%m-%d %H:%M:%S')
