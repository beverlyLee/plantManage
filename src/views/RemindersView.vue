<template>
  <div class="reminders-view">
    <div class="stats-section">
      <a-row :gutter="[12, 12]">
        <a-col :span="8">
          <a-statistic title="今日提醒" :value="remindersStore.todayReminders.length" value-style="{ color: '#ff4d4f' }">
            <template #prefix><BellOutlined /></template>
          </a-statistic>
        </a-col>
        <a-col :span="8">
          <a-statistic title="已逾期" :value="remindersStore.overdueReminders.length" value-style="{ color: '#faad14' }">
            <template #prefix><ExclamationCircleOutlined /></template>
          </a-statistic>
        </a-col>
        <a-col :span="8">
          <a-statistic title="即将到来" :value="remindersStore.upcomingReminders.length" value-style="{ color: '#52c41a' }">
            <template #prefix><ClockCircleOutlined /></template>
          </a-statistic>
        </a-col>
      </a-row>
    </div>

    <a-tabs v-model:activeKey="activeTab">
      <a-tab-pane key="all" tab="全部">
        <div class="reminders-list">
          <div
            v-for="reminder in remindersStore.upcomingReminders"
            :key="reminder.id"
            class="reminder-item"
            :class="remindersStore.getReminderPriorityClass(reminder)"
          >
            <div class="reminder-content">
              <div class="reminder-icon" :class="reminder.type">
                <component :is="getReminderIcon(reminder.type)" />
              </div>
              <div class="reminder-info">
                <div class="reminder-title">{{ reminder.title }}</div>
                <div class="reminder-plant">
                  <EnvironmentOutlined class="plant-icon" />
                  {{ getPlantName(reminder.plantId) }}
                </div>
                <div class="reminder-time">
                  <ClockCircleOutlined class="time-icon" />
                  {{ formatDate(reminder.scheduledDate) }}
                  {{ reminder.scheduledTime || '' }}
                </div>
              </div>
            </div>
            <div class="reminder-actions">
              <a-button
                type="primary"
                size="small"
                @click="handleComplete(reminder.id)"
              >
                完成
              </a-button>
              <a-button size="small" @click="handleEdit(reminder.id)">
                编辑
              </a-button>
              <a-popconfirm
                title="确定要删除这个提醒吗？"
                @confirm="handleDelete(reminder.id)"
                ok-text="确定"
                cancel-text="取消"
              >
                <a-button size="small" danger>删除</a-button>
              </a-popconfirm>
            </div>
          </div>

          <div v-if="remindersStore.upcomingReminders.length === 0" class="empty-state">
            <div class="empty-icon">
              <BellOutlined />
            </div>
            <div class="empty-text">暂无待办提醒</div>
            <a-button type="primary" @click="navigateToAddReminder">
              添加新提醒
            </a-button>
          </div>
        </div>
      </a-tab-pane>

      <a-tab-pane key="watering" tab="浇水">
        <div class="reminders-list">
          <div
            v-for="reminder in getRemindersByType('watering')"
            :key="reminder.id"
            class="reminder-item"
            :class="remindersStore.getReminderPriorityClass(reminder)"
          >
            <div class="reminder-content">
              <div class="reminder-icon watering">
                <CloudOutlined />
              </div>
              <div class="reminder-info">
                <div class="reminder-title">{{ reminder.title }}</div>
                <div class="reminder-plant">{{ getPlantName(reminder.plantId) }}</div>
                <div class="reminder-time">{{ formatDate(reminder.scheduledDate) }}</div>
              </div>
            </div>
            <a-button type="primary" size="small" @click="handleComplete(reminder.id)">
              完成
            </a-button>
          </div>
        </div>
      </a-tab-pane>

      <a-tab-pane key="completed" tab="已完成">
        <div class="reminders-list">
          <div
            v-for="reminder in completedReminders"
            :key="reminder.id"
            class="reminder-item completed"
          >
            <div class="reminder-content">
              <div class="reminder-icon completed">
                <CheckCircleOutlined />
              </div>
              <div class="reminder-info">
                <div class="reminder-title">{{ reminder.title }}</div>
                <div class="reminder-plant">{{ getPlantName(reminder.plantId) }}</div>
                <div class="reminder-time">
                  完成于: {{ reminder.completedDate }}
                </div>
              </div>
            </div>
          </div>

          <div v-if="completedReminders.length === 0" class="empty-state">
            <div class="empty-text" style="color: #8c8c8c;">暂无已完成的提醒</div>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>

    <button class="fab" @click="navigateToAddReminder">
      <PlusOutlined />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  BellOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  CloudOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  EditOutlined
} from '@ant-design/icons-vue'
import { useRemindersStore } from '@/stores/remindersStore'
import { usePlantsStore } from '@/stores/plantsStore'
import type { Reminder } from '@/types'
import dayjs from 'dayjs'

