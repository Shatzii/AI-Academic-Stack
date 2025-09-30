Auth0 integration (frontend)

Environment variables (add to .env and Netlify UI):
- VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com
- VITE_AUTH0_CLIENT_ID=YOUR_CLIENT_ID
- VITE_AUTH0_AUDIENCE=https://openedtex.api  # must match API Identifier in Auth0
- VITE_API_URL=https://your-backend.example.com/api

Frontend modules:
- Uses @auth0/auth0-react Provider in src/main.jsx
- Axios prefers Auth0 access tokens via src/auth/auth0TokenBridge.js
- Falls back to existing local JWT if present for backward compatibility

Backend expectations:
- Configure Django to accept Auth0 JWTs (issuer=https://your-tenant.us.auth0.com/, audience as above)
- Options:
  1) Use djangorestframework-simplejwt with Auth0 JWKS by customizing verification
  2) Use python-jose / PyJWT + middleware to validate Authorization: Bearer tokens
  3) Add API gateway that validates Auth0 and forwards as internal user

Minimal DRF config pattern:
- Set REST_FRAMEWORK.DEFAULT_AUTHENTICATION_CLASSES to a custom Auth0JWTAuthentication
- Validate via JWKS: https://your-tenant.us.auth0.com/.well-known/jwks.json
- Verify claims: iss and aud

Netlify CSP:
- netlify.toml includes Auth0 domains in connect-src and frame-src; update dev-xxxxx to your tenant domain.

Quick test flow:
1) Set env vars
2) npm install
3) npm run dev
4) Trigger a protected API call; network tab should include Authorization: Bearer <Auth0 token>
