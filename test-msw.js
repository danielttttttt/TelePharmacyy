// test-msw.js
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Get the directory name
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Read the medications JSON file
const medicationsPath = path.join(__dirname, 'src', 'mocks', 'mock-data', 'medications.json')
const medications = JSON.parse(fs.readFileSync(medicationsPath, 'utf8'))

// Define request handlers
const handlers = [
  rest.get('/api/medications', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(medications)
    )
  }),
]

// Setup the mock server
const server = setupServer(...handlers)

// Start the server
server.listen()

// Test the API
fetch('http://localhost:5177/api/medications')
  .then(response => {
    console.log('Response status:', response.status)
    return response.json()
  })
  .then(data => {
    console.log('Data received:', data)
  })
  .catch(error => {
    console.error('Fetch error:', error)
  })
  .finally(() => {
    // Close the server
    server.close()
  })