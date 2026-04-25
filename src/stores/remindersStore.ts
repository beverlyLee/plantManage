import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Reminder } from '@/types'
import { mockReminders, generateId } from '@/data/mockData'
import dayjs from 'dayjs'

export const useRemindersStore = defineStore('reminders', () => {
  const reminders = ref<Reminder[]>([...mockReminders])

  const upcomingReminders = computed(() => {
    const today = dayjs()
    return reminders.value
      .filter(reminder => !reminder.isCompleted)
      .sort((a, b) => {
        const dateA = dayjs(a.scheduledDate)
        const dateB = dayjs(b.scheduledDate)
        return dateA.isBefore(dateB) ? -1 : 1
      })
  })

  const overdueReminders = computed(() => {
    const today = dayjs()
    return reminders.value.filter(reminder => {
      if (reminder.isCompleted) return false
      const scheduledDate = dayjs(reminder.scheduledDate)
      return scheduledDate.isBefore(today, 'day')
    })
  })

  const todayReminders = computed(() => {
    const today = dayjs()
    return reminders.value.filter(reminder => {
      if (reminder.isCompleted) return false
      const scheduledDate = dayjs(reminder.scheduledDate)
      return scheduledDate.isSame(today, 'day')
    })
  })

  const getReminderById = (id: string) => {
    return reminders.value.find(reminder => reminder.id === id)
  }

  const getRemindersByPlantId = (plantId: string) => {
    return reminders.value.filter(reminder => reminder.plantId === plantId)
  }

  const getActiveRemindersByPlantId = (plantId: string) => {
    return reminders.value.filter(reminder =>
      reminder.plantId === plantId && !reminder.isCompleted
    )
  }

  const addReminder = (reminderData: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt' | 'isCompleted'>) => {
    const newReminder: Reminder = {
      ...reminderData,
      id: generateId(),
      isCompleted: false,
      createdAt: dayjs().format('YYYY-MM-DD'),
      updatedAt: dayjs().format('YYYY-MM-DD')
    }
    reminders.value.push(newReminder)
    return newReminder
  }

  const updateReminder = (id: string, updates: Partial<Reminder>) => {
    const index = reminders.value.findIndex(reminder => reminder.id === id)
    if (index !== -1) {
      reminders.value[index] = {
        ...reminders.value[index],
        ...updates,
        updatedAt: dayjs().format('YYYY-MM-DD')
      }
      return reminders.value[index]
    }
    return null
  }

  const deleteReminder = (id: string) => {
    const index = reminders.value.findIndex(reminder => reminder.id === id)
    if (index !== -1) {
      reminders.value.splice(index, 1)
      return true
    }
    return false
  }

  const completeReminder = (id: string) => {
    return updateReminder(id, {
      isCompleted: true,
      completedDate: dayjs().format('YYYY-MM-DD')
    })
  }

  const getReminderPriorityClass = (reminder: Reminder) => {
    if (reminder.isCompleted) return 'normal'

    const today = dayjs()
    const scheduledDate = dayjs(reminder.scheduledDate)
    const daysUntil = scheduledDate.diff(today, 'day')

    if (daysUntil < 0) return 'urgent'
    if (daysUntil <= 1) return 'warning'
    return 'normal'
  }

  const getReminderTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      watering: '浇水',
      fertilizing: '施肥',
      pruning: '修剪',
      repotting: '换盆',
      custom: '自定义'
    }
    return typeMap[type] || type
  }

  const getPriorityText = (priority: string) => {
    const priorityMap: Record<string, string> = {
      low: '低',
      medium: '中',
      high: '高'
    }
    return priorityMap[priority] || priority
  }

  return {
    reminders,
    upcomingReminders,
    overdueReminders,
    todayReminders,
    getReminderById,
    getRemindersByPlantId,
    getActiveRemindersByPlantId,
    addReminder,
    updateReminder,
    deleteReminder,
    completeReminder,
    getReminderPriorityClass,
    getReminderTypeText,
    getPriorityText
  }
})
