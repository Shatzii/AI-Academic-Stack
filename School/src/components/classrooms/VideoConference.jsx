import React, { useRef, useEffect, useState } from 'react'

const VideoConference = ({ classroomId, isActive }) => {
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const [isConnected, setIsConnected] = useState(false)
  const [participants, setParticipants] = useState([])
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)

  const peerConnectionRef = useRef(null)
  const localStreamRef = useRef(null)

  useEffect(() => {
    if (isActive) {
      initializeVideoConference()
    }

    return () => {
      cleanup()
    }
  }, [isActive, classroomId])

  const initializeVideoConference = async () => {
    try {
      // Get user media (camera and microphone)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })

      localStreamRef.current = stream

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      // Initialize WebRTC peer connection
      initializePeerConnection()

      setIsConnected(true)
    } catch (error) {
      console.error('Error accessing media devices:', error)
      // Fallback for demo purposes
      setIsConnected(false)
    }
  }

  const initializePeerConnection = () => {
    // Create RTCPeerConnection
    peerConnectionRef.current = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    })

    // Add local stream to peer connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        peerConnectionRef.current.addTrack(track, localStreamRef.current)
      })
    }

    // Handle remote stream
    peerConnectionRef.current.ontrack = (event) => {
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0]
      }
    }

    // Handle ICE candidates
    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        // Send ICE candidate to signaling server
        console.log('ICE candidate:', event.candidate)
      }
    }
  }

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks()
      audioTracks.forEach(track => {
        track.enabled = isMuted
      })
      setIsMuted(!isMuted)
    }
  }

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks()
      videoTracks.forEach(track => {
        track.enabled = isVideoOff
      })
      setIsVideoOff(!isVideoOff)
    }
  }

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        })

        // Replace video track with screen share
        const videoTrack = screenStream.getVideoTracks()[0]
        const sender = peerConnectionRef.current.getSenders().find(s =>
          s.track.kind === 'video'
        )

        if (sender) {
          sender.replaceTrack(videoTrack)
        }

        // Update local video
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream
        }

        setIsScreenSharing(true)

        // Handle screen share stop
        videoTrack.onended = () => {
          stopScreenShare()
        }
      } else {
        stopScreenShare()
      }
    } catch (error) {
      console.error('Error sharing screen:', error)
    }
  }

  const stopScreenShare = () => {
    // Restore camera video
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0]
      const sender = peerConnectionRef.current.getSenders().find(s =>
        s.track.kind === 'video'
      )

      if (sender) {
        sender.replaceTrack(videoTrack)
      }

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current
      }
    }

    setIsScreenSharing(false)
  }

  const leaveConference = () => {
    cleanup()
    setIsConnected(false)
  }

  const cleanup = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop())
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null
    }
  }

  if (!isActive) {
    return (
      <div className="video-placeholder">
        <i className="fas fa-video fa-3x text-muted mb-3"></i>
        <h4>Video Conference</h4>
        <p className="text-muted">Join the classroom to start video conferencing</p>
      </div>
    )
  }

  return (
    <div className="video-conference-container">
      <div className="video-grid">
        {/* Local Video */}
        <div className="video-tile local-video">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="video-element"
          />
          <div className="video-overlay">
            <span className="participant-name">You</span>
            {isMuted && <i className="fas fa-microphone-slash mute-indicator"></i>}
          </div>
        </div>

        {/* Remote Videos */}
        {participants.map((participant, index) => (
          <div key={participant.id} className="video-tile remote-video">
            <video
              ref={index === 0 ? remoteVideoRef : null}
              autoPlay
              playsInline
              className="video-element"
            />
            <div className="video-overlay">
              <span className="participant-name">{participant.name}</span>
              {participant.isMuted && <i className="fas fa-microphone-slash mute-indicator"></i>}
            </div>
          </div>
        ))}

        {/* Empty slots for participants */}
        {Array.from({ length: Math.max(0, 8 - participants.length - 1) }).map((_, index) => (
          <div key={`empty-${index}`} className="video-tile empty-slot">
            <div className="empty-slot-content">
              <i className="fas fa-user-plus fa-2x text-muted"></i>
              <span className="text-muted small">Waiting for participant</span>
            </div>
          </div>
        ))}
      </div>

      {/* Video Controls */}
      <div className="video-controls">
        <button
          className={`control-btn ${isMuted ? 'muted' : ''}`}
          onClick={toggleMute}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          <i className={`fas ${isMuted ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
        </button>

        <button
          className={`control-btn ${isVideoOff ? 'video-off' : ''}`}
          onClick={toggleVideo}
          title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
        >
          <i className={`fas ${isVideoOff ? 'fa-video-slash' : 'fa-video'}`}></i>
        </button>

        <button
          className={`control-btn ${isScreenSharing ? 'active' : ''}`}
          onClick={toggleScreenShare}
          title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
        >
          <i className="fas fa-desktop"></i>
        </button>

        <button
          className="control-btn leave-btn"
          onClick={leaveConference}
          title="Leave conference"
        >
          <i className="fas fa-phone-slash"></i>
        </button>
      </div>

      {/* Connection Status */}
      <div className="connection-status">
        <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
          <i className={`fas ${isConnected ? 'fa-circle' : 'fa-exclamation-triangle'}`}></i>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
        <span className="participant-count">
          <i className="fas fa-users"></i>
          {participants.length + 1} participants
        </span>
      </div>
    </div>
  )
}

export default VideoConference
