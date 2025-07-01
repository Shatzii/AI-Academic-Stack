/**
 * Assessment Dashboard Integration
 * 
 * This module integrates the ShatziiOS assessment system with the various dashboard interfaces
 * and the curriculum creator/knowledge base. It allows dashboards to display personalized
 * learning recommendations based on assessment results.
 */

// Assessment data cache
let assessmentResults = null;
let learningPersona = null;
let recommendedStrategies = [];
let strengthsAndChallenges = {
  strengths: [],
  challenges: []
};

/**
 * Initialize the assessment integration features
 * @param {Object} options - Configuration options
 * @param {string} options.dashboardType - Type of dashboard ('primary', 'secondary', 'law', 'language')
 * @param {string} options.userId - Current user ID
 */
function initAssessmentIntegration(options) {
  const { dashboardType, userId } = options;
  
  if (!userId) {
    console.error('User ID is required for assessment integration');
    return;
  }
  
  // Create the assessment widget if not already present
  if (!document.getElementById('assessment-widget')) {
    createAssessmentWidget(dashboardType);
  }
  
  // Load assessment data for the user
  loadUserAssessmentData(userId)
    .then(() => {
      updateDashboardWithAssessmentData(dashboardType);
    })
    .catch(error => {
      console.error('Failed to load assessment data:', error);
      showAssessmentPrompt(dashboardType);
    });
    
  // Add event listeners for assessment-related buttons
  setupEventListeners();
}

/**
 * Create assessment widget UI for the specified dashboard
 * @param {string} dashboardType - Type of dashboard
 */
