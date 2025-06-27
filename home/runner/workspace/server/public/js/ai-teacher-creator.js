/**
 * AI Teacher Creator Module
 * 
 * This module provides functionality for creating and interacting 
 * with AI teachers in the ShatziiOS platform.
 */

/**
 * Generate a random academic lastname for the teacher
 * @returns {string} - A random academic-sounding lastname
 */
function getRandomLastName() {
  const lastNames = [
    'Einstein', 'Curie', 'Newton', 'Hawking', 'Tesla', 'Goodall',
    'Turing', 'Darwin', 'Sagan', 'Lovelace', 'Franklin', 'Faraday',
    'Bohr', 'Feynman', 'Heisenberg', 'Maxwell', 'Pasteur', 'Planck',
    'Dawkins', 'Hopper', 'Germain', 'Bell', 'Kaku', 'Tyson'
  ];
  return lastNames[Math.floor(Math.random() * lastNames.length)];
}

document.addEventListener('DOMContentLoaded', () => {
  // DOM Element References
  const apiStatusElement = document.getElementById('api-status');
  const createTeacherForm = document.getElementById('create-teacher-form');
  const subjectInput = document.getElementById('subject');
  const gradeLevelInput = document.getElementById('grade-level');
  const teachingStyleInput = document.getElementById('teaching-style');
  const neurodivergentSupportInput = document.getElementById('neurotype-support');
  const createTeacherButton = document.getElementById('create-teacher-button');
  const resultContainer = document.getElementById('teacher-result');
  const loadingIndicator = document.getElementById('loading-indicator');
  const errorContainer = document.getElementById('error-message');
  
  // Check API status when page loads
  checkAPIStatus();
  
  // Add event listener to the form
  if (createTeacherForm) {
    createTeacherForm.addEventListener('submit', handleFormSubmit);
  }
  
  /**
   * Check the status of the AI API
   */
  async function checkAPIStatus() {
    if (!apiStatusElement) return;
    
    try {
      apiStatusElement.textContent = 'Checking API connection...';
      apiStatusElement.className = 'status-checking';
      
      // Get status from the AI API through integration routes
      const statusResponse = await fetch('/api/ai/integration/status');
      
      if (!statusResponse.ok) {
        throw new Error(`API server returned status ${statusResponse.status}`);
      }
      
      const statusData = await statusResponse.json();
      
      // Check if Anthropic API is available
      // The response now directly contains the anthropic status
      if (statusData.anthropic && statusData.anthropic.available) {
        apiStatusElement.textContent = '✅ AI API Connected';
        apiStatusElement.className = 'status-connected';
        
        // Enable the form
        if (createTeacherButton) {
          createTeacherButton.disabled = false;
        }
      } else {
        apiStatusElement.textContent = '⚠️ AI API Connected, but Anthropic API Key Missing';
        apiStatusElement.className = 'status-warning';
        showError('The AI API is running, but the Anthropic API key is missing or invalid. ' +
                  'AI teacher creation will not work until this is resolved.');
      }
    } catch (error) {
      apiStatusElement.textContent = '❌ Failed to connect to AI API';
      apiStatusElement.className = 'status-error';
      showError(`Could not connect to the AI API server: ${error.message}. ` + 
                `Make sure the API server is running.`);
    }
  }
  
  /**
   * Handle form submission
   * @param {Event} event - Form submit event
   */
  async function handleFormSubmit(event) {
    event.preventDefault();
    
    // Get form values
    const formData = {
      subject: subjectInput?.value,
      gradeLevel: gradeLevelInput?.value,
      teachingStyle: teachingStyleInput?.value,
      neurotype: neurodivergentSupportInput?.value || null
    };
    
    // Validate required fields
    if (!formData.subject || !formData.gradeLevel || !formData.teachingStyle) {
      showError('Please fill in all required fields (Subject, Grade Level, and Teaching Style).');
      return;
    }
    
    // Show loading indicator
    if (loadingIndicator) loadingIndicator.style.display = 'block';
    if (resultContainer) resultContainer.innerHTML = '';
    if (errorContainer) errorContainer.textContent = '';
    
    try {
      // Disable form while submitting
      if (createTeacherButton) createTeacherButton.disabled = true;
      
      // Send request to create teacher using integration route
      const response = await fetch('/api/ai/integration/create-teacher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      // Process response
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error (${response.status}): ${errorData.message || 'Unknown error'}`);
      }
      
      const result = await response.json();
      
      // For now create a teacher object from the system prompt
      // since the API now returns systemPrompt rather than a full teacher object
      if (result.success && result.systemPrompt) {
        const teacherName = formData.subject.includes("Professor") ? 
                            formData.subject : 
                            `Professor ${getRandomLastName()} (${formData.subject})`;
                            
        // Create a teacher object from the form data and system prompt
        const teacher = {
          name: teacherName,
          bio: `An expert AI teacher specializing in ${formData.subject} for ${formData.gradeLevel} students.`,
          philosophy: `Using a ${formData.teachingStyle} approach to make learning engaging and effective.`,
          strategies: [
            "Clear explanations adapted to student level",
            "Regular comprehension checks",
            "Real-world examples and applications",
            "Breaking complex topics into manageable parts"
          ],
          specializations: [
            formData.subject,
            `${formData.gradeLevel} Education`,
            `${formData.teachingStyle} Instruction`,
            formData.neurotype ? `${formData.neurotype} Support` : "Inclusive Teaching"
          ],
          config: {
            subject: formData.subject,
            gradeLevel: formData.gradeLevel,
            teachingStyle: formData.teachingStyle,
            neurotype: formData.neurotype
          },
          systemPrompt: result.systemPrompt
        };
        
        // Display the teacher profile
        displayTeacherProfile(teacher);
      } else {
        throw new Error('Invalid response format from AI teacher creation API');
      }
      
    } catch (error) {
      showError(`Error creating AI teacher: ${error.message}`);
    } finally {
      // Hide loading indicator and enable form
      if (loadingIndicator) loadingIndicator.style.display = 'none';
      if (createTeacherButton) createTeacherButton.disabled = false;
    }
  }
  
  /**
   * Display the AI teacher profile in the result container
   * @param {Object} teacher - Teacher profile data
   */
  function displayTeacherProfile(teacher) {
    if (!resultContainer) return;
    
    const html = `
      <div class="teacher-profile">
        <h2 class="teacher-name">${teacher.name}</h2>
        
        <div class="teacher-section">
          <h3>About</h3>
          <p>${teacher.bio}</p>
        </div>
        
        <div class="teacher-section">
          <h3>Teaching Philosophy</h3>
          <p>${teacher.philosophy}</p>
        </div>
        
        <div class="teacher-section">
          <h3>Teaching Strategies</h3>
          <ul>
            ${teacher.strategies.map(strategy => `<li>${strategy}</li>`).join('')}
          </ul>
        </div>
        
        <div class="teacher-section">
          <h3>Specialization Areas</h3>
          <ul>
            ${teacher.specializations.map(spec => `<li>${spec}</li>`).join('')}
          </ul>
        </div>
        
        <div class="teacher-section">
          <h3>Teacher Configuration</h3>
          <ul>
            <li><strong>Subject:</strong> ${teacher.config.subject}</li>
            <li><strong>Grade Level:</strong> ${teacher.config.gradeLevel}</li>
            <li><strong>Teaching Style:</strong> ${teacher.config.teachingStyle}</li>
            ${teacher.config.neurotype ? `<li><strong>Neurodivergent Support:</strong> ${teacher.config.neurotype}</li>` : ''}
          </ul>
        </div>
        
        <div class="teacher-actions">
          <button class="action-button" onclick="startTutoringSession('${encodeURIComponent(JSON.stringify(teacher))}')">
            Start Tutoring Session
          </button>
          
          <button class="action-button" onclick="generateLearningPlan('${encodeURIComponent(JSON.stringify(teacher))}')">
            Generate Learning Plan
          </button>
        </div>
      </div>
    `;
    
    resultContainer.innerHTML = html;
    resultContainer.scrollIntoView({ behavior: 'smooth' });
  }
  
  /**
   * Show an error message
   * @param {string} message - Error message to display
   */
  function showError(message) {
    if (errorContainer) {
      errorContainer.textContent = message;
      errorContainer.style.display = 'block';
    } else {
      console.error('Error:', message);
    }
    
    if (loadingIndicator) {
      loadingIndicator.style.display = 'none';
    }
  }
});

/**
 * Start a tutoring session with the created teacher
 * @param {string} teacherJson - JSON string of teacher profile
 */
function startTutoringSession(teacherJson) {
  try {
    const teacher = JSON.parse(decodeURIComponent(teacherJson));
    
    // Store teacher data in localStorage
    localStorage.setItem('current_teacher', JSON.stringify(teacher));
    
    // Redirect to tutoring session page
    window.location.href = '/ai-tutoring-session.html';
  } catch (error) {
    console.error('Error starting tutoring session:', error);
    alert('Failed to start tutoring session: ' + error.message);
  }
}

/**
 * Generate a learning plan with the created teacher
 * @param {string} teacherJson - JSON string of teacher profile
 */
function generateLearningPlan(teacherJson) {
  try {
    const teacher = JSON.parse(decodeURIComponent(teacherJson));
    
    // Store teacher data in localStorage
    localStorage.setItem('current_teacher', JSON.stringify(teacher));
    
    // Redirect to learning plan page
    window.location.href = '/learning-plan-generator.html';
  } catch (error) {
    console.error('Error navigating to learning plan generator:', error);
    alert('Failed to navigate to learning plan generator: ' + error.message);
  }
}