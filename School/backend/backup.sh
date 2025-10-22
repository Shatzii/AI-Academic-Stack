#!/bin/bash
# Enterprise Backup Script for OpenEdTex
# Performs comprehensive backups of database, files, and configurations

set -e

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/app/backups}"
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
BACKUP_NAME="openedtex_backup_$TIMESTAMP"
LOG_FILE="${LOG_FILE:-/app/logs/backup.log}"

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

# Function to create directory if it doesn't exist
ensure_dir() {
    local dir=$1
    if [ ! -d "$dir" ]; then
        mkdir -p "$dir"
        log "${GREEN}[INFO]${NC} Created directory: $dir"
    fi
}

# Function to backup SQLite database
backup_database() {
    log "${BLUE}[INFO]${NC} Starting SQLite database backup..."

    local db_file="/app/backend/db.sqlite3"
    local db_backup_file="$BACKUP_DIR/$BACKUP_NAME/database.sqlite.gz"

    if [ -f "$db_file" ]; then
        if sqlite3 "$db_file" ".backup '$BACKUP_DIR/$BACKUP_NAME/database.sqlite'" && gzip "$BACKUP_DIR/$BACKUP_NAME/database.sqlite"; then
            log "${GREEN}[SUCCESS]${NC} Database backup completed: $db_backup_file"
            return 0
        else
            log "${RED}[ERROR]${NC} Database backup failed"
            return 1
        fi
    else
        log "${YELLOW}[WARNING]${NC} Database file not found: $db_file"
        return 1
    fi
}

# Function to backup media files
backup_media() {
    log "${BLUE}[INFO]${NC} Starting media files backup..."

    local media_backup_file="$BACKUP_DIR/$BACKUP_NAME/media.tar.gz"

    if [ -d "/app/backend/mediafiles" ]; then
        if tar -czf "$media_backup_file" -C /app/backend mediafiles/; then
            log "${GREEN}[SUCCESS]${NC} Media files backup completed: $media_backup_file"
            return 0
        else
            log "${RED}[ERROR]${NC} Media files backup failed"
            return 1
        fi
    else
        log "${YELLOW}[WARNING]${NC} Media files directory not found, skipping..."
        return 0
    fi
}

# Function to backup static files
backup_static() {
    log "${BLUE}[INFO]${NC} Starting static files backup..."

    local static_backup_file="$BACKUP_DIR/$BACKUP_NAME/static.tar.gz"

    if [ -d "/app/backend/staticfiles" ]; then
        if tar -czf "$static_backup_file" -C /app/backend staticfiles/; then
            log "${GREEN}[SUCCESS]${NC} Static files backup completed: $static_backup_file"
            return 0
        else
            log "${RED}[ERROR]${NC} Static files backup failed"
            return 1
        fi
    else
        log "${YELLOW}[WARNING]${NC} Static files directory not found, skipping..."
        return 0
    fi
}

# Function to backup configuration files
backup_config() {
    log "${BLUE}[INFO]${NC} Starting configuration backup..."

    local config_backup_file="$BACKUP_DIR/$BACKUP_NAME/config.tar.gz"

    # Create temporary directory for config files
    local temp_dir=$(mktemp -d)
    local config_list=(
        ".env"
        "docker-compose.yml"
        "docker-compose.prod.yml"
        "backend/nginx.conf"
        "backend/settings.py"
        "backend/requirements.txt"
        "package.json"
        "vite.config.js"
    )

    # Copy config files to temp directory
    for file in "${config_list[@]}"; do
        if [ -f "/app/$file" ]; then
            mkdir -p "$temp_dir/$(dirname "$file")"
            cp "/app/$file" "$temp_dir/$file"
        fi
    done

    if tar -czf "$config_backup_file" -C "$temp_dir" .; then
        log "${GREEN}[SUCCESS]${NC} Configuration backup completed: $config_backup_file"
        rm -rf "$temp_dir"
        return 0
    else
        log "${RED}[ERROR]${NC} Configuration backup failed"
        rm -rf "$temp_dir"
        return 1
    fi
}

# Function to backup SSL certificates
backup_ssl() {
    log "${BLUE}[INFO]${NC} Starting SSL certificates backup..."

    local ssl_backup_file="$BACKUP_DIR/$BACKUP_NAME/ssl.tar.gz"

    if [ -d "/app/ssl" ]; then
        if tar -czf "$ssl_backup_file" -C /app ssl/; then
            log "${GREEN}[SUCCESS]${NC} SSL certificates backup completed: $ssl_backup_file"
            return 0
        else
            log "${RED}[ERROR]${NC} SSL certificates backup failed"
            return 1
        fi
    else
        log "${YELLOW}[WARNING]${NC} SSL directory not found, skipping..."
        return 0
    fi
}

