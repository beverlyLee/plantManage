<template>
  <div class="plant-detail-view" v-if="plant">
    <div class="plant-header">
      <img :src="plant.image" :alt="plant.name" class="plant-image" />
      <div class="plant-info-overlay">
        <h1 class="plant-name">{{ plant.nickname || plant.name }}</h1>
        <div class="plant-species">{{ plant.species }}</div>
      </div>
    </div>

    <div class="quick-actions">
      <a-button
        type="primary"
        size="large"
        @click="handleQuickWater"
        :loading="wateringLoading"
      >
        <CloudOutlined /> 浇水
      </a-button>
      <a-button size="large" @click="navigateToAddGrowth">
        <RiseOutlined /> 记录生长
      </a-button>
      <a-button size="large" @click="navigateToAddReminder">
        <BellOutlined /> 加提醒
      </a-button>
    </div>

    <a-tabs v-model:activeKey="activeTab">
      <a-tab-pane key="info" tab="详情">
        <a-card class="detail-card">
          <a-list>
            <a-list-item>
              <template #prefix><EnvironmentOutlined class="list-icon" /></template>
              <a-list-item-meta title="摆放位置" :description="plant.location" />
            </a-list-item>
            <a-list-item>
              <template #prefix><CalendarOutlined class="list-icon" /></template>
              <a-list-item-meta title="购买日期" :description="plant.purchaseDate" />
            </a-list-item>
            <a-list-item>
              <template #prefix><CloudOutlined class="list-icon" /></template>
              <a-list-item-meta
                title="浇水频率"
                :description="`每${plant.wateringFrequency}天浇一次水`"
              />
            </a-list-item>
            <a-list-item>
              <template #prefix><ClockCircleOutlined class="list-icon" /></template>
              <a-list-item-meta
                title="上次浇水"
                :description="`${daysSinceWatered}天前`"
              />
            </a-list-item>
            <a-list-item>
              <template #prefix><BulbOutlined class="list-icon" /></template>
              <a-list-item-meta
                title="光照需求"
                :description="getLightText(plant.lightRequirements)"
              />
            </a-list-item>
            <a-list-item>
              <template #prefix><ThunderboltOutlined class="list-icon" /></template>
              <a-list-item-meta
                title="湿度需求"
                :description="getHumidityText(plant.humidityRequirements)"
              />
            </a-list-item>
          </a-list>
        </a-card>

        <a-card class="detail-card" v-if="plant.description">
          <template #title>描述</template>
          <p class="plant-description">{{ plant.description }}</p>
        </a-card>

        <a-card class="detail-card" v-if="plant.notes">
          <template #title>养护笔记</template>
          <p class="plant-notes">{{ plant.notes }}</p>
        </a-card>
      </a-tab-pane>

      <a-tab-pane key="reminders" tab="提醒">
        <div class="reminders-section">
          <div
            v-for="reminder in activeReminders"
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
                <div class="reminder-time">{{ formatDate(reminder.scheduledDate) }}</div>
              </div>
            </div>
            <a-button
              type="primary"
              size="small"
              @click="remindersStore.completeReminder(reminder.id)"
            >
              完成
            </a-button>
          </div>

          <div v-if="activeReminders.length === 0" class="empty-state">
            <div class="empty-icon"><BellOutlined /></div>
            <div class="empty-text">暂无待办提醒</div>
            <a-button type="primary" @click="navigateToAddReminder">
              添加提醒
            </a-button>
          </div>
        </div>
      </a-tab-pane>

      <a-tab-pane key="growth" tab="生长记录">
        <div class="growth-section">
          <div v-if="growthStats" class="growth-stats">
            <a-row :gutter="[12, 12]">
              <a-col :span="8">
                <a-card class="stat-card">
                  <div class="stat-value">{{ growthStats.totalRecords }}</div>
                  <div class="stat-label">记录次数</div>
                </a-card>
              </a-col>
              <a-col :span="8">
                <a-card class="stat-card">
                  <div class="stat-value" v-if="growthStats.heightChange !== 0">
                    {{ growthStats.heightChange > 0 ? '+' : '' }}{{ growthStats.heightChange }}cm
                  </div>
                  <div v-else class="stat-value">-</div>
                  <div class="stat-label">高度变化</div>
                </a-card>
              </a-col>
              <a-col :span="8">
                <a-card class="stat-card">
                  <div class="stat-value" :style="{ color: growthRecordsStore.getHealthColor(growthStats.averageHealth || 'fair') }">
                    {{ growthRecordsStore.getHealthText(growthStats.averageHealth || 'fair') }}
                  </div>
                  <div class="stat-label">健康状况</div>
                </a-card>
              </a-col>
            </a-row>
          </div>

          <div class="growth-records">
            <div
              v-for="record in plantGrowthRecords"
              :key="record.id"
              class="growth-record-item"
            >
              <div class="record-date">{{ record.date }}</div>
              <div class="record-content">
                <div class="record-header">
                  <a-tag :color="growthRecordsStore.getHealthColor(record.health)">
                    {{ growthRecordsStore.getHealthText(record.health) }}
                  </a-tag>
                </div>
                <div class="record-stats" v-if="record.height || record.leafCount">
                  <span v-if="record.height">高度: {{ record.height }}cm</span>
                  <span v-if="record.leafCount">叶片: {{ record.leafCount }}片</span>
                </div>
                <div class="record-notes" v-if="record.notes">
                  {{ record.notes }}
                </div>
              </div>
            </div>
          </div>

          <div v-if="plantGrowthRecords.length === 0" class="empty-state">
            <div class="empty-icon"><RiseOutlined /></div>
            <div class="empty-text">暂无生长记录</div>
            <a-button type="primary" @click="navigateToAddGrowth">
              添加记录
            </a-button>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>

  <div v-else class="not-found">
    <div class="empty-icon"><EnvironmentOutlined /></div>
    <div class="empty-text">植物不存在</div>
    <a-button type="primary" @click="router.push('/')">返回首页</a-button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  CloudOutlined,
  RiseOutlined,
  BellOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  BulbOutlined,
  ThunderboltOutlined,
  EditOutlined
} from '@ant-design/icons-vue'
import { usePlantsStore } from '@/stores/plantsStore'
import { useRemindersStore } from '@/stores/remindersStore'
import { useGrowthRecordsStore } from '@/stores/growthRecordsStore'
import type { Plant } from '@/types'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const plantsStore = usePlantsStore()
const remindersStore = useRemindersStore()
const growthRecordsStore = useGrowthRecordsStore()