function createAssessmentWidget(dashboardType) {
  const styles = {
    primary: {
      bgColor: 'var(--card-bg)',
      titleColor: 'var(--primary-color)',
      iconColor: 'var(--secondary-color)',
      buttonBg: 'var(--accent-color)',
      buttonText: 'white'
    },
    secondary: {
      bgColor: '#2D3748',
      titleColor: '#4299E1',
      iconColor: '#ECC94B',
      buttonBg: '#4299E1',
      buttonText: 'white'
    },
    law: {
      bgColor: '#2A2F45',
      titleColor: '#90CDF4',
      iconColor: '#F6AD55',
      buttonBg: '#4A5568',
      buttonText: 'white'
    },
    language: {
      bgColor: '#1E3A8A',
      titleColor: '#60A5FA',
      iconColor: '#FCD34D',
      buttonBg: '#3B82F6',
      buttonText: 'white'
    }
  };
  
  const style = styles[dashboardType] || styles.primary;
  
  // Create the widget container
  const widget = document.createElement('div');
  widget.id = 'assessment-widget';
  widget.className = 'assessment-widget';
  widget.style.backgroundColor = style.bgColor;
  widget.style.borderRadius = '12px';
  widget.style.padding = '1.5rem';
  widget.style.marginBottom = '1.5rem';
  widget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  
  // Add widget content
  widget.innerHTML = `
    <div class="assessment-widget-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
      <h3 style="color: ${style.titleColor}; margin: 0; font-size: 1.25rem; font-weight: bold; display: flex; align-items: center;">
        <span style="font-size: 1.5rem; margin-right: 0.5rem; color: ${style.iconColor};">🧠</span>
        Learning Profile
      </h3>
      <button id="assessment-refresh-btn" style="background: none; border: none; color: ${style.iconColor}; cursor: pointer; font-size: 1.2rem;">
        ⟳
      </button>
    </div>
    <div id="assessment-content" class="assessment-widget-content">
      <div id="assessment-loading" style="text-align: center; padding: 1rem;">
        <div style="display: inline-block; width: 24px; height: 24px; border: 3px solid rgba(255, 255, 255, 0.3); border-radius: 50%; border-top-color: ${style.iconColor}; animation: spin 1s ease-in-out infinite;"></div>
        <style>
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        </style>
        <p style="margin-top: 0.5rem; color: #A0AEC0;">Loading your learning profile...</p>
      </div>
      <div id="assessment-data" style="display: none;">
        <!-- Assessment data will be inserted here -->
      </div>
      <div id="assessment-prompt" style="display: none; text-align: center; padding: 1rem;">
        <p style="margin-bottom: 1rem; color: #A0AEC0;">Complete a learning assessment to get personalized recommendations.</p>
        <button id="start-assessment-btn" style="background-color: ${style.buttonBg}; color: ${style.buttonText}; border: none; border-radius: 20px; padding: 0.5rem 1.25rem; font-weight: bold; cursor: pointer; transition: all 0.3s ease;">
          Start Assessment
        </button>
      </div>
    </div>
  `;
  
  // Find the right place to insert the widget based on dashboard type
  let targetElement;
  if (dashboardType === 'primary') {
    targetElement = document.querySelector('.hero-section') || document.querySelector('.main-content');
    if (targetElement) {
      targetElement.parentNode.insertBefore(widget, targetElement.nextSibling);
    } else {
      document.querySelector('.container').appendChild(widget);
    }
  } else {
    // For other dashboard types
    targetElement = document.querySelector('.main-content') || document.querySelector('.dashboard-content');
    if (targetElement) {
      targetElement.prepend(widget);
    } else {
      document.body.appendChild(widget);
    }
  }
  
  // Add style for widget
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .assessment-widget {
      transition: all 0.3s ease;
    }
    .assessment-widget:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
    }
    .assessment-strategy {
      padding: 0.5rem;
      margin-bottom: 0.5rem;
      border-radius: 8px;
      background-color: rgba(255, 255, 255, 0.1);
      transition: all 0.2s ease;
    }
    .assessment-strategy:hover {
      background-color: rgba(255, 255, 255, 0.15);
    }
    .assessment-strength {
      color: #68D391;
    }
    .assessment-challenge {
      color: #FC8181;
    }
  `;
  document.head.appendChild(styleElement);
}

/**
 * Load assessment data for a user
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
async function loadUserAssessmentData(userId) {
  try {
    // Get the most recent assessment result
    const assessmentResponse = await fetch(`/api/assessment/results/${userId}`);
    if (!assessmentResponse.ok) {
      throw new Error(`Failed to load assessment results: ${assessmentResponse.statusText}`);
    }
    
    const assessmentData = await assessmentResponse.json();
    if (assessmentData.status === 'success' && assessmentData.results && assessmentData.results.length > 0) {
      // Get the most recent assessment
      assessmentResults = assessmentData.results[0];
      
      // Get the learning persona for this assessment
      const personaResponse = await fetch(`/api/assessment/personas/${userId}`);
      if (personaResponse.ok) {
        const personaData = await personaResponse.json();
        if (personaData.status === 'success' && personaData.personas && personaData.personas.length > 0) {
          // Find the persona that matches this assessment
          learningPersona = personaData.personas.find(p => p.assessmentId === assessmentResults.id) || personaData.personas[0];
          
          if (learningPersona) {
            // Extract recommended strategies
            recommendedStrategies = learningPersona.strategies || [];
            
            // Extract strengths and challenges
            strengthsAndChallenges.strengths = learningPersona.strengths || [];
            strengthsAndChallenges.challenges = learningPersona.challenges || [];
          }
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
 * Update dashboard elements with assessment data
 * @param {string} dashboardType - Type of dashboard
 */
function updateDashboardWithAssessmentData(dashboardType) {
  const loadingElement = document.getElementById('assessment-loading');
  const assessmentDataElement = document.getElementById('assessment-data');
  const assessmentPromptElement = document.getElementById('assessment-prompt');
  
  if (!assessmentResults || !learningPersona) {
    // No assessment data available
    if (loadingElement) loadingElement.style.display = 'none';
    if (assessmentDataElement) assessmentDataElement.style.display = 'none';
    if (assessmentPromptElement) assessmentPromptElement.style.display = 'block';
    return;
  }
  
  // Hide loading, show data
  if (loadingElement) loadingElement.style.display = 'none';
  if (assessmentPromptElement) assessmentPromptElement.style.display = 'none';
  if (assessmentDataElement) {
    assessmentDataElement.style.display = 'block';
    
    // Create learning profile content
    const learningStyle = assessmentResults.primaryStyle || 'visual';
    const neurotype = assessmentResults.neurotype || 'general';
    
    assessmentDataElement.innerHTML = `
      <div style="margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span style="color: #A0AEC0;">Learning Style:</span>
          <span style="font-weight: bold; color: #90CDF4;">${capitalizeFirstLetter(learningStyle)}</span>
        </div>
        ${assessmentResults.secondaryStyle ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span style="color: #A0AEC0;">Secondary Style:</span>
          <span style="font-weight: bold; color: #90CDF4;">${capitalizeFirstLetter(assessmentResults.secondaryStyle)}</span>
        </div>
        ` : ''}
        ${neurotype !== 'general' ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span style="color: #A0AEC0;">Adaptations:</span>
          <span style="font-weight: bold; color: #90CDF4;">${capitalizeFirstLetter(neurotype)}</span>
        </div>
        ` : ''}
      </div>
      
      ${learningPersona.name ? `
      <div style="margin-bottom: 1rem;">
        <h4 style="color: #E9D8FD; font-size: 1.1rem; margin-bottom: 0.5rem;">Your Learning Persona</h4>
        <div style="background-color: rgba(95, 48, 226, 0.1); border-left: 3px solid #805AD5; padding: 0.75rem; border-radius: 4px;">
          <p style="margin: 0; color: #CBD5E0; font-style: italic;">${learningPersona.name}</p>
        </div>
      </div>
      ` : ''}
      
      ${recommendedStrategies.length > 0 ? `
      <div style="margin-bottom: 1rem;">
        <h4 style="color: #E9D8FD; font-size: 1.1rem; margin-bottom: 0.5rem;">Recommended Strategies</h4>
        <div style="max-height: 120px; overflow-y: auto; padding-right: 0.5rem;">
          ${recommendedStrategies.slice(0, 3).map(strategy => `
            <div class="assessment-strategy">
              <span style="color: #90CDF4;">•</span> ${strategy}
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}
      
      <div style="display: flex; justify-content: center; margin-top: 1rem;">
        <button id="view-full-profile-btn" style="background-color: rgba(255, 255, 255, 0.1); color: white; border: none; border-radius: 20px; padding: 0.5rem 1.25rem; font-weight: bold; cursor: pointer; transition: all 0.3s ease;">
          View Full Profile
        </button>
      </div>
    `;
    
    // Add event listener to the "View Full Profile" button
    const viewProfileBtn = document.getElementById('view-full-profile-btn');
    if (viewProfileBtn) {
      viewProfileBtn.addEventListener('click', () => openLearningProfileModal());
    }
  }
  
  // Integrate with curriculum elements if they exist
  integrateWithCurriculum(dashboardType);
}

/**
 * Show assessment prompt when no assessment data is available
 * @param {string} dashboardType - Type of dashboard
 */
function showAssessmentPrompt(dashboardType) {
  const loadingElement = document.getElementById('assessment-loading');
  const assessmentDataElement = document.getElementById('assessment-data');
  const assessmentPromptElement = document.getElementById('assessment-prompt');
  
  if (loadingElement) loadingElement.style.display = 'none';
  if (assessmentDataElement) assessmentDataElement.style.display = 'none';
  if (assessmentPromptElement) assessmentPromptElement.style.display = 'block';
}

/**
 * Integrate assessment data with curriculum elements
 * @param {string} dashboardType - Type of dashboard
 */
function integrateWithCurriculum(dashboardType) {
  if (!assessmentResults || !learningPersona) return;
  
  const learningStyle = assessmentResults.primaryStyle || 'visual';
  const neurotype = assessmentResults.neurotype || 'general';
  
  // Find curriculum cards or content blocks
  const curriculumCards = document.querySelectorAll('.curriculum-card, .lesson-card, .unit-card, .module-card');
  if (curriculumCards.length > 0) {
    curriculumCards.forEach(card => {
      // Create a recommendation badge
      const badge = document.createElement('div');
      badge.className = 'recommendation-badge';
      badge.style.position = 'absolute';
      badge.style.top = '0';
      badge.style.right = '0';
      badge.style.backgroundColor = 'rgba(104, 211, 145, 0.9)';
      badge.style.color = 'white';
      badge.style.padding = '0.25rem 0.5rem';
      badge.style.borderRadius = '0 0 0 8px';
      badge.style.fontSize = '0.8rem';
      badge.style.fontWeight = 'bold';
      badge.style.zIndex = '10';
      badge.textContent = 'Recommended';
      
      // Determine if this card matches the learning style
      const cardText = card.textContent.toLowerCase();
      const isRecommended = 
        (learningStyle === 'visual' && (cardText.includes('visual') || cardText.includes('diagram') || cardText.includes('watch'))) ||
        (learningStyle === 'auditory' && (cardText.includes('audio') || cardText.includes('listen') || cardText.includes('sound'))) ||
        (learningStyle === 'kinesthetic' && (cardText.includes('activity') || cardText.includes('hands-on') || cardText.includes('practice'))) ||
        (learningStyle === 'reading' && (cardText.includes('read') || cardText.includes('text') || cardText.includes('book')));
      
      if (isRecommended) {
        // Make sure card has position relative for absolute positioning of badge
        if (window.getComputedStyle(card).position === 'static') {
          card.style.position = 'relative';
        }
        
        card.appendChild(badge);
        
        // Highlight card
        card.style.boxShadow = '0 0 10px rgba(104, 211, 145, 0.5)';
        card.style.transform = 'translateY(-5px)';
      }
    });
  }
  
  // Apply specific adaptations based on neurotype
  if (neurotype === 'dyslexia') {
    applyDyslexiaAdaptations();
  } else if (neurotype === 'adhd') {
    applyADHDAdaptations();
  } else if (neurotype === 'autism') {
    applyAutismAdaptations();
  }
}

/**
 * Apply dyslexia-friendly adaptations to the interface
 */
function applyDyslexiaAdaptations() {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    body {
      font-family: 'Comic Sans MS', 'Arial', sans-serif !important;
      line-height: 1.8 !important;
      word-spacing: 0.2em !important;
      letter-spacing: 0.05em !important;
    }
    p, li, span:not(.icon):not(.emoji) {
      font-size: 1.05em !important;
    }
    .reading-guide {
      position: fixed;
      left: 0;
      width: 100%;
      height: 30px;
      background-color: rgba(255, 255, 0, 0.1);
      pointer-events: none;
      z-index: 9999;
      display: none;
    }
  `;
  document.head.appendChild(styleElement);
  
  // Add reading guide element
  const readingGuide = document.createElement('div');
  readingGuide.className = 'reading-guide';
  document.body.appendChild(readingGuide);
  
  // Add reading guide toggle button to accessibility toolbar if it exists
  const accessibilityToolbar = document.querySelector('.accessibility-toolbar, .a11y-toolbar');
  if (accessibilityToolbar) {
    const readingGuideBtn = document.createElement('button');
    readingGuideBtn.textContent = 'Reading Guide';
    readingGuideBtn.className = 'accessibility-btn';
    readingGuideBtn.addEventListener('click', toggleReadingGuide);
    accessibilityToolbar.appendChild(readingGuideBtn);
  }
}

