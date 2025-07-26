/**
 * Teresa Companion - Embeddable AI Chatbot Widget
 * An emotional support assistant for health-related concerns
 * 
 * Usage: Include this script and call TeresaChatbot.init(config)
 */

class TeresaChatbot {
  constructor(config = {}) {
    // Configuration with defaults
    this.config = {
      apiKey: config.apiKey || 'YOUR_API_KEY_HERE',
      apiEndpoint: config.apiEndpoint || 'https://api.openai.com/v1/chat/completions',
      buttonText: config.buttonText || 'Talk to Teresa',
      primaryColor: config.primaryColor || '#1B4D3E',
      backgroundColor: config.backgroundColor || '#FCF4DF',
      position: config.position || 'bottom-right',
      zIndex: config.zIndex || 10000,
      ...config
    };

    // State management
    this.isOpen = false;
    this.isLoading = false;
    this.userName = this.getUserName();
    this.conversationHistory = this.getConversationHistory();
    this.empathyCount = 0; // Track empathic exchanges before offering medical insight

    // Common symptoms for quick selection
    this.commonSymptoms = [
      'Feeling tired or fatigued',
      'Chest tightness or discomfort',
      'Headache or dizziness',
      'Stomach issues or nausea',
      'Muscle aches or stiffness',
      'Difficulty sleeping',
      'Feeling anxious or stressed',
      'Other concern...'
    ];

    this.init();
  }

  /**
   * Initialize the chatbot widget
   */
  init() {
    this.createStyles();
    this.createWidget();
    this.bindEvents();
  }

