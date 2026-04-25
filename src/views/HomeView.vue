<template>
  <div class="home-view">
    <div class="search-section">
      <a-input-search
        v-model:value="searchQuery"
        placeholder="搜索植物..."
        allow-clear
        @search="handleSearch"
        @change="handleSearch"
      />
    </div>

    <div class="stats-cards">
      <a-row :gutter="[16, 16]">
        <a-col :span="12">
          <a-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon total">
                <EnvironmentOutlined />
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ plantsStore.totalPlants }}</div>
                <div class="stat-label">总植物数</div>
              </div>
            </div>
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card class="stat-card" @click="navigateToReminders">
            <div class="stat-content">
              <div class="stat-icon need-water">
                <CloudOutlined />
              </div>
              <div class="stat-info">
                <div class="stat-value need-water">{{ plantsStore.plantsNeedingWaterCount }}</div>
                <div class="stat-label">需要浇水</div>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <div class="plants-section">
      <div class="section-header">
        <h2 class="section-title">我的植物</h2>
        <a-button type="link" @click="navigateToAddPlant">
          <PlusOutlined /> 添加
        </a-button>
      </div>

      <div v-if="filteredPlants.length === 0" class="empty-state">
        <div class="empty-icon">
          <EnvironmentOutlined />
        </div>
        <div class="empty-text">
          {{ searchQuery ? '没有找到匹配的植物' : '还没有添加任何植物' }}
        </div>
        <a-button type="primary" @click="navigateToAddPlant">
          添加第一株植物
        </a-button>
      </div>

      <div v-else class="plants-grid">
        <a-row :gutter="[16, 16]">
          <a-col :span="12" v-for="plant in filteredPlants" :key="plant.id">
            <a-card
              class="plant-card"
              hoverable
              @click="navigateToPlantDetail(plant.id)"
            >
              <div class="plant-image">
                <img :src="plant.image" :alt="plant.name" />
                <div
                  class="water-badge"
                  :class="{ urgent: isPlantNeedingWater(plant) }"
                  @click.stop="handleQuickWater(plant)"
                >
                  <CloudOutlined />
                  <span class="days-text">{{ getDaysSinceWatered(plant) }}天</span>
                </div>
              </div>
              <div class="plant-info">
                <div class="plant-name">{{ plant.nickname || plant.name }}</div>
                <div class="plant-location">
                  <EnvironmentOutlined class="location-icon" />
                  {{ plant.location }}
                </div>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </div>
    </div>

    <div class="daily-tips" v-if="dailyTip">
      <a-card class="tip-card">
        <div class="tip-header">
          <BulbOutlined class="tip-icon" />
          <span class="tip-title">每日养护小贴士</span>
        </div>
        <div class="tip-content">{{ dailyTip.content }}</div>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  EnvironmentOutlined,
  CloudOutlined,
  PlusOutlined,
  BulbOutlined
} from '@ant-design/icons-vue'
import { usePlantsStore } from '@/stores/plantsStore'
import type { Plant, PlantCareTip } from '@/types'
import { mockCareTips } from '@/data/mockData'
import dayjs from 'dayjs'

const router = useRouter()
const plantsStore = usePlantsStore()

const searchQuery = ref('')
const dailyTip = ref<PlantCareTip | null>(mockCareTips[Math.floor(Math.random() * mockCareTips.length)])

const filteredPlants = computed(() => {
  return plantsStore.searchPlants(searchQuery.value)
})

const handleSearch = () => {
  // 搜索会通过computed自动更新
}

const navigateToAddPlant = () => {
  router.push('/add-plant')
}

const navigateToPlantDetail = (plantId: string) => {
  router.push(`/plant/${plantId}`)
}

const navigateToReminders = () => {
  router.push('/reminders')
}

const isPlantNeedingWater = (plant: Plant) => {
  const today = dayjs()
  const lastWatered = dayjs(plant.lastWateredDate)
  const daysSinceWatered = today.diff(lastWatered, 'day')
  return daysSinceWatered >= plant.wateringFrequency
}

const getDaysSinceWatered = (plant: Plant) => {
  const today = dayjs()
  const lastWatered = dayjs(plant.lastWateredDate)
  return today.diff(lastWatered, 'day')
}

const handleQuickWater = (plant: Plant) => {
  plantsStore.waterPlant(plant.id)
  message.success(`已记录给${plant.name}浇水`)
}
</script>

<style scoped>
.home-view {
  padding-bottom: 20px;
}

.search-section {
  margin-bottom: 20px;
}

.stats-cards {
  margin-bottom: 24px;
}

.stat-card {
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.stat-icon.total {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
}

.stat-icon.need-water {
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #262626;
}

.stat-value.need-water {
  color: #1890ff;
}

.stat-label {
  font-size: 14px;
  color: #8c8c8c;
  margin-top: 4px;
}

.plants-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin: 0;
}

.plants-grid {
  margin-bottom: 16px;
}

.plant-card {
  border-radius: 12px;
  overflow: hidden;
}

.plant-image {
  position: relative;
  height: 120px;
  margin: -16px -16px 12px -16px;
}

.plant-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.water-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(24, 144, 255, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.water-badge:hover {
  background: rgba(24, 144, 255, 1);
}

.water-badge.urgent {
  background: rgba(255, 77, 79, 0.9);
}

.water-badge.urgent:hover {
  background: rgba(255, 77, 79, 1);
}

.plant-info {
  padding: 0 4px;
}

.plant-name {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.plant-location {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #8c8c8c;
}

.location-icon {
  font-size: 12px;
}

.empty-state {
  text-align: center;
  padding: 48px 24px;
  background: white;
  border-radius: 12px;
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

.tip-card {
  background: linear-gradient(135deg, #fff7e6 0%, #fffbe6 100%);
  border-radius: 12px;
}

.tip-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.tip-icon {
  font-size: 20px;
  color: #faad14;
}

.tip-title {
  font-size: 14px;
  font-weight: 600;
  color: #d48806;
}

.tip-content {
  font-size: 14px;
  color: #8c8c8c;
  line-height: 1.6;
}
</style>
