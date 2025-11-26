#!/bin/bash

# Pre-flight Check Script
# Validates environment setup before running the application

echo "================================================"
echo "  AI-Academic-Stack Pre-flight Checks"
echo "================================================"
echo ""

ERRORS=0
WARNINGS=0

# Check 1: .env file exists
echo "Checking environment configuration..."
if [ -f .env ]; then
    echo "  ✅ .env file exists"
else
    echo "  ❌ .env file not found"
    echo "     Run: cp .env.example .env (if available)"
    ((ERRORS++))
fi
echo ""

# Check 2: Required environment variables
if [ -f .env ]; then
    source .env
    
    echo "Checking required environment variables..."
    
    # DATABASE_URL
    if [ -z "$DATABASE_URL" ]; then
        echo "  ❌ DATABASE_URL is not set"
        ((ERRORS++))
    elif [[ "$DATABASE_URL" == *"placeholder"* ]]; then
        echo "  ⚠️  DATABASE_URL contains placeholder value"
        echo "     Update with real database connection string"
        ((WARNINGS++))
    else
        echo "  ✅ DATABASE_URL is configured"
    fi
    
    # ANTHROPIC_API_KEY
    if [ -z "$ANTHROPIC_API_KEY" ]; then
        echo "  ❌ ANTHROPIC_API_KEY is not set"
        ((ERRORS++))
    elif [[ "$ANTHROPIC_API_KEY" == *"placeholder"* ]]; then
        echo "  ⚠️  ANTHROPIC_API_KEY contains placeholder value"
        echo "     Update with real API key from console.anthropic.com"
        ((WARNINGS++))
    else
        echo "  ✅ ANTHROPIC_API_KEY is configured"
    fi
    
    # SESSION_SECRET
    if [ -z "$SESSION_SECRET" ]; then
        echo "  ❌ SESSION_SECRET is not set"
        ((ERRORS++))
    else
        echo "  ✅ SESSION_SECRET is configured"
    fi
    
    # JWT_SECRET
    if [ -z "$JWT_SECRET" ]; then
        echo "  ❌ JWT_SECRET is not set"
        ((ERRORS++))
    else
        echo "  ✅ JWT_SECRET is configured"
    fi
fi
echo ""

# Check 3: Node modules installed
echo "Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "  ✅ node_modules directory exists"
else
    echo "  ⚠️  node_modules not found"
    echo "     Run: npm install"
    ((WARNINGS++))
fi
echo ""

# Check 4: Build artifacts
echo "Checking build artifacts..."
if [ -d "dist" ] && [ -f "dist/index.js" ]; then
    echo "  ✅ Build artifacts found"
else
    echo "  ⚠️  Build artifacts not found"
    echo "     Run: npm run build"
    ((WARNINGS++))
fi
echo ""

# Check 5: Port availability
echo "Checking port availability..."
PORT=${PORT:-5000}
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "  ⚠️  Port $PORT is already in use"
    echo "     Stop the service or change PORT in .env"
    ((WARNINGS++))
else
    echo "  ✅ Port $PORT is available"
fi
echo ""

# Check 6: Database connectivity (if DATABASE_URL is set and valid)
if [ -f .env ]; then
    source .env
    if [ ! -z "$DATABASE_URL" ] && [[ "$DATABASE_URL" != *"placeholder"* ]]; then
        echo "Checking database connectivity..."
        # Try a simple node script to test connection
        node -e "
        import('pg').then(({ default: pg }) => {
            const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
            client.connect()
                .then(() => {
                    console.log('  ✅ Database connection successful');
                    client.end();
                    process.exit(0);
                })
                .catch(err => {
                    console.log('  ❌ Database connection failed:', err.message);
                    process.exit(1);
                });
        });
        " 2>/dev/null || echo "  ⚠️  Unable to verify database connection"
        echo ""
    fi
fi

# Summary
echo "================================================"
echo "  Pre-flight Check Summary"
echo "================================================"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo "✅ All checks passed!"
    echo ""
    echo "You're ready to start the application:"
    echo "  npm run dev     # Development mode"
    echo "  npm start       # Production mode"
    echo ""
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo "⚠️  $WARNINGS warning(s) found"
    echo ""
    echo "The application may run with reduced functionality."
    echo "Review warnings above and fix as needed."
    echo ""
    exit 0
else
    echo "❌ $ERRORS error(s) found"
    echo "⚠️  $WARNINGS warning(s) found"
    echo ""
    echo "Please fix the errors above before starting the application."
    echo ""
    echo "Need help?"
    echo "  • Read: SETUP-COMPLETE.md"
    echo "  • Read: .env.setup-guide.md"
    echo "  • Run: npm run setup:database"
    echo "  • Run: npm run setup:api-keys"
    echo ""
    exit 1
fi
