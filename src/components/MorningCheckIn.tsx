import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Heart } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useKV } from '@github/spark/hooks'
import { getTodayDateString, isToday } from '@/lib/utils'
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
  const [aiGenerating, setAiGenerating] = useState(false)

  // Get today's date
  const today = getTodayDateString()
  
  const existingEntry = morningHistory.find((entry: any) => isToday(entry.date))

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

  // Generate AI questions for today (4 questions per day) - fully non-blocking with caching
  useEffect(() => {
    const generateDailyQuestions = async () => {
      const existingQuestions = dailyQuestions.find((q: any) => q.date === today)
      if (existingQuestions) return

      // Immediately set fallback questions for instant UI
      const fallbackQuestions = getRandomFallbackQuestions()
      const initialQuestions = {
        date: today,
        questions: fallbackQuestions,
        generated: new Date().toISOString(),
        source: 'fallback'
      }
      
      setDailyQuestions((prev: any[]) => [initialQuestions, ...prev.slice(0, 9)])

      setAiGenerating(true)
      setAiGenerating(true)
      
      setTimeout(async () => {
      setTimeout(async () => {
          // Minimal context for fastest generation
          const prompt = spark.llmPrompt`4개 한국어 간단 건강질문.
          const prompt = spark.llmPrompt`4개 한국어 간단 건강질문.
주제: 수분, 호흡, 균형, 기분, 식욕, 편안함
주제: 수분, 호흡, 균형, 기분, 식욕, 편안함
JSON: [{"id":"q${Date.now()}","text":"질문","type":"scale","required":false}]`
JSON: [{"id":"q${Date.now()}","text":"질문","type":"scale","required":false}]`
          const response = await spark.llm(prompt, "gpt-4o-mini", true)
          const response = await spark.llm(prompt, "gpt-4o-mini", true)
          
          
          const validQuestions = questions.filter((q: any) => q.text && q.id)
          const validQuestions = questions.filter((q: any) => q.text && q.id)
          if (validQuestions.length > 0) {
              const currentEntry = prev.find((q: any) => q.date === today)
            setDailyQuestions((prev: any[]) => {
                const aiQuestions = {
                  date: today,
                  questions: validQuestions,
                  generated: new Date().toISOString(),
                  source: 'ai'
                }
                return [aiQuestions, ...prev.filter((q: any) => q.date !== today)]
                }
              return prev
              }
          }
          
        } catch (error) {
          setAiGenerating(false)
        }
      }, 0)
        } finally {
          setAiGenerating(false)
        }
      }, 0)]) // Remove dependencies to prevent re-runs

