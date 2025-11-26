# Google Cloud Platform Deployment Guide

Complete guide for deploying AI-Academic-Stack to Google Cloud Platform.

## Quick Start (5 minutes)

```bash
# 1. Install gcloud CLI (if not already installed)
# Visit: https://cloud.google.com/sdk/docs/install

# 2. Login to GCP
gcloud auth login

# 3. Set your project
gcloud config set project YOUR_PROJECT_ID

# 4. Run deployment script
bash scripts/gcp-deploy.sh
```

---

## Deployment Options

### Option 1: Cloud Run (Recommended) ⭐

**Best for**: Production apps, auto-scaling, serverless

**Pros**:
- ✅ Fully managed, serverless
- ✅ Auto-scaling (0 to thousands)
- ✅ Pay only for what you use
- ✅ HTTPS automatically
- ✅ Easy rollbacks

**Cost**: ~$20-50/month for typical usage

#### Deploy to Cloud Run

```bash
# Quick deploy
gcloud run deploy ai-academic-stack \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --min-instances 1 \
  --max-instances 10 \
  --cpu 2 \
  --memory 2Gi \
  --port 8080

# Or use the deployment script
bash scripts/gcp-deploy.sh
# Choose option 1
```

#### Using Docker with Cloud Run

```bash
# Build container
gcloud builds submit --tag gcr.io/PROJECT_ID/ai-academic-stack

# Deploy container
gcloud run deploy ai-academic-stack \
  --image gcr.io/PROJECT_ID/ai-academic-stack \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

### Option 2: App Engine

**Best for**: Simple deployment, managed platform

**Pros**:
- ✅ Zero configuration scaling
- ✅ Built-in load balancing
- ✅ Traffic splitting for A/B testing
- ✅ Simple deployment

**Cost**: ~$25-75/month

#### Deploy to App Engine

```bash
# Initialize App Engine (first time only)
gcloud app create --region=us-central

# Deploy
gcloud app deploy app.yaml

# View logs
gcloud app logs tail -s default
```

---

### Option 3: Compute Engine VM

**Best for**: Maximum control, traditional hosting

**Pros**:
- ✅ Full VM control
- ✅ SSH access
- ✅ Can run any software
- ✅ Predictable pricing

**Cost**: ~$15-30/month for e2-medium

#### Setup Compute Engine

```bash
# Create VM instance
gcloud compute instances create ai-academic-stack \
  --zone=us-central1-a \
  --machine-type=e2-medium \
  --image-family=debian-11 \
  --image-project=debian-cloud \
  --boot-disk-size=20GB \
  --tags=http-server,https-server

# SSH into instance
gcloud compute ssh ai-academic-stack --zone=us-central1-a

# On the VM, install Node.js and deploy
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git
git clone YOUR_REPO_URL
cd ai-academic-stack
npm install
npm run build
npm start
```

---

## Database Setup on GCP

### Option A: Cloud SQL (Managed PostgreSQL)

**Best for**: Production workloads

```bash
# Create Cloud SQL instance
gcloud sql instances create ai-academic-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --storage-size=10GB \
  --storage-type=SSD

# Create database
gcloud sql databases create academic_stack \
  --instance=ai-academic-db

# Create user
gcloud sql users create academic_user \
  --instance=ai-academic-db \
  --password=YOUR_SECURE_PASSWORD

# Get connection name
gcloud sql instances describe ai-academic-db --format='value(connectionName)'

# Connection string format:
# postgresql://academic_user:PASSWORD@/academic_stack?host=/cloudsql/CONNECTION_NAME
```

**Cost**: ~$7-15/month for db-f1-micro

### Option B: External Database (Neon/Supabase)

Use existing database from Neon, Supabase, etc.

```bash
# Just set the DATABASE_URL secret
echo "postgresql://user:pass@host:5432/db" | \
  gcloud secrets create database-url --data-file=-
```

---

## Secret Management

### Setup Secrets (Required)

```bash
# Run the interactive setup script
bash scripts/gcp-setup-secrets.sh

# Or manually create secrets:

# Database URL
echo "YOUR_DATABASE_URL" | \
  gcloud secrets create database-url --data-file=-

# Anthropic API Key
echo "YOUR_ANTHROPIC_KEY" | \
  gcloud secrets create anthropic-api-key --data-file=-

# Session Secret (auto-generate)
openssl rand -hex 32 | \
  gcloud secrets create session-secret --data-file=-

# JWT Secret (auto-generate)
openssl rand -hex 32 | \
  gcloud secrets create jwt-secret --data-file=-
```

### Grant Access to Secrets

```bash
# Get project number
PROJECT_NUMBER=$(gcloud projects describe PROJECT_ID --format='value(projectNumber)')

# Grant Cloud Run access to secrets
for secret in database-url anthropic-api-key session-secret jwt-secret; do
  gcloud secrets add-iam-policy-binding $secret \
    --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
done
```

---

## Environment Variables

### For Cloud Run

```bash
# Set environment variables
gcloud run services update ai-academic-stack \
  --update-env-vars NODE_ENV=production,PORT=8080 \
  --region us-central1

# Or use secrets
gcloud run services update ai-academic-stack \
  --update-secrets=DATABASE_URL=database-url:latest \
  --update-secrets=ANTHROPIC_API_KEY=anthropic-api-key:latest \
  --region us-central1
