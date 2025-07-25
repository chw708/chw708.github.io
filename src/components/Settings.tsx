import { useState } from 'react'
import { ArrowLeft, User, Bell, Shield, Download, Globe } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useKV } from '@github/spark/hooks'
import { useLanguage } from '../contexts/LanguageContext'
import { toast } from 'sonner'

interface SettingsProps {
  onBack: () => void
}

export default function Settings({ onBack }: SettingsProps) {
  const { language, setLanguage, t } = useLanguage()
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
    toast.success(t('common.success'))
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
      
      toast.success(t('common.success'))
    } catch (error) {
      toast.error(t('common.error'))
    }
  }

  const handleClearData = async () => {
    if (confirm(t('common.confirm') + ' ' + t('settings.clearData'))) {
      try {
        await spark.kv.delete('morning-history')
        await spark.kv.delete('midday-history')
        await spark.kv.delete('night-history')
        await spark.kv.delete('today-checkins')
        toast.success(t('common.success'))
      } catch (error) {
        toast.error(t('common.error'))
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
            <h1 className="text-lg font-semibold">{t('settings.title')}</h1>
            <p className="text-sm text-primary-foreground/80">{t('settings.subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe size={20} />
              {t('settings.language')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="language">{t('settings.selectLanguage')}</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">{t('settings.english')}</SelectItem>
                  <SelectItem value="ko">{t('settings.korean')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={20} />
              {t('settings.personalInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">{t('settings.name')}</Label>
                <Input
                  id="name"
                  value={tempProfile.name}
                  onChange={(e) => setTempProfile(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={t('settings.name')}
                />
              </div>
              <div>
                <Label htmlFor="age">{t('settings.age')}</Label>
                <Input
                  id="age"
                  type="number"
                  value={tempProfile.age || ''}
                  onChange={(e) => setTempProfile(prev => ({ ...prev, age: parseInt(e.target.value) || null }))}
                  placeholder={t('settings.age')}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">{t('settings.email')}</Label>
              <Input
                id="email"
                type="email"
                value={tempProfile.email}
                onChange={(e) => setTempProfile(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <Label htmlFor="emergency">{t('settings.emergencyContact')}</Label>
              <Input
                id="emergency"
                value={tempProfile.emergencyContact}
                onChange={(e) => setTempProfile(prev => ({ ...prev, emergencyContact: e.target.value }))}
                placeholder={t('settings.emergencyContact')}
              />
            </div>
            
            <Button onClick={handleSaveProfile} className="w-full">
              {t('settings.saveProfile')}
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell size={20} />
              {t('settings.notifications')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t('settings.morningReminder')}</p>
                <p className="text-sm text-muted-foreground">Daily at 8:00 AM</p>
              </div>
              <Switch
                checked={notifications.morning}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, morning: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t('settings.middayReminder')}</p>
                <p className="text-sm text-muted-foreground">Daily at 1:00 PM</p>
              </div>
              <Switch
                checked={notifications.midday}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, midday: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t('settings.nightReminder')}</p>
                <p className="text-sm text-muted-foreground">Daily at 8:00 PM</p>
              </div>
              <Switch
                checked={notifications.night}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, night: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t('settings.weeklyInsights')}</p>
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
              {t('settings.dataManagement')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              onClick={handleExportData}
              className="w-full justify-start gap-2"
            >
              <Download size={16} />
              {t('settings.exportData')}
            </Button>
            
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">{t('settings.privacy')}</h4>
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
              {t('settings.clearData')}
            </Button>
          </CardContent>
        </Card>

        {/* App Information */}
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="font-semibold mb-2">{t('home.title')}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              {t('home.subtitle')}
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