const activeTab = ref('info')
const wateringLoading = ref(false)

const plantId = computed(() => route.params.id as string)
const plant = computed(() => plantsStore.getPlantById(plantId.value))

const daysSinceWatered = computed(() => {
  if (!plant.value) return 0
  const today = dayjs()
  const lastWatered = dayjs(plant.value.lastWateredDate)
  return today.diff(lastWatered, 'day')
})

const activeReminders = computed(() => {
  if (!plant.value) return []
  return remindersStore.getActiveRemindersByPlantId(plant.value.id)
})

const plantGrowthRecords = computed(() => {
  if (!plant.value) return []
  return growthRecordsStore.getRecordsByPlantId(plant.value.id)
})

const growthStats = computed(() => {
  if (!plant.value) return null
  return growthRecordsStore.getPlantGrowthStats(plant.value.id)
})

const getLightText = (light: Plant['lightRequirements']) => {
  const map: Record<string, string> = {
    low: '低光照',
    medium: '中等光照',
    high: '高光照'
  }
  return map[light] || light
}

const getHumidityText = (humidity: Plant['humidityRequirements']) => {
  const map: Record<string, string> = {
    low: '低湿度',
    medium: '中等湿度',
    high: '高湿度'
  }
  return map[humidity] || humidity
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

const handleQuickWater = () => {
  if (!plant.value) return
  wateringLoading.value = true
  plantsStore.waterPlant(plant.value.id)
  setTimeout(() => {
    wateringLoading.value = false
    message.success(`已记录给${plant.value?.name}浇水`)
  }, 500)
}

const navigateToAddGrowth = () => {
  if (plant.value) {
    router.push(`/add-growth/${plant.value.id}`)
  }
}

const navigateToAddReminder = () => {
  if (plant.value) {
    router.push(`/add-reminder/${plant.value.id}`)
  }
}
</script>

<style scoped>
.plant-detail-view {
  margin: -16px -16px 0 -16px;
  padding-bottom: 80px;
}

.plant-header {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.plant-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.plant-info-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 24px 16px 16px;
  color: white;
}

.plant-name {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 4px;
}

.plant-species {
  font-size: 14px;
  opacity: 0.8;
}

.quick-actions {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: white;
}

.quick-actions .ant-btn {
  flex: 1;
}

.detail-card {
  margin: 16px;
  border-radius: 12px;
}

.list-icon {
  font-size: 18px;
  color: #52c41a;
}

.plant-description,
.plant-notes {
  font-size: 14px;
  color: #595959;
  line-height: 1.6;
  margin: 0;
}

.reminders-section,
.growth-section {
  padding: 16px;
}

.reminder-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: white;
  border-radius: 12px;
  margin-bottom: 12px;
  border-left: 4px solid #52c41a;
}

.reminder-item.urgent {
  border-left-color: #ff4d4f;
}

.reminder-item.warning {
  border-left-color: #faad14;
}

.reminder-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reminder-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: #52c41a;
}

.reminder-icon.watering {
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
}

.reminder-title {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 2px;
}

.reminder-time {
  font-size: 12px;
  color: #8c8c8c;
}

.growth-stats {
  margin-bottom: 16px;
}

.stat-card {
  text-align: center;
  border-radius: 12px;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #262626;
}

.stat-label {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 4px;
}

.growth-record-item {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}

.record-date {
  font-size: 12px;
  color: #8c8c8c;
  margin-bottom: 8px;
}

.record-header {
  margin-bottom: 8px;
}

.record-stats {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #595959;
  margin-bottom: 8px;
}

.record-notes {
  font-size: 13px;
  color: #8c8c8c;
  line-height: 1.5;
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

.not-found {
  text-align: center;
  padding: 64px 24px;
}
</style>
