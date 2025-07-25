import { useState } from 'react'
import { ArrowLeft, User, Bell, Shield, Download } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface SettingsProps {
  onBack: () => void
}

export default function Settings({ onBack }: SettingsProps) {
  const [userProfile, setUserProfile] = useKV('user-profile', {
    name: '',
    age: null,
    weight: null,
    email: '',
    emergencyContact: ''
  })

  const [notifications, setNotifications] = useKV('notification-settings', {
    morning: true,
    midday: true,
    night: true,
    insights: true
  })

  const [tempProfile, setTempProfile] = useState(userProfile)

  const handleSaveProfile = () => {
    setUserProfile(tempProfile)
    toast.success('Profile updated successfully')
  }

  const handleExportData = async () => {
    try {
      const [morningHistory] = await Promise.resolve([spark.kv.get('morning-history')])
      const [middayHistory] = await Promise.resolve([spark.kv.get('midday-history')])
      const [nightHistory] = await Promise.resolve([spark.kv.get('night-history')])
      
      const exportData = {
        profile: userProfile,
        morningHistory: morningHistory || [],
        middayHistory: middayHistory || [],
        nightHistory: nightHistory || [],
        exportDate: new Date().toISOString()
      }

      const dataStr = JSON.stringify(exportData, null, 2)
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
      
      const exportFileDefaultName = `teresa-health-data-${new Date().toISOString().split('T')[0]}.json`
      
      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
      
      toast.success('Data exported successfully')
    } catch (error) {
      toast.error('Failed to export data')
    }
  }

  const handleClearData = async () => {
    if (confirm('Are you sure you want to clear all your health data? This cannot be undone.')) {
      try {
        await spark.kv.delete('morning-history')
        await spark.kv.delete('midday-history')
        await spark.kv.delete('night-history')
        await spark.kv.delete('today-checkins')
        toast.success('All health data cleared')
      } catch (error) {
        toast.error('Failed to clear data')
      }
    }
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
            <h1 className="text-lg font-semibold">Settings</h1>
            <p className="text-sm text-primary-foreground/80">Manage your preferences</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={20} />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={tempProfile.name}
                  onChange={(e) => setTempProfile(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your name"
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={tempProfile.age || ''}
                  onChange={(e) => setTempProfile(prev => ({ ...prev, age: parseInt(e.target.value) || null }))}
                  placeholder="Age"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                type="email"
                value={tempProfile.email}
                onChange={(e) => setTempProfile(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <Label htmlFor="emergency">Emergency Contact (optional)</Label>
              <Input
                id="emergency"
                value={tempProfile.emergencyContact}
                onChange={(e) => setTempProfile(prev => ({ ...prev, emergencyContact: e.target.value }))}
                placeholder="Name and phone number"
              />
            </div>
            
            <Button onClick={handleSaveProfile} className="w-full">
              Save Profile
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell size={20} />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Morning Check-in Reminder</p>
                <p className="text-sm text-muted-foreground">Daily at 8:00 AM</p>
              </div>
              <Switch
                checked={notifications.morning}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, morning: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Midday Meal Reminder</p>
                <p className="text-sm text-muted-foreground">Daily at 1:00 PM</p>
              </div>
              <Switch
                checked={notifications.midday}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, midday: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Night Reflection Reminder</p>
                <p className="text-sm text-muted-foreground">Daily at 8:00 PM</p>
              </div>
              <Switch
                checked={notifications.night}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, night: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Weekly Insights</p>
                <p className="text-sm text-muted-foreground">Sunday mornings</p>
              </div>
              <Switch
                checked={notifications.insights}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, insights: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield size={20} />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              onClick={handleExportData}
              className="w-full justify-start gap-2"
            >
              <Download size={16} />
              Export My Data
            </Button>
            
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Privacy & Security</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Your health data is stored securely on your device. Teresa Health does not share your personal information with third parties.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Data is encrypted and stored locally</li>
                <li>• No data is sent to external servers without your consent</li>
                <li>• AI conversations are processed securely</li>
                <li>• You can export or delete your data anytime</li>
              </ul>
            </div>
            
            <Button
              variant="destructive"
              onClick={handleClearData}
              className="w-full"
            >
              Clear All Data
            </Button>
          </CardContent>
        </Card>

        {/* App Information */}
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="font-semibold mb-2">Teresa Health</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Your Daily Health Companion
            </p>
            <p className="text-xs text-muted-foreground">
              Version 1.0.0 • Made with ❤️ for your wellbeing
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}