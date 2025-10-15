// service-worker.js
// Basic service worker for caching app shell and enabling offline functionality

const CACHE_NAME = 'tele-pharmacy-v1'
const urlsToCache = [
  '/',
  '/src/assets/logo.svg',
  '/assets/logo.svg', // Also try the build output path
  '/manifest.json'
]

// Install event - cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache).catch(error => {
          console.log('Cache addAll failed: ', error)
          // Don't fail the installation if cache fails
        })
      })
  )
})

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return
  }
  
  // Skip caching for Vite development resources (these won't exist in production anyway)
  if (event.request.url.includes('@vite') || event.request.url.includes('@react-refresh')) {
    return
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response
        }
        
        // Clone the request because it's a stream that can only be consumed once
        const fetchRequest = event.request.clone()
        
        return fetch(fetchRequest)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }
            
            // Clone the response because it's a stream that can only be consumed once
            const responseToCache = response.clone()
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache)
              })
              .catch((error) => {
                console.log('Cache put failed: ', error)
              })
              
            return response
          })
          .catch(() => {
            // If fetch fails, we're probably offline - return a fallback
            // Only return fallback for HTML documents
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/').then(response => response || caches.match('/index.html'))
            }
          })
      })
      .catch((error) => {
        console.log('Cache match failed: ', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})