/**
 * Apply ADHD-friendly adaptations to the interface
 */
function applyADHDAdaptations() {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .focus-mode {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      z-index: 9998;
      display: none;
      pointer-events: none;
    }
    .focus-highlight {
      position: absolute;
      background-color: transparent;
      box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7);
      pointer-events: none;
      z-index: 9998;
      border-radius: 8px;
    }
    .progress-tracker {
      position: fixed;
      top: 10px;
      right: 10px;
      background-color: rgba(40, 40, 70, 0.9);
      padding: 10px;
      border-radius: 8px;
      z-index: 9999;
      color: white;
      font-weight: bold;
      display: none;
    }
  `;
  document.head.appendChild(styleElement);
  
  // Add focus mode elements
  const focusMode = document.createElement('div');
  focusMode.className = 'focus-mode';
  document.body.appendChild(focusMode);
  
  const focusHighlight = document.createElement('div');
  focusHighlight.className = 'focus-highlight';
  document.body.appendChild(focusHighlight);
  
  // Add progress tracker
  const progressTracker = document.createElement('div');
  progressTracker.className = 'progress-tracker';
  progressTracker.textContent = 'Task Progress: 0%';
  document.body.appendChild(progressTracker);
  
  // Add focus mode toggle button to accessibility toolbar if it exists
  const accessibilityToolbar = document.querySelector('.accessibility-toolbar, .a11y-toolbar');
  if (accessibilityToolbar) {
    const focusModeBtn = document.createElement('button');
    focusModeBtn.textContent = 'Focus Mode';
    focusModeBtn.className = 'accessibility-btn';
    focusModeBtn.addEventListener('click', toggleFocusMode);
    accessibilityToolbar.appendChild(focusModeBtn);
  }
}

/**
 * Apply autism-friendly adaptations to the interface
 */
function applyAutismAdaptations() {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    body {
      transition: all 0.5s ease !important;
    }
    .reduced-motion * {
      animation: none !important;
      transition: none !important;
    }
    .low-contrast {
      filter: contrast(0.8) brightness(1.2);
    }
    .visual-schedule {
      position: fixed;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      background-color: rgba(40, 40, 70, 0.9);
      padding: 10px;
      border-radius: 8px;
      z-index: 9999;
      color: white;
      display: none;
      width: 200px;
    }
    .visual-schedule-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      padding: 5px;
      border-radius: 5px;
    }
    .visual-schedule-item.active {
      background-color: rgba(255, 255, 255, 0.2);
    }
    .visual-schedule-icon {
      margin-right: 10px;
      font-size: 1.5rem;
    }
  `;
  document.head.appendChild(styleElement);
  
  // Add visual schedule
  const visualSchedule = document.createElement('div');
  visualSchedule.className = 'visual-schedule';
  visualSchedule.innerHTML = `
    <h3 style="margin-bottom: 10px; text-align: center;">Today's Plan</h3>
    <div class="visual-schedule-item active">
      <span class="visual-schedule-icon">📚</span>
      <span>Reading Activity</span>
    </div>
    <div class="visual-schedule-item">
      <span class="visual-schedule-icon">🧮</span>
      <span>Math Practice</span>
    </div>
    <div class="visual-schedule-item">
      <span class="visual-schedule-icon">🍎</span>
      <span>Break Time</span>
    </div>
    <div class="visual-schedule-item">
      <span class="visual-schedule-icon">🔍</span>
      <span>Science Exploration</span>
    </div>
  `;
  document.body.appendChild(visualSchedule);
  
  // Add buttons to accessibility toolbar if it exists
  const accessibilityToolbar = document.querySelector('.accessibility-toolbar, .a11y-toolbar');
  if (accessibilityToolbar) {
    const reducedMotionBtn = document.createElement('button');
    reducedMotionBtn.textContent = 'Reduce Motion';
    reducedMotionBtn.className = 'accessibility-btn';
    reducedMotionBtn.addEventListener('click', toggleReducedMotion);
    
    const visualScheduleBtn = document.createElement('button');
    visualScheduleBtn.textContent = 'Visual Schedule';
    visualScheduleBtn.className = 'accessibility-btn';
    visualScheduleBtn.addEventListener('click', toggleVisualSchedule);
    
    accessibilityToolbar.appendChild(reducedMotionBtn);
    accessibilityToolbar.appendChild(visualScheduleBtn);
  }
}