const router = useRouter()
const remindersStore = useRemindersStore()
const plantsStore = usePlantsStore()

const activeTab = ref('all')

const completedReminders = computed(() => {
  return remindersStore.reminders.filter(r => r.isCompleted)
})

const getRemindersByType = (type: string) => {
  return remindersStore.upcomingReminders.filter(r => r.type === type)
}

const getPlantName = (plantId: string) => {
  const plant = plantsStore.getPlantById(plantId)
  return plant?.name || '未知植物'
}

const getReminderIcon = (type: string) => {
  const iconMap: Record<string, any> = {
    watering: CloudOutlined,
    fertilizing: EditOutlined,
    pruning: EditOutlined,
    repotting: EnvironmentOutlined,
    custom: BellOutlined
  }
  return iconMap[type] || BellOutlined
}

const formatDate = (date: string) => {
  const today = dayjs()
  const targetDate = dayjs(date)
  const diffDays = targetDate.diff(today, 'day')

  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '明天'
  if (diffDays === -1) return '昨天'
  if (diffDays < 0) return `${Math.abs(diffDays)}天前`
  if (diffDays < 7) return `${diffDays}天后`
  return targetDate.format('MM-DD')
}

const handleComplete = (id: string) => {
  remindersStore.completeReminder(id)
  message.success('提醒已标记为完成')
}

const handleEdit = (id: string) => {
  // 编辑功能可以后续实现
  message.info('编辑功能开发中')
}

const handleDelete = (id: string) => {
  remindersStore.deleteReminder(id)
  message.success('提醒已删除')
}

const navigateToAddReminder = () => {
  router.push('/add-reminder')
}
</script>

<style scoped>
.reminders-view {
  padding-bottom: 80px;
}

.stats-section {
  background: white;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 16px;
}

.reminders-list {
  margin-top: 16px;
}

.reminder-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: white;
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #52c41a;
}

.reminder-item.urgent {
  border-left-color: #ff4d4f;
}

.reminder-item.warning {
  border-left-color: #faad14;
}

.reminder-item.completed {
  border-left-color: #d9d9d9;
  opacity: 0.7;
}

.reminder-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.reminder-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  background: #52c41a;
}

.reminder-icon.watering {
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
}

.reminder-icon.completed {
  background: #d9d9d9;
}

.reminder-info {
  flex: 1;
}

.reminder-title {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 4px;
}

.reminder-plant {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #8c8c8c;
  margin-bottom: 2px;
}

.plant-icon,
.time-icon {
  font-size: 12px;
}

.reminder-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #52c41a;
}

.reminder-actions {
  display: flex;
  gap: 8px;
}

.empty-state {
  text-align: center;
  padding: 48px 24px;
}

.empty-icon {
  font-size: 64px;
  color: #d9d9d9;
  margin-bottom: 16px;
}

.empty-text {
  color: #8c8c8c;
  font-size: 16px;
  margin-bottom: 24px;
}

.fab {
  position: fixed;
  bottom: 80px;
  right: 16px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(82, 196, 26, 0.4);
  z-index: 99;
  border: none;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  font-size: 24px;
}

.fab:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(82, 196, 26, 0.5);
}
</style>