  /**
   * Create and inject CSS styles
   */
  createStyles() {
    const styleId = 'teresa-chatbot-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* Teresa Chatbot Styles */
      .teresa-chatbot-button {
        position: fixed;
        ${this.config.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
        ${this.config.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
        width: 60px;
        height: 60px;
        background: ${this.config.primaryColor};
        border-radius: 50%;
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: ${this.config.zIndex};
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
      }

      .teresa-chatbot-button:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
      }

      .teresa-chatbot-button.open {
        background: #dc2626;
      }

      .teresa-chatbot-modal {
        position: fixed;
        ${this.config.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
        ${this.config.position.includes('bottom') ? 'bottom: 90px;' : 'top: 90px;'}
        width: 350px;
        height: 500px;
        background: ${this.config.backgroundColor};
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        z-index: ${this.config.zIndex + 1};
        display: none;
        flex-direction: column;
        font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
        border: 2px solid #e5e7eb;
      }

      .teresa-chatbot-modal.open {
        display: flex;
        animation: teresa-slide-up 0.3s ease-out;
      }

      @keyframes teresa-slide-up {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .teresa-chatbot-header {
        background: ${this.config.primaryColor};
        color: white;
        padding: 16px;
        border-radius: 14px 14px 0 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .teresa-chatbot-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }

      .teresa-chatbot-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .teresa-chatbot-messages {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .teresa-message {
        max-width: 80%;
        padding: 12px 16px;
        border-radius: 16px;
        font-size: 14px;
        line-height: 1.4;
        word-wrap: break-word;
      }

      .teresa-message.bot {
        background: white;
        color: ${this.config.primaryColor};
        align-self: flex-start;
        border: 1px solid #e5e7eb;
      }

      .teresa-message.user {
        background: ${this.config.primaryColor};
        color: white;
        align-self: flex-end;
      }

      .teresa-quick-options {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-top: 8px;
      }

      .teresa-quick-option {
        background: white;
        border: 1px solid ${this.config.primaryColor};
        color: ${this.config.primaryColor};
        padding: 8px 12px;
        border-radius: 12px;
        cursor: pointer;
        font-size: 13px;
        text-align: left;
        transition: all 0.2s ease;
      }

      .teresa-quick-option:hover {
        background: ${this.config.primaryColor};
        color: white;
      }

      .teresa-chatbot-input {
        display: flex;
        padding: 16px;
        border-top: 1px solid #e5e7eb;
        gap: 8px;
      }

      .teresa-chatbot-input input {
        flex: 1;
        padding: 12px 16px;
        border: 1px solid #d1d5db;
        border-radius: 24px;
        outline: none;
        font-size: 14px;
        font-family: inherit;
      }

      .teresa-chatbot-input input:focus {
        border-color: ${this.config.primaryColor};
      }

      .teresa-send-button {
        background: ${this.config.primaryColor};
        border: none;
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        transition: all 0.2s ease;
      }

      .teresa-send-button:hover:not(:disabled) {
        background: #0f3027;
      }

      .teresa-send-button:disabled {
        background: #9ca3af;
        cursor: not-allowed;
      }

      .teresa-typing {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #6b7280;
        font-style: italic;
        font-size: 13px;
      }

      .teresa-typing-dots {
        display: flex;
        gap: 2px;
      }

      .teresa-typing-dot {
        width: 4px;
        height: 4px;
        background: #6b7280;
        border-radius: 50%;
        animation: teresa-typing-bounce 1.4s infinite;
      }

      .teresa-typing-dot:nth-child(2) {
        animation-delay: 0.2s;
      }

      .teresa-typing-dot:nth-child(3) {
        animation-delay: 0.4s;
      }

      @keyframes teresa-typing-bounce {
        0%, 60%, 100% {
          opacity: 0.3;
          transform: translateY(0);
        }
        30% {
          opacity: 1;
          transform: translateY(-4px);
        }
      }

      .teresa-name-input {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 8px;
      }

      .teresa-name-input input {
        padding: 8px 12px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-size: 14px;
      }

      .teresa-name-input button {
        background: ${this.config.primaryColor};
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
      }

      /* Mobile responsiveness */
      @media (max-width: 768px) {
        .teresa-chatbot-modal {
          width: calc(100vw - 40px);
          height: 70vh;
          bottom: 90px;
          right: 20px;
          left: 20px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Create the chatbot widget HTML
   */
  createWidget() {
    // Create floating button
    this.button = document.createElement('button');
    this.button.className = 'teresa-chatbot-button';
    this.button.innerHTML = '💚';
    this.button.title = this.config.buttonText;

    // Create modal
    this.modal = document.createElement('div');
    this.modal.className = 'teresa-chatbot-modal';
    this.modal.innerHTML = `
      <div class="teresa-chatbot-header">
        <h3>Teresa Companion</h3>
        <button class="teresa-chatbot-close">×</button>
      </div>
      <div class="teresa-chatbot-messages" id="teresa-messages"></div>
      <div class="teresa-chatbot-input">
        <input type="text" placeholder="Type your message..." id="teresa-input" maxlength="500">
        <button class="teresa-send-button" id="teresa-send">➤</button>
      </div>
    `;

    // Append to body
    document.body.appendChild(this.button);
    document.body.appendChild(this.modal);

    // Get references
    this.messagesContainer = document.getElementById('teresa-messages');
    this.messageInput = document.getElementById('teresa-input');
    this.sendButton = document.getElementById('teresa-send');

    // Initialize conversation
    this.initializeConversation();
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Toggle modal
    this.button.addEventListener('click', () => this.toggleModal());
    
    // Close modal
    this.modal.querySelector('.teresa-chatbot-close').addEventListener('click', () => this.closeModal());
    
    // Send message
    this.sendButton.addEventListener('click', () => this.sendMessage());
    
    // Send on Enter key
    this.messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.modal.contains(e.target) && !this.button.contains(e.target)) {
        this.closeModal();
      }
    });
  }

  /**
   * Initialize conversation with welcome message
   */
  initializeConversation() {
    if (this.conversationHistory.length === 0) {
      if (!this.userName) {
        this.addMessage("Hi, I'm Teresa, your health companion. What should I call you?", 'bot');
        this.showNameInput();
      } else {
        this.addMessage(`Hello ${this.userName}! I'm Teresa, your health companion. What's bothering you today?`, 'bot');
        this.showQuickOptions();
      }
    } else {
      // Restore conversation history
      this.conversationHistory.forEach(msg => {
        this.addMessage(msg.content, msg.role === 'assistant' ? 'bot' : 'user', false);
      });
      this.scrollToBottom();
    }
  }

  /**
   * Show name input interface
   */
  showNameInput() {
    const nameInputHtml = `
      <div class="teresa-name-input">
        <input type="text" placeholder="Enter your name" id="teresa-name-input" maxlength="30">
        <button onclick="window.teresaChatbot.setUserName()">Continue</button>
      </div>
    `;
    
    const lastMessage = this.messagesContainer.lastElementChild;
    if (lastMessage) {
      lastMessage.insertAdjacentHTML('beforeend', nameInputHtml);
    }
  }

  /**
   * Set user name and continue conversation
   */
  setUserName() {
    const nameInput = document.getElementById('teresa-name-input');
    const name = nameInput.value.trim();
    
    if (name) {
      this.userName = name;
      this.saveUserName(name);
      
      // Remove name input
      const nameInputDiv = nameInput.closest('.teresa-name-input');
      if (nameInputDiv) nameInputDiv.remove();
      
      // Continue conversation
      this.addMessage(`Nice to meet you, ${name}! What's bothering you today?`, 'bot');
      this.showQuickOptions();
    }
  }

  /**
   * Show quick symptom options
   */
  showQuickOptions() {
    const optionsHtml = `
      <div class="teresa-quick-options">
        ${this.commonSymptoms.map(symptom => 
          `<button class="teresa-quick-option" onclick="window.teresaChatbot.selectQuickOption('${symptom}')">${symptom}</button>`
        ).join('')}
      </div>
    `;
    
    const lastMessage = this.messagesContainer.lastElementChild;
    if (lastMessage && lastMessage.classList.contains('bot')) {
      lastMessage.insertAdjacentHTML('beforeend', optionsHtml);
    }
  }

  /**
   * Handle quick option selection
   */
  selectQuickOption(symptom) {
    // Remove quick options
    const quickOptions = this.messagesContainer.querySelector('.teresa-quick-options');
    if (quickOptions) quickOptions.remove();
    
    // Add user message
    this.addMessage(symptom, 'user');
    
    // Process the symptom
    this.processUserMessage(symptom);
  }

  /**
   * Toggle modal open/close
   */
  toggleModal() {
    if (this.isOpen) {
      this.closeModal();
    } else {
      this.openModal();
    }
  }

  /**
   * Open modal
   */
  openModal() {
    this.isOpen = true;
    this.modal.classList.add('open');
    this.button.classList.add('open');
    this.button.innerHTML = '×';
    this.messageInput.focus();
  }

  /**
   * Close modal
   */
  closeModal() {
    this.isOpen = false;
    this.modal.classList.remove('open');
    this.button.classList.remove('open');
    this.button.innerHTML = '💚';
  }

  /**
   * Send user message
   */
  async sendMessage() {
    const message = this.messageInput.value.trim();
    if (!message || this.isLoading) return;

    this.addMessage(message, 'user');
    this.messageInput.value = '';
    
    await this.processUserMessage(message);
  }

  /**
   * Process user message and get AI response
   */
  async processUserMessage(message) {
    this.isLoading = true;
    this.sendButton.disabled = true;
    this.showTypingIndicator();

    try {
      const response = await this.getAIResponse(message);
      this.hideTypingIndicator();
      this.addMessage(response, 'bot');
      
      // Track empathy exchanges
      this.empathyCount++;
      
      // After 2-3 empathic exchanges, offer medical insight option
      if (this.empathyCount >= 2 && this.empathyCount <= 3) {
        setTimeout(() => {
          this.addMessage("Would it be okay if I shared some general health information that might help?", 'bot');
          this.showYesNoOptions();
        }, 1000);
      }
      
    } catch (error) {
      this.hideTypingIndicator();
      this.addMessage("I'm sorry, I'm having trouble responding right now. Please try again in a moment.", 'bot');
      console.error('Teresa Chatbot Error:', error);
    }

    this.isLoading = false;
    this.sendButton.disabled = false;
  }

  /**
   * Show yes/no options for medical information
   */
  showYesNoOptions() {
    const optionsHtml = `
      <div class="teresa-quick-options">
        <button class="teresa-quick-option" onclick="window.teresaChatbot.handleMedicalInfoResponse(true)">Yes, that would help</button>
        <button class="teresa-quick-option" onclick="window.teresaChatbot.handleMedicalInfoResponse(false)">No, I'd prefer just emotional support</button>
      </div>
    `;
    
    const lastMessage = this.messagesContainer.lastElementChild;
    if (lastMessage && lastMessage.classList.contains('bot')) {
      lastMessage.insertAdjacentHTML('beforeend', optionsHtml);
    }
  }

  /**
   * Handle medical information response
   */
  handleMedicalInfoResponse(wantsMedicalInfo) {
    // Remove options
    const quickOptions = this.messagesContainer.querySelector('.teresa-quick-options');
    if (quickOptions) quickOptions.remove();
    
    if (wantsMedicalInfo) {
      this.addMessage("Yes, that would help", 'user');
      this.addMessage("I'll share some general information that might be relevant. Remember, this isn't medical advice, just educational information.", 'bot');
    } else {
      this.addMessage("No, I'd prefer just emotional support", 'user');
      this.addMessage("Of course! I'm here to listen and support you emotionally. Tell me more about how you're feeling.", 'bot');
    }
  }

  /**
   * Get AI response from OpenAI API
   */
  async getAIResponse(userMessage) {
    // Mock responses for development (replace with actual API call)
    if (this.config.apiKey === 'YOUR_API_KEY_HERE') {
      return this.getMockResponse(userMessage);
    }

    const messages = [
      {
        role: "system",
        content: `You are Teresa, a compassionate health companion chatbot. Your primary role is to provide emotional support and empathy to users experiencing health concerns. 

IMPORTANT GUIDELINES:
- ALWAYS start with empathy and emotional validation
- NEVER provide medical diagnosis or specific treatment advice
- Use warm, conversational language
- Show genuine concern and understanding
- Only after 2-3 empathic exchanges, you may offer general health education (not diagnosis)
- Always encourage consulting healthcare professionals for serious concerns
- Remember the user's name: ${this.userName || 'User'}
- Keep responses concise but caring (2-3 sentences max)`
      },
      ...this.conversationHistory.slice(-10), // Last 10 messages for context
      { role: "user", content: userMessage }
    ];

    const response = await fetch(this.config.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: messages,
        max_tokens: 150,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content.trim();
    
    // Save to conversation history
    this.conversationHistory.push({ role: "user", content: userMessage });
    this.conversationHistory.push({ role: "assistant", content: aiResponse });
    this.saveConversationHistory();
    
    return aiResponse;
  }

  /**
   * Get mock response for development/testing
   */
  getMockResponse(userMessage) {
    const mockResponses = {
      "fatigue": "I can understand how exhausting it must feel to be constantly tired. That sounds really draining and frustrating.",
      "chest": "That must feel really scary and concerning. Chest discomfort can be so unsettling, and I want you to know your feelings about this are completely valid.",
      "headache": "Headaches can be so overwhelming and make everything feel more difficult. I'm sorry you're dealing with this discomfort.",
      "anxiety": "It takes courage to share that you're feeling anxious. Those feelings are real and valid, and you're not alone in experiencing them.",
      "default": "Thank you for sharing that with me. It sounds like you're going through something difficult, and I want you to know that your feelings are completely valid. You're not alone in this."
    };

    const lowerMessage = userMessage.toLowerCase();
    
    for (const [key, response] of Object.entries(mockResponses)) {
      if (key !== 'default' && lowerMessage.includes(key)) {
        return response;
      }
    }
    
    return mockResponses.default;
  }

  /**
   * Add message to chat
   */
  addMessage(content, sender, scroll = true) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `teresa-message ${sender}`;
    messageDiv.textContent = content;
    
    this.messagesContainer.appendChild(messageDiv);
    
    if (scroll) {
      this.scrollToBottom();
    }
  }

  /**
   * Show typing indicator
   */
  showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'teresa-message bot teresa-typing';
    typingDiv.innerHTML = `
      Teresa is typing
      <div class="teresa-typing-dots">
        <div class="teresa-typing-dot"></div>
        <div class="teresa-typing-dot"></div>
        <div class="teresa-typing-dot"></div>
      </div>
    `;
    typingDiv.id = 'teresa-typing-indicator';
    
    this.messagesContainer.appendChild(typingDiv);
    this.scrollToBottom();
  }

  /**
   * Hide typing indicator
   */
  hideTypingIndicator() {
    const typingIndicator = document.getElementById('teresa-typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  /**
   * Scroll to bottom of messages
   */
  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  /**
   * Local storage helpers
   */
  getUserName() {
    return localStorage.getItem('teresa-user-name') || '';
  }

  saveUserName(name) {
    localStorage.setItem('teresa-user-name', name);
  }

  getConversationHistory() {
    try {
      return JSON.parse(localStorage.getItem('teresa-conversation') || '[]');
    } catch {
      return [];
    }
  }

  saveConversationHistory() {
    localStorage.setItem('teresa-conversation', JSON.stringify(this.conversationHistory.slice(-20))); // Keep last 20 messages
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = [];
    localStorage.removeItem('teresa-conversation');
    this.messagesContainer.innerHTML = '';
    this.initializeConversation();
  }

  /**
   * Static initialization method
   */
  static init(config = {}) {
    if (!window.teresaChatbot) {
      window.teresaChatbot = new TeresaChatbot(config);
    }
    return window.teresaChatbot;
  }
}

// Auto-initialize if script is loaded directly
if (typeof window !== 'undefined') {
  // Make chatbot available globally
  window.TeresaChatbot = TeresaChatbot;
  
  // Auto-init with default config if no explicit initialization
  document.addEventListener('DOMContentLoaded', () => {
    if (!window.teresaChatbot) {
      TeresaChatbot.init();
    }
  });
}