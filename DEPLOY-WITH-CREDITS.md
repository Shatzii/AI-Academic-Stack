# Deploy AI-Academic-Stack with Your $300 GCP Credits

## 🎯 One-Command Deployment (5 Minutes)

You have **$300 in Google Cloud credits** - enough to run this app for **6-15 months**!

### Quick Deploy

```bash
# Single command to deploy everything
bash scripts/deploy-with-credits.sh
```

That's it! The script will:
1. ✅ Check/install gcloud CLI
2. ✅ Login to your GCP account
3. ✅ Enable required APIs
4. ✅ Setup secrets (database, API keys)
5. ✅ Build and deploy to Cloud Run
6. ✅ Give you a live URL

**Time**: 5 minutes  
**Cost**: ~$20-50/month (your $300 lasts 6-15 months!)

---

## 📋 What You Need Before Starting

### 1. Database (Free or Cheap)
Choose one:
- **Neon** (Recommended): Free 0.5GB → https://neon.tech
- **Supabase**: Free 500MB → https://supabase.com  
- **Cloud SQL**: $7-15/month (uses your credits)

Get the PostgreSQL connection string.

### 2. Anthropic API Key
- Visit: https://console.anthropic.com
- Sign up (free $5 credit)
- Create API key
- Copy it (starts with `sk-ant-`)

---

## 🚀 Step-by-Step Deployment

### Option 1: Automated Script (Recommended)

```bash
# Run the automated deployment
bash scripts/deploy-with-credits.sh
```

The script will prompt you for:
- Your GCP project ID
- Database connection string
- Anthropic API key

Then it automatically deploys everything!

### Option 2: Manual Deployment

```bash
# 1. Login to GCP
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# 2. Enable APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable secretmanager.googleapis.com

# 3. Create secrets
echo "YOUR_DATABASE_URL" | gcloud secrets create database-url --data-file=-
echo "YOUR_ANTHROPIC_KEY" | gcloud secrets create anthropic-api-key --data-file=-
openssl rand -hex 32 | gcloud secrets create session-secret --data-file=-
openssl rand -hex 32 | gcloud secrets create jwt-secret --data-file=-

# 4. Deploy to Cloud Run
gcloud run deploy ai-academic-stack \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --min-instances 1 \
  --max-instances 10 \
  --cpu 2 \
  --memory 2Gi \
  --set-secrets="DATABASE_URL=database-url:latest,ANTHROPIC_API_KEY=anthropic-api-key:latest,SESSION_SECRET=session-secret:latest,JWT_SECRET=jwt-secret:latest"
```

---

## 💰 Cost Breakdown with Your $300 Credits

### Monthly Costs

| Service | Cost/Month | Notes |
|---------|-----------|--------|
| **Cloud Run** | $20-50 | Main application hosting |
| **Database (Neon)** | $0 | Free tier! |
| **Database (Cloud SQL)** | $7-15 | If using Cloud SQL |
| **Bandwidth** | $5-10 | Outbound data transfer |
| **Secret Manager** | $0.06 | 4 secrets × $0.06 |
| **Build Minutes** | $1-2 | Cloud Build usage |

### Total: $21-52/month

**Your $300 credits will last: 6-15 months!** 🎉

### Free Tier Included
- Cloud Run: 2M requests/month free
- Cloud Build: 120 build-minutes/day free
- Secret Manager: First 10,000 access operations free

---

## 📊 Monitoring Your Credits

### Check Credit Balance

```bash
# View billing account
gcloud billing accounts list

# View current usage
gcloud billing accounts describe YOUR_BILLING_ACCOUNT_ID
```

### Set Budget Alerts

1. Go to: https://console.cloud.google.com/billing/budgets
2. Create Budget & Alerts
3. Set alert at $50, $100, $200 (email notifications)

### View Cost Dashboard

```bash
# Open billing dashboard
echo "https://console.cloud.google.com/billing"
```

---

## 🎓 What You Get When Deployed

### Live Features
- ✅ AI-powered tutoring (Claude 3.5)
- ✅ 5 specialized schools
- ✅ Adaptive learning system
- ✅ Student/parent dashboards
- ✅ Curriculum generation
- ✅ Progress tracking
- ✅ Mobile-responsive design

### Performance
- 🚀 Auto-scaling (0 to 1000+ concurrent users)
- ⚡ Global CDN (fast worldwide)
- 🔒 Automatic HTTPS
- 📊 Built-in monitoring
- 🔄 Zero-downtime deployments

---

## 🛠️ Post-Deployment

### View Your Live Site

```bash
# Get your URL
gcloud run services describe ai-academic-stack \
  --region us-central1 \
  --format='value(status.url)'
```

