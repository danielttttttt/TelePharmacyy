import React, { useState, useRef, useEffect } from 'react'

const VideoCall = ({ onEndCall }) => {
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [ws, setWs] = useState(null)
  const [peerConnection, setPeerConnection] = useState(null)
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)

  // Initialize WebSocket connection and WebRTC
  useEffect(() => {
    // Create WebSocket connection for signaling
    const websocket = new WebSocket('ws://localhost:301')
    
    websocket.onopen = () => {
      console.log('Connected to WebSocket signaling server')
    }
    
    websocket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data)
        
        switch (data.type) {
          case 'video_signal':
            // Handle WebRTC signaling messages
            if (data.signal.type === 'offer') {
              await handleOffer(data.signal)
            } else if (data.signal.type === 'answer') {
              await handleAnswer(data.signal)
            } else if (data.signal.type === 'candidate') {
              await handleCandidate(data.signal)
            }
            break
            
          case 'welcome':
            console.log(data.message)
            break
            
          default:
            console.log('Unknown message type:', data.type)
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }
    
    websocket.onclose = () => {
      console.log('Disconnected from WebSocket signaling server')
    }
    
    websocket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
    
    setWs(websocket)
    
    // Initialize media and WebRTC
    initializeMediaAndWebRTC(websocket)
    
    // Cleanup function
    return () => {
      if (websocket) {
        websocket.close()
      }
      if (peerConnection) {
        peerConnection.close()
      }
      // Stop media streams
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const tracks = localVideoRef.current.srcObject.getTracks()
        tracks.forEach(track => track.stop())
      }
    }
  }, [])

  const initializeMediaAndWebRTC = async (websocket) => {
    try {
      // Create peer connection
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      })
      
      setPeerConnection(pc)
      
      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          websocket.send(JSON.stringify({
            type: 'video_signal',
            signal: {
              type: 'candidate',
              candidate: event.candidate
            }
          }))
        }
      }
      
      // Handle remote stream
      pc.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0]
        }
      }
      
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      // Set local stream
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
      
      // Add tracks to peer connection
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream)
      })
      
      // Create offer and send to remote peer
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      
      websocket.send(JSON.stringify({
        type: 'video_signal',
        signal: {
          type: 'offer',
          offer: offer
        }
      }))
      
      setIsConnected(true)
    } catch (error) {
      console.error('Error initializing media and WebRTC:', error)
      // Handle error (e.g., show a message to the user)
    }
  }
  
  const handleOffer = async (offer) => {
    if (!peerConnection) return
    
    try {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
      const answer = await peerConnection.createAnswer()
      await peerConnection.setLocalDescription(answer)
      
      // Send answer back through WebSocket
      ws.send(JSON.stringify({
        type: 'video_signal',
        signal: {
          type: 'answer',
          answer: answer
        }
      }))
    } catch (error) {
      console.error('Error handling offer:', error)
    }
  }
  
  const handleAnswer = async (answer) => {
    if (!peerConnection) return
    
    try {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
    } catch (error) {
      console.error('Error handling answer:', error)
    }
  }
  
  const handleCandidate = async (candidate) => {
    if (!peerConnection) return
    
    try {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
    } catch (error) {
      console.error('Error handling candidate:', error)
    }
  }

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn)
    // Toggle the video track
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const videoTracks = localVideoRef.current.srcObject.getVideoTracks()
      videoTracks.forEach(track => {
        track.enabled = !isCameraOn
      })
    }
  }

  const toggleMic = () => {
    setIsMicOn(!isMicOn)
    // Toggle the audio track
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const audioTracks = localVideoRef.current.srcObject.getAudioTracks()
      audioTracks.forEach(track => {
        track.enabled = !isMicOn
      })
    }
  }

  const endCall = () => {
    // In a real app, we would close the connection here
    onEndCall()
  }

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      {/* Remote video (pharmacist) */}
      <div className="relative w-full h-96 bg-gray-800">
        <div className="absolute inset-0 flex items-center justify-center">
          {isConnected ? (
            <div className="bg-gray-700 border-2 border-dashed border-gray-600 rounded-xl w-full h-full flex items-center justify-center">
              <div className="text-center text-white">
                <div className="bg-gray-600 border-2 border-dashed border-gray-500 rounded-xl w-32 h-32 mx-auto mb-4"></div>
                <p className="font-bold">Pharmacist Connected</p>
              </div>
            </div>
          ) : (
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-lg">Connecting to pharmacist...</p>
            </div>
          )}
        </div>
        
        {/* Local video (user) - positioned in corner */}
        <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-700 border-2 border-white rounded-lg overflow-hidden">
          <div className="w-full h-full bg-gray-600 flex items-center justify-center">
            {isCameraOn ? (
              <div className="bg-gray-500 border-2 border-dashed border-gray-400 rounded w-16 h-16"></div>
            ) : (
              <div className="text-white text-xs text-center">
                <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 002-2V8a2 2 00-2-2H5a2 2 0 00-2 2v8a2 0 002 2z"></path>
                </svg>
                <p>Camera Off</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="bg-gray-800 py-4 px-6 flex justify-center space-x-6">
        <button 
          onClick={toggleMic}
          className={`p-3 rounded-full ${isMicOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'} text-white transition-colors`}
          aria-label={isMicOn ? "Mute microphone" : "Unmute microphone"}
        >
          {isMicOn ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2 2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>
            </svg>
          )}
        </button>
        
        <button 
          onClick={toggleCamera}
          className={`p-3 rounded-full ${isCameraOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'} text-white transition-colors`}
          aria-label={isCameraOn ? "Turn camera off" : "Turn camera on"}
        >
          {isCameraOn ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 0 00-2 2v8a2 0 002 2z"></path>
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364a9 9 0 00-12.728 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          )}
        </button>
        
        <button 
          onClick={endCall}
          className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
          aria-label="End call"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      {/* Integration Notes */}
      <div className="bg-yellow-50 p-4 text-sm text-yellow-800">
        <p className="font-medium">Implementation Notes:</p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>To implement real video calls, a signaling server (WebSocket/HTTP) and TURN/STUN server are required</li>
          <li>Use WebRTC APIs for peer-to-peer communication</li>
          <li>Handle camera/microphone permissions properly</li>
          <li>Implement fallback flows for audio-only or chat-only modes</li>
        </ul>
      </div>
    </div>
  )
}

export default VideoCall