#!/bin/bash
# Enterprise Health Monitoring Script for OpenEdTex
# Performs comprehensive health checks for all services and components

set -e

# Configuration
BACKEND_URL="${BACKEND_URL:-http://localhost:8000}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:5173}"
LOG_FILE="${LOG_FILE:-/app/logs/health_check.log}"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Counters
HEALTHY=0
UNHEALTHY=0
WARNINGS=0

# Function to log messages
log() {
    echo "[$TIMESTAMP] $1" >> "$LOG_FILE"
    echo -e "$1"
}

# Function to check HTTP endpoint
check_endpoint() {
    local url=$1
    local expected_code=${2:-200}
    local timeout=${3:-10}
    local service_name=${4:-"HTTP Service"}

    echo -n "Checking $service_name... "

    if curl -s --max-time "$timeout" -o /dev/null -w "%{http_code}" "$url" | grep -q "^$expected_code$"; then
        echo -e "${GREEN}✅ HEALTHY${NC}"
        ((HEALTHY++))
        return 0
    else
        echo -e "${RED}❌ UNHEALTHY${NC}"
        ((UNHEALTHY++))
        return 1
    fi
}

# Function to check database connectivity
check_database() {
    echo -n "Checking Database... "

    if python manage.py dbshell --command="SELECT 1;" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ HEALTHY${NC}"
        ((HEALTHY++))
        return 0
    else
        echo -e "${RED}❌ UNHEALTHY${NC}"
        ((UNHEALTHY++))
        return 1
    fi
}

# Function to check Redis connectivity
check_redis() {
    echo -n "Checking Redis... "

    if python -c "
import os
import redis
from dotenv import load_dotenv
load_dotenv()
redis_url = os.getenv('REDIS_URL', 'redis://127.0.0.1:6379/1')
try:
    client = redis.from_url(redis_url)
    client.ping()
    print('OK')
except Exception as e:
    print('FAIL')
    exit(1)
" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ HEALTHY${NC}"
        ((HEALTHY++))
        return 0
    else
        echo -e "${YELLOW}⚠️  WARNING${NC}"
        ((WARNINGS++))
        return 1
    fi
}

# Function to check SSL certificate
check_ssl() {
    echo -n "Checking SSL Certificate... "

    if [ -f "/app/ssl/certificate.crt" ]; then
        if openssl x509 -in /app/ssl/certificate.crt -noout -checkend 2592000 > /dev/null 2>&1; then
            echo -e "${GREEN}✅ HEALTHY${NC}"
            ((HEALTHY++))
        else
            echo -e "${YELLOW}⚠️  EXPIRES SOON${NC}"
            ((WARNINGS++))
        fi
    else
        echo -e "${YELLOW}⚠️  NOT FOUND${NC}"
        ((WARNINGS++))
    fi
}

# Main health check
echo -e "${BLUE}🏥 OpenEdTex Enterprise Health Check${NC}"
echo "======================================"
log "${GREEN}[INFO]${NC} Starting comprehensive health check..."

# Application Health Checks
echo -e "\n🚀 Application Health:"
echo "----------------------"

check_endpoint "$BACKEND_URL/health/" 200 10 "Backend Health"
check_endpoint "$BACKEND_URL/api/" 200 10 "API Endpoints"
check_endpoint "$FRONTEND_URL" 200 10 "Frontend Application"

# Database Health
echo -e "\n🗄️  Database Health:"
echo "-------------------"

check_database

# Cache Health
echo -e "\n🔄 Cache Health:"
echo "----------------"

check_redis

# SSL Health
echo -e "\n🔒 SSL Health:"
echo "--------------"

check_ssl

# System Resources
echo -e "\n💻 System Resources:"
echo "--------------------"

# CPU Usage
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')
if (( $(echo "$CPU_USAGE < 80" | bc -l) )); then
    echo -e "CPU Usage: ${GREEN}$CPU_USAGE%${NC} ✅"
    ((HEALTHY++))
else
    echo -e "CPU Usage: ${RED}$CPU_USAGE%${NC} ❌ HIGH"
    ((UNHEALTHY++))
fi

