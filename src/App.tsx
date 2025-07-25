import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster } from '@/components/ui/sonner'
import { LanguageProvider } from './contexts/LanguageContext'
import HomePage from './components/HomePage'
import MorningCheckIn from './components/MorningCheckIn'
import MiddayCheckIn from './components/MiddayCheckIn'
import NightCheckIn from './components/NightCheckIn'
import Dashboard from './components/Dashboard'
import Settings from './components/Settings'
import About from './components/About'
import FAQ from './components/FAQ'
import Navigation from './components/Navigation'

type Page = 'home' | 'morning' | 'midday' | 'night' | 'dashboard' | 'settings' | 'about' | 'faq'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [user] = useKV('user-profile', { name: '', age: null, weight: null })

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />
      case 'morning':
        return <MorningCheckIn onComplete={() => setCurrentPage('dashboard')} onBack={() => setCurrentPage('home')} />
      case 'midday':
        return <MiddayCheckIn onComplete={() => setCurrentPage('dashboard')} onBack={() => setCurrentPage('home')} />
      case 'night':
        return <NightCheckIn onComplete={() => setCurrentPage('dashboard')} onBack={() => setCurrentPage('home')} />
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />
      case 'settings':
        return <Settings onBack={() => setCurrentPage('home')} />
      case 'about':
        return <About onBack={() => setCurrentPage('home')} onNavigate={setCurrentPage} />
      case 'faq':
        return <FAQ onBack={() => setCurrentPage('home')} />
      default:
        return <HomePage onNavigate={setCurrentPage} />
    }
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className="pb-20">
          {renderPage()}
        </main>
        <Toaster />
      </div>
    </LanguageProvider>
  )
}

export default App