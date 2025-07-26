/**
 * Teresa Companion - Spark-Integrated AI Chatbot Widget
 * An emotional support assistant using Spark's built-in LLM API
 * 
 * This version integrates with the Spark runtime for seamless operation
 */

// Create an IIFE to avoid global pollution and prevent redeclaration
(function() {
  'use strict';
  
  // Prevent duplicate loading
  if (typeof window !== 'undefined' && window.TeresaChatbotSpark) {
    console.log('TeresaChatbotSpark already loaded, skipping redefinition');
    return;
  }

class TeresaChatbotSpark {
  constructor(config = {}) {
    // Configuration with defaults
    this.config = {
      buttonText: config.buttonText || 'Talk to Teresa',
      primaryColor: config.primaryColor || '#1B4D3E',
      backgroundColor: config.backgroundColor || '#FCF4DF',
      position: config.position || 'bottom-right',
      zIndex: config.zIndex || 1000,
      useSparkAPI: config.apiKey === 'SPARK_API' || config.useSparkAPI || true,
      ...config
    };

    // State management
    this.isOpen = false;
    this.isLoading = false;
    this.userName = this.getUserName();
    this.conversationHistory = this.getConversationHistory();
    this.empathyCount = 0;

    // Get language preference
    this.language = this.getLanguagePreference();
    
    // Common symptoms for quick selection
    this.commonSymptoms = this.getLocalizedSymptoms();

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
    const styleId = 'teresa-chatbot-spark-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* Teresa Chatbot Spark Styles */
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
        animation: teresa-message-appear 0.3s ease-out;
      }

      @keyframes teresa-message-appear {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
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
        <input type="text" placeholder="${this.getLocalizedText('placeholder')}" id="teresa-input" maxlength="500">
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
        this.addMessage(this.getLocalizedText('askName'), 'bot');
        this.showNameInput();
      } else {
        const greeting = this.language === 'ko' 
          ? `안녕하세요 ${this.userName}님! 저는 당신의 건강 동반자 테레사입니다. 오늘 무엇이 신경 쓰이시나요?`
          : `Hello ${this.userName}! I'm Teresa, your health companion. What's bothering you today?`;
        this.addMessage(greeting, 'bot');
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
    const namePlaceholder = this.language === 'ko' ? '이름을 입력해주세요' : 'Enter your name';
    const continueText = this.language === 'ko' ? '계속' : 'Continue';
    
    const nameInputHtml = `
      <div class="teresa-name-input">
        <input type="text" placeholder="${namePlaceholder}" id="teresa-name-input" maxlength="30">
        <button onclick="window.teresaChatbotSpark.setUserName()">${continueText}</button>
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
      
      // Continue conversation with localized greeting
      const greeting = this.language === 'ko' 
        ? `만나서 반갑습니다, ${name}님! 오늘 무엇이 신경 쓰이시나요?`
        : `Nice to meet you, ${name}! What's bothering you today?`;
      this.addMessage(greeting, 'bot');
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
          `<button class="teresa-quick-option" onclick="window.teresaChatbotSpark.selectQuickOption('${symptom}')">${symptom}</button>`
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
          this.addMessage(this.getLocalizedText('medicalInfo'), 'bot');
          this.showYesNoOptions();
        }, 1500);
      }
      
    } catch (error) {
      this.hideTypingIndicator();
      this.addMessage(this.getLocalizedText('error'), 'bot');
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
        <button class="teresa-quick-option" onclick="window.teresaChatbotSpark.handleMedicalInfoResponse(true)">${this.getLocalizedText('yesHelp')}</button>
        <button class="teresa-quick-option" onclick="window.teresaChatbotSpark.handleMedicalInfoResponse(false)">${this.getLocalizedText('noSupport')}</button>
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
      this.addMessage(this.getLocalizedText('yesHelp'), 'user');
      const medicalInfoResponse = this.language === 'ko' 
        ? "관련될 수 있는 일반적인 정보를 공유드리겠습니다. 이는 의료 조언이 아니라 교육적 정보임을 기억해 주세요."
        : "I'll share some general information that might be relevant. Remember, this isn't medical advice, just educational information.";
      this.addMessage(medicalInfoResponse, 'bot');
    } else {
      this.addMessage(this.getLocalizedText('noSupport'), 'user');
      const emotionalResponse = this.language === 'ko'
        ? "물론입니다! 저는 여기서 듣고 감정적으로 지지해드리겠습니다. 기분이 어떤지 더 말씀해 주세요."
        : "Of course! I'm here to listen and support you emotionally. Tell me more about how you're feeling.";
      this.addMessage(emotionalResponse, 'bot');
    }
  }

  /**
   * Get AI response using Spark's LLM API
   */
  async getAIResponse(userMessage) {
    try {
      // Check if Spark API is available
      if (this.config.useSparkAPI && window.spark && window.spark.llm && window.spark.llmPrompt) {
        
        // Build conversation context
        const conversationContext = this.conversationHistory.slice(-6).map(msg => 
          `${msg.role === 'user' ? 'User' : 'Teresa'}: ${msg.content}`
        ).join('\n');

        // Create the prompt using Spark's template system with language support
        const isKorean = this.language === 'ko';
        const languageInstructions = isKorean 
          ? `- Respond in Korean (한국어)
- Use respectful and caring Korean expressions
- Address the user politely using Korean honorifics when appropriate`
          : `- Respond in English
- Use warm and caring language`;

        const prompt = window.spark.llmPrompt`You are Teresa, a compassionate health companion chatbot. Your role is to provide emotional support followed by practical health guidance.

IMPORTANT GUIDELINES:
${languageInstructions}
- Start with 1 sentence of empathy and emotional validation
- Follow immediately with 1-2 sentences of practical advice or general health information
- NEVER provide medical diagnosis or specific treatment advice
- Keep responses to exactly 2-3 sentences total
- Offer actionable suggestions like rest, hydration, gentle movement, breathing exercises, or seeing a doctor
- Always encourage consulting healthcare professionals for serious concerns
- Remember the user's name: ${this.userName || 'User'}

RESPONSE STRUCTURE:
1. Emotional validation (1 sentence)
2. Practical guidance (1-2 sentences)

Recent conversation:
${conversationContext}

User's current message: ${userMessage}

Provide empathy followed by practical advice:`;

        // Call Spark's LLM API
        const aiResponse = await window.spark.llm(prompt, 'gpt-4o-mini');
        
        // Save to conversation history
        this.conversationHistory.push({ role: "user", content: userMessage });
        this.conversationHistory.push({ role: "assistant", content: aiResponse });
        this.saveConversationHistory();
        
        return aiResponse;
      }
    } catch (error) {
      console.error('Spark LLM API Error:', error);
    }
    
    // Fallback to mock responses
    return this.getMockResponse(userMessage);
  }

  /**
   * Get mock response for development/testing
   */
  getMockResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Enhanced mock responses with empathy + practical advice
    const responses = this.language === 'ko' ? {
      // Korean responses
      피로: "계속 피곤하신 것이 얼마나 힘드실지 이해합니다. 7-9시간 수면을 우선시하고, 충분한 수분 섭취와 짧은 산책 같은 가벼운 운동을 고려해 보세요. 지속된다면 의료진과 상담하는 것이 좋겠습니다.",
      지친: "피로감이 너무 압도적일 수 있어요. 규칙적인 영양 식사와 하루 중 짧은 휴식을 취하시길 바랍니다. 지속적이라면 의사와 상담해 보세요.",
      가슴: "정말 무섭고 걱정스러우실 것 같아요. 천천히 깊게 숨을 쉬고 편안한 자세로 앉아보세요. 가슴 통증, 호흡곤란이 있거나 악화되면 즉시 의료진의 진료를 받으세요.",
      심장: "심장 관련 증상으로 걱정되는 마음 충분히 이해합니다. 침착함을 유지하고 카페인이나 격한 활동을 피하세요. 가슴 통증, 불규칙한 심박, 호흡곤란이 있다면 의료진에게 연락하세요.",
      두통: "두통은 정말 압도적이고 모든 것을 더 어렵게 만들 수 있어요. 충분한 수분 섭취, 조용하고 어두운 곳에서 휴식, 관자놀이 마사지를 해보세요. 잦거나 심하다면 의사 진료를 고려하세요.",
      통증: "통증을 겪고 계시는 것이 정말 안타깝습니다. 가벼운 스트레칭, 온찜질 또는 냉찜질, 충분한 휴식을 시도해 보세요. 심하거나 지속적이라면 의료진과 상담하는 것이 중요합니다.",
      불안: "불안한 마음을 나누어 주셔서 용기가 있으신 것 같아요. 천천히 깊게 숨을 쉬고 지금 당장 조절할 수 있는 것에 집중해 보세요. 상담사나 의사와 불안 관리 기법에 대해 이야기하는 것을 고려해 보세요.",
      스트레스: "스트레스가 때로는 너무 압도적일 수 있어요. 깊은 호흡이나 짧은 산책을 위해 몇 분을 내보세요. 오늘 작고 관리 가능한 목표를 설정하는 것도 더 통제감을 느끼는 데 도움이 될 수 있어요.",
      잠: "수면 문제는 기분, 에너지, 신체적 느낌 등 모든 것에 영향을 줄 수 있어요. 취침 루틴 만들기, 잠자기 전 화면 피하기, 방을 시원하고 어둡게 유지하기를 시도해 보세요. 불면증이 지속되면 의사와 상의하세요.",
      어지러움: "어지러움은 정말 불안하고 무서울 수 있어요. 즉시 앉고 수분을 충분히 섭취해 보세요. 심하거나 빈번하거나 다른 증상이 동반되면 의료진의 평가를 받으세요.",
      메스꺼움: "메스꺼움은 정말 괴롭고 지치게 만들 수 있어요. 맑은 액체를 조금씩 마시고, 크래커 같은 담백한 음식을 소량 드시고, 신선한 공기를 마셔보세요. 수분을 유지할 수 없거나 지속되면 의료진에게 연락하세요.",
      걱정: "정말 걱정스러운 시간을 보내고 계신 것 같아요. 한 번에 한 가지씩 집중하고 신뢰할 수 있는 사람과 이야기하는 것을 고려해 보세요. 건강 걱정이 일상생활에 영향을 미치고 있다면 주저하지 말고 의료진에게 연락하세요."
    } : {
      // English responses  
      tired: "I can understand how exhausting it must feel to be constantly tired. Try to prioritize 7-9 hours of sleep, stay hydrated, and consider gentle movement like a short walk. If this persists, it's worth discussing with a healthcare provider.",
      fatigue: "Feeling fatigued can be so overwhelming. Make sure you're eating regular nutritious meals and taking short breaks throughout your day. Consider checking with your doctor if this has been ongoing.",
      chest: "That must feel really scary and concerning. Try taking slow, deep breaths and sitting in a comfortable position. If you experience chest pain, shortness of breath, or it worsens, please seek medical attention promptly.",
      heart: "It's completely understandable to feel worried about heart-related symptoms. Try to stay calm and avoid caffeine or strenuous activity. If you're experiencing chest pain, irregular heartbeat, or difficulty breathing, please contact a healthcare provider.",
      headache: "Headaches can be so overwhelming and make everything feel more difficult. Try staying hydrated, resting in a quiet dark room, and gently massaging your temples. If headaches are frequent or severe, consider seeing a doctor.",
      pain: "I'm really sorry you're experiencing pain. Try gentle stretching, applying heat or cold, and getting adequate rest. If the pain is severe or persistent, it's important to consult with a healthcare professional.",
      anxiety: "It takes courage to share that you're feeling anxious. Try taking slow, deep breaths and focus on what you can control right now. Consider talking to a counselor or your doctor about anxiety management techniques.",
      stress: "Stress can feel so overwhelming sometimes. Try taking a few minutes for deep breathing or a brief walk outside. Setting small, manageable goals for today can also help you feel more in control.",
      sleep: "Sleep troubles can affect everything - your mood, energy, and how you feel physically. Try creating a bedtime routine, avoiding screens before sleep, and keeping your room cool and dark. If insomnia persists, discuss it with your doctor.",
      dizzy: "Feeling dizzy can be really unsettling and scary. Sit down immediately and try to stay hydrated. If dizziness is severe, frequent, or accompanied by other symptoms, please seek medical evaluation.",
      nausea: "Nausea can make you feel so miserable and drained. Try sipping clear fluids, eating small bland foods like crackers, and getting fresh air. If you can't keep fluids down or it persists, contact a healthcare provider.",
      worried: "It sounds like you're going through a really worrying time. Try to focus on one thing at a time and consider talking to someone you trust. If health worries are affecting your daily life, don't hesitate to reach out to a healthcare professional."
    };
    
    // Find matching response
    for (const [keyword, response] of Object.entries(responses)) {
      if (lowerMessage.includes(keyword)) {
        return response;
      }
    }
    
    // Default empathetic responses with practical advice
    const defaultResponses = this.language === 'ko' ? [
      "이렇게 나누어 주셔서 감사합니다. 어려운 시간을 보내고 계신 것 같네요. 한 번에 한 걸음씩 나아가시고, 걱정이 되신다면 주저하지 말고 의료진에게 연락하세요.",
      "이것이 당신에게 부담이 되고 있다는 것을 알 수 있고, 당신의 감정은 완전히 타당합니다. 신뢰할 수 있는 사람이나 당신의 상황에 개인 맞춤형 안내를 제공할 수 있는 의료진과 이야기하는 것을 고려해 보세요.",
      "정말 다루기 어려운 일인 것 같고, 저는 여기서 당신을 지지하겠습니다. 충분한 수분 섭취, 휴식, 증상이 지속되거나 악화되면 의료 조언을 구하는 등 기본적인 자기 관리에 집중하세요.",
      "이것을 저와 나누어 주셔서 감사하고, 당신의 걱정은 중요합니다. 자신에게 친절하게 대하시고 건강이 걱정될 때 전문적인 의료 조언을 구하는 것이 항상 좋은 단계라는 것을 기억하세요."
    ] : [
      "Thank you for sharing that with me, it sounds like you're going through something difficult. Try to take things one step at a time and don't hesitate to reach out to a healthcare provider if you're concerned.",
      "I can hear that this is weighing on you, and your feelings are completely valid. Consider talking to someone you trust or a healthcare professional who can provide personalized guidance for your situation.",
      "That sounds really challenging to deal with, and I'm here to support you. Focus on basic self-care like staying hydrated, getting rest, and seeking medical advice if symptoms persist or worsen.",
      "I appreciate you trusting me with this, and your concerns are important. Try to be gentle with yourself and remember that seeking professional medical advice is always a good step when you're worried about your health."
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
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
      ${this.getLocalizedText('thinking')}
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
    localStorage.setItem('teresa-conversation', JSON.stringify(this.conversationHistory.slice(-20)));
  }

  /**
   * Get language preference from localStorage
   */
  getLanguagePreference() {
    try {
      const stored = localStorage.getItem('app-language');
      return stored === 'ko' ? 'ko' : 'en';
    } catch {
      return 'en';
    }
  }

  /**
   * Get localized symptoms list
   */
  getLocalizedSymptoms() {
    if (this.language === 'ko') {
      return [
        '피로하거나 지친 느낌',
        '가슴 답답함이나 불편함',
        '두통이나 어지러움',
        '위장 문제나 메스꺼움',
        '근육통이나 뻣뻣함',
        '잠들기 어려움',
        '불안하거나 스트레스',
        '기타 걱정...'
      ];
    }
    
    return [
      'Feeling tired or fatigued',
      'Chest tightness or discomfort',
      'Headache or dizziness',
      'Stomach issues or nausea',
      'Muscle aches or stiffness',
      'Difficulty sleeping',
      'Feeling anxious or stressed',
      'Other concern...'
    ];
  }

  /**
   * Get localized text
   */
  getLocalizedText(key) {
    const texts = {
      en: {
        greeting: "Hi, I'm Teresa, your health companion. What's bothering you today?",
        askName: "What should I call you?",
        thinking: "Teresa is thinking",
        placeholder: "Type your message...",
        send: "Send",
        medicalInfo: "Would it be okay if I shared some general health information that might help?",
        yesHelp: "Yes, that would help",
        noSupport: "No, I'd prefer just emotional support",
        error: "I'm sorry, I'm having trouble responding right now. Please try again in a moment."
      },
      ko: {
        greeting: "안녕하세요, 저는 당신의 건강 동반자 테레사입니다. 오늘 무엇이 신경 쓰이시나요?",
        askName: "어떻게 불러드리면 될까요?",
        thinking: "테레사가 생각하고 있습니다",
        placeholder: "메시지를 입력하세요...",
        send: "전송",
        medicalInfo: "도움이 될 만한 일반적인 건강 정보를 공유해도 될까요?",
        yesHelp: "네, 도움이 될 것 같아요",
        noSupport: "아니요, 감정적 지지만 받고 싶어요",
        error: "죄송하지만 지금 응답하는 데 문제가 있습니다. 잠시 후 다시 시도해 주세요."
      }
    };
    
    return texts[this.language]?.[key] || texts.en[key] || key;
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = [];
    this.empathyCount = 0;
    localStorage.removeItem('teresa-conversation');
    this.messagesContainer.innerHTML = '';
    this.initializeConversation();
  }

  /**
   * Static initialization method
   */
  static init(config = {}) {
    if (!window.teresaChatbotSpark) {
      window.teresaChatbotSpark = new TeresaChatbotSpark(config);
    }
    return window.teresaChatbotSpark;
  }
}

