// Lightweight bridge to expose Auth0 access token retrieval to non-React code (e.g., Axios interceptors)
// NOTE: This avoids calling React hooks outside components.

let tokenGetter = null

export function setAuth0TokenGetter(fn) {
  tokenGetter = typeof fn === 'function' ? fn : null
}

export async function fetchAuth0AccessToken(options) {
  if (!tokenGetter) return null
  try {
    const token = await tokenGetter(options)
    return token || null
  } catch (_e) {
    return null
  }
}