### View Logs

```bash
# Real-time logs
npm run gcp:logs

# Or directly
gcloud run logs tail ai-academic-stack --region us-central1
```

### Update Deployment

```bash
# After making code changes
gcloud run deploy ai-academic-stack \
  --source . \
  --region us-central1
```

### Scale Up/Down

```bash
# Increase max instances
gcloud run services update ai-academic-stack \
  --max-instances 50 \
  --region us-central1

# Reduce to save costs
gcloud run services update ai-academic-stack \
  --max-instances 5 \
  --min-instances 0 \
  --region us-central1
```

---

## 🌐 Custom Domain Setup (Optional)

### Add Your Domain

```bash
# Map custom domain
gcloud run domain-mappings create \
  --service ai-academic-stack \
  --domain yourdomain.com \
  --region us-central1

# Follow DNS instructions shown
```

### SSL Certificate
- Automatically provisioned by Google
- Free and auto-renewing
- Takes 15-60 minutes to activate

---

## 🔧 Troubleshooting

### Deployment Fails

```bash
# Check build logs
gcloud builds list --limit 1
gcloud builds log $(gcloud builds list --limit 1 --format='value(ID)')
```

### Service Won't Start

```bash
# Check service logs
gcloud run logs read ai-academic-stack --region us-central1 --limit 100

# Check service health
gcloud run services describe ai-academic-stack --region us-central1
```

### Database Connection Issues

```bash
# Test database connection
psql "YOUR_DATABASE_URL"

# Update database secret
echo "NEW_DATABASE_URL" | gcloud secrets versions add database-url --data-file=-

# Redeploy
gcloud run deploy ai-academic-stack --source . --region us-central1
```

---

## 💡 Cost Optimization Tips

### Make Your $300 Last Longer

1. **Use Free Database**
   - Neon or Supabase free tier
   - Saves $7-15/month

2. **Scale to Zero**
   ```bash
   gcloud run services update ai-academic-stack \
     --min-instances 0 \
     --region us-central1
   ```
   - App sleeps when not used
   - Saves ~$10-20/month

3. **Use External Services**
   - Keep database outside GCP (free tiers)
   - Only pay for Cloud Run

4. **Monitor Usage**
   - Set up billing alerts
   - Review costs weekly

### With Optimization:
- **Cost**: $10-25/month
- **Your $300 lasts**: 12-30 months! 🎉

---

## 📈 Scaling Guide

### Development (Low Traffic)
```bash
--min-instances 0
--max-instances 5
--memory 1Gi
# Cost: ~$10-20/month
```

### Production (Moderate Traffic)
```bash
--min-instances 1
--max-instances 10
--memory 2Gi
# Cost: ~$20-50/month
```

### High Traffic
```bash
--min-instances 2
--max-instances 50
--memory 4Gi
# Cost: ~$100-200/month
```

---

## 🎯 Quick Reference

### Essential Commands

```bash
# Deploy
bash scripts/deploy-with-credits.sh

# View site
gcloud run services describe ai-academic-stack --region us-central1 --format='value(status.url)'

# View logs
npm run gcp:logs

# Update secrets
bash scripts/gcp-setup-secrets.sh

# Redeploy after changes
gcloud run deploy ai-academic-stack --source . --region us-central1

# Delete service
gcloud run services delete ai-academic-stack --region us-central1
```

---

## ✅ Success Checklist

After deployment, verify:

- [ ] Site loads at your Cloud Run URL
- [ ] Database connection works
- [ ] AI features respond (test chat)
- [ ] Can create account/login
- [ ] All 5 schools accessible
- [ ] Mobile view works
- [ ] HTTPS enabled
- [ ] Budget alerts configured

---

## 🆘 Need Help?

### Resources
- **GCP Console**: https://console.cloud.google.com
- **Detailed Guide**: Read `GCP-DEPLOYMENT.md`
- **Cloud Run Docs**: https://cloud.google.com/run/docs
- **Billing Dashboard**: https://console.cloud.google.com/billing

### Support Commands
```bash
# Check service status
gcloud run services list

# View recent deployments
gcloud run revisions list --service ai-academic-stack --region us-central1

# Get support
gcloud support --help
```

---

## 🎊 You're All Set!

With your **$300 in credits**, you can run this professional AI-powered educational platform for **6-15 months** completely free!

**Deploy now:**
```bash
bash scripts/deploy-with-credits.sh
```

**Time to live site**: 5 minutes  
**Your credits cover**: 6-15 months  
**Monthly cost**: $20-50 (or $10-25 optimized)

Happy teaching! 🎓☁️

