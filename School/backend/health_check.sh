#!/bin/bash
# Health monitoring script for OpenEdTex
# Run this script periodically to check application health

set -e

# Configuration
BACKEND_URL="${BACKEND_URL:-http://localhost:8000}"
LOG_FILE="/app/logs/health_check.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

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

    if curl -s --max-time "$timeout" -o /dev/null -w "%{http_code}" "$url" | grep -q "^$expected_code$"; then
        return 0
    else
        return 1
    fi
}

# Function to check database connectivity
check_database() {
    python manage.py dbshell --command="SELECT 1;" > /dev/null 2>&1
}

# Function to check Redis connectivity
check_redis() {
    python -c "
import os
import redis
from dotenv import load_dotenv
load_dotenv()
redis_url = os.getenv('REDIS_URL', 'redis://127.0.0.1:6379/1')
try:
    client = redis.from_url(redis_url)
    client.ping()
    print('OK')
except:
    print('FAIL')
    exit(1)
" > /dev/null 2>&1
}

# Main health check
log "${GREEN}[INFO]${NC} Starting health check..."

# Check backend health endpoint
if check_endpoint "$BACKEND_URL/health/"; then
    log "${GREEN}[OK]${NC} Backend health check passed"
else
    log "${RED}[FAIL]${NC} Backend health check failed"
    exit 1
fi

# Check API endpoints
if check_endpoint "$BACKEND_URL/api/auth/login/"; then
    log "${GREEN}[OK]${NC} API endpoints accessible"
else
    log "${YELLOW}[WARN]${NC} API endpoints not accessible"
fi

# Check database connectivity
if check_database; then
    log "${GREEN}[OK]${NC} Database connection healthy"
else
    log "${RED}[FAIL]${NC} Database connection failed"
    exit 1
fi

# Check Redis connectivity
if check_redis; then
    log "${GREEN}[OK]${NC} Redis connection healthy"
else
    log "${YELLOW}[WARN]${NC} Redis connection failed - using fallback cache"
fi

# Check disk space
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 90 ]; then
    log "${RED}[FAIL]${NC} Disk usage is ${DISK_USAGE}% - consider cleanup"
    exit 1
elif [ "$DISK_USAGE" -gt 80 ]; then
    log "${YELLOW}[WARN]${NC} Disk usage is ${DISK_USAGE}%"
else
    log "${GREEN}[OK]${NC} Disk usage is ${DISK_USAGE}%"
fi

# Check memory usage
MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
if [ "$MEMORY_USAGE" -gt 90 ]; then
    log "${RED}[FAIL]${NC} Memory usage is ${MEMORY_USAGE}% - consider optimization"
    exit 1
elif [ "$MEMORY_USAGE" -gt 80 ]; then
    log "${YELLOW}[WARN]${NC} Memory usage is ${MEMORY_USAGE}%"
else
    log "${GREEN}[OK]${NC} Memory usage is ${MEMORY_USAGE}%"
fi

log "${GREEN}[INFO]${NC} Health check completed successfully"

# Send alert if configured (you can integrate with your monitoring system)
# curl -X POST -H 'Content-type: application/json' \
#      --data '{"text":"OpenEdTex health check failed"}' \
#      YOUR_SLACK_WEBHOOK_URL