# Function to create backup manifest
create_manifest() {
    log "${BLUE}[INFO]${NC} Creating backup manifest..."

    local manifest_file="$BACKUP_DIR/$BACKUP_NAME/manifest.txt"

    cat > "$manifest_file" << EOF
OpenEdTex Backup Manifest
=========================
Backup Date: $(date)
Backup Name: $BACKUP_NAME
Server: $(hostname)
User: $(whoami)

Components Backed Up:
- Database: $([ -f "$BACKUP_DIR/$BACKUP_NAME/database.sqlite.gz" ] && echo "Yes" || echo "No")
- Media Files: $([ -f "$BACKUP_DIR/$BACKUP_NAME/media.tar.gz" ] && echo "Yes" || echo "No")
- Static Files: $([ -f "$BACKUP_DIR/$BACKUP_NAME/static.tar.gz" ] && echo "Yes" || echo "No")
- Configuration: $([ -f "$BACKUP_DIR/$BACKUP_NAME/config.tar.gz" ] && echo "Yes" || echo "No")
- SSL Certificates: $([ -f "$BACKUP_DIR/$BACKUP_NAME/ssl.tar.gz" ] && echo "Yes" || echo "No")

Backup Sizes:
$(du -sh "$BACKUP_DIR/$BACKUP_NAME"/* 2>/dev/null || echo "Unable to calculate sizes")

System Information:
- OS: $(uname -s) $(uname -r)
- Python: $(python --version 2>&1)
- SQLite: $(sqlite3 --version 2>&1 | head -1)

Notes:
- This backup was created automatically by the OpenEdTex backup script
- Verify backup integrity before relying on it for disaster recovery
EOF

    log "${GREEN}[SUCCESS]${NC} Backup manifest created: $manifest_file"
}

# Function to cleanup old backups
cleanup_old_backups() {
    log "${BLUE}[INFO]${NC} Cleaning up old backups..."

    # Keep only the last 7 daily backups and last 4 weekly backups
    local daily_backups=$(find "$BACKUP_DIR" -name "openedtex_backup_*" -type d -mtime +7 | wc -l)
    local weekly_backups=$(find "$BACKUP_DIR" -name "openedtex_backup_*" -type d -mtime +28 | wc -l)

    if [ "$daily_backups" -gt 0 ]; then
        find "$BACKUP_DIR" -name "openedtex_backup_*" -type d -mtime +7 -exec rm -rf {} + 2>/dev/null || true
        log "${GREEN}[INFO]${NC} Cleaned up $daily_backups old daily backups"
    fi

    if [ "$weekly_backups" -gt 0 ]; then
        find "$BACKUP_DIR" -name "openedtex_backup_*" -type d -mtime +28 -exec rm -rf {} + 2>/dev/null || true
        log "${GREEN}[INFO]${NC} Cleaned up $weekly_backups old weekly backups"
    fi
}

# Function to verify backup integrity
verify_backup() {
    log "${BLUE}[INFO]${NC} Verifying backup integrity..."

    local errors=0

    # Check if backup files exist and are not empty
    for file in "$BACKUP_DIR/$BACKUP_NAME"/*; do
        if [ -f "$file" ]; then
            if [ ! -s "$file" ]; then
                log "${RED}[ERROR]${NC} Backup file is empty: $file"
                ((errors++))
            else
                log "${GREEN}[OK]${NC} Backup file verified: $(basename "$file") ($(du -h "$file" | cut -f1))"
            fi
        fi
    done

    if [ $errors -eq 0 ]; then
        log "${GREEN}[SUCCESS]${NC} All backup files verified successfully"
        return 0
    else
        log "${RED}[ERROR]${NC} Backup verification failed with $errors errors"
        return 1
    fi
}

# Function to send notification
send_notification() {
    local status=$1
    local message=$2

    # Slack notification (uncomment and configure)
    # if [ "$status" = "success" ]; then
    #     curl -X POST -H 'Content-type: application/json' \
    #          --data "{\"text\":\"✅ OpenEdTex Backup Completed: $message\"}" \
    #          YOUR_SLACK_WEBHOOK_URL
    # else
    #     curl -X POST -H 'Content-type: application/json' \
    #          --data "{\"text\":\"❌ OpenEdTex Backup Failed: $message\"}" \
    #          YOUR_SLACK_WEBHOOK_URL
    # fi

    # Email notification (uncomment and configure)
    # echo "$message" | mail -s "OpenEdTex Backup $status" your-email@example.com
}

# Main backup process
echo -e "${BLUE}💾 OpenEdTex Enterprise Backup${NC}"
echo "==============================="
log "${GREEN}[INFO]${NC} Starting enterprise backup process..."

# Ensure backup directory exists
ensure_dir "$BACKUP_DIR"
ensure_dir "$BACKUP_DIR/$BACKUP_NAME"

# Perform backups
backup_database
backup_media
backup_static
backup_config
backup_ssl

# Create manifest
create_manifest

# Verify backup
if verify_backup; then
    log "${GREEN}[SUCCESS]${NC} Backup completed successfully"

    # Calculate backup size
    BACKUP_SIZE=$(du -sh "$BACKUP_DIR/$BACKUP_NAME" | cut -f1)
    log "${GREEN}[INFO]${NC} Total backup size: $BACKUP_SIZE"

    # Send success notification
    send_notification "success" "Backup completed successfully. Size: $BACKUP_SIZE"

    # Cleanup old backups
    cleanup_old_backups

    echo -e "${GREEN}✅ Backup completed successfully!${NC}"
    echo "Backup location: $BACKUP_DIR/$BACKUP_NAME"
    echo "Total size: $BACKUP_SIZE"

    exit 0
else
    log "${RED}[FAILURE]${NC} Backup verification failed"

    # Send failure notification
    send_notification "failure" "Backup verification failed"

    echo -e "${RED}❌ Backup failed! Check logs for details.${NC}"
    exit 1
fi
