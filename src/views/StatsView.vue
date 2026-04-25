<template>
  <div class="stats-view">
    <a-card class="stats-card">
      <template #title>
        <BarChartOutlined /> 养护概览
      </template>

      <a-row :gutter="[16, 16]">
        <a-col :span="12">
          <a-statistic
            title="总植物数"
            :value="plantsStore.totalPlants"
            :value-style="{ color: '#52c41a' }"
          >
            <template #prefix><EnvironmentOutlined /></template>
          </a-statistic>
        </a-col>
        <a-col :span="12">
          <a-statistic
            title="需要浇水"
            :value="plantsStore.plantsNeedingWaterCount"
            :value-style="{ color: '#1890ff' }"
          >
            <template #prefix><CloudOutlined /></template>
          </a-statistic>
        </a-col>
        <a-col :span="12">
          <a-statistic
            title="待办提醒"
            :value="remindersStore.upcomingReminders.length"
            :value-style="{ color: '#faad14' }"
          >
            <template #prefix><BellOutlined /></template>
          </a-statistic>
        </a-col>
        <a-col :span="12">
          <a-statistic
            title="已逾期"
            :value="remindersStore.overdueReminders.length"
            :value-style="{ color: '#ff4d4f' }"
          >
            <template #prefix><ExclamationCircleOutlined /></template>
          </a-statistic>
        </a-col>
      </a-row>
    </a-card>

    <a-card class="section-card">
      <template #title>
        <EnvironmentOutlined /> 按位置分布
      </template>

      <a-list :data-source="locationStats">
        <a-list-item v-for="item in locationStats" :key="item.location">
          <a-list-item-meta>
            <template #title>{{ item.location }}</template>
            <template #description>
              {{ item.count }} 株植物
            </template>
          </a-list-item-meta>
          <a-tag :color="item.color">{{ item.percentage }}%</a-tag>
        </a-list-item>
      </a-list>
    </a-card>

    <a-card class="section-card">
      <template #title>
        <ThunderboltOutlined /> 光照需求分布
      </template>

      <a-row :gutter="[12, 12]">
        <a-col :span="8" v-for="item in lightStats" :key="item.level">
          <a-card class="mini-card" :bordered="false">
            <div class="mini-stat">
              <div class="mini-icon" :style="{ background: item.color }">
                <BulbOutlined />
              </div>
              <div class="mini-info">
                <div class="mini-value">{{ item.count }}</div>
                <div class="mini-label">{{ item.text }}</div>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </a-card>

    <a-card class="section-card">
      <template #title>
        <CloudOutlined /> 浇水频率分布
      </template>

      <a-row :gutter="[12, 12]">
        <a-col :span="8" v-for="item in wateringStats" :key="item.range">
          <a-card class="mini-card" :bordered="false">
            <div class="mini-stat">
              <div class="mini-icon" :style="{ background: item.color }">
                <CloudOutlined />
              </div>
              <div class="mini-info">
                <div class="mini-value">{{ item.count }}</div>
                <div class="mini-label">{{ item.range }}</div>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </a-card>

    <a-card class="section-card">
      <template #title>
        <RiseOutlined /> 养护小贴士
      </template>

      <a-collapse>
        <a-collapse-panel v-for="tip in careTips" :key="tip.id" :header="tip.title">
          <p class="tip-content">{{ tip.content }}</p>
        </a-collapse-panel>
      </a-collapse>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePlantsStore } from '@/stores/plantsStore'
import { useRemindersStore } from '@/stores/remindersStore'
import { mockCareTips } from '@/data/mockData'
import {
  BarChartOutlined,
  EnvironmentOutlined,
  CloudOutlined,
  BellOutlined,
  ExclamationCircleOutlined,
  ThunderboltOutlined,
  BulbOutlined,
  RiseOutlined
} from '@ant-design/icons-vue'

const plantsStore = usePlantsStore()
const remindersStore = useRemindersStore()

const locationStats = computed(() => {
  const locations = plantsStore.getPlantLocations()
  const total = plantsStore.totalPlants
  const colors = ['#52c41a', '#1890ff', '#faad14', '#722ed1', '#eb2f96']

  return locations.map((location, index) => {
    const plants = plantsStore.getPlantsByLocation(location)
    return {
      location,
      count: plants.length,
      percentage: total > 0 ? Math.round((plants.length / total) * 100) : 0,
      color: colors[index % colors.length]
    }
  })
})

const lightStats = computed(() => {
  const plants = plantsStore.plants
  const stats = {
    low: 0,
    medium: 0,
    high: 0
  }

  plants.forEach(plant => {
    stats[plant.lightRequirements]++
  })

  return [
    { level: 'low', text: '低光照', count: stats.low, color: '#1890ff' },
    { level: 'medium', text: '中等', count: stats.medium, color: '#52c41a' },
    { level: 'high', text: '高光照', count: stats.high, color: '#faad14' }
  ]
})

const wateringStats = computed(() => {
  const plants = plantsStore.plants
  const stats = {
    frequent: 0,
    normal: 0,
    infrequent: 0
  }

  plants.forEach(plant => {
    if (plant.wateringFrequency <= 3) {
      stats.frequent++
    } else if (plant.wateringFrequency <= 7) {
      stats.normal++
    } else {
      stats.infrequent++
    }
  })

  return [
    { range: '1-3天', count: stats.frequent, color: '#1890ff' },
    { range: '4-7天', count: stats.normal, color: '#52c41a' },
    { range: '>7天', count: stats.infrequent, color: '#faad14' }
  ]
})

const careTips = computed(() => {
  return mockCareTips.slice(0, 3)
})
</script>

<style scoped>
.stats-view {
  padding-bottom: 20px;
}

.stats-card {
  margin-bottom: 16px;
  border-radius: 12px;
}

.section-card {
  margin-bottom: 16px;
  border-radius: 12px;
}

.mini-card {
  background: #fafafa;
  border-radius: 8px;
}

.mini-stat {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mini-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
}

.mini-info {
  flex: 1;
}

.mini-value {
  font-size: 20px;
  font-weight: 600;
  color: #262626;
}

.mini-label {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 2px;
}

.tip-content {
  font-size: 14px;
  color: #595959;
  line-height: 1.6;
  margin: 0;
}
</style>
