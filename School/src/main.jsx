import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ErrorBoundary from './components/common/ErrorBoundary'
import './styles/index.css'
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'
import { setAuth0TokenGetter } from './auth/auth0TokenBridge'

// Bridge component to register the token getter once Auth0 is initialized
function Auth0Bridge() {
  const { getAccessTokenSilently } = useAuth0()
  React.useEffect(() => {
    // Register the getter so axios can request tokens on demand
    setAuth0TokenGetter(async (opts) => {
      return await getAccessTokenSilently({
        detailedResponse: false,
        ignoreCache: false,
        ...opts,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      })
    })
  }, [getAccessTokenSilently])
  return null
}

// Register service worker for caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((_registration) => {
        // Service Worker registered successfully
      })
      .catch((_error) => {
        // console.error('Service Worker registration failed:', _error)
      })
  })
}

const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID
const auth0Audience = import.meta.env.VITE_AUTH0_AUDIENCE
const auth0Enabled = Boolean(auth0Domain && auth0ClientId)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {auth0Enabled ? (
      <Auth0Provider
        domain={auth0Domain}
        clientId={auth0ClientId}
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: auth0Audience || undefined,
        }}
        cacheLocation="localstorage"
        useRefreshTokens={true}
      >
        <Auth0Bridge />
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </Auth0Provider>
    ) : (
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    )}
  </React.StrictMode>,
)