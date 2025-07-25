# Teresa Health - Product Requirements Document

## Core Purpose & Success

**Mission Statement**: Teresa Health is a comprehensive daily wellness companion that helps users, especially elderly and underserved populations, track both physical and mental health through compassionate AI-powered guidance.

**Success Indicators**: 
- Daily active engagement with check-ins (morning, midday, night)
- Improved health awareness through personalized scoring and advice
- Increased user confidence in managing personal health
- Consistent data collection for health trend analysis

**Experience Qualities**: Warm, Supportive, Intuitive

## Project Classification & Approach

**Complexity Level**: Light Application with advanced AI features and persistent data
**Primary User Activity**: Creating (health logs), Interacting (with AI), Consuming (insights and trends)

## Essential Features

### 1. Morning Check-In Wizard
- **Purpose**: Comprehensive health assessment to start the day
- **Functionality**: Sequential questions about sleep, weight, swelling, fatigue, stiffness, optional vitals
- **Dynamic AI Questions**: 2-3 unique health questions generated daily by AI to cover different aspects
- **Success Criteria**: Users complete check-in and receive personalized health score and advice

### 2. Midday Check-In
- **Purpose**: Track nutrition and mood throughout the day
- **Functionality**: Meal logging with photos/text, symptom tracking, mood selection
- **Success Criteria**: Users log at least one meal and mood, data persists for dashboard view

### 3. Night Reflection & AI Support
- **Purpose**: Emotional processing and daily reflection with AI companionship
- **Functionality**: Stress journaling, AI empathetic responses, reflection questions, daily quotes
- **Success Criteria**: Users engage with AI support and complete reflection questions

### 4. Health Dashboard
- **Purpose**: Visual health progress tracking and insights
- **Functionality**: Health score display, completion tracking, trends, vitals tracking, weekly insights
- **Success Criteria**: All check-ins display correctly, trends show meaningful data

### 5. Dynamic Question Generation
- **Purpose**: Keep morning check-ins fresh and comprehensive
- **Functionality**: AI generates 2-3 unique daily questions covering varied health aspects
- **Success Criteria**: Questions are different each day and cover diverse health dimensions

### 6. Personalized Health Scoring
- **Purpose**: Give users actionable feedback on their daily health status
- **Functionality**: Non-punitive scoring system with personalized advice and stretch recommendations
- **Success Criteria**: Scores reflect user input accurately without being overly sensitive

## Design Direction

### Visual Tone & Identity
- **Emotional Response**: Calm, reassuring, professional yet warm
- **Design Personality**: Gentle, trustworthy, accessible, health-focused
- **Visual Metaphors**: Natural elements, soft edges, healing imagery
- **Simplicity Spectrum**: Clean minimal interface with purposeful detail

### Color Strategy
- **Color Scheme Type**: Analogous warm palette with nature-inspired accents
- **Primary Color**: Deep Forest Green (`#1B4D3E`) - trust, health, stability
- **Secondary Colors**: Warm Cream (`#FCF4DF`) - comfort, cleanliness, accessibility
- **Accent Color**: Soft Beige (`#F0E6D2`) - warmth, approachability
- **Color Psychology**: Evokes natural healing, comfort, and professional care
- **Color Accessibility**: High contrast ratios maintained for elderly users

### Typography System
- **Font Pairing Strategy**: Single font family (Poppins) with varied weights for hierarchy
- **Typographic Hierarchy**: Bold headers, medium subheadings, regular body text
- **Font Personality**: Modern, readable, friendly but professional
- **Readability Focus**: Large text sizes, generous line height, clear spacing
- **Google Fonts**: Poppins (300, 400, 500, 600, 700 weights)

### Visual Hierarchy & Layout
- **Attention Direction**: Progressive disclosure through wizard-style forms
- **White Space Philosophy**: Generous spacing for calm, uncluttered experience
- **Grid System**: Card-based layout with consistent spacing
- **Responsive Approach**: Mobile-first design with touch-friendly interfaces
- **Content Density**: Minimal information per screen to reduce overwhelm

### Animations
- **Purposeful Meaning**: Progress bars, gentle transitions, loading states
- **Hierarchy of Movement**: Subtle micro-interactions for feedback
- **Contextual Appropriateness**: Gentle, calm movements that support rather than distract

### UI Elements & Component Selection
- **Component Usage**: Cards for content grouping, Buttons for actions, Progress bars for completion
- **Component Customization**: Rounded corners, soft shadows, nature-inspired colors
- **Component States**: Clear hover, active, and completed states
- **Icon Selection**: Phosphor icons for consistency and clarity
- **Spacing System**: Consistent 4px grid system using Tailwind spacing

### Accessibility & Readability
- **Contrast Goal**: WCAG AA compliance minimum with enhanced contrast for elderly users
- **Touch Targets**: Minimum 44px for all interactive elements
- **Font Sizes**: Larger than typical web fonts for better readability

## Implementation Considerations

### Data Persistence
- **Storage**: React useKV hooks for all persistent data
- **Data Structure**: Separate arrays for morning-history, midday-history, night-history
- **Date Handling**: Consistent date string format for cross-component compatibility

### AI Integration
- **Question Generation**: GPT-4o-mini for daily question generation with context awareness
- **Emotional Support**: AI responses for stress journaling and emotional guidance
- **Health Advice**: Contextual advice based on user input patterns

### Performance & Scalability
- **Local Storage**: All data stored locally for privacy and performance
- **Question Caching**: Daily questions cached to avoid regeneration
- **Efficient Updates**: Functional state updates to prevent stale closure issues

## Edge Cases & Problem Scenarios

### Data Consistency
- **Multiple Check-ins**: Users can update same-day check-ins without losing data
- **Date Transitions**: Proper handling of day boundaries and timezone considerations
- **Failed AI Calls**: Fallback questions and responses when AI services unavailable

### User Experience
- **Incomplete Check-ins**: Allow partial completion with save state
- **Health Score Sensitivity**: Forgiving scoring system that encourages rather than discourages
- **Question Variety**: Ensure AI generates truly different questions each day

## Technical Constraints

### Browser Compatibility
- **Target**: Modern browsers with ES6+ support
- **Mobile First**: Touch-friendly interface for tablet and phone use
- **Offline Capability**: Local storage ensures functionality without internet

### Privacy & Security
- **Local Data**: No external data transmission for health information
- **AI Anonymization**: Health queries to AI don't include personally identifiable information

## Success Metrics

### Engagement
- **Daily Active Use**: Users complete at least one check-in per day
- **Completion Rates**: High completion rates for multi-step check-ins
- **Return Usage**: Users return consistently over multiple days

### Health Outcomes
- **Awareness**: Users report better understanding of their health patterns
- **Behavior Change**: Users implement suggested stretches and health advice
- **Confidence**: Users feel more empowered to manage their health

## Reflection

This approach uniquely combines comprehensive health tracking with emotional support through AI, specifically designed for users who may have limited access to healthcare. The gentle, non-judgmental interface encourages daily engagement while providing actionable insights for better health management.

The focus on dynamic daily questions keeps the experience fresh and comprehensive, while the forgiving health scoring system ensures users feel supported rather than criticized. The warm, accessible design specifically considers the needs of elderly users and those who may be intimidated by traditional health technology.