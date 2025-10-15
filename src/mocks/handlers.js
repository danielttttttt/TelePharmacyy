// src/mocks/handlers.js
import { http, HttpResponse } from 'msw'
import medications from './mock-data/medications.json'
import pharmacies from './mock-data/pharmacies.json'

export const handlers = [
  // Mock medications API
  http.get('/api/medications', ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('query') || ''
    
    // Filter medications based on query if provided
    let filteredMedications = medications
    if (query) {
      filteredMedications = medications.filter(medication =>
        medication.name.toLowerCase().includes(query.toLowerCase()) ||
        medication.genericName.toLowerCase().includes(query.toLowerCase())
      )
    }
    
    return HttpResponse.json(filteredMedications)
  }),
  
  // Mock pharmacies API
  http.get('/api/pharmacies', ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('query') || ''
    
    // Filter pharmacies based on query if provided
    let filteredPharmacies = pharmacies
    if (query) {
      filteredPharmacies = pharmacies.filter(pharmacy =>
        pharmacy.name.toLowerCase().includes(query.toLowerCase())
      )
    }
    
    return HttpResponse.json(filteredPharmacies)
  }),
  
  // Mock orders API
  http.get('/api/orders/:id', ({ params }) => {
    const { id } = params
    
    // Return a mock order
    const order = {
      id: parseInt(id),
      createdAt: new Date().toISOString(),
      items: medications.slice(0, 3).map((med, index) => ({
        ...med,
        quantity: index + 1
      }))
    }
    
    return HttpResponse.json(order)
  }),
  
  // Mock order tracking API
  http.get('/api/orders/:id/track', ({ params }) => {
    const { id } = params
    
    // Return mock tracking information
    const trackingInfo = {
      orderId: parseInt(id),
      status: 'in_transit',
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 1000).toISOString(), // 2 days from now
      location: 'Distribution Center'
    }
    
    return HttpResponse.json(trackingInfo)
  }),
  
  // Mock create order API
  http.post('/api/orders', async () => {
    // Return a mock order confirmation
    const orderConfirmation = {
      id: Math.floor(Math.random() * 10000),
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    }
    
    return HttpResponse.json(orderConfirmation)
  })
]