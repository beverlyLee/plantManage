export interface Plant {
  id: string
  name: string
  nickname?: string
  species: string
  image?: string
  location: string
  description?: string
  purchaseDate: string
  lastWateredDate: string
  lastFertilizedDate?: string
  wateringFrequency: number
  fertilizingFrequency?: number
  lightRequirements: 'low' | 'medium' | 'high'
  humidityRequirements: 'low' | 'medium' | 'high'
  temperatureRequirements?: {
    min: number
    max: number
  }
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Reminder {
  id: string
  plantId: string
  type: 'watering' | 'fertilizing' | 'pruning' | 'repotting' | 'custom'
  title: string
  description?: string
  scheduledDate: string
  scheduledTime?: string
  isRecurring: boolean
  recurrencePattern?: string
  isCompleted: boolean
  completedDate?: string
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
}

export interface GrowthRecord {
  id: string
  plantId: string
  date: string
  height?: number
  width?: number
  leafCount?: number
  health: 'excellent' | 'good' | 'fair' | 'poor'
  notes?: string
  images?: string[]
  createdAt: string
}

export interface PlantCareTip {
  id: string
  title: string
  content: string
  category: 'watering' | 'lighting' | 'fertilizing' | 'pruning' | 'general'
  seasonal?: 'spring' | 'summer' | 'autumn' | 'winter'
}

export interface AppSettings {
  theme: 'light' | 'dark'
  notificationsEnabled: boolean
  reminderTime: string
  language: string
}

export type LightRequirements = 'low' | 'medium' | 'high'
export type HumidityRequirements = 'low' | 'medium' | 'high'
export type HealthStatus = 'excellent' | 'good' | 'fair' | 'poor'
export type ReminderType = 'watering' | 'fertilizing' | 'pruning' | 'repotting' | 'custom'
export type Priority = 'low' | 'medium' | 'high'

export interface DashboardStats {
  totalPlants: number
  plantsNeedingWater: number
  plantsNeedingAttention: number
  upcomingReminders: number
  healthyPlants: number
  strugglingPlants: number
}

export interface WateringLog {
  id: string
  plantId: string
  date: string
  amount?: string
  notes?: string
}

export interface PlantLocation {
  id: string
  name: string
  description?: string
  lightLevels: LightRequirements
  humidityLevels: HumidityRequirements
}
