# Teresa Companion Chatbot Widget

An embeddable AI-powered emotional support chatbot designed specifically for health-related websites. Teresa provides empathetic, non-diagnostic support for users experiencing health concerns.

## ✨ Key Features

- **Emotional-First Approach**: Prioritizes empathy and validation before offering information
- **Health-Aware Conversations**: Understands common health concerns and responds appropriately
- **Progressive Support**: Builds trust through multiple exchanges before offering medical education
- **Easy Integration**: Single JavaScript file with simple configuration
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Accessibility**: Full keyboard navigation and screen reader support
- **Privacy-Focused**: Conversations stored locally, no external tracking

## 🚀 Quick Start

### Basic Integration

```html
<!DOCTYPE html>
<html>
<head>
    <title>Your Health Website</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Your website content -->
    
    <!-- Teresa Chatbot -->
    <script src="teresa-chatbot.js"></script>
    <script>
        TeresaChatbot.init({
            apiKey: 'your-openai-api-key-here'
        });
    </script>
</body>
</html>
```

### Custom Configuration

```javascript
TeresaChatbot.init({
    // Required
    apiKey: 'sk-your-openai-api-key',
    
    // Customization Options
    buttonText: 'Talk to Teresa',
    primaryColor: '#1B4D3E',        // Teresa's signature green
    backgroundColor: '#FCF4DF',     // Warm cream background
    position: 'bottom-right',       // bottom-left, top-right, top-left
    zIndex: 10000,
    
    // Advanced Options
    apiEndpoint: 'https://api.openai.com/v1/chat/completions'
});
```

## 🎯 Conversation Flow

Teresa follows a carefully designed conversation pattern:

### 1. Initial Connection
- Asks for user's preferred name
- Provides warm, welcoming greeting
- Offers quick symptom selection or open text input

### 2. Empathetic Listening (2-3 exchanges)
- Focuses entirely on emotional validation
- Example: *"That must feel really scary. You're not alone."*
- Builds trust and rapport before offering information

### 3. Optional Medical Education
- After establishing trust, asks permission to share information
- Provides general health education (never diagnosis)
- Always encourages professional medical consultation

### 4. Ongoing Support
- Maintains empathetic tone throughout
- Remembers user's name and conversation context
- Offers continued emotional support

## 📋 Example Conversations

### User Experience Flow

**User Input:** "I've been feeling really tired lately"

**Teresa Response:** "I can understand how exhausting it must feel to be constantly tired. That sounds really draining and frustrating. Can you tell me more about when you started noticing this?"

*[After 2-3 empathetic exchanges]*

**Teresa:** "Would it be okay if I shared some general health information that might help?"

**If Yes:** "I'll share some general information that might be relevant. Remember, this isn't medical advice, just educational information. Fatigue can have many causes..."

**If No:** "Of course! I'm here to listen and support you emotionally. Tell me more about how this is affecting your daily life."

## 🛠️ Technical Specifications

### Requirements
- Modern web browser (ES6+ support)
- OpenAI API key for full functionality
- Optional: Google Fonts for Poppins typography

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Android Chrome)

### File Structure
```
teresa-chatbot/
├── teresa-chatbot.js      # Main chatbot logic (22KB)
├── teresa-chatbot.css     # Optional styling enhancements (3KB)
├── chatbot-demo.html      # Demo/test page
└── README.md             # This documentation
```

### Performance
- **Script Size**: ~25KB minified
- **Memory Usage**: <5MB typical
- **API Calls**: Only when user sends messages
- **Local Storage**: Conversation history (last 20 messages)

## 🎨 Customization

### Color Themes

```javascript
// Default Teresa Theme
{
    primaryColor: '#1B4D3E',      // Deep forest green
    backgroundColor: '#FCF4DF',   // Warm cream
}

// Healthcare Blue Theme
{
    primaryColor: '#2563eb',      // Medical blue
    backgroundColor: '#f0f9ff',   // Light blue
}

// Wellness Purple Theme
{
    primaryColor: '#7c3aed',      // Calming purple
    backgroundColor: '#faf5ff',   // Light lavender
}
```

### Position Options

```javascript
// Available positions
position: 'bottom-right'  // Default
position: 'bottom-left'
position: 'top-right'
position: 'top-left'
```

### Custom Styling

Override default styles by targeting CSS classes:

```css
/* Custom button styling */
.teresa-chatbot-button {
    width: 70px !important;
    height: 70px !important;
    background: linear-gradient(135deg, #1B4D3E, #2d6b5a) !important;
}

/* Custom modal size */
.teresa-chatbot-modal {
    width: 400px !important;
    height: 600px !important;
}
```

## 🔧 API Integration

### OpenAI Configuration

The chatbot uses OpenAI's GPT-4 model with specific prompting for health support:

```javascript
// System prompt structure
{
    role: "system",
    content: `You are Teresa, a compassionate health companion chatbot. 
    Your primary role is to provide emotional support and empathy to users 
    experiencing health concerns.
    
    IMPORTANT GUIDELINES:
    - ALWAYS start with empathy and emotional validation
    - NEVER provide medical diagnosis or specific treatment advice
    - Use warm, conversational language
    - Show genuine concern and understanding
    - Only after 2-3 empathic exchanges, you may offer general health education
    - Always encourage consulting healthcare professionals for serious concerns`
}
```

### Mock Responses (Development)

When no API key is provided, Teresa uses intelligent mock responses:

```javascript
const mockResponses = {
    "fatigue": "I can understand how exhausting it must feel...",
    "chest": "That must feel really scary and concerning...",
    "headache": "Headaches can be so overwhelming...",
    "anxiety": "It takes courage to share that you're feeling anxious...",
    "default": "Thank you for sharing that with me..."
};
```

## 🔒 Privacy & Security

### Data Handling
- **Local Storage Only**: Conversations stored in user's browser
- **No External Tracking**: No analytics or user tracking
- **API Communication**: Only sends messages to OpenAI when user initiates
- **No Personal Data**: Doesn't collect email, phone, or identifying information

### Security Features
- **Input Validation**: Sanitizes user input
- **Rate Limiting**: Built-in delays prevent API abuse
- **Secure Headers**: Proper CORS and content security practices
- **No Persistent Sessions**: Each conversation is independent

## ♿ Accessibility

### Keyboard Navigation
- **Tab Order**: Logical focus progression
- **Enter Key**: Send messages
- **Escape Key**: Close modal
- **Arrow Keys**: Navigate options

### Screen Reader Support
- **ARIA Labels**: Descriptive labels for all interactive elements
- **Role Attributes**: Proper semantic structure
- **Focus Management**: Clear focus indicators
- **Text Alternatives**: Icon descriptions

### Visual Accessibility
- **High Contrast**: Supports high contrast mode
- **Color Blind Friendly**: Doesn't rely solely on color
- **Scalable Text**: Respects user font size preferences
- **Reduced Motion**: Respects motion preferences

## 🧪 Testing & Demo

### Demo Page
Open `chatbot-demo.html` to test all features:
- Conversation flow testing
- Quick option selection
- Name input/reset
- API response simulation
- Mobile responsiveness

### Test Functions
```javascript
// Available test methods
window.teresaChatbot.clearHistory()     // Reset conversation
window.teresaChatbot.openModal()        // Open chat
window.teresaChatbot.closeModal()       // Close chat
window.teresaChatbot.setUserName(name)  // Set user name
```

### Common Test Scenarios
1. **First-time User**: Test name input flow
2. **Returning User**: Verify conversation persistence
3. **Mobile Device**: Test responsive layout
4. **Accessibility**: Test keyboard navigation
5. **API Integration**: Test with real OpenAI responses

## 🚨 Troubleshooting

### Common Issues

**Chatbot doesn't appear:**
- Check console for JavaScript errors
- Ensure script is loaded after DOM content
- Verify no CSS conflicts with positioning

**API not working:**
- Verify OpenAI API key is valid
- Check browser network tab for failed requests
- Ensure API endpoint is correct

**Styling issues:**
- Check for CSS conflicts with existing styles
- Use `!important` for critical overrides
- Verify font loading

**Mobile problems:**
- Test viewport meta tag is present
- Check for touch event conflicts
- Verify modal fits screen size

### Debug Mode

Enable debugging by adding to configuration:

```javascript
TeresaChatbot.init({
    apiKey: 'your-key',
    debug: true  // Enables console logging
});
```

## 📄 License & Usage

### Open Source License
This chatbot is provided under MIT license for healthcare and wellness websites.

### Usage Guidelines
- ✅ Healthcare websites and apps
- ✅ Wellness and mental health platforms
- ✅ Educational health resources
- ✅ Non-profit health organizations
- ❌ Not for medical diagnosis tools
- ❌ Not for emergency health services

### Attribution
When using Teresa Companion, please include:
```html
<!-- Powered by Teresa Companion -->
<meta name="chatbot" content="Teresa Companion - Emotional Health Support">
```

## 🤝 Support & Contributing

### Getting Help
- Check the demo page for common usage patterns
- Review browser console for error messages
- Test with mock responses before implementing API

### Feature Requests
Teresa Companion is designed to be simple and focused. Consider these principles:
- Emotional support over medical information
- Privacy and security first
- Easy integration and customization
- Accessibility for all users

---

**Teresa Companion** - Bringing empathetic AI support to health and wellness websites.

*"Your health, your feelings, your companion."*