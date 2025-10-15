// src/test-api.jsx
import React, { useEffect, useState } from 'react'

const TestAPI = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

 useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching from /api/medications...')
        const response = await fetch('/api/medications')
        console.log('Response status:', response.status)
        console.log('Response headers:', [...response.headers.entries()])
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const jsonData = await response.json()
        console.log('Received data:', jsonData)
        setData(jsonData)
      } catch (err) {
        console.error('Fetch error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  return (
    <div>
      <h1>API Test</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export default TestAPI