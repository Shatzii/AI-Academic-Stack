#!/bin/bash

# OpenEdTex Training Environment Setup Script
# This script creates a safe training environment for staff training exercises

echo "=========================================="
echo "OpenEdTex Training Environment Setup"
echo "=========================================="

# Create training directories
echo "Creating training directory structure..."
mkdir -p training/{videos,materials,certificates,assessments,exercises,simulations}

# Create sample training materials
echo "Creating sample training materials..."

# Sample assessment quiz
cat > training/assessments/sample_quiz.md << 'EOF'
# OpenEdTex Platform Knowledge Assessment

## Multiple Choice Questions

### Question 1: Platform Architecture
What is the primary backend framework used by OpenEdTex?
a) Flask
b) Django
c) FastAPI
d) Express.js

**Correct Answer: b) Django**

### Question 2: AI Services
Which of the following is NOT an AI service endpoint?
a) /api/ai/classify-image
b) /api/ai/extract-text
c) /api/ai/generate-speech
d) /api/ai/delete-user

**Correct Answer: d) /api/ai/delete-user**

### Question 3: Security
What should you do if you suspect a security incident?
a) Ignore it and continue working
b) Try to fix it yourself
c) Report it immediately to security team
d) Tell only your manager

**Correct Answer: c) Report it immediately to security team**

### Question 4: User Support
When handling a user complaint about course access, what is the first step?
a) Escalate to technical team
b) Verify user account status
c) Ask user to restart their browser
d) Tell user to contact their instructor

**Correct Answer: b) Verify user account status**

### Question 5: Content Management
Which tool would you use to convert existing curriculum documents?
a) Curriculum Converter AI
b) Text-to-Speech service
c) Image Classification tool
d) Recommendation Engine

**Correct Answer: a) Curriculum Converter AI**
EOF

# Sample hands-on exercise
cat > training/exercises/deployment_simulation.md << 'EOF'
# Hands-on Deployment Exercise

## Objective
Practice deploying OpenEdTex to a staging environment

## Prerequisites
- Docker and Docker Compose installed
- Git repository access
- AWS CLI configured (if using cloud deployment)

## Exercise Steps

### Step 1: Environment Preparation
```bash
# Clone the repository
git clone https://github.com/your-org/openedtex.git
cd openedtex

# Create environment file
cp .env.example .env
# Edit .env with appropriate values
```

### Step 2: Build and Deploy
```bash
# Build the application
docker-compose build

# Start the services
docker-compose up -d

# Check service health
docker-compose ps
```

### Step 3: Configuration Validation
```bash
# Test database connectivity
docker-compose exec web python manage.py dbshell

# Test AI services
curl http://localhost:8001/api/ai/health

# Test frontend
curl http://localhost:3000
```

### Step 4: Monitoring Setup
```bash
# Check logs
docker-compose logs -f web

# Monitor resource usage
docker stats
```

## Success Criteria
- [ ] All services start successfully
- [ ] Database migrations complete
- [ ] Frontend loads correctly
- [ ] AI services respond to health checks
- [ ] No critical errors in logs

## Troubleshooting
- If services fail to start, check environment variables
- If database connection fails, verify PostgreSQL credentials
- If AI services fail, check Ollama/OpenAI configuration
EOF

# Sample emergency response scenario
cat > training/simulations/emergency_response_scenario.md << 'EOF'
# Emergency Response Simulation

## Scenario: System Outage During Peak Usage

### Situation
It's Monday morning during peak usage hours. Students are reporting that they cannot access their courses. The system monitoring dashboard shows:
- Web server response time: 30+ seconds
- Database CPU usage: 95%
- Error rate: 40%
- AI services: unresponsive

### Your Role
You are the on-call system administrator. You need to:
1. Assess the situation
2. Communicate with stakeholders
3. Implement immediate fixes
4. Prevent future occurrences

### Step-by-Step Response

