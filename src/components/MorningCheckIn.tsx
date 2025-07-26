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
      
      setTimeout(async () => {
        try {
          // Professional health assessment questions
          const prompt = spark.llmPrompt`당신은 전문 의료진입니다. 일반인의 일상 건강상태를 정확히 평가할 수 있는 전문적이고 구체적인 질문 4개를 한국어로 만들어주세요.

다음 영역에서 선택하여 다양하고 의미있는 건강 지표를 평가해주세요:
- 심혈관 건강: 호흡곤란, 가슴답답함, 어지러움, 심박수 변화
- 신경계/인지기능: 집중력, 기억력, 균형감각, 두통
- 소화계: 식욕, 소화불량, 복부불편감, 배변활동
- 근골격계: 관절통증, 근육경직, 보행능력, 움직임 제한
- 정신건강: 스트레스, 불안감, 우울감, 의욕
- 수면/피로: 수면의 질, 꿈, 아침 기상감, 주간졸음
- 전반적 컨디션: 면역력, 체온변화, 수분상태, 활력

각 질문은:
- 구체적이고 측정 가능해야 함
- 일반인이 쉽게 이해할 수 있어야 함  
- 의학적으로 의미있는 건강지표를 반영해야 함
- 예/아니오, 1-10점 척도, 또는 선택지 형태로 답변 가능해야 함

JSON 형식으로 정확히 다음과 같이 응답해주세요 (정확한 형식 준수 필수):
[
  {"id":"custom_q1","text":"건강 관련 질문","type":"scale","required":false},
  {"id":"custom_q2","text":"다른 건강 질문","type":"boolean","required":false},
  {"id":"custom_q3","text":"추가 건강 질문","type":"scale","required":false},
  {"id":"custom_q4","text":"마지막 건강 질문","type":"boolean","required":false}
]`
          const response = await spark.llm(prompt, "gpt-4o-mini", true)
          
          let questions = []
          try {
            questions = JSON.parse(response)
            if (!Array.isArray(questions)) {
              throw new Error('Response is not an array')
            }
          } catch (parseError) {
            console.warn('Failed to parse AI questions, using fallback:', parseError)
            questions = []
          }
          
          const validQuestions = questions.filter((q: any) => q.text && q.id && q.type)
          if (validQuestions.length > 0) {
            setDailyQuestions((prev: any[]) => {
              const currentEntry = prev.find((q: any) => q.date === today)
              if (currentEntry && currentEntry.source === 'fallback') {
                const aiQuestions = {
                  date: today,
                  questions: validQuestions,
                  generated: new Date().toISOString(),
                  source: 'ai'
                }
                return [aiQuestions, ...prev.filter((q: any) => q.date !== today)]
              }
              return prev
            })
          }
        } catch (error) {
          console.log('AI questions failed, using fallback')
        } finally {
          setAiGenerating(false)
        }
      }, 0)
    }

    generateDailyQuestions()
  }, []) // Remove dependencies to prevent re-runs

  // Professional fallback questions - medically relevant
  const getRandomFallbackQuestions = () => {
    const professionalQuestions = [
      {
        id: `cardiovascular_${Date.now()}`,
        text: "평소보다 호흡이 더 힘들거나 가슴이 답답하신가요?",
        type: "boolean",
        required: false
      },
      {
        id: `cognitive_${Date.now() + 1}`,
        text: "오늘 집중력이나 기억력에 어려움을 느끼시나요? (1-10점: 1=전혀 없음, 10=매우 심함)",
        type: "scale",
        required: false
      },
      {
        id: `digestive_${Date.now() + 2}`,
        text: "식욕 상태는 어떠신가요?",
        type: "multiple",
        options: ["평소와 같음", "평소보다 좋음", "평소보다 떨어짐", "전혀 없음"],
        required: false
      },
      {
        id: `stiffness_${Date.now() + 3}`,
        text: "기상 후 관절이나 근육의 경직감 정도는? (1-10점: 1=전혀 없음, 10=매우 심함)",
        type: "scale",
        required: false
      },
      {
        id: `neurological_${Date.now() + 4}`,
        text: "어지러움이나 균형감각 이상을 느끼시나요?",
        type: "boolean",
        required: false
      },
      {
        id: `mental_health_${Date.now() + 5}`,
        text: "전반적인 스트레스나 불안감 정도는? (1-10점: 1=전혀 없음, 10=매우 심함)",
        type: "scale",
        required: false
      }
    ]
    
    const shuffled = professionalQuestions.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 4)
  }

  const getTodaysQuestions = (): DailyQuestion[] => {
    const todayQs = dailyQuestions.find((q: any) => q.date === today)
    const questions = todayQs?.questions
    
    // Ensure we always return an array
    return Array.isArray(questions) ? questions : []
  }

  const calculateHealthScore = (data: MorningData): number => {
    let score = 85 // Start with a fair baseline for accurate assessment
    
    // Sleep score (0-12 points) - realistic sleep assessment
    if (data.sleep !== null) {
      if (data.sleep < 5.5 || data.sleep > 9) score -= 8 // Poor sleep duration
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
    
    // AI Questions impact (0-20 points) - enhanced professional health assessment integration
    const additionalAnswers = data.additionalQuestions
    let aiQuestionsScore = 0
    let aiQuestionsCount = 0
    
    console.log('=== HEALTH SCORE CALCULATION ===')
    console.log('Additional questions data:', additionalAnswers)
    
    Object.entries(additionalAnswers).forEach(([questionId, answer]) => {
      aiQuestionsCount++
      const questionText = questionId.toLowerCase()
      let questionScore = 0
      
      console.log(`Processing question: ${questionId}, answer: ${answer}, type: ${typeof answer}`)
      
      if (typeof answer === 'number') {
        // Scale questions (1-10): enhanced health interpretation with question context analysis
        
        // Negative health indicators (symptoms, pain, stress)
        if (questionText.includes('pain') || 
            questionText.includes('stress') || 
            questionText.includes('difficulty') || 
            questionText.includes('심함') ||
            questionText.includes('어려움') ||
            questionText.includes('불안') ||
            questionText.includes('경직') ||
            questionText.includes('피로') ||
            questionText.includes('답답') ||
            questionText.includes('호흡') ||
            questionText.includes('두통') ||
            questionText.includes('통증')) {
          // Higher scores = worse condition (reverse scoring)
          if (answer <= 2) questionScore = 5 // Minimal symptoms - excellent
          else if (answer <= 4) questionScore = 3 // Mild symptoms - good
          else if (answer <= 6) questionScore = 0 // Moderate symptoms - neutral
          else if (answer <= 8) questionScore = -4 // Concerning symptoms - poor
          else questionScore = -7 // Severe symptoms - very poor
        }
        // Positive health indicators (energy, comfort, readiness, appetite)
        else if (questionText.includes('energy') ||
                 questionText.includes('컨디션') ||
                 questionText.includes('기분') ||
                 questionText.includes('편안') ||
                 questionText.includes('ready') ||
                 questionText.includes('준비') ||
                 questionText.includes('appetite') ||
                 questionText.includes('식욕') ||
                 questionText.includes('활력') ||
                 questionText.includes('motivated') ||
                 questionText.includes('의욕')) {
          // Higher scores = better condition (normal scoring)
          if (answer >= 8) questionScore = 5 // Excellent condition
          else if (answer >= 6) questionScore = 3 // Good condition
          else if (answer >= 4) questionScore = 0 // Fair condition
          else if (answer >= 2) questionScore = -3 // Poor condition
          else questionScore = -5 // Very poor condition
        }
        // Generic scale questions - moderate impact
        else {
          if (answer >= 7) questionScore = 3
          else if (answer >= 5) questionScore = 1
          else if (answer >= 3) questionScore = 0
          else questionScore = -2
        }
      } else if (typeof answer === 'boolean') {
        // Boolean questions: context-sensitive medical interpretation
        
        // Serious health symptoms (very concerning if true)
        if (questionText.includes('호흡') || 
            questionText.includes('답답') || 
            questionText.includes('어지러') || 
            questionText.includes('균형') ||
            questionText.includes('pain') || 
            questionText.includes('chest') || 
            questionText.includes('dizz') || 
            questionText.includes('breathing') ||
            questionText.includes('shortness') ||
            questionText.includes('통증') ||
            questionText.includes('두통')) {
          questionScore = answer ? -6 : 4 // Heavy penalty for symptoms, bonus for absence
        }
        // General wellness indicators (good if true)
        else if (questionText.includes('comfortable') || 
                 questionText.includes('편안') || 
                 questionText.includes('ready') || 
                 questionText.includes('준비') ||
                 questionText.includes('motivated') ||
                 questionText.includes('의욕') ||
                 questionText.includes('좋') ||
                 questionText.includes('잘') ||
                 questionText.includes('good') ||
                 questionText.includes('well')) {
          questionScore = answer ? 4 : -2 // Bonus for wellness, penalty for lack
        }
        // Moderate health concerns
        else {
          questionScore = answer ? -3 : 2
        }
      } else if (typeof answer === 'string' && answer.trim()) {
        // Multiple choice questions: enhanced professional health context evaluation
        const answerLower = answer.toLowerCase()
        
        // Excellent health indicators
        if (answerLower.includes('평소보다 좋음') || 
            answerLower.includes('매우 좋음') ||
            answerLower.includes('excellent') || 
            answerLower.includes('very good') ||
            answerLower.includes('훌륭')) {
          questionScore = 5
        }
        // Good/normal health indicators
        else if (answerLower.includes('평소와 같음') || 
                 answerLower.includes('좋음') ||
                 answerLower.includes('normal') || 
                 answerLower.includes('good') ||
                 answerLower.includes('괜찮')) {
          questionScore = 3
        }
        // Slightly concerning indicators
        else if (answerLower.includes('평소보다 떨어짐') || 
                 answerLower.includes('조금') ||
                 answerLower.includes('약간') ||
                 answerLower.includes('slightly') || 
                 answerLower.includes('mild')) {
          questionScore = -1
        }
        // Poor health indicators
        else if (answerLower.includes('떨어짐') || 
                 answerLower.includes('나쁨') ||
                 answerLower.includes('worse') || 
                 answerLower.includes('poor')) {
          questionScore = -3
        }
        // Severe health concerns
        else if (answerLower.includes('전혀 없음') || 
                 answerLower.includes('매우 나쁨') ||
                 answerLower.includes('심각') ||
                 answerLower.includes('severe') || 
                 answerLower.includes('very poor')) {
          questionScore = -5
        } else {
          // Neutral/unknown response
          questionScore = 1
        }
      }
      
      aiQuestionsScore += questionScore
      console.log(`Question ${questionId}: score = ${questionScore}, total AI score = ${aiQuestionsScore}`)
    })
    
    // Apply AI questions score with engagement bonus
    score += aiQuestionsScore
    score += aiQuestionsCount * 1 // Small engagement bonus for answering
    
    console.log(`Final AI questions contribution: ${aiQuestionsScore} points from ${aiQuestionsCount} questions`)
    console.log(`Total score before bounds: ${score}`)
    console.log('=== END HEALTH SCORE CALCULATION ===')
    
    // Small bonus for vitals tracking
    if (data.bloodPressure || data.bloodSugar) score += 2
    
    // Completion bonus
    score += 2
    
    return Math.max(50, Math.min(100, score)) // Minimum score of 50, allows for realistic range
  }

  const getHealthAdvice = (score: number, data: MorningData): string[] => {
    const advice: string[] = []
    
    // Professional health recommendations based on data
    if (data.sleep !== null && (data.sleep < 6.5 || data.sleep > 8.5)) {
      if (data.sleep < 6.5) {
        advice.push("수면 부족이 감지되었습니다. 7-8시간의 규칙적인 수면을 권장합니다")
      } else {
        advice.push("과도한 수면이 감지되었습니다. 수면의 질을 점검해보세요")
      }
    }
    
    if (data.fatigue !== null && data.fatigue >= 7) {
      advice.push("높은 피로도가 감지되었습니다. 충분한 휴식과 가벼운 활동을 권장합니다")
    }
    
    if (data.swelling) {
      advice.push("부종이 지속되면 의료진과 상담하고, 수분 섭취와 다리 거상을 권장합니다")
    }
    
    if (data.stiffness.length > 0 && !data.stiffness.includes('None')) {
      const stiffnessCount = data.stiffness.filter(s => s !== 'None').length
      if (stiffnessCount >= 3) {
        advice.push("다발성 관절 경직이 감지되었습니다. 전문의 상담을 고려해보세요")
      } else {
        advice.push("관절 경직 완화를 위한 스트레칭과 온찜질을 권장합니다")
      }
    }

    // Professional advice based on AI question responses
    const additionalAnswers = data.additionalQuestions
    Object.entries(additionalAnswers).forEach(([questionId, answer]) => {
      const questionLower = questionId.toLowerCase()
      
      // Cardiovascular concerns
      if ((questionLower.includes('호흡') || questionLower.includes('답답')) && answer === true) {
        advice.push("호흡곤란이나 흉부 답답함은 심혈관 검진이 필요할 수 있습니다")
      }
      
      // Neurological concerns
      if ((questionLower.includes('어지러') || questionLower.includes('균형')) && answer === true) {
        advice.push("어지러움이나 균형감각 이상은 의료진 상담을 권장합니다")
      }
      
      // Cognitive function
      if (questionLower.includes('집중') || questionLower.includes('기억')) {
        if (typeof answer === 'number' && answer >= 6) {
          advice.push("인지기능 저하가 지속되면 전문의 상담을 고려해보세요")
        }
      }
      
      // High stress/anxiety levels
      if ((questionLower.includes('스트레스') || questionLower.includes('불안')) && typeof answer === 'number' && answer >= 7) {
        advice.push("높은 스트레스나 불안감이 감지되었습니다. 정신건강 관리가 필요합니다")
      }
    })
    
    // Additional advice patterns for extended questions
    Object.entries(additionalAnswers).forEach(([questionId, answer]) => {
      const questionLower = questionId.toLowerCase()
      
      // Low energy/mood levels
      if ((questionLower.includes('컨디션') || questionLower.includes('기분') || questionLower.includes('energy') || questionLower.includes('mood')) && typeof answer === 'number' && answer <= 4) {
        advice.push("컨디션이나 기분이 좋지 않습니다. 충분한 휴식과 자기관리를 권장합니다")
      }
      
      // Pain/discomfort indicators
      if ((questionLower.includes('통증') || questionLower.includes('아픔') || questionLower.includes('pain') || questionLower.includes('discomfort')) && ((typeof answer === 'number' && answer >= 6) || answer === true)) {
        advice.push("지속적인 통증이나 불편감이 있다면 의료진 상담을 권장합니다")
      }
      
      // Poor appetite indicators
      if ((questionLower.includes('식욕') || questionLower.includes('appetite')) && (answer === '전혀 없음' || answer === '평소보다 떨어짐')) {
        advice.push("식욕 저하가 지속되면 영양상태와 전반적 건강을 점검해보세요")
      }
      
      // Positive wellness indicators
      if ((questionLower.includes('준비') || questionLower.includes('ready') || questionLower.includes('motivated')) && (answer === true || (typeof answer === 'number' && answer >= 8))) {
        advice.push("훌륭한 활력과 의욕을 보이고 있습니다. 현재 상태를 유지하세요")
      }
    })
    
    // Overall health status with professional context
    if (score >= 90) {
      advice.push("우수한 건강상태입니다. 현재 건강 관리 방식을 유지하세요")
    } else if (score >= 80) {
      advice.push("전반적으로 양호한 건강상태입니다")
    } else if (score >= 70) {
      advice.push("일부 건강 지표에 주의가 필요합니다. 생활습관 개선을 권장합니다")
    } else if (score >= 60) {
      advice.push("여러 건강 지표가 우려됩니다. 자가관리와 휴식을 늘려보세요")
    } else {
      advice.push("복합적인 건강 문제가 감지되었습니다. 의료진 상담을 적극 권장합니다")
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
          let question
          if (todaysQuestions.length > questionIndex) {
            question = todaysQuestions[questionIndex]
          } else {
            // Enhanced fallback questions based on question index
            const fallbackQuestions = [
              {
                id: `fallback_energy_${Date.now()}`,
                text: "아침에 일어났을 때 전체적인 컨디션은 어떤가요?",
                type: 'scale',
                required: false
              },
              {
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
                {question.text}
                {aiGenerating && currentStep >= 7 && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    🤖 개인화 중...
                  </span>
                )}
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
                          additionalQuestions: { ...prev.additionalQuestions, [question.id]: option }
                        }))}
                      />
                      <Label htmlFor={`option-${index}`} className="text-base">{option}</Label>
                    </div>
                  ))}
                </div>
              )}
              
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