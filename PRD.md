# Teresa Health - Product Requirements Document

A personalized daily health assistant designed to help users track both their physical and mental health through compassionate, AI-powered guidance.

**Experience Qualities**:
1. **Warmth**: Every interaction should feel like receiving care from a trusted friend who genuinely cares about your wellbeing
2. **Simplicity**: Complex health tracking made accessible through clear, one-step-at-a-time guidance that never overwhelms
3. **Reassurance**: Users should feel supported and understood, with gentle guidance that builds confidence in their health journey

**Complexity Level**: Light Application (multiple features with basic state)
Teresa Health provides multiple interconnected features (morning/midday/night check-ins, dashboard, AI insights) while maintaining simplicity through intuitive flows and persistent local data storage.

## Essential Features

**Morning Check-In Wizard**
- Functionality: Sequential health assessment covering sleep, weight, symptoms, fatigue, and optional vitals
- Purpose: Establishes daily baseline and generates personalized health score with actionable insights
- Trigger: User taps "Start Morning Check-In" from home page
- Progression: Welcome → Sleep Hours → Weight → Swelling Check → Fatigue Scale → Stiffness Selection → Optional Vitals → Health Score Results
- Success criteria: User completes flow, receives health score (0-100), and gets personalized advice including stretch recommendations if stiffness reported

**Midday Health Log**
- Functionality: Quick meal logging with photos/text, symptom tracking, and mood selection via emoji interface
- Purpose: Captures nutrition patterns and mid-day health changes for comprehensive daily picture
- Trigger: User selects "Midday Check-In" or receives gentle reminder notification
- Progression: Meal Entry → Photo/Text Input → Symptom Check → Mood Selection → Confirmation
- Success criteria: Data stored locally, contributes to daily health score, mood trends tracked over time

**Night Reflection & AI Support**
- Functionality: Stress journaling with AI chatbot responses, guided reflection questions, and emotional summary
- Purpose: Processes daily emotional experiences and provides supportive closure to each day
- Trigger: User initiates "Night Check-In" or evening reminder
- Progression: Stress Journal Entry → AI Response → Reflection Questions → Emotional Summary → Daily Quote
- Success criteria: User receives compassionate AI feedback, completes reflection, feels emotionally supported

**Health Dashboard**
- Functionality: Visual health score display, trend charts, mood patterns, stretch history, and weekly insights
- Purpose: Provides clear overview of health journey and motivates continued engagement
- Trigger: User navigates to dashboard from main menu
- Progression: Health Score Circle → Daily Summary Cards → Trend Charts → Weekly Suggestions → Action Items
- Success criteria: User understands their health patterns, feels motivated by progress, receives actionable weekly insights

**AI-Powered Insights**
- Functionality: Real-time health score calculation, emotional support chatbot, and personalized advice generation
- Purpose: Provides intelligent, contextual guidance that feels personal and medically informed
- Trigger: Activated during check-ins and reflection sessions
- Progression: User Input → AI Processing → Contextual Response → Actionable Advice
- Success criteria: Users receive relevant, comforting responses that demonstrate understanding of their specific situation

## Edge Case Handling

- **Incomplete Check-ins**: Save partial progress and allow resumption later with gentle reminders
- **Extreme Health Values**: Provide educational context ("Normal range is X") without alarming, suggest consulting healthcare provider for outliers
- **Technical Issues**: Graceful offline mode with local storage, clear error messages with retry options
- **Accessibility Needs**: Large touch targets (min 44px), high contrast mode, screen reader compatibility
- **Data Loss Prevention**: Automatic local backup every action, export functionality for user peace of mind

## Design Direction

The design should evoke a sense of gentle care and professional warmth - like visiting a beloved family doctor who has modern tools but timeless compassion. Rich interface with carefully curated visual elements that support rather than distract from the health journey.

## Color Selection

Analogous warm earth tones create a nurturing, medical-professional atmosphere that feels both calming and trustworthy.

- **Primary Color**: Deep Green (#1B4D3E / oklch(0.3 0.05 160)) - Communicates growth, health, and stability
- **Secondary Colors**: Warm Beige (#F0E6D2 / oklch(0.92 0.02 70)) for soft backgrounds and Cream (#FCF4DF / oklch(0.96 0.03 80)) for cards and highlights
- **Accent Color**: Warm sage green (#4A6741 / oklch(0.42 0.04 140)) for progress indicators and CTAs
- **Foreground/Background Pairings**: 
  - Background (Cream #FCF4DF): Deep Green text (#1B4D3E) - Ratio 7.2:1 ✓
  - Card (Warm Beige #F0E6D2): Deep Green text (#1B4D3E) - Ratio 6.8:1 ✓
  - Primary (Deep Green #1B4D3E): Cream text (#FCF4DF) - Ratio 7.2:1 ✓
  - Accent (Sage #4A6741): Cream text (#FCF4DF) - Ratio 4.9:1 ✓

## Font Selection

Typography should convey approachability and clarity while maintaining professional credibility - Poppins provides warmth with excellent readability for all ages.

- **Typographic Hierarchy**: 
  - H1 (App Title): Poppins SemiBold/32px/normal letter spacing
  - H2 (Section Headers): Poppins Medium/24px/normal letter spacing  
  - H3 (Card Titles): Poppins Medium/18px/normal letter spacing
  - Body (Questions/Content): Poppins Regular/16px/normal letter spacing
  - Small (Hints/Labels): Poppins Regular/14px/normal letter spacing

## Animations

Gentle, purposeful motion that mirrors the calm breathing rhythm and natural wellness flow - supporting user confidence without drawing attention to the technology.

- **Purposeful Meaning**: Smooth transitions between check-in steps mirror the thoughtful pace of self-reflection; progress indicators breathe gently to encourage mindfulness
- **Hierarchy of Movement**: Health score animations take priority (celebratory when good, gentle when concerning), followed by form transitions, then subtle hover states

## Component Selection

- **Components**: Card for check-in sections and dashboard widgets, Button for primary actions with rounded corners, Input with soft focus states, Progress for health scores, Dialog for educational content, Tabs for dashboard navigation
- **Customizations**: Custom circular progress component for health score, wizard-style form navigation, emoji selector for mood tracking, photo upload component for meal logging
- **States**: Buttons show gentle scale on hover, inputs have soft green focus glow, disabled states use muted colors with clear explanations
- **Icon Selection**: Heart symbols for health scores, calendar for check-ins, trending-up for progress, moon/sun for time-based features, stretch icons for exercise suggestions
- **Spacing**: Generous padding (p-6/p-8) for comfort, consistent gaps (gap-4/gap-6), extra margin around CTAs for easy tapping
- **Mobile**: Stack cards vertically, expand touch targets to 48px minimum, collapse navigation to hamburger menu, optimize wizard forms for thumb navigation