// Make chatbot available globally (only if not already defined)
if (typeof window !== 'undefined') {
  if (!window.TeresaChatbotSpark) {
    window.TeresaChatbotSpark = TeresaChatbotSpark;
    window.TeresaChatbot = TeresaChatbotSpark; // Alias for compatibility
  }
  
  // Auto-init with Spark integration (only if not already initialized)
  if (!window.teresaChatbotSparkInitialized) {
    document.addEventListener('DOMContentLoaded', () => {
      if (!window.teresaChatbotSpark) {
        TeresaChatbotSpark.init();
        window.teresaChatbotSparkInitialized = true;
      }
    });
  }
}

})(); // End of IIFE      'Feeling anxious or stressed',
      'Other concern...'
    ];
  }

  /**
   * Get localized text
   */
  getLocalizedText(key) {
    const texts = {
      en: {
        greeting: "Hi, I'm Teresa, your health companion. What's bothering you today?",
        askName: "What should I call you?",
        thinking: "Teresa is thinking",
        placeholder: "Type your message...",
        send: "Send",
        medicalInfo: "Would it be okay if I shared some general health information that might help?",
        yesHelp: "Yes, that would help",
        noSupport: "No, I'd prefer just emotional support",
        error: "I'm sorry, I'm having trouble responding right now. Please try again in a moment."
      },
      ko: {
        greeting: "안녕하세요, 저는 당신의 건강 동반자 테레사입니다. 오늘 무엇이 신경 쓰이시나요?",
        askName: "어떻게 불러드리면 될까요?",
        thinking: "테레사가 생각하고 있습니다",
        placeholder: "메시지를 입력하세요...",
        send: "전송",
        medicalInfo: "도움이 될 만한 일반적인 건강 정보를 공유해도 될까요?",
        yesHelp: "네, 도움이 될 것 같아요",
        noSupport: "아니요, 감정적 지지만 받고 싶어요",
        error: "죄송하지만 지금 응답하는 데 문제가 있습니다. 잠시 후 다시 시도해 주세요."
      }
    };
    
    return texts[this.language]?.[key] || texts.en[key] || key;
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = [];
    this.empathyCount = 0;
    localStorage.removeItem('teresa-conversation');
    this.messagesContainer.innerHTML = '';
    this.initializeConversation();
  }

  /**
   * Static initialization method
   */
  static init(config = {}) {
    if (!window.teresaChatbotSpark) {
      window.teresaChatbotSpark = new TeresaChatbotSpark(config);
    }
    return window.teresaChatbotSpark;
  }
}

// Make chatbot available globally (only if not already defined)
if (typeof window !== 'undefined') {
  if (!window.TeresaChatbotSpark) {
    window.TeresaChatbotSpark = TeresaChatbotSpark;
    window.TeresaChatbot = TeresaChatbotSpark; // Alias for compatibility
  }
  
  // Auto-init with Spark integration (only if not already initialized)
  if (!window.teresaChatbotSparkInitialized) {
    document.addEventListener('DOMContentLoaded', () => {
      if (!window.teresaChatbotSpark) {
        TeresaChatbotSpark.init();
        window.teresaChatbotSparkInitialized = true;
      }
    });
  }
}

})(); // End of IIFE