/**
 * VALUGATOR Probe Alpha
 * Enhanced frontend application script with visual improvements
 */

// Log when app.js loads
console.log('APP.JS LOADED - Development version');

document.addEventListener('DOMContentLoaded', () => {
  // DOM elements - Form
  const ideaForm = document.getElementById('idea-form');
  const personaSelect = document.getElementById('persona-select');
  const personaInfo = document.getElementById('persona-info');
  const ideaInput = document.getElementById('idea-input');
  const charCounter = document.getElementById('char-counter');
  const submitButton = document.getElementById('submit-button');
  const panelCards = document.querySelectorAll('.panel-card');
  
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
  
  // DOM elements - Buttons
  const resetButton = document.getElementById('reset-button');
  const techInfoButton = document.getElementById('tech-info-button');
  const errorResetButton = document.getElementById('error-reset-button');
  
  // Check if all required elements exist
  const checkElements = () => {
    const required = {
      ideaForm,
      personaSelect,
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
    
    // Panel selection
    if (panelCards && panelCards.length > 0) {
      panelCards.forEach(card => {
        card.addEventListener('click', handlePanelClick);
      });
    }
    
    // Persona selection changes
    if (personaSelect) {
      personaSelect.addEventListener('change', handlePersonaChange);
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
   * Handle panel card click
   * @param {Event} event - The click event
   */
  function handlePanelClick(event) {
    const card = event.currentTarget;
    const panel = card.dataset.panel;
    
    // Update active panel
    panelCards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    
    // Store selected panel
    selectedPanel = panel;
    
    // Update theme based on panel
    updateThemeForPanel(panel);
    
    // Populate persona dropdown based on selected panel
    populatePersonaSelect(panel);
    
    // Reset persona info
    personaInfo.classList.add('hidden');
    personaInfo.innerHTML = '';
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
    const colors = panelColors[selectedPanel] || panelColors.evaluation;
    const firstLetter = persona.name.charAt(0);
    
    personaInfo.innerHTML = `
      <div class="persona-header">
        <div class="persona-avatar" style="background-color: ${colors.primary}">
          ${firstLetter}
        </div>
        <div class="persona-details">
          <h4>${persona.name}${persona.nickname ? ` "${persona.nickname}"` : ''}</h4>
          <p>${persona.archetype || 'Gator Persona'}</p>
        </div>
      </div>
      <p>${persona.briefDescription || ''}</p>
      <p><strong>Expertise:</strong> ${persona.expertise || 'Various fields'}</p>
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
    charCounter.textContent = count;
    
    // Add warning or error class based on count
    charCounter.classList.remove('warning', 'error');
    
    if (count > 1500 && count <= 1800) {
      charCounter.classList.add('warning');
    } else if (count > 1800) {
      charCounter.classList.add('error');
    }
  }

  /**
   * Handle form submission
   * @param {Event} event - The submit event
   */
  async function handleSubmit(event) {
    // Log form submission
    console.log('Form submitted with:', {
      personaId: personaSelect.value,
      userInput: ideaInput.value.trim()
    });
    
    event.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Get form data
    const personaId = personaSelect.value;
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
    // Validate panel selection
    if (!selectedPanel) {
      showError('Please select a gator panel');
      return false;
    }
    
    // Validate persona selection
    if (!personaSelect.value) {
      showError('Please select a gator persona');
      return false;
    }
    
    // Validate idea input
    const ideaValue = ideaInput.value.trim();
    
    if (!ideaValue) {
      showError('Please enter your startup idea');
      return false;
    }
    
    if (ideaValue.length > 2000) {
      showError('Your idea exceeds the 2000 character limit');
      return false;
    }
    
    return true;
  }

  /**
   * Display the gator response
   * @param {Object} data - Response data from API
   * @param {string} userInput - The original user input
   */
  function displayResponse(data, userInput) {
    // Hide form and show response
    formContainer.classList.add('hidden');
    loadingContainer.classList.add('hidden');
    responseContainer.classList.remove('hidden');
    
    // Set response content
    const persona = personas[data.personaId];
    const truncatedInput = userInput.length > 100 
      ? userInput.substring(0, 100) + '...'
      : userInput;
    
    const colors = panelColors[selectedPanel] || panelColors.evaluation;
    const firstLetter = persona?.name.charAt(0) || colors.avatar;
    
    responseTitle.textContent = `${selectedPanel.charAt(0).toUpperCase()}${selectedPanel.slice(1)} Feedback`;
    ideaSummary.textContent = truncatedInput;
    
    // Set persona avatar with panel color
    personaAvatar.style.backgroundColor = colors.primary;
    personaAvatar.textContent = firstLetter;
    
    if (persona) {
      personaName.textContent = `${persona.name}${persona.nickname ? ` "${persona.nickname}"` : ''}`;
      personaDescription.textContent = persona.briefDescription || persona.archetype || '';
    } else {
      personaName.textContent = data.personaId;
      personaDescription.textContent = '';
    }
    
    // Handle either response or content field
    if (data.content) {
      gatorResponse.textContent = data.content;
    } else if (data.response) {
      gatorResponse.textContent = data.response;
    } else {
      gatorResponse.textContent = "No response content available";
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
    alert('Technical Details:\n\nThis response was processed by the VALUGATOR system using artificial intelligence to provide character-based startup feedback. The system includes configuration loading, prompt assembly, and LLM API communication components working together to generate contextually relevant responses.');
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
    
    // Keep the panel selection active
  }
});