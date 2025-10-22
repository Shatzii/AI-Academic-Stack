#!/bin/bash
# Enterprise Monitoring Script for OpenEdTex
# Monitors system performance, application metrics, and sends alerts

set -e

# Configuration
MONITOR_INTERVAL="${MONITOR_INTERVAL:-300}"  # 5 minutes default
LOG_FILE="${LOG_FILE:-/app/logs/monitor.log}"
ALERT_LOG="${ALERT_LOG:-/app/logs/alerts.log}"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Thresholds
CPU_THRESHOLD=80
MEMORY_THRESHOLD=80
DISK_THRESHOLD=90
RESPONSE_TIME_THRESHOLD=5000  # milliseconds

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to log messages
log() {
    echo "[$TIMESTAMP] $1" >> "$LOG_FILE"
    echo -e "$1"
}

# Function to log alerts
alert() {
    local level=$1
    local message=$2
    echo "[$TIMESTAMP] [$level] $message" >> "$ALERT_LOG"
    echo -e "[$TIMESTAMP] ${RED}[$level]${NC} $message"
}

# Function to send alert notification
send_alert() {
    local level=$1
    local message=$2

    # Slack notification (uncomment and configure)
    # curl -X POST -H 'Content-type: application/json' \
    #      --data "{\"text\":\"🚨 OpenEdTex $level Alert: $message\"}" \
    #      YOUR_SLACK_WEBHOOK_URL

    # Email notification (uncomment and configure)
    # echo "OpenEdTex $level Alert: $message" | mail -s "OpenEdTex $level Alert" your-email@example.com
}

# Function to monitor CPU usage
monitor_cpu() {
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')

    if (( $(echo "$cpu_usage > $CPU_THRESHOLD" | bc -l) )); then
        alert "CRITICAL" "High CPU usage: ${cpu_usage}% (threshold: ${CPU_THRESHOLD}%)"
        send_alert "CRITICAL" "High CPU usage: ${cpu_usage}%"
    elif (( $(echo "$cpu_usage > 70" | bc -l) )); then
        alert "WARNING" "Elevated CPU usage: ${cpu_usage}%"
    else
        log "CPU usage: ${cpu_usage}% - OK"
    fi
}

# Function to monitor memory usage
monitor_memory() {
    local memory_usage=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')

    if [ $memory_usage -gt $MEMORY_THRESHOLD ]; then
        alert "CRITICAL" "High memory usage: ${memory_usage}% (threshold: ${MEMORY_THRESHOLD}%)"
        send_alert "CRITICAL" "High memory usage: ${memory_usage}%"
    elif [ $memory_usage -gt 70 ]; then
        alert "WARNING" "Elevated memory usage: ${memory_usage}%"
    else
        log "Memory usage: ${memory_usage}% - OK"
    fi
}

# Function to monitor disk usage
monitor_disk() {
    local disk_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//g')

    if [ $disk_usage -gt $DISK_THRESHOLD ]; then
        alert "CRITICAL" "High disk usage: ${disk_usage}% (threshold: ${DISK_THRESHOLD}%)"
        send_alert "CRITICAL" "High disk usage: ${disk_usage}%"
    elif [ $disk_usage -gt 80 ]; then
        alert "WARNING" "Elevated disk usage: ${disk_usage}%"
    else
        log "Disk usage: ${disk_usage}% - OK"
    fi
}

# Function to monitor application response time
monitor_response_time() {
    local url="${BACKEND_URL:-http://localhost:8000}/health/"
    local response_time=$(curl -s -o /dev/null -w "%{time_total}" "$url" | awk '{print $1 * 1000}')

    if (( $(echo "$response_time > $RESPONSE_TIME_THRESHOLD" | bc -l) )); then
        alert "CRITICAL" "Slow response time: ${response_time}ms (threshold: ${RESPONSE_TIME_THRESHOLD}ms)"
        send_alert "CRITICAL" "Slow response time: ${response_time}ms"
    elif (( $(echo "$response_time > 2000" | bc -l) )); then
        alert "WARNING" "Elevated response time: ${response_time}ms"
    else
        log "Response time: ${response_time}ms - OK"
    fi
}

# Function to monitor database connections
monitor_database() {
    if python -c "
import os
import sqlite3
from dotenv import load_dotenv
load_dotenv()

db_path = os.getenv('DATABASE_URL', 'db.sqlite3').replace('sqlite:///', '')
try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute('SELECT COUNT(*) FROM sqlite_master')
    conn.close()
    print('OK')
except Exception as e:
    print('FAIL')
    exit(1)
" > /dev/null 2>&1; then
        log "Database connection: OK"
    else
        alert "CRITICAL" "Database connection failed"
        send_alert "CRITICAL" "Database connection failed"
    fi
}

# Function to monitor Redis connectivity
monitor_redis() {
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
        log "Redis connection: OK"
    else
        alert "WARNING" "Redis connection failed - using fallback cache"
    fi
}

