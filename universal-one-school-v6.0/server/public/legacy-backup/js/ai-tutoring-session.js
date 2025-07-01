/**
 * AI Tutoring Session Script
 * 
 * This script provides client-side functionality for the AI Tutoring Session interface,
 * connecting it to the backend AI integration API.
 */

// Teacher configuration for the current session
const teacherConfig = {
  name: "Professor Einstein",
  subject: "Mathematics",
  gradeLevel: "High School (9-12)",
  teachingStyle: "Socratic",
  supportTypes: ["ADHD", "Dyscalculia"],
  personalityTraits: ["Patient", "Supportive", "Enthusiastic"],
  formalityLevel: 3,
  description: "An engaging and patient mathematics teacher specializing in making complex concepts accessible for neurodivergent students.",
  expertise: "Algebra, Geometry, Problem-Solving, Visual Mathematics, Making Mathematical Concepts Accessible"
};

// Conversation history
let conversationHistory = [];

// Send a message to the AI teacher
async function sendMessage() {
  const messageInput = document.getElementById('message-input');
  const message = messageInput.value.trim();
  
  if (!message) return;
  
  // Add user message to the chat
  addUserMessage(message);
  
  // Clear input field
  messageInput.value = '';
  
  // Show typing indicator
  showTypingIndicator();
  
  try {
    // Call API to get teacher response
    const response = await fetch('/api/ai/integration/teacher-response', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        teacherConfig,
        conversationHistory,
        userMessage: message
      })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Hide typing indicator
    hideTypingIndicator();
    
    // Add AI response to the chat
    addAIMessage(data.response);
    
    // Update conversation history
    conversationHistory.push(
      { role: 'user', content: message },
      { role: 'assistant', content: data.response }
    );
  } catch (error) {
    console.error('Error sending message:', error);
    
    // Hide typing indicator
    hideTypingIndicator();
    
    // Add error message
    addSystemMessage('Failed to get response from AI teacher. Please try again.');
  }
}

// Add a user message to the chat
function addUserMessage(message) {
  const time = getCurrentTime();
  
  const messageElement = document.createElement('div');
  messageElement.className = 'message user-message';
  messageElement.innerHTML = `
    <div class="message-sender">You</div>
    <div class="message-content">
      <p>${escapeHTML(message)}</p>
    </div>
    <div class="message-timestamp">${time}</div>
  `;
  
  document.getElementById('chat-messages').appendChild(messageElement);
  scrollToBottom();
}

// Add an AI message to the chat
function addAIMessage(message) {
  const time = getCurrentTime();
  
  // Process message to handle markdown-like formatting
  const formattedMessage = formatMessage(message);
  
  const messageElement = document.createElement('div');
  messageElement.className = 'message ai-message';
  messageElement.innerHTML = `
    <div class="message-sender">Professor Einstein</div>
    <div class="message-content">
      ${formattedMessage}
    </div>
    <div class="message-timestamp">${time}</div>
    <div class="message-actions">
      <button class="message-action-button">Read Aloud</button>
      <button class="message-action-button">Visual Guide</button>
    </div>
  `;
  
  document.getElementById('chat-messages').appendChild(messageElement);
  
  // Add event listeners to message action buttons
  const actionButtons = messageElement.querySelectorAll('.message-action-button');
  actionButtons.forEach(button => {
    button.addEventListener('click', function() {
      if (this.textContent === 'Read Aloud') {
        readAloud(message);
      } else if (this.textContent === 'Visual Guide') {
        generateVisualGuide(message);
      }
    });
  });
  
  scrollToBottom();
}

// Add a system message to the chat
function addSystemMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.className = 'system-message';
  messageElement.textContent = message;
  
  document.getElementById('chat-messages').appendChild(messageElement);
  scrollToBottom();
}

// Show typing indicator
function showTypingIndicator() {
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'typing-indicator';
  typingIndicator.innerHTML = `
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
  `;
  
  document.getElementById('chat-messages').appendChild(typingIndicator);
  scrollToBottom();
}

// Hide typing indicator
function hideTypingIndicator() {
  const typingIndicator = document.querySelector('.typing-indicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// Format message (convert markdown-like syntax to HTML)
function formatMessage(message) {
  let formatted = message;
  
  // Convert code blocks
  formatted = formatted.replace(/```([^`]+)```/g, '<pre>$1</pre>');
  
  // Convert inline code
  formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Convert line breaks to paragraphs
  formatted = '<p>' + formatted.replace(/\n\n/g, '</p><p>') + '</p>';
  
  // Handle single line breaks
  formatted = formatted.replace(/\n/g, '<br>');
  
  return formatted;
}

// Escape HTML characters
function escapeHTML(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Get current time in HH:MM AM/PM format
function getCurrentTime() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // Convert 0 to 12
  
  return `${hours}:${minutes} ${ampm}`;
}

// Scroll to the bottom of the chat
function scrollToBottom() {
  const chatMessages = document.getElementById('chat-messages');
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Read message aloud using Web Speech API
function readAloud(message) {
  if ('speechSynthesis' in window) {
    const speech = new SpeechSynthesisUtterance(message);
    speech.rate = 0.9; // Slightly slower than default
    window.speechSynthesis.speak(speech);
  } else {
    alert('Text-to-speech is not supported in your browser.');
  }
}

// Generate a visual guide (placeholder for now)
function generateVisualGuide(message) {
  alert('Visual guide generation would be implemented here.');
  // In a real implementation, this would call an API to generate visuals
}

// End the tutoring session
function endSession() {
  const confirmed = confirm('Are you sure you want to end this tutoring session?');
  if (confirmed) {
    // Save session data
    console.log('Saving session data:', {
      teacher: teacherConfig,
      conversationHistory
    });
    
    // Redirect to dashboard
    window.location.href = '/student-dashboard';
  }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  // Send message when clicking the send button
  document.getElementById('send-button').addEventListener('click', sendMessage);
  
  // Send message when pressing Enter (but allow Shift+Enter for new line)
  document.getElementById('message-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  
  // End session button
  const endSessionButton = document.querySelector('.header-actions .secondary-button');
  if (endSessionButton) {
    endSessionButton.addEventListener('click', endSession);
  }
  
  // Initialize with welcome message
  addAIMessage(`Hello there! I'm Professor Einstein, your math tutor for today. We'll be covering linear equations in this session.

How familiar are you with solving equations like \`2x + 5 = 13\`? Would you like to start with some basics or jump right into more challenging problems?`);
  
  // Initial scroll to bottom
  scrollToBottom();
  
  // Add existing messages to conversation history
  conversationHistory.push(
    { 
      role: 'assistant', 
      content: `Hello there! I'm Professor Einstein, your math tutor for today. We'll be covering linear equations in this session.

How familiar are you with solving equations like \`2x + 5 = 13\`? Would you like to start with some basics or jump right into more challenging problems?` 
    }
  );
  
  // Auto focus the input field
  document.getElementById('message-input').focus();
});