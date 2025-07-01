/**
 * Curriculum Assessment Integration
 * 
 * This module integrates the ShatziiOS assessment system with the curriculum creator
 * and knowledge base. It allows the creation of personalized curriculum content
 * based on assessment results and learning profiles.
 */

// Assessment data cache
let assessmentData = null;
let learningPersona = null;

/**
 * Initialize curriculum assessment integration
 * @param {Object} options - Configuration options
 * @param {string} options.userId - User ID
 * @param {string} options.learningStyle - Learning style override (from URL param)
 * @param {string} options.neurotype - Neurotype override (from URL param) 
 */
async function initCurriculumAssessmentIntegration(options = {}) {
  const { userId, learningStyle, neurotype } = options;
  
  // If learningStyle and neurotype were provided in the URL (from dashboard),
  // use those values directly
  if (learningStyle && neurotype) {
    assessmentData = {
      primaryStyle: learningStyle,
      neurotype: neurotype
    };
    
    applyLearningProfile();
    return;
  }
  
  // Otherwise, load from API
  if (userId) {
    await loadUserAssessmentData(userId);
    applyLearningProfile();
  }
  
  // Add event listeners
  setupEventListeners();
}

/**
 * Load assessment data for a user
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} - Success status
 */
async function loadUserAssessmentData(userId) {
  try {
    // Get the most recent assessment result
    const assessmentResponse = await fetch(`/api/assessment/results/${userId}`);
    if (!assessmentResponse.ok) {
      throw new Error(`Failed to load assessment results: ${assessmentResponse.statusText}`);
    }
    
    const assessmentResult = await assessmentResponse.json();
    if (assessmentResult.status === 'success' && assessmentResult.results && assessmentResult.results.length > 0) {
      // Get the most recent assessment
      assessmentData = assessmentResult.results[0];
      
      // Get the learning persona for this assessment
      const personaResponse = await fetch(`/api/assessment/personas/${userId}`);
      if (personaResponse.ok) {
        const personaData = await personaResponse.json();
        if (personaData.status === 'success' && personaData.personas && personaData.personas.length > 0) {
          // Find the persona that matches this assessment
          learningPersona = personaData.personas.find(p => p.assessmentId === assessmentData.id) || personaData.personas[0];
        }
      }
      
      return true;
    } else {
      throw new Error('No assessment results found');
    }
  } catch (error) {
    console.error('Error loading assessment data:', error);
    return false;
  }
}

/**
 * Apply learning profile to curriculum creator UI
 */
function applyLearningProfile() {
  if (!assessmentData) return;
  
  const learningStyle = assessmentData.primaryStyle || 'visual';
  const neurotype = assessmentData.neurotype || 'general';
  
  // Create profile indicator in UI
  createProfileIndicator(learningStyle, neurotype);
  
  // Update form fields if they exist
  updateFormFields(learningStyle, neurotype);
  
  // Apply specific adaptations based on neurotype
  applyNeurotypeAdaptations(neurotype);
}

/**
 * Create profile indicator in the curriculum creator UI
 * @param {string} learningStyle - Primary learning style
 * @param {string} neurotype - Neurotype
 */
