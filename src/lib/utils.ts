import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to get today's date string consistently across the app
export function getTodayDateString(): string {
  const today = new Date()
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
}

// Utility function to check if a date is today
export function isToday(dateString: string): boolean {
  const today = getTodayDateString()
  
  // If dateString is already in YYYY-MM-DD format, compare directly
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return today === dateString
  }
  
  // Handle other date formats by converting to YYYY-MM-DD
  const checkDate = new Date(dateString)
  const checkDateFormatted = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`
  return today === checkDateFormatted
}

// Utility function to check if check-ins have been reset for the current day
export function shouldResetDailyCheckins(checkinDate: string): boolean {
  return checkinDate !== getTodayDateString()
}

// Utility function to get a fresh daily checkins object
export function getEmptyDailyCheckins() {
  return {
    morning: false,
    midday: false,
    night: false,
    date: getTodayDateString()
  }
}