/**
 * Open a modal with the full learning profile
 */
function openLearningProfileModal() {
  if (!assessmentResults || !learningPersona) return;
  
  // Create modal container
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.style.position = 'fixed';
  modalOverlay.style.top = '0';
  modalOverlay.style.left = '0';
  modalOverlay.style.width = '100%';
  modalOverlay.style.height = '100%';
  modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  modalOverlay.style.display = 'flex';
  modalOverlay.style.justifyContent = 'center';
  modalOverlay.style.alignItems = 'center';
  modalOverlay.style.zIndex = '9999';
  
  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  modalContent.style.backgroundColor = 'var(--card-bg, #282846)';
  modalContent.style.borderRadius = '12px';
  modalContent.style.padding = '2rem';
  modalContent.style.width = '90%';
  modalContent.style.maxWidth = '700px';
  modalContent.style.maxHeight = '90vh';
  modalContent.style.overflowY = 'auto';
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
  
  // Modal header
  const modalHeader = document.createElement('div');
  modalHeader.style.marginBottom = '1.5rem';
  modalHeader.style.textAlign = 'center';
  
  const modalTitle = document.createElement('h2');
  modalTitle.style.color = 'var(--primary-color, #FF5588)';
  modalTitle.style.marginBottom = '0.5rem';
  modalTitle.textContent = 'Your Learning Profile';
  
  const modalSubtitle = document.createElement('p');
  modalSubtitle.style.color = 'var(--text-secondary, #CCCCCC)';
  modalSubtitle.style.fontSize = '1.1rem';
  modalSubtitle.textContent = 'Personalized learning insights and recommendations';
  
  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(modalSubtitle);
  modalContent.appendChild(modalHeader);
  
  // Learning persona section
  if (learningPersona && learningPersona.name) {
    const personaSection = document.createElement('div');
    personaSection.style.marginBottom = '2rem';
    personaSection.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
    personaSection.style.padding = '1.5rem';
    personaSection.style.borderRadius = '8px';
    
    const personaTitle = document.createElement('h3');
    personaTitle.style.color = 'var(--accent-color, #44AAFF)';
    personaTitle.style.marginBottom = '1rem';
    personaTitle.textContent = learningPersona.name;
    
    const personaDesc = document.createElement('p');
    personaDesc.style.color = 'var(--text-primary, white)';
    personaDesc.style.lineHeight = '1.6';
    personaDesc.textContent = learningPersona.description || 'Your unique learning profile based on your assessment results.';
    
    personaSection.appendChild(personaTitle);
    personaSection.appendChild(personaDesc);
    modalContent.appendChild(personaSection);
  }
  
  // Learning styles section
  const stylesSection = document.createElement('div');
  stylesSection.style.marginBottom = '2rem';
  
  const stylesTitle = document.createElement('h3');
  stylesTitle.style.color = 'var(--accent-color, #44AAFF)';
  stylesTitle.style.marginBottom = '1rem';
  stylesTitle.textContent = 'Learning Styles';
  
  stylesSection.appendChild(stylesTitle);
  
  // Primary style
  const primaryStyle = assessmentResults.primaryStyle || 'visual';
  const primaryStyleDiv = document.createElement('div');
  primaryStyleDiv.style.marginBottom = '1rem';
  primaryStyleDiv.style.padding = '1rem';
  primaryStyleDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
  primaryStyleDiv.style.borderRadius = '8px';
  primaryStyleDiv.style.borderLeft = '4px solid var(--primary-color, #FF5588)';
  
  const primaryStyleTitle = document.createElement('h4');
  primaryStyleTitle.style.color = 'var(--primary-color, #FF5588)';
  primaryStyleTitle.style.marginBottom = '0.5rem';
  primaryStyleTitle.textContent = `Primary: ${capitalizeFirstLetter(primaryStyle)}`;
  
  const primaryStyleDesc = document.createElement('p');
  primaryStyleDesc.style.color = 'var(--text-primary, white)';
  
  switch (primaryStyle) {
    case 'visual':
      primaryStyleDesc.textContent = 'You learn best through seeing diagrams, pictures, videos, and demonstrations.';
      break;
    case 'auditory':
      primaryStyleDesc.textContent = 'You learn best by listening to explanations, discussions, and verbal instructions.';
      break;
    case 'kinesthetic':
      primaryStyleDesc.textContent = 'You learn best through hands-on activities, movement, and physical interaction.';
      break;
    case 'reading':
      primaryStyleDesc.textContent = 'You learn best by reading texts and writing notes and summaries.';
      break;
    default:
      primaryStyleDesc.textContent = 'You have a unique learning style that combines multiple approaches.';
  }
  
  primaryStyleDiv.appendChild(primaryStyleTitle);
  primaryStyleDiv.appendChild(primaryStyleDesc);
  stylesSection.appendChild(primaryStyleDiv);
  
  // Secondary style if available
  if (assessmentResults.secondaryStyle) {
    const secondaryStyle = assessmentResults.secondaryStyle;
    const secondaryStyleDiv = document.createElement('div');
    secondaryStyleDiv.style.marginBottom = '1rem';
    secondaryStyleDiv.style.padding = '1rem';
    secondaryStyleDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    secondaryStyleDiv.style.borderRadius = '8px';
    secondaryStyleDiv.style.borderLeft = '4px solid var(--secondary-color, #FFCC00)';
    
    const secondaryStyleTitle = document.createElement('h4');
    secondaryStyleTitle.style.color = 'var(--secondary-color, #FFCC00)';
    secondaryStyleTitle.style.marginBottom = '0.5rem';
    secondaryStyleTitle.textContent = `Secondary: ${capitalizeFirstLetter(secondaryStyle)}`;
    
    const secondaryStyleDesc = document.createElement('p');
    secondaryStyleDesc.style.color = 'var(--text-primary, white)';
    
    switch (secondaryStyle) {
      case 'visual':
        secondaryStyleDesc.textContent = 'You also benefit from visual aids like diagrams, pictures, and demonstrations.';
        break;
      case 'auditory':
        secondaryStyleDesc.textContent = 'You also benefit from listening to explanations and verbal instructions.';
        break;
      case 'kinesthetic':
        secondaryStyleDesc.textContent = 'You also benefit from hands-on activities and physical interaction.';
        break;
      case 'reading':
        secondaryStyleDesc.textContent = 'You also benefit from reading texts and writing notes.';
        break;
      default:
        secondaryStyleDesc.textContent = 'You have a secondary learning style that enhances your primary approach.';
    }
    
    secondaryStyleDiv.appendChild(secondaryStyleTitle);
    secondaryStyleDiv.appendChild(secondaryStyleDesc);
    stylesSection.appendChild(secondaryStyleDiv);
  }
  
  modalContent.appendChild(stylesSection);
  
  // Strengths and challenges section
  if (strengthsAndChallenges.strengths.length > 0 || strengthsAndChallenges.challenges.length > 0) {
    const strengthsChallengesSection = document.createElement('div');
    strengthsChallengesSection.style.marginBottom = '2rem';
    strengthsChallengesSection.style.display = 'flex';
    strengthsChallengesSection.style.flexWrap = 'wrap';
    strengthsChallengesSection.style.gap = '1rem';
    
    // Strengths column
    if (strengthsAndChallenges.strengths.length > 0) {
      const strengthsColumn = document.createElement('div');
      strengthsColumn.style.flex = '1';
      strengthsColumn.style.minWidth = '250px';
      
      const strengthsTitle = document.createElement('h3');
      strengthsTitle.style.color = '#68D391';
      strengthsTitle.style.marginBottom = '1rem';
      strengthsTitle.textContent = 'Your Strengths';
      
      strengthsColumn.appendChild(strengthsTitle);
      
      const strengthsList = document.createElement('ul');
      strengthsList.style.paddingLeft = '1.5rem';
      
      strengthsAndChallenges.strengths.forEach(strength => {
        const listItem = document.createElement('li');
        listItem.style.color = 'var(--text-primary, white)';
        listItem.style.marginBottom = '0.5rem';
        listItem.textContent = strength;
        strengthsList.appendChild(listItem);
      });
      
      strengthsColumn.appendChild(strengthsList);
      strengthsChallengesSection.appendChild(strengthsColumn);
    }
    
    // Challenges column
    if (strengthsAndChallenges.challenges.length > 0) {
      const challengesColumn = document.createElement('div');
      challengesColumn.style.flex = '1';
      challengesColumn.style.minWidth = '250px';
      
      const challengesTitle = document.createElement('h3');
      challengesTitle.style.color = '#FC8181';
      challengesTitle.style.marginBottom = '1rem';
      challengesTitle.textContent = 'Your Challenges';
      
      challengesColumn.appendChild(challengesTitle);
      
      const challengesList = document.createElement('ul');
      challengesList.style.paddingLeft = '1.5rem';
      
      strengthsAndChallenges.challenges.forEach(challenge => {
        const listItem = document.createElement('li');
        listItem.style.color = 'var(--text-primary, white)';
        listItem.style.marginBottom = '0.5rem';
        listItem.textContent = challenge;
        challengesList.appendChild(listItem);
      });
      
      challengesColumn.appendChild(challengesList);
      strengthsChallengesSection.appendChild(challengesColumn);
    }
    
    modalContent.appendChild(strengthsChallengesSection);
  }
  
  // Recommended strategies section
  if (recommendedStrategies.length > 0) {
    const strategiesSection = document.createElement('div');
    strategiesSection.style.marginBottom = '2rem';
    
    const strategiesTitle = document.createElement('h3');
    strategiesTitle.style.color = 'var(--accent-color, #44AAFF)';
    strategiesTitle.style.marginBottom = '1rem';
    strategiesTitle.textContent = 'Recommended Learning Strategies';
    
    strategiesSection.appendChild(strategiesTitle);
    
    const strategiesList = document.createElement('div');
    
    recommendedStrategies.forEach(strategy => {
      const strategyItem = document.createElement('div');
      strategyItem.className = 'assessment-strategy';
      strategyItem.style.marginBottom = '0.75rem';
      strategyItem.style.padding = '0.75rem';
      strategyItem.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      strategyItem.style.borderRadius = '8px';
      strategyItem.style.display = 'flex';
      strategyItem.style.alignItems = 'flex-start';
      
      const strategyIcon = document.createElement('span');
      strategyIcon.style.color = 'var(--accent-color, #44AAFF)';
      strategyIcon.style.marginRight = '0.75rem';
      strategyIcon.style.fontSize = '1.2rem';
      strategyIcon.textContent = '•';
      
      const strategyText = document.createElement('span');
      strategyText.style.color = 'var(--text-primary, white)';
      strategyText.textContent = strategy;
      
      strategyItem.appendChild(strategyIcon);
      strategyItem.appendChild(strategyText);
      strategiesList.appendChild(strategyItem);
    });
    
    strategiesSection.appendChild(strategiesList);
    modalContent.appendChild(strategiesSection);
  }
  
  // Add button to integrate with curriculum
  const integrateButton = document.createElement('button');
  integrateButton.style.backgroundColor = 'var(--accent-color, #44AAFF)';
  integrateButton.style.color = 'white';
  integrateButton.style.border = 'none';
  integrateButton.style.borderRadius = '20px';
  integrateButton.style.padding = '0.75rem 1.5rem';
  integrateButton.style.fontWeight = 'bold';
  integrateButton.style.cursor = 'pointer';
  integrateButton.style.display = 'block';
  integrateButton.style.margin = '0 auto';
  integrateButton.style.fontSize = '1rem';
  integrateButton.style.transition = 'all 0.3s ease';
  integrateButton.textContent = 'Adapt Curriculum to My Profile';
  
  integrateButton.addEventListener('mouseenter', () => {
    integrateButton.style.transform = 'scale(1.05)';
    integrateButton.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
  });
  
  integrateButton.addEventListener('mouseleave', () => {
    integrateButton.style.transform = 'scale(1)';
    integrateButton.style.boxShadow = 'none';
  });
  
  integrateButton.addEventListener('click', () => {
    // Redirect to curriculum creator with profile data
    const learningStyleParam = encodeURIComponent(assessmentResults.primaryStyle || 'visual');
    const neurotypParam = encodeURIComponent(assessmentResults.neurotype || 'general');
    
    window.location.href = `/curriculum-creator.html?learningStyle=${learningStyleParam}&neurotype=${neurotypParam}`;
  });
  
  modalContent.appendChild(integrateButton);
  
  // Add modal to page
  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);
  
  // Close modal when clicking outside
  modalOverlay.addEventListener('click', event => {
    if (event.target === modalOverlay) {
      document.body.removeChild(modalOverlay);
    }
  });
}

