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
   * @param {string} persona - The selected persona ID
   */
  async function submitIdea(idea, persona) {
    showMessage('Consulting with the gator...', 'loading');
    submitButton.disabled = true;

    try {
      const response = await fetch('/api/gator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idea, persona }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get gator feedback');
      }

      const data = await response.json();
      showMessage(data.response || 'No response received', 'success');
    } catch (error) {
      showMessage(
        'This feature is not yet implemented. Stay tuned for future updates!',
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
  function showMessage(message, type) {
    gatorResponse.innerHTML = '';
    
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageElement.classList.add(type);
    
    gatorResponse.appendChild(messageElement);
  }
});