# Memory Usage
MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
if [ $MEMORY_USAGE -lt 80 ]; then
    echo -e "Memory Usage: ${GREEN}$MEMORY_USAGE%${NC} ✅"
    ((HEALTHY++))
else
    echo -e "Memory Usage: ${RED}$MEMORY_USAGE%${NC} ❌ HIGH"
    ((UNHEALTHY++))
fi

# Disk Usage
DISK_USAGE=$(df / | grep / | awk '{ print $5}' | sed 's/%//g')
if [ $DISK_USAGE -lt 90 ]; then
    echo -e "Disk Usage: ${GREEN}$DISK_USAGE%${NC} ✅"
    ((HEALTHY++))
else
    echo -e "Disk Usage: ${RED}$DISK_USAGE%${NC} ❌ HIGH"
    ((UNHEALTHY++))
fi

# File System Checks
echo -e "\n💾 File System:"
echo "---------------"

if [ -d "/app/staticfiles" ]; then
    echo -e "Static Files: ${GREEN}Present${NC} ✅"
    ((HEALTHY++))
else
    echo -e "Static Files: ${RED}Missing${NC} ❌"
    ((UNHEALTHY++))
fi

if [ -d "/app/mediafiles" ]; then
    echo -e "Media Files: ${GREEN}Present${NC} ✅"
    ((HEALTHY++))
else
    echo -e "Media Files: ${YELLOW}Missing${NC} ⚠️"
    ((WARNINGS++))
fi

if [ -d "/app/logs" ]; then
    echo -e "Logs Directory: ${GREEN}Present${NC} ✅"
    ((HEALTHY++))
else
    echo -e "Logs Directory: ${YELLOW}Missing${NC} ⚠️"
    ((WARNINGS++))
fi

# Network Connectivity
echo -e "\n🌐 Network Connectivity:"
echo "------------------------"

if curl -s --connect-timeout 5 https://www.google.com > /dev/null; then
    echo -e "Internet: ${GREEN}Connected${NC} ✅"
    ((HEALTHY++))
else
    echo -e "Internet: ${RED}Disconnected${NC} ❌"
    ((UNHEALTHY++))
fi

# Backup Status
echo -e "\n💾 Backup Status:"
echo "-----------------"

if [ -f "/app/backup.sh" ]; then
    LAST_BACKUP=$(find /app/ -name "*.sql.gz" -mtime -1 2>/dev/null | wc -l)
    if [ $LAST_BACKUP -gt 0 ]; then
        echo -e "Recent Backup: ${GREEN}Found${NC} ✅"
        ((HEALTHY++))
    else
        echo -e "Recent Backup: ${YELLOW}Not found in last 24h${NC} ⚠️"
        ((WARNINGS++))
    fi
else
    echo -e "Backup Script: ${RED}Missing${NC} ❌"
    ((UNHEALTHY++))
fi

# Summary
echo -e "\n📈 Health Check Summary:"
echo "========================="
echo -e "✅ Healthy: ${GREEN}$HEALTHY${NC}"
echo -e "❌ Unhealthy: ${RED}$UNHEALTHY${NC}"
echo -e "⚠️  Warnings: ${YELLOW}$WARNINGS${NC}"

TOTAL_CHECKS=$((HEALTHY + UNHEALTHY + WARNINGS))

if [ $UNHEALTHY -eq 0 ]; then
    log "${GREEN}[SUCCESS]${NC} All systems healthy!"
    if [ $WARNINGS -gt 0 ]; then
        log "${YELLOW}[WARNING]${NC} Review warnings for potential improvements."
    fi

    # Send success notification (uncomment and configure)
    # curl -X POST -H 'Content-type: application/json' \
    #      --data '{"text":"✅ OpenEdTex Health Check: All systems healthy"}' \
    #      YOUR_SLACK_WEBHOOK_URL

    exit 0
else
    log "${RED}[FAILURE]${NC} Health issues detected. Address critical issues immediately."

    # Send alert notification (uncomment and configure)
    # curl -X POST -H 'Content-type: application/json' \
    #      --data '{"text":"❌ OpenEdTex Health Check: Issues detected"}' \
    #      YOUR_SLACK_WEBHOOK_URL

    exit 1
fi
