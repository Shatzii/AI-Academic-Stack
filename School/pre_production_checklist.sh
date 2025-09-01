#!/bin/bash
# Pre-Production Checklist Script for OpenEdTex
# Validates all production readiness requirements

set -e

# Configuration
LOG_FILE="${LOG_FILE:-logs/pre_production_check.log}"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Counters
PASSED=0
FAILED=0
WARNINGS=0
TOTAL_CHECKS=0

# Function to log messages
log() {
    echo "[$TIMESTAMP] $1" >> "$LOG_FILE"
    echo -e "$1"
}

# Function to check item
check_item() {
    local description=$1
    local command=$2
    local required=${3:-true}

    ((TOTAL_CHECKS++))
    echo -n "Checking: $description... "

    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASSED${NC}"
        ((PASSED++))
        return 0
    else
        if [ "$required" = true ]; then
            echo -e "${RED}❌ FAILED${NC}"
            ((FAILED++))
            return 1
        else
            echo -e "${YELLOW}⚠️  WARNING${NC}"
            ((WARNINGS++))
            return 0
        fi
    fi
}

# Function to check file exists
check_file() {
    local file=$1
    local description=$2
    local required=${3:-true}

    check_item "$description" "test -f '$file'" "$required"
}

# Function to check directory exists
check_directory() {
    local dir=$1
    local description=$2
    local required=${3:-true}

    check_item "$description" "test -d '$dir'" "$required"
}

# Function to check command exists
check_command() {
    local cmd=$1
    local description=$2
    local required=${3:-true}

    check_item "$description" "command -v '$cmd' > /dev/null" "$required"
}

# Function to check environment variable
check_env_var() {
    local var=$1
    local description=$2
    local required=${3:-true}

    check_item "$description" "test -n \"\$$var\"" "$required"
}

# Function to check service running
check_service() {
    local service=$1
    local description=$2
    local required=${3:-true}

    check_item "$description" "pgrep -f '$service' > /dev/null" "$required"
}

# Function to check HTTP endpoint
check_http_endpoint() {
    local url=$1
    local expected_code=${2:-200}
    local description=$3
    local required=${4:-true}

    check_item "$description" "curl -s --max-time 10 -o /dev/null -w '%{http_code}' '$url' | grep -q '^$expected_code$'" "$required"
}

# Main pre-production checklist
echo -e "${BLUE}🚀 OpenEdTex Pre-Production Checklist${NC}"
echo "========================================"
log "${GREEN}[INFO]${NC} Starting pre-production validation..."

# 1. Environment Configuration
echo -e "\n${BLUE}1. Environment Configuration${NC}"
echo "-------------------------------"

check_file ".env" "Environment configuration file exists"
check_env_var "SECRET_KEY" "Django SECRET_KEY is set"
check_env_var "DEBUG" "DEBUG mode is configured"
check_env_var "DATABASE_URL" "Database URL is configured"
check_env_var "REDIS_URL" "Redis URL is configured"
check_env_var "ALLOWED_HOSTS" "ALLOWED_HOSTS is configured"

# 2. Security Configuration
echo -e "\n${BLUE}2. Security Configuration${NC}"
echo "--------------------------"

check_directory "ssl" "SSL certificates directory exists"
check_file "ssl/certificate.crt" "SSL certificate exists"
check_file "ssl/private.key" "SSL private key exists"
check_command "openssl" "OpenSSL is installed"
check_item "SSL certificate is valid" "openssl x509 -in ssl/certificate.crt -noout -checkend 0" true

# 3. Database Configuration
echo -e "\n${BLUE}3. Database Configuration${NC}"
echo "----------------------------"

check_file "backend/db.sqlite3" "Database file exists"
check_command "sqlite3" "SQLite3 is installed"
check_item "Database is accessible" "python -c \"import sqlite3; sqlite3.connect('backend/db.sqlite3').close()\"" true

# 4. Application Files
echo -e "\n${BLUE}4. Application Files${NC}"
echo "---------------------"

check_file "backend/manage.py" "Django manage.py exists"
check_file "backend/settings.py" "Django settings.py exists"
check_file "package.json" "Frontend package.json exists"
check_file "vite.config.js" "Vite configuration exists"
check_file "docker-compose.yml" "Docker Compose configuration exists"
check_file "backend/Dockerfile" "Backend Dockerfile exists"
check_file "frontend.Dockerfile" "Frontend Dockerfile exists"

# 5. Dependencies
echo -e "\n${BLUE}5. Dependencies${NC}"
echo "----------------"

check_file "backend/requirements.txt" "Python requirements.txt exists"
check_command "python" "Python is installed"
check_command "pip" "Pip is installed"
check_command "node" "Node.js is installed"
check_command "npm" "NPM is installed"
check_command "docker" "Docker is installed"
check_command "docker-compose" "Docker Compose is installed"