#### Step 1: Initial Assessment (5 minutes)
- Check system monitoring dashboards
- Review recent logs for error patterns
- Identify affected services
- Determine scope of impact

#### Step 2: Communication (2 minutes)
- Notify incident response team
- Update status page for users
- Inform management of situation
- Set up communication channels

#### Step 3: Immediate Actions (10 minutes)
- Restart unresponsive services
- Scale up database resources
- Implement emergency caching
- Route traffic to backup systems

#### Step 4: Root Cause Analysis (15 minutes)
- Analyze log files for error patterns
- Check resource utilization trends
- Review recent deployments
- Identify contributing factors

#### Step 5: Resolution (20 minutes)
- Apply permanent fixes
- Restore full service
- Validate system stability
- Monitor for recurrence

#### Step 6: Post-Incident Activities (30 minutes)
- Document incident details
- Update incident response procedures
- Schedule debrief meeting
- Implement preventive measures

### Success Metrics
- System restored within 30 minutes
- Clear communication maintained
- Root cause identified and fixed
- Preventive measures implemented
- Incident properly documented

### Debrief Questions
1. What went well in this response?
2. What could be improved?
3. Were communication protocols followed?
4. Did we meet our RTO/RPO objectives?
5. What preventive measures should be implemented?
EOF

echo "Sample training materials created successfully!"

# Create training progress tracker
cat > training/training_progress_tracker.py << 'EOF'
#!/usr/bin/env python3
"""
OpenEdTex Training Progress Tracker
Tracks completion of training modules and certifications
"""

import json
import os
from datetime import datetime
from typing import Dict, List, Optional

