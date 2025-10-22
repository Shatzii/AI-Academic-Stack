#!/bin/bash
echo "Testing Railway backend deployment..."
echo "===================================="

echo "1. Testing health endpoint:"
curl -s https://aiacademy-production-941d.up.railway.app/health/ | jq . 2>/dev/null || echo "Response: $(curl -s https://aiacademy-production-941d.up.railway.app/health/)"

echo -e "\n2. Testing API endpoint:"
curl -s https://aiacademy-production-941d.up.railway.app/api/courses/ | jq . 2>/dev/null || echo "Response: $(curl -s https://aiacademy-production-941d.up.railway.app/api/courses/)"

echo -e "\n3. Testing Netlify proxy:"
curl -s https://go4itacademy.netlify.app/api/health/ | head -5

echo -e "\n4. Frontend status:"
curl -s -I https://go4itacademy.netlify.app/ | grep "HTTP/"
