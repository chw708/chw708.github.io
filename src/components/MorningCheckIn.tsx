import { useState, useEffect } from 'react'
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
  additionalQuestions: Record<string, any>
}

interface DailyQuestion {
  id: string
  text: string
  type: 'scale' | 'boolean' | 'text' | 'multiple'
  options?: string[]
  required: boolean
}

const stiffnessOptions = [
  'Neck', 'Shoulders', 'Back', 'Hips', 'Knees', 'Ankles', 'Wrists', 'None'
]

export default function MorningCheckIn({ onComplete, onBack }: MorningCheckInProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [morningHistory, setMorningHistory] = useKV('morning-history', [])
  const [dailyQuestions, setDailyQuestions] = useKV('daily-questions', [])

  const [todayCheckins, setTodayCheckins] = useKV('today-checkins', {
    morning: false,
    midday: false,
    night: false,
    date: new Date().toDateString()
  })

  // Get today's existing data if any
  const today = new Date().toDateString()
  
  // Check if we have an entry for today
  const hasTodayMorning = morningHistory.some((entry: any) => 
    new Date(entry.date).toDateString() === today
  )
  
  // Reset checkins for new day
  useEffect(() => {
    if (todayCheckins.date !== today) {
      setTodayCheckins({
        morning: hasTodayMorning,
        midday: false,
        night: false,
        date: today
      })
    }
  }, [today, todayCheckins.date, hasTodayMorning, setTodayCheckins])
  
  const [existingEntry] = morningHistory.filter((entry: any) => 
    new Date(entry.date).toDateString() === today
  )

  // Initialize with existing data if available
  const [data, setData] = useState<MorningData>(() => {
    if (existingEntry) {
      return {
        sleep: existingEntry.sleep,
        weight: existingEntry.weight,
        swelling: existingEntry.swelling,
        fatigue: existingEntry.fatigue,
        stiffness: existingEntry.stiffness,
        bloodPressure: existingEntry.bloodPressure,
        bloodSugar: existingEntry.bloodSugar,
        additionalQuestions: existingEntry.additionalQuestions || {}
      }
    }
    return {
      sleep: null,
      weight: null,
      swelling: false,
      fatigue: null,
      stiffness: [],
      bloodPressure: '',
      bloodSugar: '',
      additionalQuestions: {}
    }
  })

  // Generate AI questions for today
  useEffect(() => {
    const generateDailyQuestions = async () => {
      const existingQuestions = dailyQuestions.find((q: any) => q.date === today)
      if (existingQuestions) return

      try {
        const prompt = spark.llmPrompt`Generate 2-3 unique daily health assessment questions for a morning check-in on ${new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}. These should be DIFFERENT from standard questions about sleep, weight, fatigue, stiffness, blood pressure, and blood sugar.

Focus on varied aspects of daily health such as:
- Hydration awareness and thirst levels
- Appetite and hunger patterns  
- Balance, coordination, or dizziness
- Breathing comfort and ease
- Temperature sensitivity (feeling too hot/cold)
- Joint flexibility or morning mobility
- Energy patterns throughout the day
- Digestive comfort
- Mental clarity and focus
- Physical comfort while sitting/standing
- Minor symptoms awareness

Create questions that are:
- Simple and easy to understand
- Relevant to elderly and health-conscious users
- Different from yesterday's questions
- Compassionate in tone
- Focused on immediate physical/mental sensations

Return a JSON array with questions in this exact format:
[
  {"id": "hydration_${Date.now()}", "text": "How is your thirst level this morning?", "type": "scale", "required": false},
  {"id": "appetite_${Date.now() + 1}", "text": "How would you describe your appetite today?", "type": "multiple", "options": ["Strong", "Normal", "Weak", "No appetite"], "required": false}
]

Types available: 
- "scale" (1-10 rating)
- "boolean" (yes/no)
- "text" (short answer)
- "multiple" (with options array)

Make each question unique and meaningful for health tracking.`
        
        const response = await spark.llm(prompt, "gpt-4o-mini", true)
        const questions = JSON.parse(response)
        
        const todayQuestions = {
          date: today,
          questions: questions
        }
        
        setDailyQuestions((prev: any[]) => [todayQuestions, ...prev.slice(0, 6)]) // Keep last 7 days
      } catch (error) {
        console.error('Failed to generate questions:', error)
      }
    }

    generateDailyQuestions()
  }, [today, dailyQuestions, setDailyQuestions])

  const getTodaysQuestions = (): DailyQuestion[] => {
    const todayQs = dailyQuestions.find((q: any) => q.date === today)
    const questions = todayQs?.questions
    // Ensure we always return an array
    return Array.isArray(questions) ? questions : []
  }

  const calculateHealthScore = (data: MorningData): number => {
    let score = 85 // Start with a higher base score to be less sensitive
    
    // Sleep score (0-10 points) - very forgiving ranges
    if (data.sleep !== null) {
      if (data.sleep < 4 || data.sleep > 11) score -= 8
      else if (data.sleep < 5 || data.sleep > 10) score -= 4
      else if (data.sleep < 6 || data.sleep > 9) score -= 1
      // 6-9 hours gets no penalty (very forgiving range)
    }
    
    // Fatigue score (0-10 points) - very forgiving
    if (data.fatigue !== null) {
      if (data.fatigue > 8) score -= 8
      else if (data.fatigue > 6) score -= 3
      // Only penalize if fatigue > 6, gentler penalty
    }
    
    // Swelling penalty (0-3 points) - minimal impact
    if (data.swelling) score -= 3
    
    // Stiffness penalty (0-7 points) - reduced and capped
    const stiffnessCount = data.stiffness.filter(s => s !== 'None').length
    score -= Math.min(7, stiffnessCount * 1) // Very gentle penalty, capped at 7 points
    
    // Bonus for completing additional questions
    const additionalAnswered = Object.keys(data.additionalQuestions).length
    score += additionalAnswered * 2
    
    // Extra bonus for vitals tracking
    if (data.bloodPressure || data.bloodSugar) score += 3
    
    return Math.max(65, Math.min(100, score)) // Minimum score of 65, higher floor
  }

  const getHealthAdvice = (score: number, data: MorningData): string[] => {
    const advice = []
    
    if (data.sleep !== null && (data.sleep < 6.5 || data.sleep > 8.5)) {
      advice.push("Consider aiming for 7-8 hours of sleep for optimal energy")
    }
    
    if (data.fatigue !== null && data.fatigue > 7) {
      advice.push("Some gentle movement or fresh air might help boost your energy")
    }
    
    if (data.swelling) {
      advice.push("Stay well hydrated and consider elevating your legs when resting")
    }
    
    if (data.stiffness.length > 0 && !data.stiffness.includes('None')) {
      advice.push("Gentle stretches can help ease stiffness and improve mobility")
    }
    
    if (score >= 85) {
      advice.push("Excellent! You're feeling great and starting the day strong")
    } else if (score >= 75) {
      advice.push("You're doing well! Keep taking good care of yourself")
    } else if (score >= 65) {
      advice.push("Listen to your body today and be kind to yourself")
    } else {
      advice.push("Today might be a good day to focus on rest and gentle self-care")
    }
    
    return advice
  }

  const handleNext = () => {
    const todaysQuestions = getTodaysQuestions()
    const totalSteps = 7 + todaysQuestions.length // Basic 7 steps + AI questions
    
    if (currentStep < totalSteps - 1) {
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
      
      // Remove any existing entry for today and add the new one
      setMorningHistory((prev: any[]) => {
        const filteredHistory = prev.filter((entry: any) => 
          new Date(entry.date).toDateString() !== today
        )
        return [newEntry, ...filteredHistory]
      })
      
      // Mark morning as complete for today - use functional update
      setTodayCheckins((prev: any) => {
        const updatedCheckins = {
          ...prev,
          morning: true,
          date: today
        }
        console.log('Setting morning complete:', updatedCheckins)
        return updatedCheckins
      })
      
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
    const todaysQuestions = getTodaysQuestions()
    const totalSteps = 7 + todaysQuestions.length
    
    switch (currentStep) {
      case 0: return data.sleep !== null
      case 1: return true // weight is optional
      case 2: return true // swelling is boolean
      case 3: return data.fatigue !== null
      case 4: return data.stiffness.length > 0
      case 5: return true // optional vitals
      case 6: return true // results
      default: 
        // AI questions (steps 7+)
        const questionIndex = currentStep - 7
        if (questionIndex < todaysQuestions.length) {
          const question = todaysQuestions[questionIndex]
          return !question.required || data.additionalQuestions[question.id] !== undefined
        }
        return true
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
                <Label htmlFor="bp" className="text-sm">Blood Pressure (optional, e.g., 120/80)</Label>
                <Input
                  id="bp"
                  value={data.bloodPressure}
                  onChange={(e) => setData({...data, bloodPressure: e.target.value})}
                  placeholder="120/80"
                />
              </div>
              <div>
                <Label htmlFor="bs" className="text-sm">Blood Sugar (optional, mg/dL)</Label>
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
        // Handle AI-generated questions (steps 7+)
        const todaysQuestions = getTodaysQuestions()
        const questionIndex = currentStep - 7
        
        if (questionIndex < todaysQuestions.length) {
          const question = todaysQuestions[questionIndex]
          
          return (
            <div className="space-y-4">
              <Label className="text-base font-medium">
                {question.text}
              </Label>
              
              {question.type === 'scale' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                      <Button
                        key={level}
                        variant={data.additionalQuestions[question.id] === level ? "default" : "outline"}
                        onClick={() => setData(prev => ({
                          ...prev,
                          additionalQuestions: { ...prev.additionalQuestions, [question.id]: level }
                        }))}
                        className="aspect-square"
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    1 = Poor/Low • 10 = Excellent/High
                  </p>
                </div>
              )}
              
              {question.type === 'boolean' && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="yes"
                      checked={data.additionalQuestions[question.id] === true}
                      onCheckedChange={() => setData(prev => ({
                        ...prev,
                        additionalQuestions: { ...prev.additionalQuestions, [question.id]: true }
                      }))}
                    />
                    <Label htmlFor="yes" className="text-base">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="no"
                      checked={data.additionalQuestions[question.id] === false}
                      onCheckedChange={() => setData(prev => ({
                        ...prev,
                        additionalQuestions: { ...prev.additionalQuestions, [question.id]: false }
                      }))}
                    />
                    <Label htmlFor="no" className="text-base">No</Label>
                  </div>
                </div>
              )}
              
              {question.type === 'text' && (
                <Input
                  value={data.additionalQuestions[question.id] || ''}
                  onChange={(e) => setData(prev => ({
                    ...prev,
                    additionalQuestions: { ...prev.additionalQuestions, [question.id]: e.target.value }
                  }))}
                  placeholder="Your answer..."
                  className="text-lg p-4"
                />
              )}
              
              {question.type === 'multiple' && question.options && (
                <div className="space-y-2">
                  {question.options.map((option: string, index: number) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Checkbox
                        id={`option-${index}`}
                        checked={data.additionalQuestions[question.id] === option}
                        onCheckedChange={() => setData(prev => ({
                          ...prev,
                          additionalQuestions: { ...prev.additionalQuestions, [question.id]: option }
                        }))}
                      />
                      <Label htmlFor={`option-${index}`} className="text-base">{option}</Label>
                    </div>
                  ))}
                </div>
              )}
              
              {!question.required && (
                <p className="text-sm text-muted-foreground">This question is optional</p>
              )}
            </div>
          )
        }
        
        return null
    }
  }

  const getStepTitles = () => {
    const basicTitles = [
      'Sleep Duration',
      'Weight Check',
      'Swelling Check',
      'Energy Level',
      'Stiffness Areas',
      'Optional Vitals',
      'Your Results'
    ]
    
    const todaysQuestions = getTodaysQuestions()
    const aiTitles = todaysQuestions.map((q, index) => `Daily Question ${index + 1}`)
    
    return [...basicTitles, ...aiTitles]
  }

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
              Step {currentStep + 1} of {getStepTitles().length}: {getStepTitles()[currentStep]}
            </p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4 bg-primary-foreground/20 rounded-full h-2">
          <div 
            className="bg-primary-foreground rounded-full h-2 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / getStepTitles().length) * 100}%` }}
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
          {currentStep === getStepTitles().length - 1 ? 'Complete Check-In' : 'Continue'}
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  )
}