much faster selection
  const getRandomFallbackQuestions = () => {
    const quickQuestions = [
      {
  // Optimized fallback question function - much faster selection
        text: "아침에 일어났을 때 기분은 어떤가요?",
    const quickQuestions = [
        required: false
        id: `morning_energy_${Date.now()}`,
        text: "아침에 일어났을 때 기분은 어떤가요?",
        id: `morning_hydration_${Date.now() + 1}`,
        text: "목마름을 느끼시나요?",
      },
      {
        id: `morning_hydration_${Date.now() + 1}`,
        text: "목마름을 느끼시나요?",
        id: `morning_comfort_${Date.now() + 2}`,
        text: "전체적으로 몸이 편안한가요?",
      },
      {
        id: `morning_comfort_${Date.now() + 2}`,
        text: "전체적으로 몸이 편안한가요?",
        id: `morning_readiness_${Date.now() + 3}`,
        text: "하루를 시작할 준비가 되셨나요?",
        type: "boolean",
      {
      }
        text: "하루를 시작할 준비가 되셨나요?",
    
    return quickQuestions
  }
    ]
    
    return quickQuestions
    const questions = todayQs?.questions
    // Ensure we always return an array
  const getTodaysQuestions = (): DailyQuestion[] => {
  }

    // Ensure we always return an arrayingData): number => {
    return Array.isArray(questions) ? questions : [] for accurate assessment
  }
    // Sleep score (0-12 points) - realistic sleep assessment
    if (data.sleep !== null) {
      if (data.sleep < 4 || data.sleep > 10) score -= 12 // Severely inadequate sleep
      else if (data.sleep < 5.5 || data.sleep > 9) score -= 8 // Poor sleep duration
      else if (data.sleep < 6.5 || data.sleep > 8.5) score -= 4 // Below optimal range
      else if (data.sleep >= 7 && data.sleep <= 8) score += 2 // Optimal sleep bonus
      // 6.5-8.5 hours gets minimal penalty, 7-8 hours gets bonus
    }
    
    // Fatigue score (0-10 points) - meaningful fatigue assessment
    if (data.fatigue !== null) {
      if (data.fatigue >= 9) score -= 10 // Severely exhausted
      else if (data.fatigue >= 7) score -= 6 // High fatigue
      else if (data.fatigue >= 5) score -= 3 // Moderate fatigue
      else if (data.fatigue <= 3) score += 3 // Good energy bonus
      // Fatigue 4-6 is neutral, 1-3 gets bonus
    }
    
    // Swelling penalty (0-3 points) - swelling is a health concern
    if (data.swelling) score -= 3
    
    // Stiffness penalty (0-8 points) - stiffness indicates health issues
    const stiffnessCount = data.stiffness.filter(s => s !== 'None').length
    if (stiffnessCount >= 5) score -= 8 // Multiple stiff areas
    else if (stiffnessCount >= 3) score -= 5 // Several stiff areas
    else if (stiffnessCount >= 1) score -= 2 // Some stiffness
    // No stiffness gets no penalty
    
    // AI Questions impact (0-15 points) - significant contribution to health assessment
    const additionalAnswers = data.additionalQuestions
    let aiQuestionsScore = 0
    let aiQuestionsCount = 0
    
    Object.entries(additionalAnswers).forEach(([questionId, answer]) => {
      aiQuestionsCount++
      
      if (typeof answer === 'number') {
        // Scale questions (1-10): normalize to health impact
        if (answer >= 8) aiQuestionsScore += 4 // Very positive
        else if (answer >= 6) aiQuestionsScore += 2 // Positive
        else if (answer >= 4) aiQuestionsScore += 0 // Neutral
        else if (answer >= 2) aiQuestionsScore -= 2 // Concerning
        else aiQuestionsScore -= 4 // Very concerning
      } else if (typeof answer === 'boolean') {
        // Boolean questions: context-dependent interpretation
        const questionText = questionId.toLowerCase()
        
        // Positive health indicators (good if true)
        if (questionText.includes('comfortable') || 
            questionText.includes('ready') || 
            questionText.includes('clear') || 
            questionText.includes('smooth') ||
            questionText.includes('motivated') ||
            questionText.includes('steady')) {
          aiQuestionsScore += answer ? 3 : -2
        }
        // Negative health indicators (bad if true)
        else if (questionText.includes('pain') || 
                 questionText.includes('dizz') || 
                 questionText.includes('headache') || 
                 questionText.includes('nausea') ||
                 questionText.includes('pressure') ||
                 questionText.includes('swelling')) {
          aiQuestionsScore += answer ? -3 : 2
        }
        // Neutral interpretation for other boolean questions
        else {
          aiQuestionsScore += answer ? 1 : -1
        }
      } else if (typeof answer === 'string' && answer.trim()) {
        // Multiple choice and text questions
        const answerLower = answer.toLowerCase()
        
        // Evaluate based on common positive/negative keywords
        if (answerLower.includes('very') && (answerLower.includes('good') || answerLower.includes('comfortable') || answerLower.includes('motivated'))) {
          aiQuestionsScore += 4
        } else if (answerLower.includes('good') || answerLower.includes('comfortable') || answerLower.includes('normal') || answerLower.includes('motivated')) {
          aiQuestionsScore += 2
        } else if (answerLower.includes('slight') || answerLower.includes('somewhat') || answerLower.includes('moderate')) {
          aiQuestionsScore += 0
        } else if (answerLower.includes('low') || answerLower.includes('poor') || answerLower.includes('tired') || answerLower.includes('cold') || answerLower.includes('dry')) {
          aiQuestionsScore -= 2
        } else if (answerLower.includes('very') && (answerLower.includes('poor') || answerLower.includes('bad') || answerLower.includes('tired'))) {
          aiQuestionsScore -= 4
        } else {
          // Default neutral for unrecognized text
          aiQuestionsScore += 1
        }
      }
    })
    
    // Apply AI questions score with engagement bonus
    score += aiQuestionsScore
    score += aiQuestionsCount * 1 // Small engagement bonus for answering
    
    // Small bonus for vitals tracking
    if (data.bloodPressure || data.bloodSugar) score += 2
    
    // Completion bonus
    score += 2
    
    return Math.max(50, Math.min(100, score)) // Minimum score of 50, allows for realistic range
  }

  const getHealthAdvice = (score: number, data: MorningData): string[] => {
    const advice = []
    
    if (data.sleep !== null && (data.sleep < 6.5 || data.sleep > 8.5)) {
      advice.push("Consider aiming for 7-8 hours of sleep for optimal energy")
    }
    
    if (data.fatigue !== null && data.fatigue >= 7) {
      advice.push("High fatigue may indicate need for better rest or gentle activity")
    }
    
    if (data.swelling) {
      advice.push("Monitor swelling - stay hydrated and consider elevating legs when resting")
    }
    
    if (data.stiffness.length > 0 && !data.stiffness.includes('None')) {
      advice.push("Gentle stretches can help ease stiffness and improve mobility")
    }
    
    if (score >= 90) {
      advice.push("Excellent health status! You're feeling great and starting strong")
    } else if (score >= 80) {
      advice.push("Good health status - you're doing well overall")
    } else if (score >= 70) {
      advice.push("Fair health status - some areas may need attention")
    } else if (score >= 60) {
      advice.push("Health indicators suggest focusing on rest and gentle self-care today")
    } else {
      advice.push("Multiple health concerns present - consider consulting a healthcare provider")
    }
    
    return advice
  }

  const handleNext = () => {
    // Always expect 4 AI questions (fixed count)
    const totalSteps = 7 + 4 // Basic 7 steps + 4 AI questions
    
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete check-in - follow exact same pattern as night reflection
      const healthScore = calculateHealthScore(data)
      const advice = getHealthAdvice(healthScore, data)
      
      const finalData = {
        ...data,
        healthScore,
        advice
      }
      
      const newEntry = {
        date: today, // Use consistent date format
        ...finalData,
        completedAt: new Date().toISOString()
      }
      
      // Remove any existing entry for today and add the new one
      setMorningHistory((prev: any[]) => {
        const filteredHistory = prev.filter((entry: any) => !isToday(entry.date))
        const newHistory = [newEntry, ...filteredHistory]
        console.log('=== MORNING CHECK-IN COMPLETION ===')
        console.log('Today date string:', today)
        console.log('Entry being saved:', newEntry)
        console.log('Previous history length:', prev.length)
        console.log('New history length:', newHistory.length)
        console.log('New history first item:', newHistory[0])
        console.log('================================')
        return newHistory
      })
      
      setData(finalData)
      
      // Small delay to ensure data is persisted before navigation
      setTimeout(() => {
        onComplete()
      }, 100)
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
      case 1: return true // weight is optional
      case 2: return true // swelling is boolean
      case 3: return data.fatigue !== null
      case 4: return data.stiffness.length > 0
      case 5: return true // optional vitals
      case 6: return true // results
      default: 
        // AI questions (steps 7-10 for 4 questions)
        const questionIndex = currentStep - 7
        if (questionIndex < 4) {
          const todaysQuestions = getTodaysQuestions()
          if (questionIndex < todaysQuestions.length) {
            const question = todaysQuestions[questionIndex]
            return !question.required || data.additionalQuestions[question.id] !== undefined
          }
          // If questions are still loading or not available, allow proceeding
          return true
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
              placeholder="kg"
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
        // Handle AI-generated questions (steps 7-10 for 4 questions)
        const todaysQuestions = getTodaysQuestions()
        const questionIndex = currentStep - 7
        
        // Always show questions immediately - no loading state
        if (questionIndex < 4) {
          // Use fallback if AI questions aren't ready yet, with better fallback mapping
          const todaysQuestions = getTodaysQuestions()
        // Always show questions immediately - no loading state
        if (questionIndex < 4) {
          // Use fallback if AI questions aren't ready yet, with better fallback mapping
          const todaysQuestions = getTodaysQuestions()
          let question
            // Enhanced fallback questions based on question index
          if (todaysQuestions.length > questionIndex) {
              {
          } else {
                text: "아침에 일어났을 때 전체적인 컨디션은 어떤가요?",
                type: 'scale',
                required: false
              },
                text: "아침에 일어났을 때 전체적인 컨디션은 어떤가요?",
                id: `fallback_comfort_${Date.now() + 1}`,
                text: "몸이 전반적으로 편안한가요?",
                type: 'boolean',
                required: false
              },
              {
                id: `fallback_mood_${Date.now() + 2}`,
                text: "오늘 하루를 시작할 기분은 어떤가요?",
                type: 'scale',
                required: false
              },
              {
                id: `fallback_readiness_${Date.now() + 3}`,
                text: "활동할 준비가 되어 있다고 느끼시나요?",
                type: 'boolean',
                required: false
              }
            ]
            question = fallbackQuestions[questionIndex] || fallbackQuestions[0]
          }
          
          return (
            <div className="space-y-4">
              <Label className="text-base font-medium">
          n.text}
          return (
              
              {question.type === 'scale' && (
                <div className="space-y-3">
                {aiGenerating && currentStep >= 7 && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    🤖 개인화 중...
                  </span>
                )}? "default" : "outline"}
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
                    1 = 나쁨/낮음 • 10 = 매우 좋음/높음
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
                    <Label htmlFor="yes" className="text-base">네</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="no"
                      checked={data.additionalQuestions[question.id] === false}
                      onCheckedChange={() => setData(prev => ({
                      }))}
                    />
                    <Label htmlFor="yes" className="text-base">네</Label>
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
                    <Label htmlFor="no" className="text-base">아니오</Label>
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
                  placeholder="답변을 입력하세요..."
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
              {!question.required && (
                <p className="text-sm text-muted-foreground">이 질문은 선택사항입니다</p>
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
    
    // Always show 4 AI question titles, regardless of loading state
    const aiTitles = ['맞춤 질문 1', '맞춤 질문 2', '맞춤 질문 3', '맞춤 질문 4']
    
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