import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Plant } from '@/types'
import { mockPlants, generateId, mockPlantImages } from '@/data/mockData'
import dayjs from 'dayjs'

export const usePlantsStore = defineStore('plants', () => {
  const plants = ref<Plant[]>([...mockPlants])

  const totalPlants = computed(() => plants.value.length)

  const plantsNeedingWater = computed(() => {
    const today = dayjs()
    return plants.value.filter(plant => {
      const lastWatered = dayjs(plant.lastWateredDate)
      const daysSinceWatered = today.diff(lastWatered, 'day')
      return daysSinceWatered >= plant.wateringFrequency
    })
  })

  const plantsNeedingWaterCount = computed(() => plantsNeedingWater.value.length)

  const getPlantById = (id: string) => {
    return plants.value.find(plant => plant.id === id)
  }

  const getPlantsByLocation = (location: string) => {
    return plants.value.filter(plant => plant.location === location)
  }

  const addPlant = (plantData: Omit<Plant, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPlant: Plant = {
      ...plantData,
      id: generateId(),
      image: mockPlantImages[Math.floor(Math.random() * mockPlantImages.length)],
      createdAt: dayjs().format('YYYY-MM-DD'),
      updatedAt: dayjs().format('YYYY-MM-DD')
    }
    plants.value.push(newPlant)
    return newPlant
  }

  const updatePlant = (id: string, updates: Partial<Plant>) => {
    const index = plants.value.findIndex(plant => plant.id === id)
    if (index !== -1) {
      plants.value[index] = {
        ...plants.value[index],
        ...updates,
        updatedAt: dayjs().format('YYYY-MM-DD')
      }
      return plants.value[index]
    }
    return null
  }

  const deletePlant = (id: string) => {
    const index = plants.value.findIndex(plant => plant.id === id)
    if (index !== -1) {
      plants.value.splice(index, 1)
      return true
    }
    return false
  }

  const waterPlant = (id: string) => {
    return updatePlant(id, {
      lastWateredDate: dayjs().format('YYYY-MM-DD')
    })
  }

  const searchPlants = (query: string) => {
    if (!query.trim()) return plants.value
    const lowerQuery = query.toLowerCase()
    return plants.value.filter(plant =>
      plant.name.toLowerCase().includes(lowerQuery) ||
      plant.species.toLowerCase().includes(lowerQuery) ||
      (plant.nickname && plant.nickname.toLowerCase().includes(lowerQuery))
    )
  }

  const getPlantLocations = () => {
    return [...new Set(plants.value.map(plant => plant.location))]
  }

  return {
    plants,
    totalPlants,
    plantsNeedingWater,
    plantsNeedingWaterCount,
    getPlantById,
    getPlantsByLocation,
    addPlant,
    updatePlant,
    deletePlant,
    waterPlant,
    searchPlants,
    getPlantLocations
  }
})
