import { Heart, House, ChartLine, Settings, Info, Question } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '../contexts/LanguageContext'

interface NavigationProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const { t } = useLanguage()
  
  const navItems = [
    { id: 'home', icon: House, label: t('navigation.home') },
    { id: 'dashboard', icon: ChartLine, label: t('navigation.dashboard') },
    { id: 'about', icon: Info, label: t('navigation.about') },
    { id: 'settings', icon: Settings, label: t('navigation.settings') },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 py-2 px-3 h-auto ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon size={20} weight={isActive ? 'fill' : 'regular'} />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          )
        })}
      </div>
    </nav>
  )
}