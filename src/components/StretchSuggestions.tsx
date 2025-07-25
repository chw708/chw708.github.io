interface StretchSuggestionsProps {
  stiffnessAreas: string[]
}

const stretchDatabase: Record<string, string[]> = {
  'Neck': [
    'Gently tilt your head to each side, holding for 15 seconds',
    'Slowly rotate your head in circles, 5 times each direction',
    'Tuck your chin down toward your chest and hold for 10 seconds',
    'Look up gently toward the ceiling and hold for 10 seconds',
    'Turn your head left and right slowly, like saying "no"',
    'Place hand on side of head and gently resist as you tilt'
  ],
  'Shoulders': [
    'Roll your shoulders backward 10 times, then forward 10 times',
    'Reach one arm across your chest and gently pull with the other arm',
    'Clasp hands behind your back and gently lift your arms',
    'Shrug your shoulders up to your ears, hold for 5 seconds',
    'Reach both arms overhead and gently lean to each side',
    'Circle your arms like swimming backstroke, slowly'
  ],
  'Back': [
    'Gently arch your back while seated, hold for 10 seconds',
    'Twist your torso left and right while keeping hips forward',
    'Hug your knees to your chest while lying down',
    'Cat-cow stretch: arch and round your back alternately',
    'Seated spinal twist: rotate gently with hand on chair back',
    'Stand and reach toward your toes, bending from your waist'
  ],
  'Hips': [
    'Sit and pull one knee toward your chest, hold for 20 seconds',
    'Lie on your back and cross one ankle over the opposite knee',
    'Step into a gentle lunge position and hold for 15 seconds',
    'Seated figure-4 stretch: ankle on opposite knee, lean forward',
    'Standing hip circles: hands on hips, circle gently',
    'Lie down and gently pull both knees to chest'
  ],
  'Knees': [
    'Gently straighten and bend your knee while seated',
    'Stand and march in place, lifting knees gently',
    'Sit and extend one leg straight, flexing your foot',
    'Wall sit for 10-15 seconds against a wall',
    'Gentle heel kicks: bring heel toward buttocks',
    'Step up and down on a low step or curb'
  ],
  'Ankles': [
    'Rotate your ankles in circles, 10 times each direction',
    'Point your toes up toward your shin, then down',
    'Write the alphabet in the air with your toes',
    'Calf raises: rise up on your toes and lower slowly',
    'Seated ankle pumps: flex and point your feet',
    'Rock back on your heels, lifting your toes up'
  ],
  'Wrists': [
    'Gently flex your wrist up and down, holding each position',
    'Make gentle fist and then spread fingers wide',
    'Rotate your wrists in small circles',
    'Prayer stretch: palms together, lower hands',
    'Wrist circles with arms extended straight out',
    'Gentle finger stretches: bend each finger individually'
  ]
}

export default function StretchSuggestions({ stiffnessAreas }: StretchSuggestionsProps) {
  const uniqueAreas = [...new Set(stiffnessAreas.filter(area => area !== 'None' && stretchDatabase[area]))]
  
  const relevantStretches = uniqueAreas.map((area, areaIndex) => {
    const stretches = stretchDatabase[area]
    // Use today's date + unique area hash to ensure different stretches for different areas and days
    const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24))
    
    // Create a much better hash that's unique per area using multiple factors
    const areaHash = area.split('').reduce((hash, char, charIndex) => {
      return hash + char.charCodeAt(0) * (charIndex + 1) * 37
    }, 0)
    
    // Add hour of day to ensure variety even within the same day for different check-ins
    const hourOfDay = new Date().getHours()
    
    // Use multiple factors to create truly unique selection per area per day
    const stretchIndex = (dayOfYear * 13 + areaHash * 7 + areaIndex * 19 + hourOfDay * 3) % stretches.length
    const selectedStretch = stretches[stretchIndex]
    
    return { area, stretch: selectedStretch }
  })

  if (relevantStretches.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center">Recommended Stretches</h3>
      <div className="space-y-3">
        {relevantStretches.map((item, index) => (
          <div key={`${item.area}-${index}-${Date.now()}`} className="p-3 bg-accent/5 border border-accent/20 rounded-lg">
            <h4 className="font-medium text-accent-foreground mb-1">{item.area}</h4>
            <p className="text-sm text-muted-foreground">{item.stretch}</p>
          </div>
        ))}
      </div>
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          💡 Hold each stretch gently and stop if you feel pain. Listen to your body.
        </p>
      </div>
    </div>
  )
}