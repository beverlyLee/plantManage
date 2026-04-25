<template>
  <a-config-provider :locale="zhCN">
    <a-layout class="app-layout">
      <a-layout-header class="app-header">
        <div class="header-content">
          <div class="logo">
            <EnvironmentOutlined class="logo-icon" />
            <span class="logo-text">家庭绿植养护</span>
          </div>
        </div>
      </a-layout-header>
      <a-layout-content class="app-content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="app-footer">
        <div class="bottom-nav">
          <div
            class="nav-item"
            :class="{ active: activeKey === 'home' }"
            @click="handleNavClick('home')"
          >
            <HomeOutlined class="nav-icon" />
            <span class="nav-label">首页</span>
            <div v-if="activeKey === 'home'" class="nav-indicator"></div>
          </div>
          <div
            class="nav-item"
            :class="{ active: activeKey === 'reminders' }"
            @click="handleNavClick('reminders')"
          >
            <BellOutlined class="nav-icon" />
            <span class="nav-label">提醒</span>
            <div v-if="activeKey === 'reminders'" class="nav-indicator"></div>
          </div>
          <div
            class="nav-item nav-item-add"
            @click="handleNavClick('add')"
          >
            <div class="add-button">
              <PlusOutlined class="add-icon" />
            </div>
          </div>
          <div
            class="nav-item"
            :class="{ active: activeKey === 'stats' }"
            @click="handleNavClick('stats')"
          >
            <BarChartOutlined class="nav-icon" />
            <span class="nav-label">统计</span>
            <div v-if="activeKey === 'stats'" class="nav-indicator"></div>
          </div>
          <div
            class="nav-item"
            :class="{ active: activeKey === 'profile' }"
            @click="handleNavClick('profile')"
          >
            <UserOutlined class="nav-icon" />
            <span class="nav-label">我的</span>
            <div v-if="activeKey === 'profile'" class="nav-indicator"></div>
          </div>
        </div>
      </a-layout-footer>
    </a-layout>
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import {
  HomeOutlined,
  BellOutlined,
  PlusOutlined,
  BarChartOutlined,
  UserOutlined,
  EnvironmentOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

const activeKey = ref('home')

const routeToTab: Record<string, string> = {
  '/': 'home',
  '/home': 'home',
  '/reminders': 'reminders',
  '/stats': 'stats',
  '/profile': 'profile'
}

watch(
  () => route.path,
  (newPath) => {
    if (routeToTab[newPath]) {
      activeKey.value = routeToTab[newPath]
    }
  },
  { immediate: true }
)

const handleNavClick = (key: string) => {
  if (key === 'add') {
    router.push('/add-plant')
  } else {
    const tabToRoute: Record<string, string> = {
      home: '/',
      reminders: '/reminders',
      stats: '/stats',
      profile: '/profile'
    }
    if (tabToRoute[key]) {
      activeKey.value = key
      router.push(tabToRoute[key])
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-layout {
  min-height: 100vh;
  background: #f5f5f5;
}

.app-header {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  padding: 0 16px;
  height: 56px;
  line-height: 56px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 18px;
  font-weight: 600;
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.app-content {
  padding: 16px;
  padding-bottom: 80px;
  max-width: 768px;
  margin: 0 auto;
  width: 100%;
}

.app-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 0;
  height: 64px;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.bottom-nav {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100%;
  width: 100%;
  max-width: 768px;
  margin: 0 auto;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-width: 0;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: rgba(82, 196, 26, 0.05);
}

.nav-item.active {
  color: #52c41a;
}

.nav-icon {
  font-size: 24px;
  line-height: 1;
  margin-bottom: 4px;
  color: #666;
  transition: color 0.2s ease;
  flex-shrink: 0;
}

.nav-item.active .nav-icon {
  color: #52c41a;
}

.nav-label {
  font-size: 11px;
  color: #666;
  line-height: 1;
  transition: color 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-item.active .nav-label {
  color: #52c41a;
  font-weight: 500;
}

.nav-indicator {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 3px;
  background: #52c41a;
  border-radius: 2px 2px 0 0;
}

.nav-item-add {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
}

.add-button {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(82, 196, 26, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  flex-shrink: 0;
}

.add-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(82, 196, 26, 0.5);
}

.add-button:active {
  transform: scale(0.95);
}

.add-icon {
  font-size: 26px;
  color: white;
  line-height: 1;
}

@media (max-width: 360px) {
  .nav-icon {
    font-size: 22px;
  }
  
  .nav-label {
    font-size: 10px;
  }
  
  .add-button {
    width: 44px;
    height: 44px;
  }
  
  .add-icon {
    font-size: 22px;
  }
  
  .app-footer {
    height: 60px;
  }
}

@media (min-width: 480px) {
  .nav-icon {
    font-size: 26px;
  }
  
  .nav-label {
    font-size: 12px;
  }
  
  .add-button {
    width: 52px;
    height: 52px;
  }
  
  .add-icon {
    font-size: 28px;
  }
}
</style>
