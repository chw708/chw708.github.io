import { useState, useEffect } from 'react'
import { ArrowLeft, Heart, Sparkle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useKV } from '@github/spark/hooks'
import { getTodayDateString, isToday } from '@/lib/utils'

interface NightCheckInProps {
  onComplete: () => void
  onBack: () => void
}

interface NightData {
  stressJournal: string
  aiResponse: string
  reflections: {
    happiness: string
    stressLevel: number | null
    connection: string
    gratitude: string
    tomorrow: string
  }
  emotionalSummary: string
  dailyQuote: string
}

const reflectionQuestions = [
  {
    key: 'happiness' as keyof NightData['reflections'],
    question: 'What made you happy or brought you joy today?',
    placeholder: 'Even small moments count...'
  },
  {
    key: 'connection' as keyof NightData['reflections'],
    question: 'Did you feel connected with others today?',
    placeholder: 'Family, friends, community, or even a kind stranger...'
  },
  {
    key: 'gratitude' as keyof NightData['reflections'],
    question: 'What are you grateful for today?',
    placeholder: 'Big or small, what brought warmth to your heart?'
  },
  {
    key: 'tomorrow' as keyof NightData['reflections'],
    question: 'What\'s one thing you\'re looking forward to tomorrow?',
    placeholder: 'Something to anticipate, no matter how simple...'
  }
]

const dailyQuotes = [
  "Every day is a new beginning. Take a deep breath, smile, and start again.",
  "Your body is your temple. Take care of it, and it will take care of you.",
  "Small steps every day lead to big changes one year from now.",
  "Listen to your body. It whispers before it screams.",
  "Healing is not just about the body - it's about the mind and spirit too.",
  "You are stronger than you think, braver than you feel, and more loved than you know.",
  "Rest when you're weary. Refresh and renew yourself. Your body, mind, and spirit all need that.",
  "Taking care of yourself is not selfish. It's essential."
]

