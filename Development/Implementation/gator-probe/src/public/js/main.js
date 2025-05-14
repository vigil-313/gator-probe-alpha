/**
 * VALUGATOR Probe Alpha
 * Client-side JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const ideaForm = document.getElementById('idea-form');
  const ideaInput = document.getElementById('idea-input');
  const personaSelect = document.getElementById('persona-select');
  const submitButton = document.getElementById('submit-button');
  const gatorResponse = document.getElementById('gator-response');

  // Event listeners
  ideaForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const idea = ideaInput.value.trim();
    const persona = personaSelect.value;

    if (!idea) {
      showMessage('Please enter your startup idea', 'error');
      return;
    }

    await submitIdea(idea, persona);
  });

  /**
   * Submit idea to the API and display response
   * @param {string} idea - The startup idea
   * @param {string} personaId - The selected persona ID
   */
  async function submitIdea(idea, personaId) {
    showMessage('Consulting with the gator...', 'loading');
    submitButton.disabled = true;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          personaId, 
          userInput: idea 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get gator feedback');
      }

      const data = await response.json();
      console.log('API response:', data);
      
      if (data && data.status === 'success' && data.data) {
        // Handle the response based on the format
        // Extract usage data if available
        const usageData = data.data.metadata?.usage || null;
        
        if (data.data.response) {
          showMessage(data.data.response, 'success', usageData);
        } else if (data.data.content) {
          showMessage(data.data.content, 'success', usageData);
        } else {
          throw new Error('Response missing content');
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      showMessage(
        `Error: ${error.message || 'Something went wrong. Please try again.'}`,
        'error'
      );
      console.error('Error:', error);
    } finally {
      submitButton.disabled = false;
    }
  }

  /**
   * Display a message in the response area
   * @param {string} message - The message to display
   * @param {string} type - Message type (loading, error, success)
   */
  function showMessage(message, type, usageData) {
    gatorResponse.innerHTML = '';
    
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageElement.classList.add(type);
    
    gatorResponse.appendChild(messageElement);
    
    // Show usage data if available
    if (usageData && (usageData.input_tokens || usageData.output_tokens)) {
      console.log('Showing token usage:', usageData);
      const usageElement = document.createElement('div');
      usageElement.classList.add('token-usage');
      usageElement.innerHTML = `
        <p class="token-info">
          <strong>Token Usage:</strong> 
          Input: ${usageData.input_tokens || 0} | 
          Output: ${usageData.output_tokens || 0} | 
          Total: ${(usageData.input_tokens || 0) + (usageData.output_tokens || 0)}
        </p>
      `;
      gatorResponse.appendChild(usageElement);
    } else {
      console.log('No token usage data available');
    }
  }
});