#!/bin/bash

# API Keys Setup Helper Script
# Helps users get their required API keys

echo "================================================"
echo "  AI-Academic-Stack API Keys Setup"
echo "================================================"
echo ""

echo "REQUIRED API Keys:"
echo ""
echo "1. ANTHROPIC API KEY (Primary AI Engine)"
echo "   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   • Powers all AI tutoring and content generation"
echo "   • Get it at: https://console.anthropic.com"
echo "   • Free tier: $5 credit for new users"
echo "   • Steps:"
echo "     1. Sign up at console.anthropic.com"
echo "     2. Navigate to API Keys"
echo "     3. Create new key"
echo "     4. Copy and paste into .env file"
echo ""

echo "OPTIONAL API Keys:"
echo ""
echo "2. OPENAI API KEY (Alternative AI)"
echo "   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   • Get it at: https://platform.openai.com"
echo "   • Provides backup AI capabilities"
echo ""

echo "3. PERPLEXITY API KEY (Research AI)"
echo "   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   • Get it at: https://www.perplexity.ai"
echo "   • Enhanced research capabilities"
echo ""

echo "4. SENDGRID API KEY (Email Service)"
echo "   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   • Get it at: https://sendgrid.com"
echo "   • Free tier: 100 emails/day"
echo "   • For notifications and password resets"
echo ""

echo "5. STRIPE API KEYS (Payments)"
echo "   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   • Get it at: https://stripe.com"
echo "   • Required only for premium features"
echo "   • Use test keys for development"
echo ""

echo "================================================"
echo ""
echo "Current .env file status:"
echo ""

# Check .env file
if [ -f .env ]; then
    echo "✅ .env file exists"
    echo ""
    
    # Check for key placeholders
    if grep -q "placeholder" .env; then
        echo "⚠️  Found placeholder values - need to be replaced:"
        echo ""
        grep "placeholder" .env | sed 's/=.*/=<needs-real-key>/'
    else
        echo "✅ No placeholders found"
    fi
    
    echo ""
    
    # Check for generated secrets
    if grep -q "SESSION_SECRET=" .env && ! grep -q "placeholder" <<< "$(grep SESSION_SECRET .env)"; then
        echo "✅ SESSION_SECRET is set"
    else
        echo "⚠️  SESSION_SECRET needs to be set"
    fi
    
    if grep -q "JWT_SECRET=" .env && ! grep -q "placeholder" <<< "$(grep JWT_SECRET .env)"; then
        echo "✅ JWT_SECRET is set"
    else
        echo "⚠️  JWT_SECRET needs to be set"
    fi
else
    echo "❌ .env file not found"
    echo "   Run: npm run setup:env"
fi

echo ""
echo "================================================"
echo ""
echo "Quick Start (Minimum Required):"
echo "1. Get Anthropic API key → Update ANTHROPIC_API_KEY"
echo "2. Set up database → Update DATABASE_URL"
echo "3. Run: npm run db:push"
echo "4. Run: npm run build"
echo "5. Run: npm start"
echo ""
echo "================================================"
echo ""

# Offer to open URLs
read -p "Open Anthropic Console to get API key? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v "$BROWSER" &> /dev/null; then
        "$BROWSER" "https://console.anthropic.com" &
        echo "✅ Opening Anthropic Console..."
    else
        echo "⚠️  Please manually open: https://console.anthropic.com"
    fi
fi

echo ""