export default function NightCheckIn({ onComplete, onBack }: NightCheckInProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [nightHistory, setNightHistory] = useKV('night-history', [])

  // Get today's existing data if any
  const today = getTodayDateString()
  
  // Check if we have an entry for today
  const hasTodayNight = nightHistory.some((entry: any) => isToday(entry.date))
  
  const [existingEntry] = nightHistory.filter((entry: any) => isToday(entry.date))

  // Initialize with existing data if available
  const [data, setData] = useState<NightData>(() => {
    if (existingEntry) {
      return {
        stressJournal: existingEntry.stressJournal || '',
        aiResponse: existingEntry.aiResponse || '',
        reflections: existingEntry.reflections || {
          happiness: '',
          stressLevel: null,
          connection: '',
          gratitude: '',
          tomorrow: ''
        },
        emotionalSummary: existingEntry.emotionalSummary || '',
        dailyQuote: existingEntry.dailyQuote || ''
      }
    }
    return {
      stressJournal: '',
      aiResponse: '',
      reflections: {
        happiness: '',
        stressLevel: null,
        connection: '',
        gratitude: '',
        tomorrow: ''
      },
      emotionalSummary: '',
      dailyQuote: ''
    }
  })
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false)

  const generateAIResponse = async (stressText: string): Promise<string> => {
    if (!stressText.trim()) {
      return "I'm here to listen. Sometimes just knowing someone cares can make a difference. You're not alone in this journey."
    }

    try {
      const prompt = spark.llmPrompt`You are Teresa, a warm and compassionate health companion. A user has shared what stressed them today: "${stressText}". 

Respond with empathy and gentle support. Keep your response to 2-3 sentences. Be warm, understanding, and offer gentle encouragement or a simple coping suggestion if appropriate. Don't give medical advice, just emotional support like a caring friend would.`

      const response = await spark.llm(prompt, 'gpt-4o-mini')
      return response.trim()
    } catch (error) {
      return "I understand that today has been challenging for you. Remember that difficult days are part of being human, and tomorrow brings new possibilities. You're taking such good care of yourself by checking in each day."
    }
  }

  const generateEmotionalSummary = async (): Promise<string> => {
    try {
      const prompt = spark.llmPrompt`Based on these evening reflections, create a warm, encouraging 1-2 sentence summary:

Stress: ${data.stressJournal}
Happiness: ${data.reflections.happiness}
Stress Level: ${data.reflections.stressLevel}/10
Connection: ${data.reflections.connection}
Gratitude: ${data.reflections.gratitude}
Tomorrow: ${data.reflections.tomorrow}

Create a supportive summary that acknowledges their experiences and ends on a hopeful note.`

      const response = await spark.llm(prompt, 'gpt-4o-mini')
      return response.trim()
    } catch (error) {
      return "You've taken time to reflect on your day with honesty and care. That kind of self-awareness is a beautiful gift you give yourself each evening."
    }
  }

  const handleStressJournalNext = async () => {
    setIsGeneratingResponse(true)
    const response = await generateAIResponse(data.stressJournal)
    setData(prev => ({ ...prev, aiResponse: response }))
    setIsGeneratingResponse(false)
    setCurrentStep(1)
  }

  const handleReflectionChange = (key: keyof NightData['reflections'], value: string | number) => {
    setData(prev => ({
      ...prev,
      reflections: {
        ...prev.reflections,
        [key]: value
      }
    }))
  }

  const handleComplete = async () => {
    const randomQuote = dailyQuotes[Math.floor(Math.random() * dailyQuotes.length)]
    const emotionalSummary = await generateEmotionalSummary()
    
    const finalData = {
      ...data,
      dailyQuote: randomQuote,
      emotionalSummary
    }
    
    const newEntry = {
      date: new Date().toISOString(),
      ...finalData
    }
    
    // Remove any existing entry for today and add the new one
    setNightHistory((prev: any[]) => {
      const filteredHistory = prev.filter((entry: any) => !isToday(entry.date))
      return [newEntry, ...filteredHistory]
    })
    
    setData(finalData)
    setCurrentStep(4) // Show summary
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">
                What stressed you today? Let it out here...
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Sometimes writing about our worries helps us process them. I'm here to listen.
              </p>
            </div>
            <Textarea
              value={data.stressJournal}
              onChange={(e) => setData(prev => ({ ...prev, stressJournal: e.target.value }))}
              placeholder="Share whatever is weighing on your mind - work, relationships, health concerns, daily challenges..."
              rows={6}
              className="resize-none"
            />
            <Button
              onClick={handleStressJournalNext}
              disabled={isGeneratingResponse}
              className="w-full"
            >
              {isGeneratingResponse ? (
                <>
                  <Sparkle className="animate-spin mr-2" size={16} />
                  Teresa is responding...
                </>
              ) : (
                'Share with Teresa'
              )}
            </Button>
          </div>
        )

      case 1:
        return (
          <div className="space-y-4">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary text-primary-foreground p-2 rounded-full flex-shrink-0">
                  <Heart size={16} weight="fill" />
                </div>
                <div>
                  <p className="font-medium text-primary mb-2">Teresa's Response</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {data.aiResponse}
                  </p>
                </div>
              </div>
            </div>
            <Button onClick={() => setCurrentStep(2)} className="w-full">
              Continue to Reflection
            </Button>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">
                Rate your stress level today (1 = very calm, 10 = very stressed)
              </Label>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                <Button
                  key={level}
                  variant={data.reflections.stressLevel === level ? "default" : "outline"}
                  onClick={() => handleReflectionChange('stressLevel', level)}
                  className="aspect-square"
                >
                  {level}
                </Button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground text-center">
              1-3: Very calm • 4-6: Moderate • 7-10: High stress
            </p>
            <Button
              onClick={() => setCurrentStep(3)}
              disabled={data.reflections.stressLevel === null}
              className="w-full"
            >
              Continue
            </Button>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-center">Evening Reflections</h3>
            {reflectionQuestions.map((q, index) => (
              <div key={q.key} className="space-y-2">
                <Label className="text-sm font-medium">{q.question}</Label>
                <Textarea
                  value={data.reflections[q.key] as string}
                  onChange={(e) => handleReflectionChange(q.key, e.target.value)}
                  placeholder={q.placeholder}
                  rows={2}
                />
              </div>
            ))}
            <Button onClick={handleComplete} className="w-full">
              Complete Night Reflection
            </Button>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart size={24} weight="fill" className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Good Night</h3>
              <p className="text-muted-foreground">Your day is complete. Rest well.</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Your Day Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed text-center">
                  {data.emotionalSummary}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Quote for Tomorrow</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-primary italic text-center leading-relaxed">
                  "{data.dailyQuote}"
                </p>
              </CardContent>
            </Card>

            <Button onClick={onComplete} className="w-full">
              Return to Home
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  const stepTitles = [
    'Stress Journal',
    'AI Support',
    'Stress Level',
    'Reflections',
    'Summary'
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-purple-600 text-white px-6 py-4">
        <div className="flex items-center gap-4">
          {currentStep < 4 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={currentStep === 0 ? onBack : () => setCurrentStep(currentStep - 1)}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft size={20} />
            </Button>
          )}
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Night Reflection</h1>
            <p className="text-sm text-white/80">
              {stepTitles[currentStep]}
            </p>
          </div>
        </div>
        
        {currentStep < 4 && (
          <div className="mt-4 bg-white/20 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / 4) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <Card>
          <CardContent className="p-6">
            {renderStep()}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}