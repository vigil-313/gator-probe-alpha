# Minimal User Interface Design

## Document ID
[DOC-TECH-UI-1]

## Overview
This document outlines the design for the minimal user interface of the VALUGATOR Probe Alpha. Following the MVP approach recommended by Zane and the technical gators, the UI focuses on the essential components needed to test the core user flow: submitting a startup idea and receiving a gator persona response.

## Core Interface Components

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
│           │ Get Feedback   │                       │
│           └────────────────┘                       │
│                                                    │
└────────────────────────────────────────────────────┘
```

#### Components:
- **Page Title**: Simple heading "VALUGATOR Probe Alpha"
- **Text Area**: Multi-line input for the startup idea
- **Gator Selector**: Dropdown to select from available gators
- **Submit Button**: Clear call to action to get feedback

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
- **Original Idea**: Display of the submitted idea
- **Gator Response**: Persona response with character attribution
- **Reset Button**: Option to submit another idea

## Implementation

### HTML Implementation (index.html)

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
        <header>
            <h1>VALUGATOR Probe Alpha</h1>
        </header>
        
        <main>
            <form id="gator-form">
                <div class="form-group">
                    <label for="user-input">Enter your startup idea:</label>
                    <textarea id="user-input" rows="5" placeholder="Describe your startup idea here..." required></textarea>
                </div>
                
                <div class="form-group">
                    <label for="persona-select">Select Gator:</label>
                    <select id="persona-select" required>
                        <option value="" disabled selected>Select a gator...</option>
                        <!-- Will be populated dynamically -->
                    </select>
                </div>
                
                <button type="submit">Get Feedback</button>
            </form>
            
            <div id="response-container" class="hidden">
                <h2 id="response-header"></h2>
                <div id="response-content"></div>
                <button id="reset-button">Submit Another Idea</button>
            </div>
            
            <div id="loading-indicator" class="hidden">
                <p>Getting feedback from your chosen gator...</p>
            </div>
            
            <div id="error-container" class="hidden">
                <p id="error-message"></p>
                <button id="error-reset-button">Try Again</button>
            </div>
        </main>
        
        <footer>
            <p>VALUGATOR Probe Alpha | 2025</p>
        </footer>
    </div>
    
    <script src="js/app.js"></script>
</body>
</html>
```

### CSS Implementation (styles.css)

```css
/* Minimal styling for the probe interface */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f4f4f4;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

header {
  margin-bottom: 30px;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

select, textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

#response-container {
  margin-top: 30px;
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

#response-header {
  margin-bottom: 15px;
  color: #2c3e50;
}

#response-content {
  margin-bottom: 20px;
  white-space: pre-line;
}

#reset-button {
  margin-top: 20px;
}

#loading-indicator {
  text-align: center;
  margin: 30px 0;
}

#error-container {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 4px;
}

.hidden {
  display: none;
}

footer {
  margin-top: 50px;
  text-align: center;
  color: #777;
}
```

### JavaScript Implementation (app.js)

```javascript
document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const form = document.getElementById('gator-form');
  const personaSelect = document.getElementById('persona-select');
  const userInput = document.getElementById('user-input');
  const responseContainer = document.getElementById('response-container');
  const responseHeader = document.getElementById('response-header');
  const responseContent = document.getElementById('response-content');
  const resetButton = document.getElementById('reset-button');
  const loadingIndicator = document.getElementById('loading-indicator');
  const errorContainer = document.getElementById('error-container');
  const errorMessage = document.getElementById('error-message');
  const errorResetButton = document.getElementById('error-reset-button');
  
  // Load available personas
  fetchPersonas();
  
  // Event listeners
  form.addEventListener('submit', handleSubmit);
  resetButton.addEventListener('click', resetForm);
  errorResetButton.addEventListener('click', resetForm);
  
  // Functions
  async function fetchPersonas() {
    try {
      const response = await fetch('/api/personas');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to load personas');
      }
      
      // Populate select dropdown
      data.personas.forEach(persona => {
        const option = document.createElement('option');
        option.value = persona.id;
        option.textContent = `${persona.name} (${persona.panel})`;
        personaSelect.appendChild(option);
      });
    } catch (error) {
      showError('Failed to load gator personas. Please refresh the page.');
      console.error('Error fetching personas:', error);
    }
  }
  
  async function handleSubmit(event) {
    event.preventDefault();
    
    // Basic validation
    if (!personaSelect.value) {
      showError('Please select a gator persona');
      return;
    }
    
    if (!userInput.value.trim()) {
      showError('Please enter your startup idea');
      return;
    }
    
    // Show loading indicator
    form.classList.add('hidden');
    loadingIndicator.classList.remove('hidden');
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personaId: personaSelect.value,
          userInput: userInput.value
        })
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to generate response');
      }
      
      // Display response
      responseHeader.textContent = `Feedback from ${data.personaName}`;
      responseContent.innerHTML = `<p>${data.response}</p>`;
      
      // Show response container, hide loading
      loadingIndicator.classList.add('hidden');
      responseContainer.classList.remove('hidden');
    } catch (error) {
      showError(error.message || 'An error occurred while getting feedback');
      console.error('Error generating response:', error);
      loadingIndicator.classList.add('hidden');
    }
  }
  
  function resetForm() {
    // Reset form
    form.reset();
    form.classList.remove('hidden');
    responseContainer.classList.add('hidden');
    errorContainer.classList.add('hidden');
  }
  
  function showError(message) {
    errorMessage.textContent = message;
    errorContainer.classList.remove('hidden');
  }
});
```

## API Integration

The UI interacts with two main backend API endpoints:

### 1. GET /api/personas

Retrieves available gator personas:

```javascript
// Response format
{
  "success": true,
  "personas": [
    { "id": "rex", "name": "Rex Revenue", "panel": "Evaluation" },
    { "id": "vanessa", "name": "Vanessa Venture", "panel": "Evaluation" },
    { "id": "zane", "name": "Zane Cutter", "panel": "Pathfinder" },
    { "id": "lex", "name": "Lex Talionis", "panel": "Legal" }
  ]
}
```

### 2. POST /api/generate

Generates a gator response:

```javascript
// Request format
{
  "personaId": "rex",
  "userInput": "An AI-powered app that writes breakup texts"
}

// Response format
{
  "success": true,
  "personaName": "Rex \"The Roaster\" Revenue",
  "response": "Look, I'll be blunt. Your app for AI-written breakup texts..."
}
```

## Extension Points

The UI is designed with these extension points for future development:

### 1. Enhanced Visual Design
- Gator persona avatars/images
- Custom styling per gator type
- More engaging visual elements

### 2. User Experience Enhancements
- Feedback collection mechanism
- History of previous submissions
- Panel-specific UI adaptations

### 3. Multi-turn Conversations
- Chat-like interface for follow-up questions
- Conversation history display
- Context preservation between exchanges

These extensions are documented in more detail in `/Technical/EXTENSION_POINTS.md`.

## Implementation Focus

For the MVP, implementation will focus on:
1. Basic form submission and response display
2. Minimal styling for readability
3. Core error handling
4. API integration

This minimal approach allows us to quickly test the core user flow while establishing a foundation that can be enhanced in future iterations.

## Last Updated
2025-05-12T18:00:00-07:00 | SESSION-004 | Claude