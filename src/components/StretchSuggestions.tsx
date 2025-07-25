interface StretchSuggestionsProps {
  stiffnessAreas: string[]
}

const stretchDatabase: Record<string, string[]> = {
  'Neck': [
    'Gently tilt your head to each side, holding for 15 seconds',
    'Slowly rotate your head in circles, 5 times each direction',
    'Tuck your chin down toward your chest and hold for 10 seconds'
  ],
  'Shoulders': [
    'Roll your shoulders backward 10 times, then forward 10 times',
    'Reach one arm across your chest and gently pull with the other arm',
    'Clasp hands behind your back and gently lift your arms'
  ],
  'Back': [
    'Gently arch your back while seated, hold for 10 seconds',
    'Twist your torso left and right while keeping hips forward',
    'Hug your knees to your chest while lying down'
  ],
  'Hips': [
    'Sit and pull one knee toward your chest, hold for 20 seconds',
    'Lie on your back and cross one ankle over the opposite knee',
    'Step into a gentle lunge position and hold for 15 seconds'
  ],
  'Knees': [
    'Gently straighten and bend your knee while seated',
    'Stand and march in place, lifting knees gently',
    'Sit and extend one leg straight, flexing your foot'
  ],
  'Ankles': [
    'Rotate your ankles in circles, 10 times each direction',
    'Point your toes up toward your shin, then down',
    'Write the alphabet in the air with your toes'
  ],
  'Wrists': [
    'Gently flex your wrist up and down, holding each position',
    'Make gentle fist and then spread fingers wide',
    'Rotate your wrists in small circles'
  ]
}

export default function StretchSuggestions({ stiffnessAreas }: StretchSuggestionsProps) {
  const relevantStretches = stiffnessAreas
    .filter(area => area !== 'None' && stretchDatabase[area])
    .map((area, index) => {
      const stretches = stretchDatabase[area]
      // Use a different approach to get varied stretches - use index modulo to ensure diversity
      const stretchIndex = (index + Math.floor(Date.now() / (1000 * 60 * 60 * 24))) % stretches.length
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
          <div key={`${item.area}-${index}`} className="p-3 bg-accent/5 border border-accent/20 rounded-lg">
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