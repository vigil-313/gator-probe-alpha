/**
 * VALUGATOR Probe Alpha
 * Enhanced frontend application script with visual improvements
 */

// Log when app.js loads
console.log('APP.JS LOADED - Development version');

document.addEventListener('DOMContentLoaded', () => {
  // DOM elements - Form
  const ideaForm = document.getElementById('idea-form');
  const personaInfo = document.getElementById('persona-info');
  const ideaInput = document.getElementById('idea-input');
  const charCounter = document.getElementById('char-counter');
  const submitButton = document.getElementById('submit-button');
  const personaContainer = document.querySelector('.all-personas-container');
  
  // DOM elements - Containers
  const formContainer = document.getElementById('form-container');
  const responseContainer = document.getElementById('response-container');
  const loadingContainer = document.getElementById('loading-container');
  const errorContainer = document.getElementById('error-container');
  
  // DOM elements - Response
  const responseTitle = document.getElementById('response-title');
  const ideaSummary = document.getElementById('idea-summary');
  const personaName = document.getElementById('persona-name');
  const personaDescription = document.getElementById('persona-description');
  const personaAvatar = document.getElementById('persona-avatar');
  const gatorResponse = document.getElementById('gator-response');
  const selectPrompt = document.getElementById('select-prompt');
  
  // DOM elements - Buttons
  const resetButton = document.getElementById('reset-button');
  const techInfoButton = document.getElementById('tech-info-button');
  const errorResetButton = document.getElementById('error-reset-button');
  
  // Check if all required elements exist
  const checkElements = () => {
    const required = {
      ideaForm,
      personaInfo,
      ideaInput,
      charCounter,
      submitButton,
      formContainer,
      responseContainer,
      loadingContainer,
      errorContainer,
      resetButton,
      errorResetButton
    };
    
    const missing = Object.entries(required)
      .filter(([_, element]) => !element)
      .map(([name]) => name);
    
    if (missing.length > 0) {
      console.error(`Missing required DOM elements: ${missing.join(', ')}`);
      return false;
    }
    
    return true;
  };

  // State
  let personas = {};
  let panels = {};
  let selectedPersona = null;
  let selectedPanel = null;

  // Panel colors for theming
  const panelColors = {
    evaluation: {
      primary: '#38a169', // Green
      light: '#c6f6d5',
      avatar: 'E'
    },
    pathfinder: {
      primary: '#805ad5', // Purple
      light: '#e9d8fd',
      avatar: 'P'
    },
    legal: {
      primary: '#3182ce', // Blue
      light: '#bee3f8',
      avatar: 'L'
    }
  };

  // Initialize
  init();

  /**
   * Initialize the application
   */
  async function init() {
    try {
      // Check if all required DOM elements exist
      if (!checkElements()) {
        console.error('Cannot initialize: Missing required DOM elements');
        document.body.innerHTML = '<div style="text-align: center; padding: 40px; color: #f56565;"><h1>Error</h1><p>Failed to load application. Some UI elements could not be found.</p></div>';
        return;
      }
      
      // Set up event listeners
      addEventListeners();
      
      // Simulate API data for demo purposes if server isn't returning data
      // Comment out this line if connecting to a real backend
      // simulateApiData();
      
      // Fetch personas from API - enable this when backend is ready
      // Comment out this line if using simulated data
      await loadPersonas();
      
      // Render persona tiles
      renderPersonaTiles();
    } catch (error) {
      console.error('Initialization error:', error);
      showError('Failed to initialize application. Please refresh the page.', error);
    }
  }

  /**
   * Set up event listeners
   */
  function addEventListeners() {
    // Form submission
    if (ideaForm) {
      ideaForm.addEventListener('submit', handleSubmit);
    }
    
    // Character count
    if (ideaInput) {
      ideaInput.addEventListener('input', updateCharCount);
    }
    
    // Reset/Try Again buttons
    if (resetButton) {
      resetButton.addEventListener('click', resetApplication);
    }
    
    if (errorResetButton) {
      errorResetButton.addEventListener('click', resetApplication);
    }
    
    // Tech info button
    if (techInfoButton) {
      techInfoButton.addEventListener('click', showTechInfo);
    }
  }

  /**
   * Render all persona tiles in one container
   */
  function renderPersonaTiles() {
    // Get the container for all personas
    const container = document.querySelector('.all-personas-container');
    
    if (!container) {
      console.error('Persona container not found');
      return;
    }
    
    if (!panels || Object.keys(panels).length === 0) {
      console.error('No panels data available for rendering tiles');
      return;
    }
    
    // Clear loading message
    container.innerHTML = '';
    
    // For each panel type, add its personas to the container
    Object.keys(panels).forEach(panelType => {
      const panelData = panels[panelType];
      
      if (!panelData || !panelData.personas || panelData.personas.length === 0) {
        return; // Skip empty panels
      }
      
      // Create persona tiles for this panel
      panelData.personas.forEach(persona => {
        const tile = createPersonaTile(persona, panelType);
        container.appendChild(tile);
      });
    });
  }
  
  /**
   * Create a persona tile element
   * @param {Object} persona - The persona data
   * @param {string} panelType - The panel type
   * @returns {HTMLElement} - The persona tile element
   */
  function createPersonaTile(persona, panelType) {
    const tile = document.createElement('div');
    tile.className = `persona-tile ${panelType}`;
    tile.dataset.personaId = persona.id;
    tile.dataset.panel = panelType;
    
    // Get first letter for avatar
    const avatarLetter = persona.name.charAt(0);
    
    // Get a short name that respects titles like 'Dr.'
    let shortName;
    if (persona.name.startsWith('Dr.')) {
      // For doctors, keep title + first name
      const nameParts = persona.name.split(' ');
      shortName = nameParts.length >= 2 ? `${nameParts[0]} ${nameParts[1]}` : persona.name;
    } else {
      // Otherwise just first name
      shortName = persona.name.split(' ')[0];
    }
    
    // Create minimal tile content without the popup
    tile.innerHTML = `
      <div class="persona-avatar">${avatarLetter}</div>
      <h5>${shortName}</h5>
    `;
    
    // Parse expertise into tags if it's a string
    let expertiseTags = [];
    if (typeof persona.expertise === 'string') {
      expertiseTags = persona.expertise.split(',').map(tag => tag.trim());
    } else if (Array.isArray(persona.expertise)) {
      expertiseTags = persona.expertise;
    }
    
    // Add event handlers for hover and touch
    tile.addEventListener('mouseenter', () => {
      // Create popup if doesn't exist
      showPersonaPopup(persona, panelType, expertiseTags, tile);
    });
    
    tile.addEventListener('mouseleave', () => {
      // Remove popup when mouse leaves
      hidePersonaPopup();
    });
    
    // Add touch events for mobile devices
    tile.addEventListener('touchend', (e) => {
      // Don't prevent default to allow scrolling
      // Only handle if this is a tap, not a scroll
      if (!window.touchMoved) {
        // Check if popup is already shown
        const existingPopup = document.getElementById('persona-popup');
        if (existingPopup) {
          // If already shown, hide it (acting like a toggle)
          hidePersonaPopup();
        } else {
          // Otherwise show it
          showPersonaPopup(persona, panelType, expertiseTags, tile);
        }
        // Prevent click event from firing
        e.preventDefault();
      }
    });
    
    // Track touch movement for scroll detection
    tile.addEventListener('touchstart', () => {
      window.touchMoved = false;
    });
    
    tile.addEventListener('touchmove', () => {
      window.touchMoved = true;
    });
    
    // Add touch event to document to dismiss popup when touching elsewhere
    if (!document.touchEndInitialized) {
      document.addEventListener('touchend', (e) => {
        // Check if this was a tap (not a scroll) and if we have a popup
        if (!window.touchMoved) {
          const popup = document.getElementById('persona-popup');
          // If popup exists and touch wasn't on a tile or popup
          if (popup && !e.target.closest('.persona-tile') && !e.target.closest('.persona-popup')) {
            hidePersonaPopup();
          }
        }
      });
      
      // Track document touch movement for scroll detection
      document.addEventListener('touchstart', () => {
        window.touchMoved = false;
      });
      
      document.addEventListener('touchmove', () => {
        window.touchMoved = true;
      });
      
      document.touchEndInitialized = true;
    }
    
    // Add click event to select this persona
    tile.addEventListener('click', () => handlePersonaTileClick(tile, persona, panelType));
    
    return tile;
  }
  
  /**
   * Show a popup for a persona
   * @param {Object} persona - The persona data
   * @param {string} panelType - The panel type
   * @param {Array} expertiseTags - The expertise tags
   * @param {HTMLElement} tile - The tile element
   */
  function showPersonaPopup(persona, panelType, expertiseTags, tile) {
    // Remove any existing popup
    hidePersonaPopup();
    
    // Create the popup
    const popup = document.createElement('div');
    popup.id = 'persona-popup';
    popup.className = 'persona-popup';
    
    // Add content to the popup
    popup.innerHTML = `
      <div class="popup-close-button">×</div>
      <div class="detail-panel-type ${panelType}">${getPanelDisplayName(panelType)}</div>
      <h6>${persona.name} ${persona.nickname ? `"${persona.nickname}"` : ''}</h6>
      <div class="detail-archetype">${persona.archetype || 'Gator Persona'}</div>
      <p>${persona.briefDescription || ''}</p>
      <h6>Expertise</h6>
      <div class="expertise-tags">
        ${expertiseTags.slice(0, 5).map(tag => `<span class="expertise-tag">${tag}</span>`).join('')}
        ${expertiseTags.length > 5 ? `<span class="expertise-tag">+${expertiseTags.length - 5} more</span>` : ''}
      </div>
    `;
    
    // Append to body (not inside the container)
    document.body.appendChild(popup);
    
    // Add event listener for close button
    const closeButton = popup.querySelector('.popup-close-button');
    if (closeButton) {
      closeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        hidePersonaPopup();
      });
    }
    
    // Position the popup near the tile, but check if it would go off-screen
    const tileRect = tile.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const popupWidth = 250;
    
    popup.style.position = 'fixed';
    
    // Check if there's more space above or below
    if (tileRect.bottom + 300 > viewportHeight && tileRect.top > 300) {
      // Position above
      popup.style.bottom = (viewportHeight - tileRect.top + 10) + 'px';
      popup.style.top = 'auto';
      // Move arrow to bottom
      popup.classList.add('arrow-bottom');
    } else {
      // Position below
      popup.style.top = (tileRect.bottom + 10) + 'px';
      popup.style.bottom = 'auto';
    }
    
    // Center horizontally, but don't go off-screen
    let leftPos = tileRect.left + (tileRect.width / 2) - (popupWidth / 2);
    if (leftPos < 10) leftPos = 10;
    if (leftPos + popupWidth > viewportWidth - 10) leftPos = viewportWidth - popupWidth - 10;
    
    popup.style.left = leftPos + 'px';
    
    // Set a fixed width
    popup.style.width = '250px';
  }
  
  /**
   * Hide the persona popup
   */
  function hidePersonaPopup() {
    const popup = document.getElementById('persona-popup');
    if (popup) {
      popup.remove();
    }
  }
  
  /**
   * Handle click on a persona tile
   * @param {HTMLElement} tile - The persona tile element
   * @param {Object} persona - The persona data
   * @param {string} panelType - The panel type
   */
  function handlePersonaTileClick(tile, persona, panelType) {
    // Deselect all other tiles
    document.querySelectorAll('.persona-tile').forEach(t => {
      t.classList.remove('selected');
    });
    
    // Select this tile
    tile.classList.add('selected');
    
    // Store selected persona and panel
    selectedPersona = persona;
    selectedPanel = panelType;
    
    // Update theme based on panel
    updateThemeForPanel(panelType);
    
    // Display persona info
    displayPersonaInfo(persona);
    
    // Enable submit button and hide prompt
    submitButton.disabled = false;
    document.getElementById('select-prompt').style.display = 'none';
  }
  
  /**
   * Update UI theme based on selected panel
   * @param {string} panel - The selected panel type
   */
  /**
   * Get display name for panel type
   * @param {string} panelType - The panel type
   * @returns {string} The display name
   */
  function getPanelDisplayName(panelType) {
    const displayNames = {
      'evaluation': 'Evaluation Chamber',
      'pathfinder': 'Pathfinder Council',
      'legal': 'Legal Panel'
    };
    
    return displayNames[panelType] || panelType.charAt(0).toUpperCase() + panelType.slice(1);
  }
  
  /**
   * Update UI theme based on selected panel
   * @param {string} panel - The selected panel type
   */
  function updateThemeForPanel(panel) {
    const colors = panelColors[panel] || panelColors.evaluation;
    
    // Update button colors
    submitButton.classList.remove('gator-button', 'tech-button', 'accent-button');
    
    // Add specific class based on panel
    if (panel === 'evaluation') {
      submitButton.classList.add('gator-button');
    } else if (panel === 'pathfinder') {
      submitButton.classList.add('accent-button');
    } else if (panel === 'legal') {
      submitButton.classList.add('tech-button');
    }
    
    // Update persona info border color
    document.documentElement.style.setProperty('--persona-color', colors.primary);
    document.documentElement.style.setProperty('--persona-light', colors.light);
  }

  /**
   * Load personas from the API
   */
  async function loadPersonas() {
    showLoading(true, formContainer);
    
    try {
      const response = await fetch('/api/personas');
      
      if (!response.ok) {
        throw new Error(`Failed to load personas: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.status || data.status !== 'success') {
        throw new Error(data.message || 'Failed to load personas');
      }
      
      // Store panels and personas
      panels = data.data.panels;
      
      // Reset active state after successful fetch
      showLoading(false, formContainer);
      
      // Panels are loaded but none selected yet
      return true;
    } catch (error) {
      showError('Failed to load gator personas. Please refresh the page.', error);
      return false;
    }
  }
  
  /**
   * Simulate API data for demonstration purposes
   * Remove this function when connecting to a real backend
   */
  function simulateApiData() {
    panels = {
      evaluation: {
        displayName: 'Evaluation Chamber',
        description: 'Critical feedback on startup ideas',
        personas: [
          {
            id: 'rex',
            name: 'Rex Revenue',
            nickname: 'The Roaster',
            archetype: 'Business Expert',
            briefDescription: 'Blunt, profit-focused critic with years of VC experience',
            expertise: 'Business models, Profitability, Market fit',
            tone: 'Direct, critical'
          },
          {
            id: 'tessa',
            name: 'Tessa Technical',
            nickname: 'Debug Dynamo',
            archetype: 'Tech Guru',
            briefDescription: 'Technical analysis with focus on scalability and innovation',
            expertise: 'Technical feasibility, Scalability, Innovation',
            tone: 'Analytical, detailed'
          },
          {
            id: 'vanessa',
            name: 'Vanessa Venture',
            nickname: 'Vision Finder',
            archetype: 'Venture Capitalist',
            briefDescription: 'Seeks ambitious ideas with strong market potential',
            expertise: 'Market trends, Growth potential, Investment appeal',
            tone: 'Strategic, forward-thinking'
          }
        ]
      },
      pathfinder: {
        displayName: 'Pathfinder Council',
        description: 'Guidance and direction for decision making',
        personas: [
          {
            id: 'zane',
            name: 'Zane Cutter',
            nickname: 'Path Clearer',
            archetype: 'Strategic Advisor',
            briefDescription: 'Helps identify the clearest path to success',
            expertise: 'Strategic planning, Problem solving, Opportunity mapping',
            tone: 'Clear, decisive'
          },
          {
            id: 'sol',
            name: 'Sol Stargazer',
            nickname: 'Future Seer',
            archetype: 'Visionary',
            briefDescription: 'Explores future possibilities and long-term impact',
            expertise: 'Future trends, Vision development, Innovation potential',
            tone: 'Inspirational, creative'
          }
        ]
      },
      legal: {
        displayName: 'Legal Panel',
        description: 'Legal risk assessment and considerations',
        personas: [
          {
            id: 'lex',
            name: 'Lex Talionis',
            nickname: 'Regulation Radar',
            archetype: 'Legal Advisor',
            briefDescription: 'Identifies potential legal issues and regulatory concerns',
            expertise: 'Regulatory compliance, Legal risks, Intellectual property',
            tone: 'Precise, cautious'
          },
          {
            id: 'clara',
            name: 'Clara Clause',
            nickname: 'Contract Crafter',
            archetype: 'Contract Specialist',
            briefDescription: 'Expert in legal agreements and business relationships',
            expertise: 'Contracts, Business relationships, Terms of service',
            tone: 'Methodical, detailed'
          }
        ]
      }
    };
    
    // Reset loading state for simulated data
    showLoading(false, formContainer);
  }

  /**
   * Populate persona select dropdown based on selected panel
   * @param {string} panelKey - The selected panel key
   */
  function populatePersonaSelect(panelKey) {
    // Make sure the select element exists
    if (!personaSelect) {
      console.error('Cannot populate persona select: Element not found');
      return;
    }
    
    // Clear existing options
    personaSelect.innerHTML = '';
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = `Choose a ${panelKey} gator...`;
    personaSelect.appendChild(defaultOption);
    
    // Get personas for the selected panel
    const panelPersonas = panels[panelKey]?.personas || [];
    
    // Add persona options
    panelPersonas.forEach(persona => {
      const option = document.createElement('option');
      option.value = persona.id;
      option.textContent = persona.nickname 
        ? `${persona.name} "${persona.nickname}"` 
        : persona.name;
      personaSelect.appendChild(option);
    });
    
    // Store personas by ID for easy lookup
    personas = panelPersonas.reduce((acc, persona) => {
      acc[persona.id] = persona;
      return acc;
    }, {});
  }

  /**
   * Handle persona selection change
   */
  function handlePersonaChange() {
    const personaId = personaSelect.value;
    
    if (!personaId) {
      personaInfo.classList.add('hidden');
      return;
    }
    
    // Get the selected persona
    selectedPersona = personas[personaId];
    
    if (!selectedPersona) {
      personaInfo.classList.add('hidden');
      return;
    }
    
    // Show persona information
    displayPersonaInfo(selectedPersona);
  }

  /**
   * Display information about the selected persona
   * @param {Object} persona - The selected persona
   */
  function displayPersonaInfo(persona) {
    if (!persona) {
      personaInfo.classList.add('hidden');
      return;
    }

    const colors = panelColors[selectedPanel] || panelColors.evaluation;
    const firstLetter = persona.name.charAt(0);
    
    // Show the info box
    personaInfo.innerHTML = `
      <div class="selected-persona-header">
        <div class="selected-persona-avatar" style="background-color: ${colors.primary}">
          ${firstLetter}
        </div>
        <div class="selected-persona-details">
          <div class="selected-persona-name">${persona.name}</div>
          ${persona.nickname ? `<div class="selected-persona-nickname">${persona.nickname}</div>` : ''}
          <div class="selected-persona-archetype">${persona.archetype || 'Gator Persona'}</div>
        </div>
      </div>
      <div class="selected-persona-description">
        <p>${persona.briefDescription || ''}</p>
        <div class="selected-persona-expertise">
          <strong>Expertise:</strong> ${persona.expertise || 'Various fields'}
        </div>
      </div>
      <div class="persona-tags">
        ${persona.tone ? `<span class="tag">Tone: ${persona.tone}</span>` : ''}
        <span class="tag">${selectedPanel}</span>
      </div>
    `;
    
    personaInfo.classList.remove('hidden');
  }

  /**
   * Update character count for the idea input
   */
  function updateCharCount() {
    const count = ideaInput.value.length;
    const MAX_CHARS = 7000;
    charCounter.textContent = count;
    
    // Add warning or error class based on count
    charCounter.classList.remove('warning', 'error', 'pulse', 'exceed');
    ideaInput.classList.remove('warning-border', 'error-border', 'exceed-border');
    document.querySelector('.char-count').classList.remove('warning-bg', 'error-bg', 'exceed-bg');
    
    // Get the character counter container
    const charCountContainer = document.querySelector('.char-count');
    
    // Calculate percentage of limit
    const percentage = (count / MAX_CHARS) * 100;
    
    if (percentage > 70 && percentage <= 90) {
      // Warning at 70-90%
      charCounter.classList.add('warning');
      ideaInput.classList.add('warning-border');
      charCountContainer.classList.add('warning-bg');
      
      // Show approaching limit message
      if (!document.querySelector('.warning-message') && percentage > 80) {
        const warningMessage = document.createElement('div');
        warningMessage.className = 'warning-message';
        warningMessage.textContent = `You're approaching the character limit`;
        charCountContainer.appendChild(warningMessage);
      }
    } else if (percentage > 90 && percentage <= 100) {
      // Near limit at 90-100% - still yellow, not red
      charCounter.classList.add('warning', 'pulse');
      ideaInput.classList.add('warning-border');
      charCountContainer.classList.add('warning-bg');
      
      // Show near limit message
      if (!document.querySelector('.warning-message')) {
        const oldWarning = document.querySelector('.warning-message');
        if (oldWarning) oldWarning.remove();
        
        const warningMessage = document.createElement('div');
        warningMessage.className = 'warning-message';
        warningMessage.textContent = `You're very close to the ${MAX_CHARS.toLocaleString()} character limit`;
        charCountContainer.appendChild(warningMessage);
      }
    } else if (percentage > 100) {
      // Exceeded limit
      charCounter.classList.add('exceed', 'pulse');
      ideaInput.classList.add('exceed-border', 'shake');
      charCountContainer.classList.add('exceed-bg');
      
      // Show exceeded message
      if (!document.querySelector('.exceed-message')) {
        const exceedMessage = document.createElement('div');
        exceedMessage.className = 'exceed-message';
        exceedMessage.textContent = `You've exceeded the ${MAX_CHARS.toLocaleString()} character limit!`;
        charCountContainer.appendChild(exceedMessage);
      }
      
      setTimeout(() => {
        ideaInput.classList.remove('shake');
      }, 600);
    } else {
      // Remove any messages if exists and count is now below warning threshold
      const exceedMessage = document.querySelector('.exceed-message');
      if (exceedMessage) {
        exceedMessage.remove();
      }
      
      const warningMessage = document.querySelector('.warning-message');
      if (warningMessage) {
        warningMessage.remove();
      }
    }
    
    // Update character limit display
    document.getElementById('char-limit').textContent = MAX_CHARS.toLocaleString();
  }

  /**
   * Handle form submission
   * @param {Event} event - The submit event
   */
  async function handleSubmit(event) {
    // Log form submission
    console.log('Form submitted with:', {
      personaId: selectedPersona.id,
      userInput: ideaInput.value.trim()
    });
    
    event.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Get form data
    const personaId = selectedPersona.id;
    const userInput = ideaInput.value.trim();
    
    // Show loading state
    showLoading(true);
    
    try {
      // Comment out simulation for real API integration
      // For demonstration purposes - simulate API call with a timeout
      // await new Promise(resolve => setTimeout(resolve, 2000));
      // 
      // const simulatedResponse = {
      //   status: 'success',
      //   data: {
      //     personaId,
      //     response: generateSimulatedResponse(personaId, userInput),
      //     metadata: {
      //       model: 'claude-3-sonnet-20240229',
      //       usage: {
      //         input_tokens: 250,
      //         output_tokens: 450
      //       }
      //     }
      //   }
      // };
      // 
      // displayResponse(simulatedResponse.data, userInput);
      
      // Real API integration
      console.log('Sending request to API:', {
        personaId,
        userInput
      });
      
      // Send request to API
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personaId,
          userInput
        }),
      });
      
      // Handle errors
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get response');
      }
      
      // Process response
      const data = await response.json();
      console.log('API response:', data);
      
      if (!data.status || data.status !== 'success') {
        throw new Error(data.message || 'Failed to generate response');
      }
      
      // Display the response
      displayResponse(data.data, userInput);
    } catch (error) {
      showError('Failed to get gator feedback. Please try again.', error);
    } finally {
      showLoading(false);
    }
  }

  /**
   * Generate a simulated response for demonstration purposes
   * Remove this function when connecting to a real backend
   * @param {string} personaId - The ID of the selected persona
   * @param {string} userInput - The user's startup idea
   * @returns {string} - A simulated response
   */
  function generateSimulatedResponse(personaId, userInput) {
    const persona = personas[personaId];
    const responses = {
      rex: `Look, I'll be blunt. Your idea for "${userInput.substring(0, 50)}${userInput.length > 50 ? '...' : ''}" has some serious revenue issues. Where's the money? Who pays for this? If it's free, it's a toy, not a business. If it's subscription, you need to consider retention and lifetime value. Your TAM seems limited, and acquisition costs will be high. Fix your revenue model or don't waste my time.`,
      
      tessa: `From a technical perspective, your startup idea "${userInput.substring(0, 50)}${userInput.length > 50 ? '...' : ''}" presents several challenges. The scalability would be constrained by [technical constraint]. You'd need to consider [technical solution] to make this viable. The innovation factor is [medium/high/low], but implementation complexity is significant. I recommend focusing on the [technical component] first to validate the core functionality.`,
      
      vanessa: `Interesting concept. For "${userInput.substring(0, 50)}${userInput.length > 50 ? '...' : ''}", I see market potential in the [market segment]. However, current trends suggest [trend insight]. Your competitive advantage isn't clearly articulated yet. I'd want to see stronger differentiation and a more compelling GTM strategy. The investment appeal hinges on [key factor]. Work on these aspects to strengthen your pitch.`,
      
      zane: `After analyzing your idea for "${userInput.substring(0, 50)}${userInput.length > 50 ? '...' : ''}", I can see three potential paths forward. First, [option 1] which offers [benefit] but risks [risk]. Second, [option 2] with greater [attribute] yet requiring [resource]. Third, [option 3] as a more conservative approach. Given current market conditions, I recommend path [number] because [strategic reasoning]. Focus on [key priority] first.`,
      
      sol: `Your concept "${userInput.substring(0, 50)}${userInput.length > 50 ? '...' : ''}" has fascinating long-term implications. Looking 5-10 years ahead, this could evolve into [future vision]. The societal impact might include [impact areas]. Consider how [emerging technology] could enhance your offering over time. I see potential convergence with [adjacent trend], creating new opportunities in [future market]. To realize this vision, prioritize [foundational element] today.`,
      
      lex: `From a legal perspective, your idea "${userInput.substring(0, 50)}${userInput.length > 50 ? '...' : ''}" raises several considerations. First, regulatory compliance in [domain] will require [requirement]. Second, potential intellectual property issues around [IP area] should be addressed early. Third, user data handling triggers [regulation] obligations. I recommend consulting a licensed attorney about [specific legal concern] before proceeding further.

DISCLAIMER: This feedback is for educational purposes only and does not constitute legal advice.`,
      
      clara: `Regarding contractual matters for "${userInput.substring(0, 50)}${userInput.length > 50 ? '...' : ''}", you should consider several issues. Your terms of service should clearly address [key term]. Partner agreements will need provisions for [important clause]. Customer contracts should specify [critical element] to mitigate liability. I suggest developing a [contract type] template with appropriate [protections] before launch.

DISCLAIMER: This analysis is for informational purposes only and does not constitute legal advice. Consult a qualified attorney for specific guidance.`
    };
    
    // Default response if persona not found
    return responses[personaId] || `Thank you for sharing your startup idea "${userInput.substring(0, 50)}${userInput.length > 50 ? '...' : ''}". This is a very interesting concept that has potential in today's market. I would recommend focusing on the unique value proposition and ensuring you have a clear path to monetization. Good luck with your venture!`;
  }

  /**
   * Validate form inputs
   * @returns {boolean} - True if form is valid
   */
  function validateForm() {
    // Validate persona selection (now done via tiles)
    if (!selectedPersona) {
      showError('Please select a Valugator persona');
      return false;
    }
    
    // Validate idea input
    const ideaValue = ideaInput.value.trim();
    
    if (!ideaValue) {
      showError('Please enter your startup idea');
      return false;
    }
    
    const MAX_CHARS = 7000;
    if (ideaValue.length > MAX_CHARS) {
      showError(`Your idea exceeds the ${MAX_CHARS.toLocaleString()} character limit`);
      // Add animated highlight to the textarea
      ideaInput.classList.add('error-border', 'shake');
      setTimeout(() => {
        ideaInput.classList.remove('shake');
      }, 600);
      return false;
    }
    
    return true;
  }

  /**
   * Display the response
   * @param {Object} data - Response data from API
   * @param {string} userInput - The original user input
   */
  function displayResponse(data, userInput) {
    // Hide form and show response
    formContainer.classList.add('hidden');
    loadingContainer.classList.add('hidden');
    responseContainer.classList.remove('hidden');
    
    // Set response content
    const truncatedInput = userInput.length > 100 
      ? userInput.substring(0, 100) + '...'
      : userInput;
    
    const colors = panelColors[selectedPanel] || panelColors.evaluation;
    const firstLetter = selectedPersona.name.charAt(0);
    
    responseTitle.textContent = `${getPanelDisplayName(selectedPanel)} Feedback`;
    ideaSummary.textContent = truncatedInput;
    
    // Set persona avatar with panel color
    personaAvatar.style.backgroundColor = colors.primary;
    personaAvatar.textContent = firstLetter;
    
    // Use selectedPersona which we know is valid
    personaName.textContent = `${selectedPersona.name}${selectedPersona.nickname ? ` "${selectedPersona.nickname}"` : ''}`;
    personaDescription.textContent = selectedPersona.briefDescription || selectedPersona.archetype || '';
    
    
    // Clear the response area first
    gatorResponse.innerHTML = '';
    
    // Add the main response content
    const responseContent = document.createElement('p');
    if (data.content) {
      responseContent.textContent = data.content;
    } else if (data.response) {
      responseContent.textContent = data.response;
    } else {
      responseContent.textContent = "No response content available";
    }
    gatorResponse.appendChild(responseContent);
    
    // Add token usage information if available
    const usageData = data.metadata?.usage;
    if (usageData && (usageData.input_tokens || usageData.output_tokens)) {
      console.log('Showing token usage:', usageData);
      // Calculate approximate cost (using Claude Sonnet pricing as default)
      const inputTokens = usageData.input_tokens || 0;
      const outputTokens = usageData.output_tokens || 0;
      const totalTokens = inputTokens + outputTokens;
      
      // Claude Sonnet pricing: $3/million input tokens, $15/million output tokens
      const inputCost = (inputTokens / 1000000) * 3;
      const outputCost = (outputTokens / 1000000) * 15;
      const totalCost = inputCost + outputCost;
      
      const usageElement = document.createElement('div');
      usageElement.classList.add('token-usage');
      usageElement.innerHTML = `
        <div class="token-info-container">
          <div class="token-info-header">API Usage Details</div>
          <div class="token-metrics">
            <div class="token-metric">
              <span class="metric-label">Input Tokens:</span>
              <span class="metric-value">${inputTokens.toLocaleString()}</span>
            </div>
            <div class="token-metric">
              <span class="metric-label">Output Tokens:</span>
              <span class="metric-value">${outputTokens.toLocaleString()}</span>
            </div>
            <div class="token-metric">
              <span class="metric-label">Total Tokens:</span>
              <span class="metric-value">${totalTokens.toLocaleString()}</span>
            </div>
            <div class="token-metric cost">
              <span class="metric-label">Estimated Cost:</span>
              <span class="metric-value">$${totalCost.toFixed(4)}</span>
            </div>
          </div>
        </div>
      `;
      gatorResponse.appendChild(usageElement);
    } else {
      console.log('No token usage data available');
    }
    
    console.log('Response data to display:', data);
    
    // Scroll to response
    responseContainer.scrollIntoView({ behavior: 'smooth' });
  }

  /**
   * Show tech info modal
   * This is a placeholder for additional features
   */
  function showTechInfo() {
    alert('Technical Details:\n\nThis response was processed by the VALUGATOR system using artificial intelligence to provide character-based startup feedback from specialized Valugator personas. The system includes configuration loading, prompt assembly, and LLM API communication components working together to generate contextually relevant responses.');
  }

  /**
   * Show or hide loading state
   * @param {boolean} isLoading - Whether to show or hide loading
   * @param {HTMLElement} elementToHide - Element to hide while loading (optional)
   */
  function showLoading(isLoading, elementToHide = formContainer) {
    // Check if required elements exist
    if (!loadingContainer) {
      console.error('Cannot show loading: Loading container not found');
      return;
    }
    
    if (isLoading) {
      if (elementToHide) elementToHide.classList.add('hidden');
      loadingContainer.classList.remove('hidden');
      if (responseContainer) responseContainer.classList.add('hidden');
      if (errorContainer) errorContainer.classList.add('hidden');
    } else {
      loadingContainer.classList.add('hidden');
      if (elementToHide) elementToHide.classList.remove('hidden');
    }
  }

  /**
   * Show error message
   * @param {string} message - Error message to display
   * @param {Error} error - Original error object (optional, for console logging)
   */
  function showError(message, error = null) {
    if (error) {
      console.error('Error:', error);
    }
    
    // Check if required elements exist
    if (!errorContainer || !errorMessage) {
      console.error('Cannot show error: Error container or message element not found');
      // Create a basic error alert as fallback
      alert(`Error: ${message}`);
      return;
    }
    
    errorMessage.textContent = message;
    
    if (formContainer) formContainer.classList.add('hidden');
    if (loadingContainer) loadingContainer.classList.add('hidden');
    if (responseContainer) responseContainer.classList.add('hidden');
    errorContainer.classList.remove('hidden');
  }

  /**
   * Reset application to initial state
   */
  function resetApplication() {
    // Reset form
    ideaForm.reset();
    updateCharCount();
    
    // Show form, hide other containers
    formContainer.classList.remove('hidden');
    responseContainer.classList.add('hidden');
    loadingContainer.classList.add('hidden');
    errorContainer.classList.add('hidden');
    
    // Reset persona info
    personaInfo.classList.add('hidden');
    personaInfo.innerHTML = '';
    
    // Disable submit button and show prompt
    submitButton.disabled = true;
    selectPrompt.style.display = '';
    
    // Deselect all tiles
    document.querySelectorAll('.persona-tile').forEach(t => {
      t.classList.remove('selected');
    });
    
    // Reset selected persona
    selectedPersona = null;
    selectedPanel = null;
  }
});