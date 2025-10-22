// Service Worker for caching and offline functionality
const CACHE_NAME = 'openedtex-v1.0.0'
const STATIC_CACHE = 'openedtex-static-v1.0.0'
const API_CACHE = 'openedtex-api-v1.0.0'

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/style.css',
  '/src/components.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
]

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/courses/',
  '/api/user/profile/',
  '/api/analytics/dashboard/'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static assets:', error)
      })
  )
  // Force activation
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== API_CACHE) {
            console.log('Service Worker: Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  // Take control of all clients
  self.clients.claim()
})

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request))
    return
  }

  // Handle static assets
  if (STATIC_ASSETS.includes(request.url) || request.url.includes('/assets/')) {
    event.respondWith(handleStaticRequest(request))
    return
  }

  // Default network-first strategy for other requests
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses (only cache same-origin requests)
        if (response.status === 200 &&
            url.origin === self.location.origin &&
            !request.url.startsWith('chrome-extension://') &&
            !request.url.includes('github.dev')) {
          const responseClone = response.clone()
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, responseClone)
          })
        }
        return response
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(request)
      })
  )
})

// Handle API requests with cache-first strategy
async function handleApiRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      // Return cached response and update in background
      fetch(request).then((response) => {
        if (response.status === 200) {
          caches.open(API_CACHE).then((cache) => {
            cache.put(request, response.clone())
          })
        }
      })
      return cachedResponse
    }

    // Fetch from network
    const response = await fetch(request)
    if (response.status === 200) {
      const responseClone = response.clone()
      caches.open(API_CACHE).then((cache) => {
        cache.put(request, responseClone)
      })
    }
    return response
  } catch (error) {
    console.error('API request failed:', error)
    // Return cached response if available
    return caches.match(request)
  }
}

// Handle static assets with cache-first strategy
async function handleStaticRequest(request) {
  try {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    const response = await fetch(request)
    if (response.status === 200) {
      const responseClone = response.clone()
      caches.open(STATIC_CACHE).then((cache) => {
        cache.put(request, responseClone)
      })
    }
    return response
  } catch (error) {
    console.error('Static request failed:', error)
    return new Response('Offline', { status: 503 })
  }
}

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  console.log('Service Worker: Performing background sync')
  // Implement background sync logic here
  // e.g., retry failed API requests
}

// Handle push notifications (future feature)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      }
    }
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  )
})
