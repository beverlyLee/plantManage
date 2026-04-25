import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/reminders',
    name: 'Reminders',
    component: () => import('@/views/RemindersView.vue'),
    meta: {
      title: '提醒'
    }
  },
  {
    path: '/stats',
    name: 'Stats',
    component: () => import('@/views/StatsView.vue'),
    meta: {
      title: '统计'
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: {
      title: '我的'
    }
  },
  {
    path: '/add-plant',
    name: 'AddPlant',
    component: () => import('@/views/AddPlantView.vue'),
    meta: {
      title: '添加植物'
    }
  },
  {
    path: '/plant/:id',
    name: 'PlantDetail',
    component: () => import('@/views/PlantDetailView.vue'),
    meta: {
      title: '植物详情'
    }
  },
  {
    path: '/add-reminder/:plantId?',
    name: 'AddReminder',
    component: () => import('@/views/AddReminderView.vue'),
    meta: {
      title: '添加提醒'
    }
  },
  {
    path: '/add-growth/:plantId',
    name: 'AddGrowth',
    component: () => import('@/views/AddGrowthView.vue'),
    meta: {
      title: '记录生长'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, _from, next) => {
  document.title = `${to.meta.title || '家庭绿植养护'} - 家庭绿植养护`
  next()
})

export default router