function createProfileIndicator(learningStyle, neurotype) {
  // Remove existing indicator if any
  const existingIndicator = document.getElementById('profile-indicator');
  if (existingIndicator) {
    existingIndicator.remove();
  }
  
  // Create new indicator
  const indicator = document.createElement('div');
  indicator.id = 'profile-indicator';
  indicator.className = 'profile-indicator';
  indicator.style.backgroundColor = 'rgba(40, 40, 70, 0.9)';
  indicator.style.borderRadius = '8px';
  indicator.style.padding = '0.75rem';
  indicator.style.marginBottom = '1.5rem';
  indicator.style.display = 'flex';
  indicator.style.alignItems = 'center';
  indicator.style.justifyContent = 'space-between';
  indicator.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  
  // Learning style color mapping
  const styleColors = {
    visual: '#4299E1', // blue
    auditory: '#F6AD55', // orange
    kinesthetic: '#68D391', // green
    reading: '#9F7AEA' // purple
  };
  
  // Neurotype icon mapping
  const neurotypeIcons = {
    general: '👤',
    dyslexia: '📖',
    adhd: '⚡',
    autism: '🧩'
  };
  
  const styleColor = styleColors[learningStyle] || styleColors.visual;
  const neurotypeIcon = neurotypeIcons[neurotype] || neurotypeIcons.general;
  
  indicator.innerHTML = `
    <div style="display: flex; align-items: center;">
      <span style="font-size: 1.5rem; margin-right: 0.75rem;">${neurotypeIcon}</span>
      <div>
        <div style="font-weight: bold; color: white; font-size: 1.1rem;">Personalizing for Your Learning Profile</div>
        <div style="color: #A0AEC0; font-size: 0.9rem;">
          ${capitalizeFirstLetter(learningStyle)} Learner 
          ${neurotype !== 'general' ? ` • ${capitalizeFirstLetter(neurotype)} Adaptations` : ''}
        </div>
      </div>
    </div>
    <button id="change-profile-btn" style="background-color: rgba(255, 255, 255, 0.1); border: none; color: white; padding: 0.5rem 0.75rem; border-radius: 4px; cursor: pointer;">
      Change
    </button>
  `;
  
  // Find insertion point - ideally before the first form
  const formElement = document.querySelector('form') || document.querySelector('.curriculum-form') || document.querySelector('.form-container');
  if (formElement) {
    formElement.parentNode.insertBefore(indicator, formElement);
  } else {
    // Fallback - insert after header or at beginning of main content
    const headerElement = document.querySelector('header') || document.querySelector('.header');
    if (headerElement) {
      headerElement.parentNode.insertBefore(indicator, headerElement.nextSibling);
    } else {
      const mainContent = document.querySelector('main') || document.querySelector('.main-content') || document.querySelector('.container');
      if (mainContent) {
        mainContent.prepend(indicator);
      }
    }
  }
  
  // Style the learning style
  const styleIndicator = document.createElement('div');
  styleIndicator.className = 'learning-style-indicator';
  styleIndicator.style.position = 'fixed';
  styleIndicator.style.top = '20px';
  styleIndicator.style.right = '20px';
  styleIndicator.style.backgroundColor = styleColor;
  styleIndicator.style.color = 'white';
  styleIndicator.style.padding = '0.5rem 1rem';
  styleIndicator.style.borderRadius = '20px';
  styleIndicator.style.fontWeight = 'bold';
  styleIndicator.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  styleIndicator.style.zIndex = '1000';
  styleIndicator.textContent = `${capitalizeFirstLetter(learningStyle)} Learning`;
  
  document.body.appendChild(styleIndicator);
}

/**
 * Update form fields with learning profile data
 * @param {string} learningStyle - Primary learning style
 * @param {string} neurotype - Neurotype
 */
function updateFormFields(learningStyle, neurotype) {
  // Find learning style field
  const learningStyleField = document.querySelector('select[name="learningStyle"], select[id="learning-style"], select[id="learningStyle"]');
  if (learningStyleField) {
    learningStyleField.value = learningStyle;
  }
  
  // Find neurotype field
  const neurotypeField = document.querySelector('select[name="neurotype"], select[id="neurotype"], select[id="adaptation"]');
  if (neurotypeField) {
    neurotypeField.value = neurotype;
  }
  
  // Update any hidden fields
  const hiddenLearningStyleField = document.querySelector('input[name="learningStyle"], input[id="learning-style-hidden"]');
  if (hiddenLearningStyleField) {
    hiddenLearningStyleField.value = learningStyle;
  }
  
  const hiddenNeurotypeField = document.querySelector('input[name="neurotype"], input[id="neurotype-hidden"]');
  if (hiddenNeurotypeField) {
    hiddenNeurotypeField.value = neurotype;
  }
}

