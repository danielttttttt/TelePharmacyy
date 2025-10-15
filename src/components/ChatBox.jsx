import React, { useState, useRef, useEffect } from 'react'

const ChatBox = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your pharmacist assistant. How can I help you today?", sender: 'pharmacist', timestamp: new Date(Date.now() - 300000) },
    { id: 2, text: "Hi, I have a question about my prescription.", sender: 'user', timestamp: new Date(Date.now() - 240000) }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [ws, setWs] = useState(null)
  const messagesEndRef = useRef(null)

  // Initialize WebSocket connection
  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:301')
    
    websocket.onopen = () => {
      console.log('Connected to WebSocket server')
    }
    
    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'chat_message') {
          setMessages(prev => [
            ...prev,
            {
              id: prev.length + 1,
              text: data.text,
              sender: data.sender,
              timestamp: new Date(data.timestamp)
            }
          ])
        } else if (data.type === 'welcome') {
          console.log(data.message)
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }
    
    websocket.onclose = () => {
      console.log('Disconnected from WebSocket server')
    }
    
    websocket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
    
    setWs(websocket)
    
    // Cleanup function
    return () => {
      if (websocket) {
        websocket.close()
      }
    }
  }, [])

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (newMessage.trim() === '' || !ws) return

    // Send message through WebSocket
    const messageData = {
      type: 'chat_message',
      sender: 'user',
      text: newMessage
    }
    
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(messageData))
      
      // Add message to local state immediately
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          text: newMessage,
          sender: 'user',
          timestamp: new Date()
        }
      ])
      
      setNewMessage('')
    } else {
      console.error('WebSocket is not open')
    }
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex flex-col h-96 bg-white rounded-lg shadow-md overflow-hidden">
      {/* Chat header */}
      <div className="bg-primary text-white p-4">
        <h3 className="font-bold text-lg">Chat with Pharmacist</h3>
        <p className="text-sm opacity-90">Online now</p>
      </div>
      
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-primary text-white rounded-br-none' 
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-primary-light' : 'text-gray-500'}`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 bg-white">
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-r-lg hover:bg-primary-dark transition-colors"
          >
            Send
          </button>
        </div>
      </form>
      
      {/* Integration Notes */}
      <div className="bg-yellow-50 p-3 text-xs text-yellow-800 border-t border-yellow-200">
        <p className="font-medium">Implementation Notes:</p>
        <p>Real-time chat is now implemented using WebSocket connection.</p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>WebSocket connection is established on component mount</li>
          <li>Messages are sent and received in real-time</li>
          <li>Message persistence should be implemented on the server</li>
          <li>Add typing indicators and read receipts for enhanced UX</li>
        </ul>
      </div>
    </div>
  )
}

export default ChatBox