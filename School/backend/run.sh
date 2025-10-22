#!/bin/bash

# OpenEdTex Backend Development Server Script

set -e

echo "🚀 Starting OpenEdTex Backend Development Server"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install/update dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Run migrations
echo "🗄️  Running database migrations..."
python manage.py migrate

# Collect static files
echo "📄 Collecting static files..."
python manage.py collectstatic --noinput

# Start development server
echo "🌐 Starting development server on http://localhost:8000"
echo "📚 API Documentation: http://localhost:8000/swagger/"
echo "🔴 Press Ctrl+C to stop the server"
python manage.py runserver
