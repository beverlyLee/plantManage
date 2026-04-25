import type { Plant, Reminder, GrowthRecord } from '@/types'

const STORAGE_KEYS = {
  PLANTS: 'plant-manage-plants',
  REMINDERS: 'plant-manage-reminders',
  GROWTH_RECORDS: 'plant-manage-growth-records',
  IS_INITIALIZED: 'plant-manage-initialized'
}

const isBrowser = typeof window !== 'undefined'

const saveToStorage = <T>(key: string, data: T): void => {
  if (!isBrowser) return
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Failed to save to localStorage (${key}):`, error)
  }
}

const loadFromStorage = <T>(key: string): T | null => {
  if (!isBrowser) return null
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) as T : null
  } catch (error) {
    console.error(`Failed to load from localStorage (${key}):`, error)
    return null
  }
}

const removeFromStorage = (key: string): void => {
  if (!isBrowser) return
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Failed to remove from localStorage (${key}):`, error)
  }
}

export const plantStorage = {
  savePlants: (plants: Plant[]): void => {
    saveToStorage(STORAGE_KEYS.PLANTS, plants)
  },

  loadPlants: (): Plant[] | null => {
    return loadFromStorage<Plant[]>(STORAGE_KEYS.PLANTS)
  },

  clearPlants: (): void => {
    removeFromStorage(STORAGE_KEYS.PLANTS)
  }
}

export const reminderStorage = {
  saveReminders: (reminders: Reminder[]): void => {
    saveToStorage(STORAGE_KEYS.REMINDERS, reminders)
  },

  loadReminders: (): Reminder[] | null => {
    return loadFromStorage<Reminder[]>(STORAGE_KEYS.REMINDERS)
  },

  clearReminders: (): void => {
    removeFromStorage(STORAGE_KEYS.REMINDERS)
  }
}

export const growthRecordStorage = {
  saveGrowthRecords: (records: GrowthRecord[]): void => {
    saveToStorage(STORAGE_KEYS.GROWTH_RECORDS, records)
  },

  loadGrowthRecords: (): GrowthRecord[] | null => {
    return loadFromStorage<GrowthRecord[]>(STORAGE_KEYS.GROWTH_RECORDS)
  },

  clearGrowthRecords: (): void => {
    removeFromStorage(STORAGE_KEYS.GROWTH_RECORDS)
  }
}

export const isInitialized = (): boolean => {
  if (!isBrowser) return false
  return localStorage.getItem(STORAGE_KEYS.IS_INITIALIZED) === 'true'
}

export const markInitialized = (): void => {
  if (!isBrowser) return
  localStorage.setItem(STORAGE_KEYS.IS_INITIALIZED, 'true')
}

export const clearAllStorage = (): void => {
  removeFromStorage(STORAGE_KEYS.PLANTS)
  removeFromStorage(STORAGE_KEYS.REMINDERS)
  removeFromStorage(STORAGE_KEYS.GROWTH_RECORDS)
  removeFromStorage(STORAGE_KEYS.IS_INITIALIZED)
}
