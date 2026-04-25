import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GrowthRecord, HealthStatus } from '@/types'
import { mockGrowthRecords, generateId } from '@/data/mockData'
import { growthRecordStorage } from '@/utils/storage'
import dayjs from 'dayjs'

export const useGrowthRecordsStore = defineStore('growthRecords', () => {
  const storedRecords = growthRecordStorage.loadGrowthRecords()
  const records = ref<GrowthRecord[]>(
    storedRecords && storedRecords.length > 0 ? storedRecords : [...mockGrowthRecords]
  )

  const getRecordsByPlantId = (plantId: string) => {
    return records.value
      .filter(record => record.plantId === plantId)
      .sort((a, b) => {
        const dateA = dayjs(a.date)
        const dateB = dayjs(b.date)
        return dateB.isBefore(dateA) ? -1 : 1
      })
  }

  const getLatestRecordByPlantId = (plantId: string) => {
    const plantRecords = getRecordsByPlantId(plantId)
    return plantRecords.length > 0 ? plantRecords[0] : null
  }

  const saveRecords = () => {
    growthRecordStorage.saveGrowthRecords([...records.value])
  }

  const addRecord = (recordData: Omit<GrowthRecord, 'id' | 'createdAt'>) => {
    const newRecord: GrowthRecord = {
      ...recordData,
      id: generateId(),
      createdAt: dayjs().format('YYYY-MM-DD')
    }
    records.value.push(newRecord)
    saveRecords()
    return newRecord
  }

  const updateRecord = (id: string, updates: Partial<GrowthRecord>) => {
    const index = records.value.findIndex(record => record.id === id)
    if (index !== -1) {
      records.value[index] = {
        ...records.value[index],
        ...updates
      }
      saveRecords()
      return records.value[index]
    }
    return null
  }

  const deleteRecord = (id: string) => {
    const index = records.value.findIndex(record => record.id === id)
    if (index !== -1) {
      records.value.splice(index, 1)
      saveRecords()
      return true
    }
    return false
  }

  const getPlantGrowthStats = (plantId: string) => {
    const plantRecords = getRecordsByPlantId(plantId)
    if (plantRecords.length === 0) {
      return {
        totalRecords: 0,
        heightChange: 0,
        leafCountChange: 0,
        healthTrend: 'stable' as const,
        averageHealth: null as HealthStatus | null
      }
    }

    const latestRecord = plantRecords[0]
    const oldestRecord = plantRecords[plantRecords.length - 1]

    const heightChange = latestRecord.height && oldestRecord.height
      ? latestRecord.height - oldestRecord.height
      : 0

    const leafCountChange = latestRecord.leafCount && oldestRecord.leafCount
      ? latestRecord.leafCount - oldestRecord.leafCount
      : 0

    const healthValues: Record<HealthStatus, number> = {
      excellent: 4,
      good: 3,
      fair: 2,
      poor: 1
    }

    const averageHealthValue = plantRecords.reduce((sum, r) => sum + healthValues[r.health], 0) / plantRecords.length

    let averageHealth: HealthStatus = 'fair'
    if (averageHealthValue >= 3.5) averageHealth = 'excellent'
    else if (averageHealthValue >= 2.5) averageHealth = 'good'
    else if (averageHealthValue >= 1.5) averageHealth = 'fair'
    else averageHealth = 'poor'

    let healthTrend: 'improving' | 'declining' | 'stable' = 'stable'
    if (plantRecords.length >= 2) {
      const latestHealth = healthValues[latestRecord.health]
      const previousHealth = healthValues[plantRecords[1].health]
      if (latestHealth > previousHealth) healthTrend = 'improving'
      else if (latestHealth < previousHealth) healthTrend = 'declining'
    }

    return {
      totalRecords: plantRecords.length,
      heightChange,
      leafCountChange,
      healthTrend,
      averageHealth
    }
  }

  const getHealthText = (health: HealthStatus) => {
    const healthMap: Record<HealthStatus, string> = {
      excellent: '非常好',
      good: '良好',
      fair: '一般',
      poor: '较差'
    }
    return healthMap[health]
  }

  const getHealthColor = (health: HealthStatus) => {
    const colorMap: Record<HealthStatus, string> = {
      excellent: '#52c41a',
      good: '#1890ff',
      fair: '#faad14',
      poor: '#ff4d4f'
    }
    return colorMap[health]
  }

  return {
    records,
    getRecordsByPlantId,
    getLatestRecordByPlantId,
    addRecord,
    updateRecord,
    deleteRecord,
    getPlantGrowthStats,
    getHealthText,
    getHealthColor,
    saveRecords
  }
})
