import { Heart, Sun, Moon, Bowl } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useKV } from '@github/spark/hooks'

interface HomePageProps {
  onNavigate: (page: string) => void
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [todayData] = useKV('today-checkins', {
    morning: false,
    midday: false,
    night: false,
    date: new Date().toDateString()
  })

  const currentDate = new Date().toDateString()
  const isToday = todayData.date === currentDate

  const checkInButtons = [
    {
      id: 'morning',
      icon: Sun,
      title: 'Morning Check-In',
      subtitle: 'Start your day with a wellness check',
      completed: isToday && todayData.morning,
      color: 'bg-yellow-50 border-yellow-200 text-yellow-800'
    },
    {
      id: 'midday', 
      icon: Bowl,
      title: 'Midday Log',
      subtitle: 'Record your meals and mood',
      completed: isToday && todayData.midday,
      color: 'bg-orange-50 border-orange-200 text-orange-800'
    },
    {
      id: 'night',
      icon: Moon,
      title: 'Night Reflection',
      subtitle: 'Reflect on your day with AI support',
      completed: isToday && todayData.night,
      color: 'bg-purple-50 border-purple-200 text-purple-800'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-6 pt-12 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary-foreground/20 p-2 rounded-full">
            <Heart size={24} weight="fill" className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Teresa Health</h1>
            <p className="text-primary-foreground/80 text-sm">Your health, your habits</p>
          </div>
        </div>
        
        <div className="bg-primary-foreground/10 rounded-xl p-4">
          <p className="text-primary-foreground/90 text-sm mb-2">Welcome back!</p>
          <p className="text-primary-foreground font-medium">
            How are you feeling today? Let's check in together.
          </p>
        </div>
      </div>

      {/* Check-in Cards */}
      <div className="px-6 py-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground mb-4">Daily Check-ins</h2>
        
        {checkInButtons.map((checkIn) => {
          const Icon = checkIn.icon
          
          return (
            <Card key={checkIn.id} className="overflow-hidden">
              <CardContent className="p-0">
                <Button
                  variant="ghost"
                  onClick={() => onNavigate(checkIn.id)}
                  className="w-full h-auto p-4 justify-start text-left hover:bg-accent/50"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${checkIn.color}`}>
                      <Icon size={24} weight="fill" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground">{checkIn.title}</h3>
                        {checkIn.completed && (
                          <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Completed
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{checkIn.subtitle}</p>
                    </div>
                  </div>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-4">
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => onNavigate('dashboard')}
            className="h-auto py-4 flex flex-col gap-2"
          >
            <span className="font-medium">View Progress</span>
            <span className="text-xs text-muted-foreground">See your health trends</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => onNavigate('about')}
            className="h-auto py-4 flex flex-col gap-2"
          >
            <span className="font-medium">Learn More</span>
            <span className="text-xs text-muted-foreground">About Teresa Health</span>
          </Button>
        </div>
      </div>
    </div>
  )
}