/**
 * Apply neurotype-specific adaptations to the curriculum creator
 * @param {string} neurotype - Neurotype
 */
function applyNeurotypeAdaptations(neurotype) {
  // Remove existing adaptations
  document.body.classList.remove('dyslexia-adaptations', 'adhd-adaptations', 'autism-adaptations');
  
  // Apply new adaptations
  if (neurotype === 'dyslexia') {
    applyDyslexiaAdaptations();
  } else if (neurotype === 'adhd') {
    applyADHDAdaptations();
  } else if (neurotype === 'autism') {
    applyAutismAdaptations();
  }
}

/**
 * Apply dyslexia-friendly adaptations to the curriculum creator
 */
function applyDyslexiaAdaptations() {
  document.body.classList.add('dyslexia-adaptations');
  
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .dyslexia-adaptations {
      font-family: 'Comic Sans MS', 'Arial', sans-serif !important;
      line-height: 1.8 !important;
      word-spacing: 0.2em !important;
      letter-spacing: 0.05em !important;
    }
    .dyslexia-adaptations p, 
    .dyslexia-adaptations li, 
    .dyslexia-adaptations label, 
    .dyslexia-adaptations input, 
    .dyslexia-adaptations textarea {
      font-size: 1.05em !important;
    }
    .dyslexia-adaptations input, 
    .dyslexia-adaptations textarea, 
    .dyslexia-adaptations select {
      background-color: #FFFDD0 !important;
      line-height: 1.8 !important;
    }
  `;
  document.head.appendChild(styleElement);
  
  // Add accessibility toolbar option if it exists
  const accessibilityToolbar = document.querySelector('.accessibility-toolbar, .a11y-toolbar');
  if (accessibilityToolbar) {
    const dyslexiaOption = document.createElement('div');
    dyslexiaOption.className = 'accessibility-option active';
    dyslexiaOption.innerHTML = `
      <span class="option-icon">📖</span>
      <span class="option-text">Dyslexia Mode</span>
    `;
    accessibilityToolbar.appendChild(dyslexiaOption);
  }
}

/**
 * Apply ADHD-friendly adaptations to the curriculum creator
 */
function applyADHDAdaptations() {
  document.body.classList.add('adhd-adaptations');
  
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .adhd-adaptations form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .adhd-adaptations .form-group {
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 1rem;
      transition: all 0.3s ease;
    }
    .adhd-adaptations .form-group:hover {
      border-color: rgba(255, 255, 255, 0.3);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      transform: translateY(-2px);
    }
    .adhd-adaptations .form-group label {
      font-weight: bold;
      font-size: 1.1em;
      margin-bottom: 0.5rem;
      display: block;
    }
    .adhd-adaptations button {
      transition: all 0.3s ease;
    }
    .adhd-adaptations button:hover {
      transform: scale(1.05);
    }
  `;
  document.head.appendChild(styleElement);
  
  // Add accessibility toolbar option if it exists
  const accessibilityToolbar = document.querySelector('.accessibility-toolbar, .a11y-toolbar');
  if (accessibilityToolbar) {
    const adhdOption = document.createElement('div');
    adhdOption.className = 'accessibility-option active';
    adhdOption.innerHTML = `
      <span class="option-icon">⚡</span>
      <span class="option-text">ADHD Mode</span>
    `;
    accessibilityToolbar.appendChild(adhdOption);
  }
  
  // Find all form groups and add focus styles
  const formGroups = document.querySelectorAll('.form-group, .input-group, .field-group');
  formGroups.forEach(group => {
    group.classList.add('adhd-form-group');
  });
  
  // Add progress indicator if form has multiple steps
  const form = document.querySelector('form');
  if (form) {
    const formSteps = form.querySelectorAll('fieldset, .form-step, .form-section');
    if (formSteps.length > 1) {
      const progressIndicator = document.createElement('div');
      progressIndicator.className = 'progress-indicator';
      progressIndicator.style.marginBottom = '1.5rem';
      progressIndicator.style.display = 'flex';
      progressIndicator.style.justifyContent = 'space-between';
      
      for (let i = 0; i < formSteps.length; i++) {
        const step = document.createElement('div');
        step.className = 'progress-step';
        step.style.flex = '1';
        step.style.textAlign = 'center';
        step.style.padding = '0.5rem';
        step.style.backgroundColor = i === 0 ? '#4299E1' : 'rgba(255, 255, 255, 0.1)';
        step.style.color = i === 0 ? 'white' : '#A0AEC0';
        step.style.borderRadius = '4px';
        step.style.marginRight = i < formSteps.length - 1 ? '0.5rem' : '0';
        step.textContent = `Step ${i + 1}`;
        
        progressIndicator.appendChild(step);
      }
      
      form.prepend(progressIndicator);
    }
  }
}