/**
 * Setup event listeners for assessment-related components
 */
function setupEventListeners() {
  // Refresh button
  const refreshBtn = document.getElementById('assessment-refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      const userId = getUserId();
      if (userId) {
        const loadingElement = document.getElementById('assessment-loading');
        const assessmentDataElement = document.getElementById('assessment-data');
        
        if (loadingElement) loadingElement.style.display = 'block';
        if (assessmentDataElement) assessmentDataElement.style.display = 'none';
        
        await loadUserAssessmentData(userId);
        updateDashboardWithAssessmentData(getActiveDashboardType());
      }
    });
  }
  
  // Start assessment button
  const startAssessmentBtn = document.getElementById('start-assessment-btn');
  if (startAssessmentBtn) {
    startAssessmentBtn.addEventListener('click', () => {
      window.location.href = '/assessment-test.html';
    });
  }
}

/**
 * Toggle reading guide for dyslexia adaptations
 */
function toggleReadingGuide() {
  const readingGuide = document.querySelector('.reading-guide');
  if (readingGuide) {
    if (readingGuide.style.display === 'block') {
      readingGuide.style.display = 'none';
      document.removeEventListener('mousemove', moveReadingGuide);
    } else {
      readingGuide.style.display = 'block';
      document.addEventListener('mousemove', moveReadingGuide);
    }
  }
}

