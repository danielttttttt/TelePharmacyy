// server.js
import express from 'express'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { WebSocketServer } from 'ws'
import http from 'http'

// Get the directory name
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = 301

// Create HTTP server
const server = http.createServer(app)

// Middleware to parse JSON
app.use(express.json())

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')))

// Read medications data
const medicationsPath = path.join(__dirname, 'src', 'mocks', 'mock-data', 'medications.json')
const medications = JSON.parse(fs.readFileSync(medicationsPath, 'utf8'))

// Read pharmacies data
const pharmaciesPath = path.join(__dirname, 'src', 'mocks', 'mock-data', 'pharmacies.json')
const pharmacies = JSON.parse(fs.readFileSync(pharmaciesPath, 'utf8'))

// API routes
app.get('/api/medications', (req, res) => {
  const query = req.query.query || ''
  
  // Filter medications based on query if provided
  let filteredMedications = medications
  if (query) {
    filteredMedications = medications.filter(medication => 
      medication.name.toLowerCase().includes(query.toLowerCase()) ||
      medication.genericName.toLowerCase().includes(query.toLowerCase())
    )
  }
  
  res.json(filteredMedications)
})

app.get('/api/pharmacies', (req, res) => {
  const query = req.query.query || ''
  
  // Filter pharmacies based on query if provided
  let filteredPharmacies = pharmacies
  if (query) {
    filteredPharmacies = pharmacies.filter(pharmacy => 
      pharmacy.name.toLowerCase().includes(query.toLowerCase())
    )
  }
  
  res.json(filteredPharmacies)
})

app.get('/api/orders/:id', (req, res) => {
  const { id } = req.params
  
  // Return a mock order
  const order = {
    id: parseInt(id),
    createdAt: new Date().toISOString(),
    items: medications.slice(0, 3).map((med, index) => ({
      ...med,
      quantity: index + 1
    }))
  }
  
  res.json(order)
})

app.get('/api/orders/:id/track', (req, res) => {
  const { id } = req.params
  
  // Return mock tracking information
  const trackingInfo = {
    orderId: parseInt(id),
    status: 'in_transit',
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 1000).toISOString(), // 2 days from now
    location: 'Distribution Center'
  }
  
  res.json(trackingInfo)
})

app.post('/api/orders', (req, res) => {
  // Return a mock order confirmation
  const orderConfirmation = {
    id: Math.floor(Math.random() * 10000),
    createdAt: new Date().toISOString(),
    status: 'confirmed'
  }
  
  res.json(orderConfirmation)
})

// Create WebSocket server
const wss = new WebSocketServer({ server })

// Store connected clients
const clients = new Set()

// Handle WebSocket connections
wss.on('connection', (ws) => {
  // Add new client to the set
  clients.add(ws)
  console.log('New client connected. Total clients:', clients.size)

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Connected to WebSocket server'
  }))

  // Handle incoming messages
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message)
      
      // Handle different message types
      switch (data.type) {
        case 'chat_message':
          // Broadcast chat message to all clients
          const chatMessage = {
            type: 'chat_message',
            sender: data.sender,
            text: data.text,
            timestamp: new Date().toISOString()
          }
          clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(chatMessage))
            }
          })
          break
          
        case 'video_signal':
          // Forward video call signaling to target client
          const signalMessage = {
            type: 'video_signal',
            from: data.from,
            to: data.to,
            signal: data.signal
          }
          clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              // In a real app, you would check if this client is the intended recipient
              client.send(JSON.stringify(signalMessage))
            }
          })
          break
          
        default:
          console.log('Unknown message type:', data.type)
      }
    } catch (error) {
      console.error('Error parsing message:', error)
    }
  })

  // Handle client disconnect
  ws.on('close', () => {
    clients.delete(ws)
    console.log('Client disconnected. Total clients:', clients.size)
  })

  // Handle errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error)
    clients.delete(ws)
  })
})

// Start the server
server.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`)
})