/**
 * Apply autism-friendly adaptations to the curriculum creator
 */
function applyAutismAdaptations() {
  document.body.classList.add('autism-adaptations');
  
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .autism-adaptations * {
      transition: none !important;
      animation: none !important;
    }
    .autism-adaptations {
      filter: saturate(0.9);
    }
    .autism-adaptations .form-group,
    .autism-adaptations .input-group {
      margin-bottom: 2rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 1.5rem;
    }
    .autism-adaptations label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }
    .autism-adaptations .form-helper {
      background-color: rgba(66, 153, 225, 0.1);
      border-left: 3px solid #4299E1;
      padding: 0.75rem;
      margin-top: 0.5rem;
      border-radius: 4px;
    }
  `;
  document.head.appendChild(styleElement);
  
  // Add accessibility toolbar option if it exists
  const accessibilityToolbar = document.querySelector('.accessibility-toolbar, .a11y-toolbar');
  if (accessibilityToolbar) {
    const autismOption = document.createElement('div');
    autismOption.className = 'accessibility-option active';
    autismOption.innerHTML = `
      <span class="option-icon">🧩</span>
      <span class="option-text">Autism Mode</span>
    `;
    accessibilityToolbar.appendChild(autismOption);
  }
  
  // Add helper text to form fields
  const formGroups = document.querySelectorAll('.form-group, .input-group, .field-group');
  formGroups.forEach(group => {
    // Only add helper if not already present
    if (!group.querySelector('.form-helper, .helper-text, .hint')) {
      const input = group.querySelector('input, select, textarea');
      const label = group.querySelector('label');
      
      if (input && label) {
        const helperText = document.createElement('div');
        helperText.className = 'form-helper';
        helperText.style.color = '#A0AEC0';
        helperText.style.fontSize = '0.9rem';
        
        // Generate helper text based on input type and label
        const labelText = label.textContent.toLowerCase();
        
        if (input.type === 'text' && labelText.includes('name')) {
          helperText.textContent = 'Enter a descriptive name for your curriculum.';
        } else if (input.type === 'text' && labelText.includes('title')) {
          helperText.textContent = 'Enter a clear title that describes the content.';
        } else if (input.type === 'text' && labelText.includes('topic')) {
          helperText.textContent = 'Enter the main subject or topic for this curriculum.';
        } else if (input.tagName === 'SELECT' && labelText.includes('grade')) {
          helperText.textContent = 'Select the appropriate grade level for this curriculum.';
        } else if (input.tagName === 'SELECT' && labelText.includes('subject')) {
          helperText.textContent = 'Select the academic subject for this curriculum.';
        } else if (input.tagName === 'TEXTAREA') {
          helperText.textContent = 'Enter detailed information. Be as specific as possible.';
        } else {
          // Don't add a generic helper if we can't generate something specific
          return;
        }
        
        group.appendChild(helperText);
      }
    }
  });
}

/**
 * Create learning profile selector modal
 */
function createProfileSelector() {
  // Create modal overlay
  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'profile-selector-modal';
  modalOverlay.style.position = 'fixed';
  modalOverlay.style.top = '0';
  modalOverlay.style.left = '0';
  modalOverlay.style.width = '100%';
  modalOverlay.style.height = '100%';
  modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  modalOverlay.style.display = 'flex';
  modalOverlay.style.justifyContent = 'center';
  modalOverlay.style.alignItems = 'center';
  modalOverlay.style.zIndex = '2000';
  
  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.style.backgroundColor = 'var(--card-bg, #282846)';
  modalContent.style.borderRadius = '12px';
  modalContent.style.padding = '2rem';
  modalContent.style.width = '90%';
  modalContent.style.maxWidth = '500px';
  modalContent.style.position = 'relative';
  modalContent.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.5)';
  
  // Close button
  const closeButton = document.createElement('button');
  closeButton.innerHTML = '&times;';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '1rem';
  closeButton.style.right = '1rem';
  closeButton.style.background = 'none';
  closeButton.style.border = 'none';
  closeButton.style.color = 'var(--text-primary, white)';
  closeButton.style.fontSize = '1.5rem';
  closeButton.style.cursor = 'pointer';
  closeButton.style.width = '30px';
  closeButton.style.height = '30px';
  closeButton.style.display = 'flex';
  closeButton.style.justifyContent = 'center';
  closeButton.style.alignItems = 'center';
  closeButton.style.borderRadius = '50%';
  closeButton.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
  
  closeButton.addEventListener('click', () => {
    document.body.removeChild(modalOverlay);
  });
  
  modalContent.appendChild(closeButton);
  
  // Modal title
  const modalTitle = document.createElement('h2');
  modalTitle.style.color = 'var(--text-primary, white)';
  modalTitle.style.marginBottom = '1.5rem';
  modalTitle.style.textAlign = 'center';
  modalTitle.textContent = 'Select Learning Profile';
  
  modalContent.appendChild(modalTitle);
  
  // Learning style selector
  const learningStyleSection = document.createElement('div');
  learningStyleSection.style.marginBottom = '1.5rem';
  
  const learningStyleLabel = document.createElement('label');
  learningStyleLabel.style.display = 'block';
  learningStyleLabel.style.marginBottom = '0.5rem';
  learningStyleLabel.style.color = 'var(--text-primary, white)';
  learningStyleLabel.style.fontWeight = 'bold';
  learningStyleLabel.textContent = 'Learning Style:';
  
  const learningStyleSelect = document.createElement('select');
  learningStyleSelect.id = 'profile-learning-style';
  learningStyleSelect.style.width = '100%';
  learningStyleSelect.style.padding = '0.75rem';
  learningStyleSelect.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
  learningStyleSelect.style.color = 'var(--text-primary, white)';
  learningStyleSelect.style.border = '1px solid rgba(255, 255, 255, 0.2)';
  learningStyleSelect.style.borderRadius = '4px';
  
  const styleOptions = [
    { value: 'visual', label: 'Visual (learns best with images and visual aids)' },
    { value: 'auditory', label: 'Auditory (learns best by listening and discussing)' },
    { value: 'kinesthetic', label: 'Kinesthetic (learns best through activities and movement)' },
    { value: 'reading', label: 'Reading/Writing (learns best through text and notes)' }
  ];
  
  styleOptions.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option.value;
    optionElement.textContent = option.label;
    learningStyleSelect.appendChild(optionElement);
  });
  
  // Set default value from assessment if available
  if (assessmentData && assessmentData.primaryStyle) {
    learningStyleSelect.value = assessmentData.primaryStyle;
  }
  
  learningStyleSection.appendChild(learningStyleLabel);
  learningStyleSection.appendChild(learningStyleSelect);
  
  // Neurotype selector
  const neurotypeSection = document.createElement('div');
  neurotypeSection.style.marginBottom = '1.5rem';
  
  const neurotypeLabel = document.createElement('label');
  neurotypeLabel.style.display = 'block';
  neurotypeLabel.style.marginBottom = '0.5rem';
  neurotypeLabel.style.color = 'var(--text-primary, white)';
  neurotypeLabel.style.fontWeight = 'bold';
  neurotypeLabel.textContent = 'Adaptations For:';
  
  const neurotypeSelect = document.createElement('select');
  neurotypeSelect.id = 'profile-neurotype';
  neurotypeSelect.style.width = '100%';
  neurotypeSelect.style.padding = '0.75rem';
  neurotypeSelect.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
  neurotypeSelect.style.color = 'var(--text-primary, white)';
  neurotypeSelect.style.border = '1px solid rgba(255, 255, 255, 0.2)';
  neurotypeSelect.style.borderRadius = '4px';
  
  const neurotypeOptions = [
    { value: 'general', label: 'General' },
    { value: 'dyslexia', label: 'Dyslexia' },
    { value: 'adhd', label: 'ADHD' },
    { value: 'autism', label: 'Autism Spectrum' }
  ];
  
  neurotypeOptions.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option.value;
    optionElement.textContent = option.label;
    neurotypeSelect.appendChild(optionElement);
  });
  
  // Set default value from assessment if available
  if (assessmentData && assessmentData.neurotype) {
    neurotypeSelect.value = assessmentData.neurotype;
  }
  
  neurotypeSection.appendChild(neurotypeLabel);
  neurotypeSection.appendChild(neurotypeSelect);
  
  // Apply button
  const applyButton = document.createElement('button');
  applyButton.style.backgroundColor = 'var(--accent-color, #44AAFF)';
  applyButton.style.color = 'white';
  applyButton.style.border = 'none';
  applyButton.style.borderRadius = '4px';
  applyButton.style.padding = '0.75rem 1.5rem';
  applyButton.style.fontWeight = 'bold';
  applyButton.style.cursor = 'pointer';
  applyButton.style.width = '100%';
  applyButton.style.fontSize = '1rem';
  applyButton.style.marginTop = '1rem';
  applyButton.textContent = 'Apply Learning Profile';
  
  applyButton.addEventListener('click', () => {
    // Get selected values
    const learningStyle = document.getElementById('profile-learning-style').value;
    const neurotype = document.getElementById('profile-neurotype').value;
    
    // Update assessment data
    assessmentData = {
      ...assessmentData,
      primaryStyle: learningStyle,
      neurotype: neurotype
    };
    
    // Apply changes
    applyLearningProfile();
    
    // Close modal
    document.body.removeChild(modalOverlay);
  });
  
  // Assemble modal content
  modalContent.appendChild(learningStyleSection);
  modalContent.appendChild(neurotypeSection);
  modalContent.appendChild(applyButton);
  
  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);
}

/**
 * Set up event listeners for curriculum creator integration
 */
function setupEventListeners() {
  // Change profile button
  document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'change-profile-btn') {
      createProfileSelector();
    }
  });
  
  // Intercept curriculum form submission to add learning profile
  document.addEventListener('submit', function(e) {
    // Only intercept curriculum creation forms
    if (e.target && 
        (e.target.id === 'curriculum-form' || 
         e.target.className.includes('curriculum-form') || 
         e.target.action.includes('curriculum'))) {
      
      // Don't intercept if form already has learning profile fields
      const hasLearningStyleField = e.target.querySelector('[name="learningStyle"]');
      const hasNeurotypeField = e.target.querySelector('[name="neurotype"]');
      
      if (!hasLearningStyleField || !hasNeurotypeField) {
        e.preventDefault();
        
        // Get learning profile data
        const learningStyle = assessmentData ? assessmentData.primaryStyle : 'visual';
        const neurotype = assessmentData ? assessmentData.neurotype : 'general';
        
        // Add hidden fields to the form
        const learningStyleField = document.createElement('input');
        learningStyleField.type = 'hidden';
        learningStyleField.name = 'learningStyle';
        learningStyleField.value = learningStyle;
        
        const neurotypeField = document.createElement('input');
        neurotypeField.type = 'hidden';
        neurotypeField.name = 'neurotype';
        neurotypeField.value = neurotype;
        
        e.target.appendChild(learningStyleField);
        e.target.appendChild(neurotypeField);
        
        // Submit the form
        e.target.submit();
      }
    }
  });
  
  // Listen for learning profile change events from other components
  window.addEventListener('learningProfileChanged', function(e) {
    if (e.detail) {
      const { learningStyle, neurotype } = e.detail;
      
      // Update assessment data
      assessmentData = {
        ...assessmentData,
        primaryStyle: learningStyle || (assessmentData ? assessmentData.primaryStyle : 'visual'),
        neurotype: neurotype || (assessmentData ? assessmentData.neurotype : 'general')
      };
      
      // Apply changes
      applyLearningProfile();
    }
  });
}

/**
 * Enhance curriculum API requests with learning profile data
 * @param {Object} curriculumData - Curriculum request data
 * @returns {Object} - Enhanced curriculum data
 */
function enhanceWithLearningProfile(curriculumData) {
  if (!assessmentData) return curriculumData;
  
  const learningStyle = assessmentData.primaryStyle || 'visual';
  const neurotype = assessmentData.neurotype || 'general';
  
  // Only add if not already present
  if (!curriculumData.learningStyle) {
    curriculumData.learningStyle = learningStyle;
  }
  
  if (!curriculumData.neurotype && neurotype !== 'general') {
    curriculumData.neurotype = neurotype;
  }
  
  // Add adaptation level if available from persona
  if (learningPersona && learningPersona.adaptationLevel && !curriculumData.adaptationLevel) {
    curriculumData.adaptationLevel = learningPersona.adaptationLevel;
  }
  
  return curriculumData;
}

/**
 * Apply learning profile to curriculum response data
 * @param {Object} curriculumResponse - Curriculum response data
 * @returns {Object} - Enhanced curriculum response
 */
function enhanceCurriculumResponse(curriculumResponse) {
  if (!assessmentData || !curriculumResponse) return curriculumResponse;
  
  const learningStyle = assessmentData.primaryStyle || 'visual';
  
  // Add visual markers based on learning style
  if (learningStyle === 'visual' && curriculumResponse.units) {
    curriculumResponse.units = curriculumResponse.units.map(unit => {
      if (!unit.visualAids) {
        unit.visualAids = [
          'Concept maps for key ideas',
          'Color-coded section markers',
          'Infographics for complex concepts'
        ];
      }
      return unit;
    });
  }
  
  // Add auditory components for auditory learners
  if (learningStyle === 'auditory' && curriculumResponse.units) {
    curriculumResponse.units = curriculumResponse.units.map(unit => {
      if (!unit.auditoryActivities) {
        unit.auditoryActivities = [
          'Discussion prompts for each concept',
          'Verbal explanation guides',
          'Audio summaries of key points'
        ];
      }
      return unit;
    });
  }
  
  // Add hands-on activities for kinesthetic learners
  if (learningStyle === 'kinesthetic' && curriculumResponse.units) {
    curriculumResponse.units = curriculumResponse.units.map(unit => {
      if (!unit.kinestheticActivities) {
        unit.kinestheticActivities = [
          'Hands-on experiments and activities',
          'Role-playing exercises',
          'Physical manipulation of concepts'
        ];
      }
      return unit;
    });
  }
  
  // Add reading/writing activities for reading/writing learners
  if (learningStyle === 'reading' && curriculumResponse.units) {
    curriculumResponse.units = curriculumResponse.units.map(unit => {
      if (!unit.readingActivities) {
        unit.readingActivities = [
          'Extended reading lists',
          'Journal prompts and reflection activities',
          'Written summaries and analyses'
        ];
      }
      return unit;
    });
  }
  
  return curriculumResponse;
}

/**
 * Capitalize first letter of a string
 * @param {string} string - String to capitalize
 * @returns {string} - Capitalized string
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Create global object for curriculum integration
window.curriculumAssessmentIntegration = {
  initCurriculumAssessmentIntegration,
  loadUserAssessmentData,
  enhanceWithLearningProfile,
  enhanceCurriculumResponse
};