/**
 * Move reading guide with mouse for dyslexia adaptations
 * @param {MouseEvent} e - Mouse event
 */
function moveReadingGuide(e) {
  const readingGuide = document.querySelector('.reading-guide');
  if (readingGuide) {
    readingGuide.style.top = (e.clientY - 15) + 'px';
  }
}

/**
 * Toggle focus mode for ADHD adaptations
 */
function toggleFocusMode() {
  const focusMode = document.querySelector('.focus-mode');
  const focusHighlight = document.querySelector('.focus-highlight');
  const progressTracker = document.querySelector('.progress-tracker');
  
  if (focusMode && focusHighlight) {
    if (focusMode.style.display === 'block') {
      focusMode.style.display = 'none';
      focusHighlight.style.display = 'none';
      if (progressTracker) progressTracker.style.display = 'none';
      document.removeEventListener('mouseover', highlightElement);
    } else {
      focusMode.style.display = 'block';
      focusHighlight.style.display = 'block';
      if (progressTracker) progressTracker.style.display = 'block';
      document.addEventListener('mouseover', highlightElement);
    }
  }
}

/**
 * Highlight element on mouseover for ADHD focus mode
 * @param {MouseEvent} e - Mouse event
 */
function highlightElement(e) {
  const focusHighlight = document.querySelector('.focus-highlight');
  if (!focusHighlight) return;
  
  // Only highlight certain elements
  const validTargets = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'BUTTON', 'A', 'INPUT', 'TEXTAREA', 'SELECT', 'IMG', 'FIGURE', 'CODE', 'PRE'];
  const target = e.target;
  
  if (validTargets.includes(target.tagName) || target.className.includes('card') || target.className.includes('item') || target.className.includes('container')) {
    const rect = target.getBoundingClientRect();
    
    focusHighlight.style.left = rect.left + 'px';
    focusHighlight.style.top = rect.top + 'px';
    focusHighlight.style.width = rect.width + 'px';
    focusHighlight.style.height = rect.height + 'px';
  }
}

