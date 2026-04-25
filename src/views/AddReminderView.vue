<template>
  <div class="add-reminder-view">
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      layout="vertical"
      @finish="handleSubmit"
    >
      <a-card class="form-card">
        <template #title>
          <BellOutlined /> 提醒信息
        </template>

        <a-form-item label="选择植物" name="plantId">
          <a-select
            v-model:value="formState.plantId"
            placeholder="请选择植物"
            :disabled="!!preselectedPlantId"
          >
            <a-select-option v-for="plant in plantsStore.plants" :key="plant.id" :value="plant.id">
              {{ plant.nickname || plant.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="提醒类型" name="type">
          <a-select v-model:value="formState.type" placeholder="请选择提醒类型">
            <a-select-option value="watering">浇水</a-select-option>
            <a-select-option value="fertilizing">施肥</a-select-option>
            <a-select-option value="pruning">修剪</a-select-option>
            <a-select-option value="repotting">换盆</a-select-option>
            <a-select-option value="custom">自定义</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="提醒标题" name="title">
          <a-input v-model:value="formState.title" placeholder="请输入提醒标题" />
        </a-form-item>

        <a-form-item label="提醒描述" name="description">
          <a-textarea
            v-model:value="formState.description"
            placeholder="添加详细描述（可选）"
            :rows="3"
          />
        </a-form-item>
      </a-card>

      <a-card class="form-card">
        <template #title>
          <ClockCircleOutlined /> 时间设置
        </template>

        <a-form-item label="提醒日期" name="scheduledDate">
          <a-date-picker
            v-model:value="formState.scheduledDate"
            placeholder="选择提醒日期"
            style="width: 100%"
            :disabled-date="disabledDate"
          />
        </a-form-item>

        <a-form-item label="提醒时间" name="scheduledTime">
          <a-time-picker
            v-model:value="formState.scheduledTime"
            placeholder="选择提醒时间"
            style="width: 100%"
            format="HH:mm"
          />
        </a-form-item>

        <a-form-item label="优先级" name="priority">
          <a-select v-model:value="formState.priority" placeholder="请选择优先级">
            <a-select-option value="low">低</a-select-option>
            <a-select-option value="medium">中</a-select-option>
            <a-select-option value="high">高</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-checkbox v-model:checked="formState.isRecurring">
            重复提醒
          </a-checkbox>
        </a-form-item>

        <a-form-item v-if="formState.isRecurring" label="重复模式" name="recurrencePattern">
          <a-select v-model:value="formState.recurrencePattern" placeholder="选择重复模式">
            <a-select-option value="daily">每天</a-select-option>
            <a-select-option value="weekly">每周</a-select-option>
            <a-select-option value="biweekly">每两周</a-select-option>
            <a-select-option value="monthly">每月</a-select-option>
            <a-select-option value="custom">自定义</a-select-option>
          </a-select>
        </a-form-item>
      </a-card>

      <div class="form-actions">
        <a-button size="large" @click="handleCancel">取消</a-button>
        <a-button type="primary" size="large" html-type="submit" :loading="loading">
          添加提醒
        </a-button>
      </div>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { FormInstance, FormRules } from 'ant-design-vue'
import {
  BellOutlined,
  ClockCircleOutlined
} from '@ant-design/icons-vue'
import { usePlantsStore } from '@/stores/plantsStore'
import { useRemindersStore } from '@/stores/remindersStore'
import type { Reminder } from '@/types'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const plantsStore = usePlantsStore()
const remindersStore = useRemindersStore()
const formRef = ref<FormInstance>()
const loading = ref(false)

const preselectedPlantId = computed(() => route.params.plantId as string | undefined)

const formState = reactive<{
  plantId: string
  type: Reminder['type']
  title: string
  description: string
  scheduledDate: dayjs.Dayjs | null
  scheduledTime: dayjs.Dayjs | null
  priority: Reminder['priority']
  isRecurring: boolean
  recurrencePattern: string
}>({
  plantId: preselectedPlantId.value || '',
  type: 'watering',
  title: '',
  description: '',
  scheduledDate: dayjs().add(1, 'day'),
  scheduledTime: null,
  priority: 'medium',
  isRecurring: false,
  recurrencePattern: ''
})

watch(
  () => formState.type,
  (newType) => {
    const typeTitles: Record<string, string> = {
      watering: '浇水',
      fertilizing: '施肥',
      pruning: '修剪',
      repotting: '换盆',
      custom: ''
    }
    if (formState.plantId && typeTitles[newType]) {
      const plant = plantsStore.getPlantById(formState.plantId)
      if (plant) {
        formState.title = `给${plant.nickname || plant.name}${typeTitles[newType]}`
      }
    }
  }
)

watch(
  () => formState.plantId,
  (newPlantId) => {
    if (newPlantId && formState.type !== 'custom') {
      const typeTitles: Record<string, string> = {
        watering: '浇水',
        fertilizing: '施肥',
        pruning: '修剪',
        repotting: '换盆'
      }
      const plant = plantsStore.getPlantById(newPlantId)
      if (plant && typeTitles[formState.type]) {
        formState.title = `给${plant.nickname || plant.name}${typeTitles[formState.type]}`
      }
    }
  }
)

const rules: FormRules = {
  plantId: [
    { required: true, message: '请选择植物', trigger: 'change' }
  ],
  type: [
    { required: true, message: '请选择提醒类型', trigger: 'change' }
  ],
  title: [
    { required: true, message: '请输入提醒标题', trigger: 'blur' },
    { max: 100, message: '标题不能超过100个字符', trigger: 'blur' }
  ],
  scheduledDate: [
    { required: true, message: '请选择提醒日期', trigger: 'change' }
  ],
  priority: [
    { required: true, message: '请选择优先级', trigger: 'change' }
  ]
}

const disabledDate = (current: dayjs.Dayjs) => {
  return current && current < dayjs().startOf('day')
}

const handleSubmit = () => {
  formRef.value?.validate().then(() => {
    loading.value = true

    const newReminder = remindersStore.addReminder({
      plantId: formState.plantId,
      type: formState.type,
      title: formState.title,
      description: formState.description || undefined,
      scheduledDate: formState.scheduledDate?.format('YYYY-MM-DD') || dayjs().add(1, 'day').format('YYYY-MM-DD'),
      scheduledTime: formState.scheduledTime?.format('HH:mm'),
      isRecurring: formState.isRecurring,
      recurrencePattern: formState.recurrencePattern || undefined,
      priority: formState.priority
    })

    setTimeout(() => {
      loading.value = false
      message.success('提醒添加成功！')
      if (preselectedPlantId.value) {
        router.push(`/plant/${preselectedPlantId.value}`)
      } else {
        router.push('/reminders')
      }
    }, 500)
  }).catch(() => {
    message.error('请填写必填项')
  })
}

const handleCancel = () => {
  router.back()
}
</script>

<style scoped>
.add-reminder-view {
  padding-bottom: 100px;
}

.form-card {
  margin-bottom: 16px;
  border-radius: 12px;
}

.form-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 16px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.form-actions .ant-btn {
  min-width: 100px;
}
</style>
