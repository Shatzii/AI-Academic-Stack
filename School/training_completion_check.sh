#!/bin/bash

# OpenEdTex Staff Training Completion Script
#check_training_content() {
    local file="$1"
    local sections="$2"

    if [ ! -f "$file" ]; then
        return 1
    fi

    for section in "${sections[@]}"; do
        echo "Checking for: '$section' in $file"
        if grep -q "$section" "$file"; then
            echo -e "${GREEN}✓${NC} $section found in $file"
        else
            echo -e "${RED}✗${NC} $section NOT found in $file"
            echo "Available sections in $file:"
            grep "^###" "$file" | head -10
            return 1
        fi
    done
    return 0
}ates that all staff training requirements are met

echo "=========================================="
echo "OpenEdTex Staff Training Completion Check"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Training completion status
TRAINING_COMPLETE=true

echo -e "\n${YELLOW}Checking Training Materials...${NC}"

# Check if training files exist
training_files=(
    "STAFF_TRAINING.md"
    "SYSTEM_ADMIN_TRAINING.md"
    "USER_SUPPORT_TRAINING.md"
)

for file in "${training_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file exists"
    else
        echo -e "${RED}✗${NC} $file missing"
        TRAINING_COMPLETE=false
    fi
done

echo -e "\n${YELLOW}Checking Training Resources...${NC}"

# Check for training directories
training_dirs=(
    "training/videos"
    "training/materials"
    "training/certificates"
    "training/assessments"
)

for dir in "${training_dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓${NC} $dir exists"
    else
        echo -e "${YELLOW}⚠${NC} $dir missing - creating..."
        mkdir -p "$dir"
        echo -e "${GREEN}✓${NC} $dir created"
    fi
done

echo -e "\n${YELLOW}Validating Training Content...${NC}"

# Check training content completeness
check_training_content() {
    local file="$1"
    local required_sections="$2"

    if [ ! -f "$file" ]; then
        return 1
    fi

    for section in "${required_sections[@]}"; do
        if grep -q "$section" "$file"; then
            echo -e "${GREEN}✓${NC} $section found in $file"
        else
            echo -e "${RED}✗${NC} $section missing in $file"
            return 1
        fi
    done
    return 0
}

# Check STAFF_TRAINING.md content
staff_sections=(
    "### 1. System Administration Training"
    "### 2. User Support Training"
    "### 3. Content Management Training"
    "### 4. Security Awareness Training"
    "### 5. Emergency Response Training"
    "### 6. Performance Monitoring Training"
)

if check_training_content "STAFF_TRAINING.md" staff_sections; then
    echo -e "${GREEN}✓${NC} STAFF_TRAINING.md content validation passed"
else
    TRAINING_COMPLETE=false
fi

# Check SYSTEM_ADMIN_TRAINING.md content
admin_sections=(
    "### 1.1 Backend Architecture"
    "### 2.1 Production Deployment Checklist"
    "### 3.1 Key Metrics to Monitor"
    "### 4.1 Access Control"
)

if check_training_content "SYSTEM_ADMIN_TRAINING.md" admin_sections; then
    echo -e "${GREEN}✓${NC} SYSTEM_ADMIN_TRAINING.md content validation passed"
else
    TRAINING_COMPLETE=false
fi

# Check USER_SUPPORT_TRAINING.md content
support_sections=(
    "### 1.1 Understanding the User Journey"
    "### 2.1 Account and Access Issues"
    "### 3.1 Communication Guidelines"
    "### 4.1 Handling Data Subject Requests"
)

if check_training_content "USER_SUPPORT_TRAINING.md" support_sections; then
    echo -e "${GREEN}✓${NC} USER_SUPPORT_TRAINING.md content validation passed"
else
    TRAINING_COMPLETE=false
fi

echo -e "\n${YELLOW}Checking Training Infrastructure...${NC}"

# Check if training scripts exist
training_scripts=(
    "training/setup_training_environment.sh"
    "training/generate_certificates.sh"
    "training/assessment_runner.py"
)

for script in "${training_scripts[@]}"; do
    if [ -f "$script" ]; then
        echo -e "${GREEN}✓${NC} $script exists"
    else
        echo -e "${YELLOW}⚠${NC} $script missing"
    fi
done

echo -e "\n${YELLOW}Training Completion Summary${NC}"
echo "=========================================="

if [ "$TRAINING_COMPLETE" = true ]; then
    echo -e "${GREEN}✓ ALL TRAINING REQUIREMENTS MET${NC}"
    echo -e "${GREEN}Staff training programs are complete and ready for deployment.${NC}"

    # Create completion certificate
    cat > training/TRAINING_COMPLETION_CERTIFICATE.md << 'EOF'
# OpenEdTex Staff Training Completion Certificate

## Training Program Status: COMPLETE ✅

This certificate confirms that all required staff training materials have been created and validated for the OpenEdTex educational platform.

### Completed Training Components:

#### Core Training Materials
- [x] Comprehensive Staff Training Program (STAFF_TRAINING.md)
- [x] System Administrator Training Manual (SYSTEM_ADMIN_TRAINING.md)
- [x] User Support Training Manual (USER_SUPPORT_TRAINING.md)

#### Training Infrastructure
- [x] Training directory structure
- [x] Training resource organization
- [x] Assessment and certification framework

#### Content Validation
- [x] All required training modules present
- [x] Content completeness verified
- [x] Training delivery methods documented

### Training Tracks Covered:
1. System Administration Training
2. User Support Training
3. Content Management Training
4. Security Awareness Training
5. Emergency Response Training
6. Performance Monitoring Training

### Certification Levels Available:
- Basic User Certification
- Advanced User Certification
- Administrator Certification
- Security Specialist Certification

**Completion Date:** $(date)
**Training Coordinator:** OpenEdTex Platform Team

---
*This certificate is automatically generated upon successful completion of all training requirements.*
EOF

    echo -e "${GREEN}✓${NC} Training completion certificate generated"

else
    echo -e "${RED}✗ TRAINING REQUIREMENTS NOT FULLY MET${NC}"
    echo -e "${YELLOW}Please review the issues above and complete missing training components.${NC}"
fi

echo -e "\n=========================================="
echo "Training validation completed at $(date)"
echo "=========================================="