/**
 * Toggle reduced motion for autism adaptations
 */
function toggleReducedMotion() {
  document.body.classList.toggle('reduced-motion');
  document.body.classList.toggle('low-contrast');
}

/**
 * Toggle visual schedule for autism adaptations
 */
function toggleVisualSchedule() {
  const visualSchedule = document.querySelector('.visual-schedule');
  if (visualSchedule) {
    visualSchedule.style.display = visualSchedule.style.display === 'block' ? 'none' : 'block';
  }
}

/**
 * Get the current user ID from URL or DOM
 * @returns {string|null} User ID or null if not found
 */
function getUserId() {
  // Try to get from URL
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('userId');
  
  if (userId) return userId;
  
  // Try to get from DOM
  const userElement = document.querySelector('[data-user-id]');
  if (userElement && userElement.dataset.userId) {
    return userElement.dataset.userId;
  }
  
  // Fallback to default
  return '1'; // Default user ID for testing
}

/**
 * Get the active dashboard type
 * @returns {string} Dashboard type ('primary', 'secondary', 'law', 'language')
 */
function getActiveDashboardType() {
  const bodyClasses = document.body.className;
  
  if (bodyClasses.includes('primary') || window.location.pathname.includes('primary')) {
    return 'primary';
  } else if (bodyClasses.includes('secondary') || window.location.pathname.includes('secondary')) {
    return 'secondary';
  } else if (bodyClasses.includes('law') || window.location.pathname.includes('law')) {
    return 'law';
  } else if (bodyClasses.includes('language') || window.location.pathname.includes('language')) {
    return 'language';
  }
  
  // Default to primary
  return 'primary';
}

/**
 * Capitalize first letter of a string
 * @param {string} string - String to capitalize
 * @returns {string} Capitalized string
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Export functions for use in other modules
window.assessmentDashboardIntegration = {
  initAssessmentIntegration,
  loadUserAssessmentData,
  updateDashboardWithAssessmentData,
  openLearningProfileModal
};