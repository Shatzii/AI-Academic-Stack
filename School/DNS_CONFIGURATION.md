# DNS Configuration Guide for OpenEdTex Production Deployment

## Required DNS Records

### Primary Domain (yourdomain.com)
```
Type: A
Name: @
Value: YOUR_SERVER_IP_ADDRESS
TTL: 300

Type: AAAA (if IPv6)
Name: @
Value: YOUR_SERVER_IPV6_ADDRESS
TTL: 300

Type: CNAME
Name: www
Value: yourdomain.com
TTL: 300
```

### API Subdomain (api.yourdomain.com)
```
Type: A
Name: api
Value: YOUR_SERVER_IP_ADDRESS
TTL: 300

Type: AAAA (if IPv6)
Name: api
Value: YOUR_SERVER_IPV6_ADDRESS
TTL: 300
```

### CDN Subdomain (cdn.yourdomain.com) - If using CloudFront/Cloudflare
```
Type: CNAME
Name: cdn
Value: YOUR_CDN_DISTRIBUTION_DOMAIN
TTL: 300
```

## SSL Certificate Validation Records

### Let's Encrypt ACME Challenge (for certbot)
```
Type: TXT
Name: _acme-challenge
Value: YOUR_CERTBOT_CHALLENGE_TOKEN
TTL: 300
```

## Email Configuration Records

### SPF Record
```
Type: TXT
Name: @
Value: "v=spf1 include:_spf.google.com ~all"
TTL: 300
```

### DKIM Record (if using custom SMTP)
```
Type: TXT
Name: google._domainkey
Value: YOUR_DKIM_KEY
TTL: 300
```

### DMARC Record
```
Type: TXT
Name: _dmarc
Value: "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
TTL: 300
```

## Monitoring & Health Check Records

### Health Check Subdomain (optional)
```
Type: CNAME
Name: health
Value: yourdomain.com
TTL: 300
```

## CDN Configuration

If using AWS CloudFront:
1. Create CloudFront Distribution
2. Set Origin Domain to yourdomain.com
3. Configure SSL/TLS with custom certificate
4. Set CNAME to cdn.yourdomain.com
5. Enable caching for static assets

If using Cloudflare:
1. Add yourdomain.com to Cloudflare
2. Configure DNS records as above
3. Enable SSL/TLS encryption
4. Configure caching rules for /static/ and /media/ paths

## Verification Steps

1. Use `dig` or `nslookup` to verify records:
   ```bash
   dig A yourdomain.com
   dig CNAME www.yourdomain.com
   dig A api.yourdomain.com
   ```

2. Test SSL certificate:
   ```bash
   openssl s_client -connect yourdomain.com:443 -servername yourdomain.com
   ```

3. Verify CDN functionality:
   ```bash
   curl -I https://cdn.yourdomain.com/static/css/main.css
   ```

## DNS Propagation Time

- Allow 24-48 hours for DNS changes to propagate globally
- Use DNS propagation checkers like dnschecker.org
- Monitor certificate renewal after initial setup

## Emergency Contacts

- DNS Provider: [Your DNS Provider Support]
- SSL Certificate Authority: Let's Encrypt Community Support
- CDN Provider: [Your CDN Provider Support]