import { ArrowLeft, Question } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { useState } from 'react'

interface FAQProps {
  onBack: () => void
}

const faqData = [
  {
    question: "What is Teresa Health for?",
    answer: "Teresa Health is a daily wellness companion designed to help you track your physical and mental health through simple check-ins. It's especially helpful for seniors, people in underserved areas, or anyone wanting to build better health habits with AI-powered insights and emotional support."
  },
  {
    question: "Is my data safe and private?",
    answer: "Yes, absolutely. All your health data is stored securely on your device. We never sell, share, or upload your personal information to external servers without your explicit consent. You have full control over your data and can export or delete it anytime."
  },
  {
    question: "Can I use this without medical knowledge?",
    answer: "Definitely! Teresa Health is designed to be simple and accessible for everyone, regardless of medical background. We provide context for normal ranges (like blood pressure and sleep hours) and use plain language throughout the app. However, this app complements but doesn't replace professional medical care."
  },
  {
    question: "How does the health score work?",
    answer: "Your health score (0-100) is calculated based on your morning check-in responses including sleep quality, fatigue level, physical symptoms, and overall wellbeing indicators. Higher scores indicate better health patterns, while lower scores suggest areas that might need attention."
  },
  {
    question: "What makes the AI responses helpful?",
    answer: "Teresa, our AI companion, is trained to provide warm, empathetic responses to your daily reflections and stress journal entries. She offers emotional support, gentle encouragement, and coping suggestions while maintaining a caring, non-judgmental tone - like having a compassionate friend who's always there to listen."
  },
  {
    question: "Do I need to complete all check-ins every day?",
    answer: "While daily check-ins provide the most complete picture of your health patterns, you can use Teresa Health flexibly. Even completing just one check-in per day is valuable. The app saves your progress, so you can always come back to complete missed sections."
  },
  {
    question: "How do the stretch recommendations work?",
    answer: "When you report stiffness in specific body areas during your morning check-in, Teresa Health suggests gentle stretches targeted to those areas. These recommendations are based on common mobility exercises that can help relieve tension and improve flexibility."
  },
  {
    question: "Can I track medications or medical appointments?",
    answer: "Currently, Teresa Health focuses on daily wellness tracking through mood, sleep, meals, and reflection. For medication tracking and appointment management, we recommend consulting with your healthcare provider or using dedicated medical management apps alongside Teresa Health."
  },
  {
    question: "What if I miss several days of check-ins?",
    answer: "No worries at all! Teresa Health is designed to be forgiving and supportive. You can restart anytime without losing your previous data. The app will show your most recent trends and insights, and you can immediately begin building new healthy patterns."
  },
  {
    question: "Is this app suitable for elderly users?",
    answer: "Yes! Teresa Health was specifically designed with seniors in mind. It features large, easy-to-tap buttons, clear text, simple navigation, and step-by-step guidance. The warm, patient tone and emotional support features make it particularly helpful for older adults managing their health independently."
  },
  {
    question: "When should I seek professional medical help?",
    answer: "Teresa Health is a wellness tracking tool, not a medical diagnostic device. Seek immediate medical attention for emergencies (call 911), persistent concerning symptoms, sudden changes in health, or whenever you feel unsure about your wellbeing. Always follow up with healthcare providers for medical concerns."
  },
  {
    question: "How can I export my health data?",
    answer: "Go to Settings > Data Management > Export My Data. This will download a JSON file containing all your check-in history, health scores, and reflections. You can share this data with healthcare providers or keep it as a personal backup."
  }
]

export default function FAQ({ onBack }: FAQProps) {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Frequently Asked Questions</h1>
            <p className="text-sm text-primary-foreground/80">Common questions and answers</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Introduction */}
        <Card className="mb-6">
          <CardContent className="p-6 text-center">
            <div className="bg-primary/10 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <Question size={20} className="text-primary" />
            </div>
            <h2 className="text-lg font-semibold mb-2">How can we help?</h2>
            <p className="text-sm text-muted-foreground">
              Find answers to common questions about using Teresa Health for your daily wellness journey.
            </p>
          </CardContent>
        </Card>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqData.map((faq, index) => (
            <Card key={index} className="overflow-hidden">
              <Collapsible open={openItems.includes(index)} onOpenChange={() => toggleItem(index)}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full p-4 h-auto text-left justify-between hover:bg-accent/50"
                  >
                    <span className="font-medium text-sm pr-4">{faq.question}</span>
                    <div className={`transform transition-transform ${openItems.includes(index) ? 'rotate-180' : ''}`}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-4 pb-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Still have questions?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              If you can't find the answer you're looking for, remember that Teresa Health is designed to be intuitive and forgiving. Feel free to explore the app - you can always reset your data if needed.
            </p>
            <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
              <p className="text-sm font-medium mb-2">💡 Pro Tips:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Start with just the morning check-in to build a habit</li>
                <li>• Be honest in your responses - Teresa is here to help, not judge</li>
                <li>• Check your dashboard weekly to see patterns and insights</li>
                <li>• Use the night reflection as a moment of self-care</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Notice */}
        <Card className="mt-6 border-destructive/20 bg-destructive/5">
          <CardContent className="p-4">
            <h4 className="font-medium text-destructive mb-2">⚠️ Important Medical Notice</h4>
            <p className="text-sm text-muted-foreground">
              Teresa Health is not a substitute for professional medical care. If you're experiencing a medical emergency, call 911 immediately. For persistent health concerns, always consult with qualified healthcare providers.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}