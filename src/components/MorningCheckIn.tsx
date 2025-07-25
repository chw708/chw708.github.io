import { useState } from 'react'
import { ArrowLeft, ArrowRight, Heart } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useKV } from '@github/spark/hooks'
import HealthScore from './HealthScore'
import StretchSuggestions from './StretchSuggestions'

interface MorningCheckInProps {
  onComplete: () => void
  onBack: () => void
}

interface MorningData {
  sleep: number | null
  weight: number | null
  swelling: boolean
  fatigue: number | null
  stiffness: string[]
  bloodPressure: string
  bloodSugar: string
}

const stiffnessOptions = [
  'Neck', 'Shoulders', 'Back', 'Hips', 'Knees', 'Ankles', 'Wrists', 'None'
]

export default function MorningCheckIn({ onComplete, onBack }: MorningCheckInProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<MorningData>({
    sleep: null,
    weight: null,
    swelling: false,
    fatigue: null,
    stiffness: [],
    bloodPressure: '',
    bloodSugar: ''
  })

  const [todayCheckins, setTodayCheckins] = useKV('today-checkins', {
    morning: false,
    midday: false,
    night: false,
    date: new Date().toDateString()
  })

  const [morningHistory, setMorningHistory] = useKV('morning-history', [])

  const calculateHealthScore = (data: MorningData): number => {
    let score = 100
    
    // Sleep score (0-30 points)
    if (data.sleep !== null) {
      if (data.sleep < 6 || data.sleep > 9) score -= 20
      else if (data.sleep < 7 || data.sleep > 8) score -= 10
    }
    
    // Fatigue score (0-25 points)
    if (data.fatigue !== null) {
      score -= (data.fatigue - 1) * 3
    }
    
    // Swelling penalty (0-15 points)
    if (data.swelling) score -= 15
    
    // Stiffness penalty (0-20 points)
    const stiffnessCount = data.stiffness.filter(s => s !== 'None').length
    score -= stiffnessCount * 3
    
    return Math.max(0, Math.min(100, score))
  }

  const getHealthAdvice = (score: number, data: MorningData): string[] => {
    const advice = []
    
    if (data.sleep !== null && (data.sleep < 7 || data.sleep > 8)) {
      advice.push("Aim for 7-8 hours of sleep for optimal recovery")
    }
    
    if (data.fatigue !== null && data.fatigue > 6) {
      advice.push("Consider gentle stretching or light exercise to boost energy")
    }
    
    if (data.swelling) {
      advice.push("Stay hydrated and consider elevating your legs when resting")
    }
    
    if (data.stiffness.length > 0 && !data.stiffness.includes('None')) {
      advice.push("Try some gentle stretches for the areas feeling stiff")
    }
    
    if (score >= 80) {
      advice.push("Great job! You're starting the day strong")
    } else if (score >= 60) {
      advice.push("Listen to your body today and be gentle with yourself")
    } else {
      advice.push("Take it easy today and focus on self-care")
    }
    
    return advice
  }

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete check-in
      const healthScore = calculateHealthScore(data)
      const advice = getHealthAdvice(healthScore, data)
      
      const newEntry = {
        date: new Date().toISOString(),
        ...data,
        healthScore,
        advice
      }
      
      setMorningHistory((prev: any[]) => [newEntry, ...prev])
      setTodayCheckins((prev: any) => ({
        ...prev,
        morning: true,
        date: new Date().toDateString()
      }))
      
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      onBack()
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0: return data.sleep !== null
      case 1: return data.weight !== null
      case 2: return true // swelling is boolean
      case 3: return data.fatigue !== null
      case 4: return data.stiffness.length > 0
      case 5: return true // optional vitals
      case 6: return true // results
      default: return false
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <Label htmlFor="sleep" className="text-base font-medium">
              How many hours did you sleep last night?
            </Label>
            <Input
              id="sleep"
              type="number"
              step="0.5"
              min="0"
              max="12"
              value={data.sleep || ''}
              onChange={(e) => setData({...data, sleep: parseFloat(e.target.value) || null})}
              placeholder="e.g., 7.5"
              className="text-lg p-4 text-center"
            />
            <p className="text-sm text-muted-foreground text-center">
              Most adults need 7-9 hours for optimal health
            </p>
          </div>
        )

      case 1:
        return (
          <div className="space-y-4">
            <Label htmlFor="weight" className="text-base font-medium">
              What's your current weight? (optional)
            </Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              value={data.weight || ''}
              onChange={(e) => setData({...data, weight: parseFloat(e.target.value) || null})}
              placeholder="lbs or kg"
              className="text-lg p-4 text-center"
            />
            <p className="text-sm text-muted-foreground text-center">
              Track changes over time for better health insights
            </p>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <Label className="text-base font-medium">
              Are you experiencing any swelling or puffiness?
            </Label>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="no-swelling"
                  checked={!data.swelling}
                  onCheckedChange={() => setData({...data, swelling: false})}
                />
                <Label htmlFor="no-swelling" className="text-base">No swelling</Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="yes-swelling"
                  checked={data.swelling}
                  onCheckedChange={() => setData({...data, swelling: true})}
                />
                <Label htmlFor="yes-swelling" className="text-base">Yes, I notice swelling</Label>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <Label className="text-base font-medium">
              Rate your fatigue level (1 = very energetic, 10 = exhausted)
            </Label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                <Button
                  key={level}
                  variant={data.fatigue === level ? "default" : "outline"}
                  onClick={() => setData({...data, fatigue: level})}
                  className="aspect-square"
                >
                  {level}
                </Button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground text-center">
              1-3: Energetic • 4-6: Moderate • 7-10: Fatigued
            </p>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <Label className="text-base font-medium">
              Any stiff or sore body areas? (Select all that apply)
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {stiffnessOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={option}
                    checked={data.stiffness.includes(option)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        const newStiffness = option === 'None' 
                          ? ['None'] 
                          : [...data.stiffness.filter(s => s !== 'None'), option]
                        setData({...data, stiffness: newStiffness})
                      } else {
                        setData({...data, stiffness: data.stiffness.filter(s => s !== option)})
                      }
                    }}
                  />
                  <Label htmlFor={option} className="text-sm">{option}</Label>
                </div>
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <Label className="text-base font-medium">
              Optional: Record your vitals
            </Label>
            <div className="space-y-3">
              <div>
                <Label htmlFor="bp" className="text-sm">Blood Pressure (e.g., 120/80)</Label>
                <Input
                  id="bp"
                  value={data.bloodPressure}
                  onChange={(e) => setData({...data, bloodPressure: e.target.value})}
                  placeholder="120/80"
                />
              </div>
              <div>
                <Label htmlFor="bs" className="text-sm">Blood Sugar (mg/dL)</Label>
                <Input
                  id="bs"
                  value={data.bloodSugar}
                  onChange={(e) => setData({...data, bloodSugar: e.target.value})}
                  placeholder="90"
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Normal blood pressure: around 120/80 • Normal fasting blood sugar: 70-100 mg/dL
            </p>
          </div>
        )

      case 6:
        const healthScore = calculateHealthScore(data)
        const advice = getHealthAdvice(healthScore, data)
        
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Your Morning Health Score</h3>
              <HealthScore score={healthScore} size="large" />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personalized Advice</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {advice.map((tip, index) => (
                  <p key={index} className="text-sm text-muted-foreground">
                    • {tip}
                  </p>
                ))}
              </CardContent>
            </Card>
            
            {data.stiffness.length > 0 && !data.stiffness.includes('None') && (
              <StretchSuggestions stiffnessAreas={data.stiffness} />
            )}
          </div>
        )

      default:
        return null
    }
  }

  const stepTitles = [
    'Sleep Duration',
    'Weight Check',
    'Swelling Check',
    'Energy Level',
    'Stiffness Areas',
    'Optional Vitals',
    'Your Results'
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Morning Check-In</h1>
            <p className="text-sm text-primary-foreground/80">
              Step {currentStep + 1} of {stepTitles.length}: {stepTitles[currentStep]}
            </p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4 bg-primary-foreground/20 rounded-full h-2">
          <div 
            className="bg-primary-foreground rounded-full h-2 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / stepTitles.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <Card>
          <CardContent className="p-6">
            {renderStep()}
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-20 left-0 right-0 px-6 py-4 bg-background border-t">
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="w-full"
        >
          {currentStep === 6 ? 'Complete Check-In' : 'Continue'}
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  )
}