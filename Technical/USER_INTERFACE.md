# Minimal User Interface Design

## Document ID
[DOC-TECH-UI-1]

## Overview
This document outlines the design for the minimal user interface of the VALUGATOR Probe Alpha. The UI focuses on simplicity and functionality, allowing users to submit startup ideas and receive character-consistent responses from the selected gator persona.

## Interface Components

### 1. Input Form

```
┌────────────────────────────────────────────────────┐
│ VALUGATOR Probe Alpha                              │
├────────────────────────────────────────────────────┤
│                                                    │
│ Enter your startup idea:                           │
│ ┌──────────────────────────────────────────────┐   │
│ │                                              │   │
│ │                                              │   │
│ │                                              │   │
│ └──────────────────────────────────────────────┘   │
│                                                    │
│ Select Gator:                                      │
│ ┌──────────────┐                                   │
│ │ Rex Revenue ▼│                                   │
│ └──────────────┘                                   │
│                                                    │
│           ┌────────────────┐                       │
│           │ Face the Gator │                       │
│           └────────────────┘                       │
│                                                    │
└────────────────────────────────────────────────────┘
```

#### Components:
- **Page Title**: "VALUGATOR Probe Alpha"
- **Text Area**: Multi-line input field for the startup idea
- **Gator Selector**: Dropdown to select from available gators (configurable)
- **Submit Button**: "Face the Gator" to trigger evaluation

### 2. Response Display

```
┌────────────────────────────────────────────────────┐
│ VALUGATOR Probe Alpha                              │
├────────────────────────────────────────────────────┤
│                                                    │
│ Your idea: An AI-powered app that writes breakup   │
│ texts.                                             │
│                                                    │
│ ┌──────────────────────────────────────────────┐   │
│ │ Rex "The Roaster" Revenue:                   │   │
│ │                                              │   │
│ │ Look, I'll be blunt. Your app for AI-written │   │
│ │ breakup texts... where's the money? Who pays │   │
│ │ for this? If it's free, it's a toy, not a    │   │
│ │ business. If it's subscription, good luck    │   │
│ │ getting recurring revenue from something     │   │
│ │ people only need occasionally. Your TAM is   │   │
│ │ limited to cowards, which—fine—is a big      │   │
│ │ market, but retention will be abysmal. Fix   │   │
│ │ your revenue model or don't waste my time.   │   │
│ └──────────────────────────────────────────────┘   │
│                                                    │
│           ┌───────────────┐                        │
│           │ Try Another   │                        │
│           └───────────────┘                        │
│                                                    │
└────────────────────────────────────────────────────┘
```

#### Components:
- **Original Idea**: Display of the user's submitted startup idea
- **Gator Response**: The character's evaluation in a styled text block
- **Try Again Button**: Option to submit another idea or try with a different gator

## HTML Implementation (index.html)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VALUGATOR Probe Alpha</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <div class="container">
        <h1>VALUGATOR Probe Alpha</h1>
        
        <div id="input-form" class="panel">
            <div class="form-group">
                <label for="startup-idea">Enter your startup idea:</label>
                <textarea id="startup-idea" rows="5" placeholder="Describe your startup idea here..."></textarea>
            </div>
            
            <div class="form-group">
                <label for="gator-select">Select Gator:</label>
                <select id="gator-select">
                    <option value="rex" selected>Rex Revenue</option>
                    <!-- Additional gators will be added here -->
                </select>
            </div>
            
            <button id="submit-btn" class="primary-btn">Face the Gator</button>
        </div>
        
        <div id="response-display" class="panel hidden">
            <div class="user-idea">
                <h3>Your idea:</h3>
                <p id="idea-display"></p>
            </div>
            
            <div class="gator-response">
                <h3 id="gator-name"></h3>
                <p id="response-text"></p>
            </div>
            
            <button id="try-again-btn" class="secondary-btn">Try Another</button>
        </div>
        
        <div id="loading" class="hidden">
            <div class="spinner"></div>
            <p>The Gator is thinking...</p>
        </div>
        
        <div id="error-message" class="panel error hidden">
            <p>Something went wrong. Please try again.</p>
        </div>
    </div>

    <script src="js/app.js"></script>