```

### For App Engine

Add to `app.yaml`:
```yaml
env_variables:
  NODE_ENV: "production"
```

---

## Custom Domain Setup

### Cloud Run with Custom Domain

```bash
# Map custom domain
gcloud run domain-mappings create \
  --service ai-academic-stack \
  --domain your-domain.com \
  --region us-central1

# Follow DNS setup instructions provided
```

### App Engine with Custom Domain

```bash
# Add custom domain
gcloud app domain-mappings create your-domain.com

# Add SSL certificate (automatic)
gcloud app ssl-certificates create --domains=your-domain.com
```

---

## Monitoring & Logging

### View Logs

```bash
# Cloud Run logs
gcloud run logs read ai-academic-stack \
  --region us-central1 \
  --limit 50

# App Engine logs
gcloud app logs tail -s default

# Follow logs in real-time
gcloud run logs tail ai-academic-stack --region us-central1
```

### Setup Monitoring

```bash
# Enable Cloud Monitoring
gcloud services enable monitoring.googleapis.com

# View in console
echo "https://console.cloud.google.com/monitoring"
```

---

## CI/CD with Cloud Build

### Automatic Deployment

```bash
# Connect GitHub repository
gcloud builds submit --config cloudbuild.yaml

# Setup trigger for automatic deployment on push
gcloud builds triggers create github \
  --repo-name=AI-Academic-Stack \
  --repo-owner=YOUR_GITHUB_USERNAME \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

---

## Cost Optimization

### Cloud Run Free Tier
- 2M requests/month
- 360,000 GB-seconds memory
- 180,000 vCPU-seconds

### Cost Estimates

| Service | Instance | Monthly Cost |
|---------|----------|--------------|
| Cloud Run | 2CPU/2GB, moderate traffic | $20-50 |
| App Engine | F2 instance | $25-75 |
| Cloud SQL | db-f1-micro | $7-15 |
| Compute Engine | e2-medium | $15-30 |

### Tips to Reduce Costs
1. Use Cloud Run min-instances: 0 for low traffic
2. Use db-f1-micro for Cloud SQL
3. Enable auto-scaling
4. Use external database (Neon free tier)
5. Set up budget alerts

---

## Health Checks

Add health check endpoint to your app:

```javascript
// In server/index.ts or appropriate file
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});
```

---

## Troubleshooting

### Cloud Run Issues

```bash
# Check service status
gcloud run services describe ai-academic-stack --region us-central1

# View recent logs
gcloud run logs read ai-academic-stack --region us-central1 --limit 100

# Test locally with Cloud Run emulator
gcloud beta code dev
```

### Common Problems

**Port Issues**
- Cloud Run expects PORT 8080
- App Engine expects PORT 8080
- Ensure your app reads `process.env.PORT`

**Build Failures**
```bash
# Check build logs
gcloud builds log $(gcloud builds list --limit 1 --format='value(ID)')
```

**Database Connection**
- Use Cloud SQL Proxy for local testing
- Check firewall rules
- Verify connection string format

---

## Security Best Practices

1. **Use Secret Manager** for all sensitive data
2. **Enable VPC** for Cloud SQL connection
3. **Set up IAM roles** properly
4. **Enable Cloud Armor** for DDoS protection
5. **Use HTTPS only** (default on Cloud Run/App Engine)
6. **Regular security audits**:
   ```bash
   gcloud scc findings list YOUR_ORG_ID
   ```

---

## Scaling Configuration

### Cloud Run Auto-scaling

```bash
gcloud run services update ai-academic-stack \
  --min-instances 1 \
  --max-instances 100 \
  --concurrency 80 \
  --cpu-throttling \
  --region us-central1
```

### App Engine Scaling

In `app.yaml`:
```yaml
automatic_scaling:
  min_instances: 1
  max_instances: 10
  target_cpu_utilization: 0.65
```

---

## Backup & Recovery

### Database Backups (Cloud SQL)

```bash
# Create backup
gcloud sql backups create \
  --instance=ai-academic-db \
  --description="Manual backup"

# List backups
gcloud sql backups list --instance=ai-academic-db

# Restore from backup
gcloud sql backups restore BACKUP_ID \
  --backup-instance=ai-academic-db \
  --backup-id=BACKUP_ID
```

---

## Next Steps

1. ✅ Deploy application
2. ✅ Setup database
3. ✅ Configure secrets
4. ✅ Add custom domain
5. ✅ Setup monitoring
6. ✅ Configure CI/CD
7. ✅ Test thoroughly
8. ✅ Go live!

---

## Support Resources

- **GCP Console**: https://console.cloud.google.com
- **Cloud Run Docs**: https://cloud.google.com/run/docs
- **App Engine Docs**: https://cloud.google.com/appengine/docs
- **Cloud SQL Docs**: https://cloud.google.com/sql/docs
- **Support**: https://cloud.google.com/support

---

## Quick Reference Commands

```bash
# Deploy to Cloud Run
bash scripts/gcp-deploy.sh

# Setup secrets
bash scripts/gcp-setup-secrets.sh

# View logs
gcloud run logs tail ai-academic-stack --region us-central1

# Check status
gcloud run services describe ai-academic-stack --region us-central1

# Update service
gcloud run services update ai-academic-stack --region us-central1

# Delete service
gcloud run services delete ai-academic-stack --region us-central1
```

Happy deploying! 🚀

