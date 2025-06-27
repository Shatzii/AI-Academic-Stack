/**
 * AI Tutor Configuration Script
 * 
 * This script provides client-side functionality for the AI Tutor Configuration interface,
 * connecting it to the backend AI integration API.
 */

// Current tutor configuration
let currentConfig = {
  name: "Tutoring Assistant",
  subject: "General",
  level: "Beginner",
  style: "Conversational",
  personality: "Friendly",
  adaptations: []
};

// Check if the API is available
async function checkAPIStatus() {
  try {
    const response = await fetch('/api/ai/integration/status');
    const data = await response.json();
    
    const apiStatusElement = document.getElementById('api-status');
    
    if (data.anthropic && data.anthropic.available) {
      apiStatusElement.innerHTML = '<span class="status-indicator connected"></span> AI services connected';
      apiStatusElement.classList.add('connected');
      apiStatusElement.classList.remove('disconnected');
    } else {
      apiStatusElement.innerHTML = '<span class="status-indicator disconnected"></span> AI services not available';
      apiStatusElement.classList.remove('connected');
      apiStatusElement.classList.add('disconnected');
    }
  } catch (error) {
    console.error('Error checking API status:', error);
    const apiStatusElement = document.getElementById('api-status');
    apiStatusElement.innerHTML = '<span class="status-indicator disconnected"></span> Error checking AI services';
    apiStatusElement.classList.remove('connected');
    apiStatusElement.classList.add('disconnected');
  }
}

// Update configuration when form changes
function updateConfig() {
  const name = document.getElementById('tutor-name').value;
  const subject = document.getElementById('subject').value;
  const level = document.getElementById('level').value;
  const style = document.getElementById('teaching-style').value;
  const personality = document.getElementById('personality').value;
  
  // Get selected adaptations
  const adaptationCheckboxes = document.querySelectorAll('input[name="adaptation"]:checked');
  const adaptations = Array.from(adaptationCheckboxes).map(cb => cb.value);
  
  // Update current configuration
  currentConfig = {
    name: name || "Tutoring Assistant",
    subject: subject || "General",
    level: level || "Beginner",
    style: style || "Conversational",
    personality: personality || "Friendly",
    adaptations: adaptations
  };
  
  // Update preview
  updatePreview();
}

// Update the preview based on current configuration
function updatePreview() {
  // Update preview elements
  document.getElementById('preview-name').textContent = currentConfig.name;
  document.getElementById('preview-subject').textContent = currentConfig.subject;
  document.getElementById('preview-level').textContent = currentConfig.level;
  document.getElementById('preview-style').textContent = currentConfig.style;
  document.getElementById('preview-personality').textContent = currentConfig.personality;
  
  // Update adaptations list
  const adaptationsList = document.getElementById('preview-adaptations');
  adaptationsList.innerHTML = '';
  
  if (currentConfig.adaptations.length > 0) {
    currentConfig.adaptations.forEach(adaptation => {
      const listItem = document.createElement('li');
      listItem.textContent = adaptation;
      adaptationsList.appendChild(listItem);
    });
  } else {
    const listItem = document.createElement('li');
    listItem.textContent = 'No specific adaptations';
    adaptationsList.appendChild(listItem);
  }
}

// Save configuration
async function saveConfig() {
  try {
    // This would normally save to a database via API
    localStorage.setItem('aiTutorConfig', JSON.stringify(currentConfig));
    
    // Show success message
    const saveMessage = document.getElementById('save-message');
    saveMessage.textContent = 'Configuration saved successfully!';
    saveMessage.style.display = 'block';
    
    // Hide message after 3 seconds
    setTimeout(() => {
      saveMessage.style.display = 'none';
    }, 3000);
  } catch (error) {
    console.error('Error saving configuration:', error);
    alert('Failed to save configuration. Please try again.');
  }
}

// Start a tutoring session with the current configuration
function startSession() {
  // Save configuration before starting
  localStorage.setItem('aiTutorConfig', JSON.stringify(currentConfig));
  
  // Redirect to tutoring session page
  window.location.href = '/ai-tutoring-session';
}

// Load a saved configuration
function loadSavedConfig() {
  const savedConfig = localStorage.getItem('aiTutorConfig');
  
  if (savedConfig) {
    try {
      currentConfig = JSON.parse(savedConfig);
      
      // Update form values
      document.getElementById('tutor-name').value = currentConfig.name;
      document.getElementById('subject').value = currentConfig.subject;
      document.getElementById('level').value = currentConfig.level;
      document.getElementById('teaching-style').value = currentConfig.style;
      document.getElementById('personality').value = currentConfig.personality;
      
      // Update adaptation checkboxes
      document.querySelectorAll('input[name="adaptation"]').forEach(checkbox => {
        checkbox.checked = currentConfig.adaptations.includes(checkbox.value);
      });
      
      // Update preview
      updatePreview();
    } catch (error) {
      console.error('Error loading saved configuration:', error);
    }
  }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  // Check API status
  checkAPIStatus();
  
  // Add event listeners to form inputs
  const formInputs = document.querySelectorAll('input, select');
  formInputs.forEach(input => {
    input.addEventListener('change', updateConfig);
  });
  
  // Add event listeners to buttons
  document.getElementById('save-button').addEventListener('click', saveConfig);
  document.getElementById('start-session-button').addEventListener('click', startSession);
  
  // Try to load saved configuration
  loadSavedConfig();
  
  // Initialize preview with default/loaded values
  updatePreview();
});