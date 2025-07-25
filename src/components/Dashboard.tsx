import { useState, useEffect } from 'react'
import { ArrowLeft, TrendUp, Heart, Calendar, Target } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useKV } from '@github/spark/hooks'
import { getTodayDateString, isToday } from '@/lib/utils'
import HealthScore from './HealthScore'

interface DashboardProps {
  onNavigate: (page: string) => void
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [morningHistory] = useKV('morning-history', [])
  const [middayHistory] = useKV('midday-history', [])
  const [nightHistory] = useKV('night-history', [])
  // Get today's date
  const today = getTodayDateString()

  // Check if there are entries for today in each history - real-time check
  const hasTodayMorning = morningHistory.some((entry: any) => isToday(entry.date))
  const hasTodayMidday = middayHistory.some((entry: any) => isToday(entry.date))
  const hasTodayNight = nightHistory.some((entry: any) => isToday(entry.date))

  const getCurrentHealthScore = () => {
    const todayEntry = morningHistory.find((entry: any) => isToday(entry.date))
    return todayEntry?.healthScore || 75
  }

  const getWeeklyData = () => {
    const last7Days = morningHistory.slice(0, 7).reverse()
    return last7Days.map((entry: any, index: number) => ({
      day: new Date(entry.date).toLocaleDateString('en', { weekday: 'short' }),
      score: entry.healthScore || 75,
      date: entry.date
    }))
  }

  const getMoodTrend = () => {
    const last7Days = middayHistory.slice(0, 7)
    const moodCounts = last7Days.reduce((acc: any, entry: any) => {
      const mood = entry.mood || 'neutral'
      acc[mood] = (acc[mood] || 0) + 1
      return acc
    }, {})
    
    const topMood = Object.entries(moodCounts).sort(([,a], [,b]) => (b as number) - (a as number))[0]
    return topMood ? topMood[0] : 'neutral'
  }

  const getWeeklyInsights = () => {
    const insights = []
    
    if (morningHistory.length >= 3) {
      const recentScores = morningHistory.slice(0, 3).map((entry: any) => entry.healthScore)
      const avgScore = recentScores.reduce((a: number, b: number) => a + b, 0) / recentScores.length
      
      if (avgScore >= 80) {
        insights.push("🌟 Great job! Your health scores have been consistently high this week.")
      } else if (avgScore < 60) {
        insights.push("💙 Your recent scores suggest you might need extra self-care this week.")
      }
    }

    if (morningHistory.length >= 3) {
      const sleepHours = morningHistory.slice(0, 3).map((entry: any) => entry.sleep).filter(Boolean)
      if (sleepHours.length >= 2) {
        const avgSleep = sleepHours.reduce((a: number, b: number) => a + b, 0) / sleepHours.length
        if (avgSleep < 7) {
          insights.push("😴 You've been getting less than 7 hours of sleep. Consider an earlier bedtime.")
        }
      }
    }

    const topMood = getMoodTrend()
    if (topMood === 'happy') {
      insights.push("😊 Your mood has been positive this week - keep up whatever you're doing!")
    } else if (topMood === 'stressed') {
      insights.push("🧘 You've been feeling stressed lately. Consider some relaxation techniques.")
    }

    if (insights.length === 0) {
      insights.push("📈 Keep up with your daily check-ins to see personalized insights here.")
    }

    return insights
  }

  const getLatestQuote = () => {
    const todayEntry = nightHistory.find((entry: any) => isToday(entry.date))
    if (todayEntry?.dailyQuote) {
      return todayEntry.dailyQuote
    }
    return "Every day is a new beginning. Take a deep breath, smile, and start again."
  }

  const healthScore = getCurrentHealthScore()
  const weeklyData = getWeeklyData()
  const insights = getWeeklyInsights()
  const todayQuote = getLatestQuote()

