import { useState, useEffect } from 'react'
import { ArrowLeft, Camera, Plus, X } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useKV } from '@github/spark/hooks'
import { getTodayDateString, isToday } from '@/lib/utils'

interface MiddayCheckInProps {
  onComplete: () => void
  onBack: () => void
}

interface MiddayData {
  meals: Array<{
    name: string
    description: string
    time: string
  }>
  symptoms: string
  mood: string
}

const moodEmojis = [
  { emoji: '😊', label: 'Happy', value: 'happy' },
  { emoji: '😌', label: 'Calm', value: 'calm' },
  { emoji: '😐', label: 'Neutral', value: 'neutral' },
  { emoji: '😟', label: 'Worried', value: 'worried' },
  { emoji: '😫', label: 'Stressed', value: 'stressed' },
  { emoji: '😢', label: 'Sad', value: 'sad' },
]

export default function MiddayCheckIn({ onComplete, onBack }: MiddayCheckInProps) {
  const [middayHistory, setMiddayHistory] = useKV('midday-history', [])

  // Get today's date  
  const today = getTodayDateString()
  
  const [existingEntry] = middayHistory.filter((entry: any) => isToday(entry.date))

  // Initialize with existing data if available
  const [data, setData] = useState<MiddayData>(() => {
    if (existingEntry) {
      return {
        meals: existingEntry.meals || [],
        symptoms: existingEntry.symptoms || '',
        mood: existingEntry.mood || ''
      }
    }
    return {
      meals: [],
      symptoms: '',
      mood: ''
    }
  })

  const [newMeal, setNewMeal] = useState({ name: '', description: '' })
  const [showMealForm, setShowMealForm] = useState(false)

  const addMeal = () => {
    if (newMeal.name.trim()) {
      const meal = {
        ...newMeal,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setData(prev => ({
        ...prev,
        meals: [...prev.meals, meal]
      }))
      setNewMeal({ name: '', description: '' })
      setShowMealForm(false)
    }
  }

  const removeMeal = (index: number) => {
    setData(prev => ({
      ...prev,
      meals: prev.meals.filter((_, i) => i !== index)
    }))
  }

  const handleComplete = () => {
    const newEntry = {
      date: new Date().toISOString(),
      ...data
    }
    
    // Remove any existing entry for today and add the new one
    setMiddayHistory((prev: any[]) => {
      const filteredHistory = prev.filter((entry: any) => !isToday(entry.date))
      return [newEntry, ...filteredHistory]
    })
    
    onComplete()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-orange-500 text-white px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Midday Check-In</h1>
            <p className="text-sm text-white/80">Log your meals and current mood</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Meals Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Today's Meals</span>
              <Button
                size="sm"
                onClick={() => setShowMealForm(true)}
                className="gap-2"
              >
                <Plus size={16} />
                Add Meal
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.meals.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No meals logged yet. Tap "Add Meal" to get started.
              </p>
            ) : (
              <div className="space-y-3">
                {data.meals.map((meal, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{meal.name}</h4>
                      {meal.description && (
                        <p className="text-sm text-muted-foreground">{meal.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground">{meal.time}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMeal(index)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            {showMealForm && (
              <Card className="border-dashed">
                <CardContent className="p-4 space-y-3">
                  <div>
                    <Label htmlFor="meal-name">Meal Name *</Label>
                    <Input
                      id="meal-name"
                      value={newMeal.name}
                      onChange={(e) => setNewMeal(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Breakfast, Lunch, Snack"
                    />
                  </div>
                  <div>
                    <Label htmlFor="meal-description">Description (optional)</Label>
                    <Textarea
                      id="meal-description"
                      value={newMeal.description}
                      onChange={(e) => setNewMeal(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="What did you eat? How did it make you feel?"
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addMeal} disabled={!newMeal.name.trim()}>
                      Add Meal
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowMealForm(false)
                        setNewMeal({ name: '', description: '' })
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Symptoms Section */}
        <Card>
          <CardHeader>
            <CardTitle>Any Unusual Symptoms?</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={data.symptoms}
              onChange={(e) => setData(prev => ({ ...prev, symptoms: e.target.value }))}
              placeholder="Any new aches, pains, or changes you've noticed since this morning? (optional)"
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Mood Section */}
        <Card>
          <CardHeader>
            <CardTitle>How are you feeling right now?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {moodEmojis.map((mood) => (
                <Button
                  key={mood.value}
                  variant={data.mood === mood.value ? "default" : "outline"}
                  onClick={() => setData(prev => ({ ...prev, mood: mood.value }))}
                  className="h-auto py-4 flex flex-col gap-2"
                >
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className="text-sm">{mood.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Complete Button */}
      <div className="fixed bottom-20 left-0 right-0 px-6 py-4 bg-background border-t">
        <Button
          onClick={handleComplete}
          disabled={data.meals.length === 0 && !data.mood}
          className="w-full"
        >
          Complete Midday Check-In
        </Button>
      </div>
    </div>
  )
}