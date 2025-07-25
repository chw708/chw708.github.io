import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to get today's date string consistently across the app
export function getTodayDateString(): string {
  return new Date().toDateString()
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
