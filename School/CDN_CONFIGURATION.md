# CDN Configuration Guide for OpenEdTex

## Overview

This guide covers setting up Content Delivery Network (CDN) for optimal performance and global content distribution.

## Supported CDN Providers

### 1. AWS CloudFront

#### Setup Steps:
1. **Create CloudFront Distribution**
   ```bash
   aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
   ```

2. **CloudFront Configuration JSON**:
   ```json
   {
     "CallerReference": "openedtex-cdn-$(date +%s)",
     "Comment": "OpenEdTex CDN Distribution",
     "Enabled": true,
     "Origins": {
       "Quantity": 1,
       "Items": [
         {
           "Id": "openedtex-origin",
           "DomainName": "yourdomain.com",
           "CustomOriginConfig": {
             "HTTPPort": 80,
             "HTTPSPort": 443,
             "OriginProtocolPolicy": "https-only",
             "OriginSSLProtocols": {
               "Quantity": 1,
               "Items": ["TLSv1.2"]
             }
           }
         }
       ]
     },
     "DefaultCacheBehavior": {
       "TargetOriginId": "openedtex-origin",
       "ViewerProtocolPolicy": "redirect-to-https",
       "MinTTL": 0,
       "DefaultTTL": 86400,
       "MaxTTL": 31536000,
       "Compress": true,
       "ForwardedValues": {
         "QueryString": false,
         "Cookies": {
           "Forward": "none"
         }
       }
     },
     "CacheBehaviors": {
       "Quantity": 2,
       "Items": [
         {
           "PathPattern": "/static/*",
           "TargetOriginId": "openedtex-origin",
           "ViewerProtocolPolicy": "redirect-to-https",
           "MinTTL": 86400,
           "DefaultTTL": 31536000,
           "MaxTTL": 31536000,
           "Compress": true,
           "ForwardedValues": {
             "QueryString": false,
             "Cookies": {
               "Forward": "none"
             }
           }
         },
         {
           "PathPattern": "/media/*",
           "TargetOriginId": "openedtex-origin",
           "ViewerProtocolPolicy": "redirect-to-https",
           "MinTTL": 3600,
           "DefaultTTL": 86400,
           "MaxTTL": 604800,
           "Compress": true,
           "ForwardedValues": {
             "QueryString": false,
             "Cookies": {
               "Forward": "none"
             }
           }
         }
       ]
     },
     "Aliases": {
       "Quantity": 1,
       "Items": ["cdn.yourdomain.com"]
     },
     "ViewerCertificate": {
       "ACMCertificateArn": "arn:aws:acm:us-east-1:123456789012:certificate/your-certificate-arn",
       "SSLSupportMethod": "sni-only",
       "MinimumProtocolVersion": "TLSv1.2_2019"
     }
   }
   ```

3. **Update DNS Records**:
   ```
   Type: CNAME
   Name: cdn
   Value: your-distribution.cloudfront.net
   TTL: 300
   ```

### 2. Cloudflare

#### Setup Steps:
1. **Add Domain to Cloudflare**
   - Sign up for Cloudflare account
   - Add yourdomain.com to Cloudflare
   - Update nameservers at your DNS provider

2. **Configure SSL/TLS**:
   - Go to SSL/TLS > Overview
   - Set encryption mode to "Full (strict)"
   - Upload custom certificate if needed

3. **Set up Page Rules**:
   ```
   URL Pattern: yourdomain.com/static/*
   Cache Level: Cache Everything
   Edge Cache TTL: 1 month

   URL Pattern: yourdomain.com/media/*
   Cache Level: Cache Everything
   Edge Cache TTL: 1 week
   ```

4. **Enable Compression**:
   - Go to Speed > Optimization
   - Enable Auto Minify for HTML, CSS, JS
   - Enable Brotli compression

### 3. Fastly

#### Setup Steps:
1. **Create Fastly Service**
   ```bash
   fastly service create --name "OpenEdTex CDN" --domain cdn.yourdomain.com
   ```

2. **Configure Backend**:
   ```bash
   fastly backend create --service-id YOUR_SERVICE_ID --name origin --host yourdomain.com --port 443 --use-ssl
   ```

3. **Set up Caching Rules**:
   - Static assets: TTL 1 year
   - Media files: TTL 1 week
   - API responses: TTL 5 minutes

## CDN Optimization Checklist

- [ ] CDN distribution created
- [ ] SSL certificate configured
- [ ] DNS CNAME record added
- [ ] Cache settings optimized for static/media assets
- [ ] Compression enabled
- [ ] Origin server configured with proper headers
- [ ] Cache invalidation strategy in place
- [ ] Monitoring and alerting set up

## Performance Testing

### Test CDN Performance:
```bash
# Test static asset loading
curl -I https://cdn.yourdomain.com/static/css/main.css

# Test cache headers
curl -H "Cache-Control: no-cache" https://cdn.yourdomain.com/static/js/app.js

# Test global performance
curl -w "@curl-format.txt" -o /dev/null -s https://cdn.yourdomain.com/
```

### CDN Monitoring:
- Response times from different regions
- Cache hit/miss ratios
- Error rates
- Bandwidth usage

## Troubleshooting

### Common Issues:
1. **SSL Certificate Errors**: Ensure certificate is valid and properly configured
2. **CORS Issues**: Configure appropriate CORS headers on origin
3. **Cache Invalidation**: Use cache purging APIs when updating content
4. **DNS Propagation**: Allow 24-48 hours for DNS changes

### Debug Commands:
```bash
# Check DNS resolution
dig cdn.yourdomain.com

# Test CDN connectivity
traceroute cdn.yourdomain.com

# Check SSL certificate
openssl s_client -connect cdn.yourdomain.com:443
```

## Cost Optimization

- Monitor bandwidth usage
- Set appropriate cache TTLs
- Use compression to reduce transfer sizes
- Consider regional restrictions if not serving globally