# 6. Build and Static Files
echo -e "\n${BLUE}6. Build and Static Files${NC}"
echo "----------------------------"

check_directory "backend/staticfiles" "Static files directory exists" false
check_directory "backend/mediafiles" "Media files directory exists" false
check_directory "public" "Public assets directory exists"

# 7. Logging and Monitoring
echo -e "\n${BLUE}7. Logging and Monitoring${NC}"
echo "----------------------------"

check_directory "logs" "Logs directory exists"
check_file "backend/health_check.sh" "Health check script exists"
check_file "backend/backup.sh" "Backup script exists"
check_file "backend/monitor.sh" "Monitoring script exists"
check_file "backend/security_audit.sh" "Security audit script exists"

# 8. Network Configuration
echo -e "\n${BLUE}8. Network Configuration${NC}"
echo "--------------------------"

check_file "backend/nginx.conf" "Nginx configuration exists"
check_command "nginx" "Nginx is installed" false
check_http_endpoint "http://localhost:8000/health/" 200 "Backend health endpoint" false
check_http_endpoint "http://localhost:5173" 200 "Frontend application" false

# 9. Backup and Recovery
echo -e "\n${BLUE}9. Backup and Recovery${NC}"
echo "-----------------------"

check_directory "backups" "Backup directory exists" false
check_file "backend/backup.sh" "Backup script is executable" false
check_item "Backup script is executable" "test -x backend/backup.sh" false

# 10. Documentation
echo -e "\n${BLUE}10. Documentation${NC}"
echo "-----------------"

check_file "README.md" "README.md exists"
check_file "SECRETS.md" "Security documentation exists" false
check_file "STUDENT_ID_SYSTEM_README.md" "Student ID system documentation exists" false
check_file "SITE_OVERVIEW.md" "Site overview documentation exists" false

# 11. Scripts and Automation
echo -e "\n${BLUE}11. Scripts and Automation${NC}"
echo "-----------------------------"

check_file "automate_project.sh" "Project automation script exists" false
check_file "setup_secrets.sh" "Secrets setup script exists" false
check_file "security_audit.sh" "Security audit script exists" false
check_file "optimize-build.js" "Build optimization script exists" false

# 12. Development Tools
echo -e "\n${BLUE}12. Development Tools${NC}"
echo "-----------------------"

check_command "git" "Git is installed"
check_item "Git repository is initialized" "test -d .git" false
check_file "/app/.gitignore" "Git ignore file exists" false

# 13. Testing Configuration
echo -e "\n${BLUE}13. Testing Configuration${NC}"
echo "---------------------------"

check_file "backend/test-deployment.sh" "Deployment test script exists" false
check_command "pytest" "Pytest is installed" false
check_command "jest" "Jest is installed" false

# 14. Performance and Optimization
echo -e "\n${BLUE}14. Performance and Optimization${NC}"
echo "-----------------------------------"

check_file "/app/vite.config.js" "Vite build configuration exists"
check_file "/app/backend/Dockerfile" "Optimized Dockerfile exists"
check_file "docker-compose.prod.yml" "Production Docker Compose exists" false

# 15. Compliance and Security
echo -e "\n${BLUE}15. Compliance and Security${NC}"
echo "-----------------------------"

check_file "backend/security_config.py" "Security configuration exists" false
check_file "backend/secrets_manager.py" "Secrets manager exists" false
check_file "backend/secrets_validator.py" "Secrets validator exists" false

# Summary
echo -e "\n${BLUE}📊 Pre-Production Checklist Summary${NC}"
echo "======================================"
echo -e "Total Checks: ${TOTAL_CHECKS}"
echo -e "✅ Passed: ${GREEN}${PASSED}${NC}"
echo -e "❌ Failed: ${RED}${FAILED}${NC}"
echo -e "⚠️  Warnings: ${YELLOW}${WARNINGS}${NC}"

SUCCESS_RATE=$(( (PASSED * 100) / TOTAL_CHECKS ))

if [ $FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All critical checks passed! Ready for production.${NC}"
    log "${GREEN}[SUCCESS]${NC} Pre-production checklist completed successfully"

    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠️  Review warnings for optional improvements.${NC}"
    fi

    # Send success notification (uncomment and configure)
    # curl -X POST -H 'Content-type: application/json' \
    #      --data '{"text":"✅ OpenEdTex Pre-Production Checklist: All checks passed!"}' \
    #      YOUR_SLACK_WEBHOOK_URL

    exit 0
else
    echo -e "\n${RED}❌ Critical issues found. Address failed checks before production deployment.${NC}"
    log "${RED}[FAILURE]${NC} Pre-production checklist failed with $FAILED critical issues"

    # Send failure notification (uncomment and configure)
    # curl -X POST -H 'Content-type: application/json' \
    #      --data '{"text":"❌ OpenEdTex Pre-Production Checklist: Issues found"}' \
    #      YOUR_SLACK_WEBHOOK_URL

    exit 1
fi