</body>
</html>
```

## JavaScript Implementation (app.js)

```javascript
// Pseudocode for basic functionality
document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const inputForm = document.getElementById('input-form');
    const responseDisplay = document.getElementById('response-display');
    const startupIdeaInput = document.getElementById('startup-idea');
    const gatorSelect = document.getElementById('gator-select');
    const submitBtn = document.getElementById('submit-btn');
    const ideaDisplay = document.getElementById('idea-display');
    const gatorName = document.getElementById('gator-name');
    const responseText = document.getElementById('response-text');
    const tryAgainBtn = document.getElementById('try-again-btn');
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    
    // Event listeners
    submitBtn.addEventListener('click', handleSubmit);
    tryAgainBtn.addEventListener('click', resetForm);
    
    // Load available gators
    loadGators();
    
    async function loadGators() {
        // In a full implementation, this would load from the server
        // For the probe, we'll hardcode Rex Revenue
    }
    
    async function handleSubmit() {
        const idea = startupIdeaInput.value.trim();
        const gator = gatorSelect.value;
        
        if (!idea) {
            alert('Please enter your startup idea');
            return;
        }
        
        // Show loading state
        inputForm.classList.add('hidden');
        loading.classList.remove('hidden');
        
        try {
            // Call API to get gator response
            const response = await getGatorResponse(idea, gator);
            
            // Display response
            ideaDisplay.textContent = idea;
            gatorName.textContent = response.gatorDisplayName;
            responseText.textContent = response.text;
            
            // Show response panel
            loading.classList.add('hidden');
            responseDisplay.classList.remove('hidden');
        } catch (error) {
            console.error('Error:', error);
            loading.classList.add('hidden');
            errorMessage.classList.remove('hidden');
        }
    }
    
    function resetForm() {
        // Reset the form for another submission
        responseDisplay.classList.add('hidden');
        errorMessage.classList.add('hidden');
        inputForm.classList.remove('hidden');
        startupIdeaInput.value = '';
    }
    
    async function getGatorResponse(idea, gator) {
        // This would be an API call in the full implementation
        // For the probe, we'll use fetch to call our backend
        
        const response = await fetch('/api/evaluate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                gator,
                userInput: idea
            })
        });
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        return await response.json();
    }
});
```

## CSS Styling (styles.css)

```css
/* Basic styling for the probe interface */
body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h1 {
    text-align: center;
    margin-bottom: 20px;
    color: #333;
}

.panel {
    margin-bottom: 20px;
    padding: 15px;
    border-radius: 4px;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

textarea, select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.primary-btn, .secondary-btn {
    display: block;
    margin: 20px auto;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
}

.primary-btn {
    background-color: #4CAF50;
    color: white;
}

.secondary-btn {
    background-color: #f0f0f0;
    color: #333;
}

.gator-response {
    background-color: #f0f8ff;
    padding: 15px;
    border-radius: 4px;
    border-left: 4px solid #4CAF50;
    margin-top: 15px;
}

.hidden {
    display: none;
}

.error {
    background-color: #ffebee;
    color: #d32f2f;
    padding: 10px;
    border-radius: 4px;
}

.spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 2s linear infinite;
    margin: 20px auto;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
```

## Backend API Endpoint (pseudocode)

```javascript
// Express route handler (server.js)
app.post('/api/evaluate', async (req, res) => {
  try {
    const { gator, userInput } = req.body;
    
    // Load gator configuration
    const gatorConfig = await loadGatorConfig(gator);
    
    // Load prompt template
    const promptTemplate = await loadPromptTemplate('evaluation');
    
    // Assemble prompt
    const systemPrompt = assemblePrompt(promptTemplate, gatorConfig);
    
    // Call LLM API
    const llmClient = createLlmClient();
    const response = await llmClient.generateResponse(systemPrompt, userInput);
    
    // Return response
    res.json({
      gatorDisplayName: `${gatorConfig.name} "${gatorConfig.nickname}"`,
      text: response
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});
```

## Accessibility Considerations

1. **Keyboard Navigation**
   - All interactive elements must be accessible via keyboard
   - Proper tab order implemented
   - Focus states clearly visible

2. **Screen Reader Support**
   - Semantic HTML elements with appropriate ARIA attributes
   - Meaningful alt text for any visual elements
   - Screen reader announcements for dynamic content

3. **Responsive Design**
   - Interface works across different screen sizes
   - Text remains readable at different zoom levels
   - Touch targets large enough for mobile devices

## Performance Considerations

1. **Minimal Dependencies**
   - No heavy frameworks required
   - Limited use of external libraries
   - Focus on vanilla JavaScript for core functionality

2. **Optimized Loading**
   - CSS and JavaScript minification in production
   - Asynchronous loading where appropriate
   - Minimal asset sizes

3. **Response Handling**
   - Clear loading indicators during API calls
   - Graceful error handling
   - Response caching where appropriate

## Last Updated
2025-05-11 23:50:00 PDT | SESSION-INIT-001 | Claude