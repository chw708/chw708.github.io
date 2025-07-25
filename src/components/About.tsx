import { ArrowLeft, Heart, Target, Users, Sparkle, Question } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AboutProps {
  onBack: () => void
  onNavigate?: (page: string) => void
}

export default function About({ onBack, onNavigate }: AboutProps) {
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
            <h1 className="text-lg font-semibold">About Teresa Health</h1>
            <p className="text-sm text-primary-foreground/80">Our mission and story</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Hero Section */}
        <Card>
          <CardContent className="p-6 text-center">
            <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Heart size={24} weight="fill" className="text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">Teresa Health</h2>
            <p className="text-muted-foreground italic mb-4">Your health, your habits</p>
            <p className="text-sm leading-relaxed">
              A personalized daily health assistant designed to help you track both your physical and mental health through compassionate, AI-powered guidance.
            </p>
          </CardContent>
        </Card>

        {/* Mission */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target size={20} />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              To empower individuals, especially the elderly and people in underserved areas, to take control of their health journey through simple, daily check-ins that provide meaningful insights and emotional support.
            </p>
          </CardContent>
        </Card>

        {/* Who We Serve */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={20} />
              Who We Serve
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
              <h4 className="font-medium mb-2">🧓 Seniors & Elderly</h4>
              <p className="text-sm text-muted-foreground">
                Easy-to-use interface with large buttons and clear instructions for tracking daily health metrics and staying connected with their wellbeing.
              </p>
            </div>
            
            <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
              <h4 className="font-medium mb-2">🏥 Underserved Communities</h4>
              <p className="text-sm text-muted-foreground">
                Providing basic health tracking and AI-powered insights to those who may not have regular access to healthcare professionals.
              </p>
            </div>
            
            <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
              <h4 className="font-medium mb-2">❤️ Anyone Prioritizing Wellness</h4>
              <p className="text-sm text-muted-foreground">
                A gentle, supportive companion for anyone looking to build healthy habits and gain insights into their daily health patterns.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkle size={20} />
              How Teresa Health Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="bg-yellow-100 text-yellow-800 p-2 rounded-full flex-shrink-0">
                <span className="text-sm font-bold">1</span>
              </div>
              <div>
                <h4 className="font-medium">Morning Check-In</h4>
                <p className="text-sm text-muted-foreground">
                  Start your day by logging sleep, weight, energy levels, and any physical symptoms. Get a personalized health score and advice.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-orange-100 text-orange-800 p-2 rounded-full flex-shrink-0">
                <span className="text-sm font-bold">2</span>
              </div>
              <div>
                <h4 className="font-medium">Midday Logging</h4>
                <p className="text-sm text-muted-foreground">
                  Record your meals, mood, and any symptoms that develop throughout the day to build a complete daily picture.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-purple-100 text-purple-800 p-2 rounded-full flex-shrink-0">
                <span className="text-sm font-bold">3</span>
              </div>
              <div>
                <h4 className="font-medium">Night Reflection</h4>
                <p className="text-sm text-muted-foreground">
                  End your day with guided reflection questions and receive emotional support from our AI companion, Teresa.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-green-100 text-green-800 p-2 rounded-full flex-shrink-0">
                <span className="text-sm font-bold">4</span>
              </div>
              <div>
                <h4 className="font-medium">Insights & Trends</h4>
                <p className="text-sm text-muted-foreground">
                  View your health dashboard to see patterns, trends, and receive personalized recommendations for improvement.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle>Privacy & Security</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  All your health data is stored securely on your device - we never sell or share your personal information.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  AI conversations are processed securely to provide emotional support while protecting your privacy.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  You have full control over your data - export it anytime or delete it completely if you choose.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card>
          <CardHeader>
            <CardTitle>Get Support</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Teresa Health is designed to complement, not replace, professional medical care. Always consult with healthcare providers for medical concerns.
            </p>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Emergency:</span> If you're experiencing a medical emergency, call 911 immediately.
              </p>
              <p className="text-sm">
                <span className="font-medium">Questions:</span> Check out our FAQ section for common questions and answers.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Link */}
        <Button 
          onClick={() => onNavigate?.('faq')} 
          variant="outline" 
          className="w-full gap-2"
        >
          <Question size={16} />
          View Frequently Asked Questions
        </Button>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground">
            Teresa Health v1.0.0
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Made with love for your wellbeing 💚
          </p>
        </div>
      </div>
    </div>
  )
}