class TrainingTracker:
    def __init__(self, data_file: str = "training/training_progress.json"):
        self.data_file = data_file
        self.ensure_data_directory()
        self.load_progress()

    def ensure_data_directory(self):
        """Ensure training data directory exists"""
        os.makedirs(os.path.dirname(self.data_file), exist_ok=True)

    def load_progress(self):
        """Load training progress from file"""
        if os.path.exists(self.data_file):
            with open(self.data_file, 'r') as f:
                self.progress_data = json.load(f)
        else:
            self.progress_data = {
                "staff": {},
                "modules": {
                    "system_admin": {
                        "name": "System Administration Training",
                        "modules": ["architecture", "deployment", "security", "monitoring"],
                        "duration_hours": 16
                    },
                    "user_support": {
                        "name": "User Support Training",
                        "modules": ["platform_overview", "support_procedures", "accessibility", "communication"],
                        "duration_hours": 12
                    },
                    "content_management": {
                        "name": "Content Management Training",
                        "modules": ["curriculum_dev", "quality_assurance", "accessibility", "compliance"],
                        "duration_hours": 10
                    },
                    "security_awareness": {
                        "name": "Security Awareness Training",
                        "modules": ["cybersecurity", "data_protection", "incident_response", "compliance"],
                        "duration_hours": 8
                    },
                    "emergency_response": {
                        "name": "Emergency Response Training",
                        "modules": ["incident_response", "disaster_recovery", "communication", "testing"],
                        "duration_hours": 7
                    },
                    "performance_monitoring": {
                        "name": "Performance Monitoring Training",
                        "modules": ["system_monitoring", "analytics", "reporting", "optimization"],
                        "duration_hours": 7
                    }
                },
                "certifications": {
                    "basic_user": {"name": "Basic User Certification", "prerequisites": []},
                    "advanced_user": {"name": "Advanced User Certification", "prerequisites": ["basic_user"]},
                    "administrator": {"name": "Administrator Certification", "prerequisites": ["advanced_user"]},
                    "security_specialist": {"name": "Security Specialist Certification", "prerequisites": ["administrator"]}
                }
            }
            self.save_progress()

    def save_progress(self):
        """Save training progress to file"""
        with open(self.data_file, 'w') as f:
            json.dump(self.progress_data, f, indent=2, default=str)

    def add_staff_member(self, staff_id: str, name: str, role: str):
        """Add a new staff member to tracking"""
        if staff_id not in self.progress_data["staff"]:
            self.progress_data["staff"][staff_id] = {
                "name": name,
                "role": role,
                "training_completed": [],
                "certifications_earned": [],
                "start_date": datetime.now().isoformat(),
                "last_updated": datetime.now().isoformat()
            }
            self.save_progress()
            return True
        return False

    def complete_module(self, staff_id: str, module: str, track: str):
        """Mark a training module as completed"""
        if staff_id in self.progress_data["staff"]:
            completed_key = f"{track}_{module}"
            if completed_key not in self.progress_data["staff"][staff_id]["training_completed"]:
                self.progress_data["staff"][staff_id]["training_completed"].append(completed_key)
                self.progress_data["staff"][staff_id]["last_updated"] = datetime.now().isoformat()
                self.save_progress()
                return True
        return False

    def award_certification(self, staff_id: str, certification: str):
        """Award a certification to staff member"""
        if staff_id in self.progress_data["staff"]:
            if certification not in self.progress_data["staff"][staff_id]["certifications_earned"]:
                # Check prerequisites
                cert_info = self.progress_data["certifications"].get(certification, {})
                prerequisites = cert_info.get("prerequisites", [])

                has_prereqs = all(
                    prereq in self.progress_data["staff"][staff_id]["certifications_earned"]
                    for prereq in prerequisites
                )

                if has_prereqs:
                    self.progress_data["staff"][staff_id]["certifications_earned"].append(certification)
                    self.progress_data["staff"][staff_id]["last_updated"] = datetime.now().isoformat()
                    self.save_progress()
                    return True
        return False

    def get_staff_progress(self, staff_id: str) -> Optional[Dict]:
        """Get training progress for a staff member"""
        return self.progress_data["staff"].get(staff_id)

    def get_completion_report(self) -> Dict:
        """Generate completion report for all staff"""
        report = {
            "total_staff": len(self.progress_data["staff"]),
            "certifications_awarded": {},
            "module_completion": {},
            "overall_completion_rate": 0.0
        }

        for cert_name in self.progress_data["certifications"]:
            report["certifications_awarded"][cert_name] = 0

        for track_name, track_info in self.progress_data["modules"].items():
            report["module_completion"][track_name] = 0

        total_modules = sum(len(track["modules"]) for track in self.progress_data["modules"].values())

        for staff_id, staff_data in self.progress_data["staff"].items():
            # Count certifications
            for cert in staff_data["certifications_earned"]:
                if cert in report["certifications_awarded"]:
                    report["certifications_awarded"][cert] += 1

            # Count completed modules
            completed_count = len(staff_data["training_completed"])
            report["overall_completion_rate"] += (completed_count / total_modules)

        if report["total_staff"] > 0:
            report["overall_completion_rate"] /= report["total_staff"]
            report["overall_completion_rate"] *= 100

        return report

def main():
    tracker = TrainingTracker()

    # Example usage
    print("OpenEdTex Training Progress Tracker")
    print("===================================")

    # Add sample staff
    tracker.add_staff_member("admin001", "John Doe", "System Administrator")
    tracker.add_staff_member("support001", "Jane Smith", "User Support Specialist")

    # Complete some modules
    tracker.complete_module("admin001", "architecture", "system_admin")
    tracker.complete_module("admin001", "deployment", "system_admin")
    tracker.award_certification("admin001", "basic_user")

    # Generate report
    report = tracker.get_completion_report()
    print(f"\nCompletion Report:")
    print(f"Total Staff: {report['total_staff']}")
    print(".1f")
    print(f"Certifications Awarded: {report['certifications_awarded']}")

if __name__ == "__main__":
    main()
EOF

echo "Training progress tracker created!"

# Make scripts executable
chmod +x training_completion_check.sh
chmod +x training/training_progress_tracker.py

echo "=========================================="
echo "Training environment setup completed!"
echo "=========================================="