  const completedCount = (hasTodayMorning ? 1 : 0) + 
                       (hasTodayMidday ? 1 : 0) + 
                       (hasTodayNight ? 1 : 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-6 pt-12 pb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-primary-foreground/20 p-2 rounded-full">
            <Heart size={24} weight="fill" className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Health Dashboard</h1>
            <p className="text-primary-foreground/80 text-sm">Your wellness journey</p>
          </div>
        </div>

        {/* Today's Progress */}
        <div className="bg-primary-foreground/10 rounded-xl p-4">
          <h3 className="text-primary-foreground font-medium mb-3">Today's Check-ins</h3>
          <div className="flex gap-2">
            <div className={`w-3 h-3 rounded-full ${hasTodayMorning ? 'bg-green-400' : 'bg-primary-foreground/30'}`} />
            <div className={`w-3 h-3 rounded-full ${hasTodayMidday ? 'bg-green-400' : 'bg-primary-foreground/30'}`} />
            <div className={`w-3 h-3 rounded-full ${hasTodayNight ? 'bg-green-400' : 'bg-primary-foreground/30'}`} />
          </div>
          <p className="text-primary-foreground/80 text-xs mt-2">
            {`${completedCount}/3 completed today`}
          </p>
        </div>
      </div>

      <div className="px-6 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Current Health Score */}
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-4">Current Health Score</h3>
                <HealthScore score={healthScore} size="large" />
                {morningHistory.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-4">
                    Last updated: {new Date(morningHistory[0].date).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Today's Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar size={20} />
                  Today's Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {hasTodayMorning && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-800">Morning Check-in Complete</p>
                    <p className="text-xs text-green-600">
                      Sleep: {morningHistory.find((entry: any) => isToday(entry.date))?.sleep}h • Health Score: {morningHistory.find((entry: any) => isToday(entry.date))?.healthScore}
                    </p>
                  </div>
                )}
                
                {hasTodayMidday && (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm font-medium text-orange-800">Midday Log Complete</p>
                    <p className="text-xs text-orange-600">
                      Meals: {middayHistory.find((entry: any) => isToday(entry.date))?.meals?.length || 0} • Mood: {middayHistory.find((entry: any) => isToday(entry.date))?.mood}
                    </p>
                  </div>
                )}
                
                {hasTodayNight && (
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm font-medium text-purple-800">Night Reflection Complete</p>
                    <p className="text-xs text-purple-600">
                      Stress Level: {nightHistory.find((entry: any) => isToday(entry.date))?.reflections?.stressLevel}/10
                    </p>
                  </div>
                )}

                {!hasTodayMorning && !hasTodayMidday && !hasTodayNight && (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">
                      No check-ins completed today yet. Start with your morning check-in!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Daily Quote */}
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-4">Daily Inspiration</h3>
                <p className="text-primary italic leading-relaxed">
                  "{todayQuote}"
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            {/* Health Score Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendUp size={20} />
                  Health Score Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                {weeklyData.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-7 gap-2">
                      {weeklyData.map((day, index) => (
                        <div key={index} className="text-center">
                          <p className="text-xs text-muted-foreground mb-2">{day.day}</p>
                          <div className="h-20 bg-muted rounded flex items-end justify-center">
                            <div
                              className="bg-primary rounded-t w-6 min-h-2"
                              style={{ height: `${(day.score / 100) * 80}%` }}
                            />
                          </div>
                          <p className="text-xs font-medium mt-1">{day.score}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Complete a few morning check-ins to see your health score trend.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Mood Pattern */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Mood Pattern</CardTitle>
              </CardHeader>
              <CardContent>
                {middayHistory.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm">
                      Most common mood this week: <span className="font-medium capitalize">{getMoodTrend()}</span>
                    </p>
                    <div className="grid grid-cols-7 gap-1">
                      {middayHistory.slice(0, 7).reverse().map((entry: any, index: number) => {
                        const moodEmojis: Record<string, string> = {
                          happy: '😊',
                          calm: '😌',
                          neutral: '😐',
                          worried: '😟',
                          stressed: '😫',
                          sad: '😢'
                        }
                        return (
                          <div key={index} className="text-center p-2 bg-muted rounded">
                            <span className="text-lg">{moodEmojis[entry.mood] || '😐'}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Complete some midday check-ins to see your mood patterns.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Vitals Tracking */}
            <Card>
              <CardHeader>
                <CardTitle>Vitals Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                {morningHistory.some((entry: any) => entry.bloodPressure || entry.bloodSugar || entry.weight) ? (
                  <div className="space-y-4">
                    {/* Weight */}
                    {morningHistory.some((entry: any) => entry.weight) && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Weight</h4>
                        <div className="space-y-1">
                          {morningHistory.slice(0, 7).reverse().map((entry: any, index: number) => 
                            entry.weight && (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{new Date(entry.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
                                <span className="font-medium">{entry.weight} lbs</span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Blood Pressure */}
                    {morningHistory.some((entry: any) => entry.bloodPressure) && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Blood Pressure</h4>
                        <div className="space-y-1">
                          {morningHistory.slice(0, 7).reverse().map((entry: any, index: number) => 
                            entry.bloodPressure && (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{new Date(entry.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
                                <span className="font-medium">{entry.bloodPressure}</span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Blood Sugar */}
                    {morningHistory.some((entry: any) => entry.bloodSugar) && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Blood Sugar</h4>
                        <div className="space-y-1">
                          {morningHistory.slice(0, 7).reverse().map((entry: any, index: number) => 
                            entry.bloodSugar && (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{new Date(entry.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
                                <span className="font-medium">{entry.bloodSugar} mg/dL</span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Record vitals in your morning check-ins to track trends here.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target size={20} />
                  Weekly Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {insights.map((insight, index) => (
                  <div key={index} className="p-3 bg-accent/5 border border-accent/20 rounded-lg">
                    <p className="text-sm text-accent-foreground">{insight}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {!hasTodayMorning ? (
                  <Button
                    variant="outline"
                    onClick={() => onNavigate('morning')}
                    className="w-full justify-start"
                  >
                    Complete Morning Check-in
                  </Button>
                ) : null}
                
                {!hasTodayMidday ? (
                  <Button
                    variant="outline"
                    onClick={() => onNavigate('midday')}
                    className="w-full justify-start"
                  >
                    Log Midday Meals & Mood
                  </Button>
                ) : null}
                
                {!hasTodayNight ? (
                  <Button
                    variant="outline"
                    onClick={() => onNavigate('night')}
                    className="w-full justify-start"
                  >
                    Complete Night Reflection
                  </Button>
                ) : null}

                {healthScore < 70 && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      💡 Your health score could use some attention. Consider focusing on better sleep and stress management.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}