# Function to monitor application logs for errors
monitor_logs() {
    local error_count=$(grep -c "ERROR\|CRITICAL" "$LOG_FILE" 2>/dev/null || echo "0")
    local recent_errors=$(tail -n 50 "$LOG_FILE" 2>/dev/null | grep -c "ERROR\|CRITICAL" || echo "0")

    if [ "$recent_errors" -gt 5 ]; then
        alert "WARNING" "High error rate detected: $recent_errors errors in recent logs"
    fi

    log "Log errors today: $error_count"
}

# Function to monitor SSL certificate expiry
monitor_ssl() {
    if [ -f "/app/ssl/certificate.crt" ]; then
        local days_until_expiry=$(openssl x509 -in /app/ssl/certificate.crt -noout -checkend $((30*24*3600)) > /dev/null 2>&1 && echo "30+" || openssl x509 -in /app/ssl/certificate.crt -noout -enddate | cut -d= -f2 | xargs -I {} date -d {} +%s | awk '{print int(($1 - systime()) / 86400)}')

        if [ "$days_until_expiry" = "30+" ]; then
            log "SSL certificate: OK (expires in more than 30 days)"
        elif [ "$days_until_expiry" -lt 7 ]; then
            alert "CRITICAL" "SSL certificate expires in $days_until_expiry days"
            send_alert "CRITICAL" "SSL certificate expires in $days_until_expiry days"
        elif [ "$days_until_expiry" -lt 30 ]; then
            alert "WARNING" "SSL certificate expires in $days_until_expiry days"
        else
            log "SSL certificate expires in $days_until_expiry days"
        fi
    else
        alert "WARNING" "SSL certificate not found"
    fi
}

# Function to monitor backup status
monitor_backup() {
    local backup_dir="${BACKUP_DIR:-/app/backups}"
    local recent_backup=$(find "$backup_dir" -name "openedtex_backup_*" -type d -mtime -1 2>/dev/null | wc -l)

    if [ "$recent_backup" -eq 0 ]; then
        alert "WARNING" "No recent backup found (last 24 hours)"
    else
        log "Recent backup: Found ($recent_backup backup(s) in last 24 hours)"
    fi
}

# Function to monitor network connectivity
monitor_network() {
    if ping -c 1 -W 5 8.8.8.8 > /dev/null 2>&1; then
        log "Network connectivity: OK"
    else
        alert "CRITICAL" "Network connectivity failed"
        send_alert "CRITICAL" "Network connectivity failed"
    fi
}

# Function to generate monitoring report
generate_report() {
    local report_file="/app/logs/monitoring_report_$(date '+%Y%m%d').txt"

    cat > "$report_file" << EOF
OpenEdTex Monitoring Report
===========================
Generated: $(date)

System Metrics:
- CPU Usage: $(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')%
- Memory Usage: $(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')%
- Disk Usage: $(df / | tail -1 | awk '{print $5}')

Application Metrics:
- Response Time: $(curl -s -o /dev/null -w "%{time_total}" "${BACKEND_URL:-http://localhost:8000}/health/" | awk '{print $1 * 1000}')ms
- Database: $(python -c "import sqlite3; sqlite3.connect('backend/db.sqlite3').close(); print('Connected')" 2>/dev/null && echo "OK" || echo "FAIL")
- Redis: $(python -c "import redis; redis.from_url('${REDIS_URL:-redis://127.0.0.1:6379/1}').ping(); print('OK')" 2>/dev/null && echo "OK" || echo "FAIL")

Recent Alerts:
$(tail -n 10 "$ALERT_LOG" 2>/dev/null || echo "No recent alerts")

Log Summary:
- Total errors today: $(grep -c "ERROR\|CRITICAL" "$LOG_FILE" 2>/dev/null || echo "0")
- Total warnings today: $(grep -c "WARNING" "$LOG_FILE" 2>/dev/null || echo "0")
EOF

    log "Monitoring report generated: $report_file"
}

# Main monitoring loop
echo -e "${BLUE}📊 OpenEdTex Enterprise Monitoring${NC}"
echo "====================================="
log "${GREEN}[INFO]${NC} Starting monitoring service..."

# Create log directories if they don't exist
mkdir -p "$(dirname "$LOG_FILE")"
mkdir -p "$(dirname "$ALERT_LOG")"

# Continuous monitoring loop
while true; do
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

    echo -e "\n${BLUE}🔍 Monitoring Cycle - $TIMESTAMP${NC}"
    echo "====================================="

    # Run all monitoring checks
    monitor_cpu
    monitor_memory
    monitor_disk
    monitor_response_time
    monitor_database
    monitor_redis
    monitor_logs
    monitor_ssl
    monitor_backup
    monitor_network

    # Generate daily report at midnight
    if [ "$(date '+%H%M')" = "0000" ]; then
        generate_report
    fi

    echo -e "${GREEN}✅ Monitoring cycle completed${NC}"

    # Wait for next monitoring interval
    sleep "$MONITOR_INTERVAL"
done
