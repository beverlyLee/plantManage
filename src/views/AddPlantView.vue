<template>
  <div class="add-plant-view">
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      layout="vertical"
      @finish="handleSubmit"
    >
      <a-card class="form-card">
        <template #title>
          <EnvironmentOutlined /> 基本信息
        </template>

        <a-form-item label="植物名称" name="name">
          <a-input v-model:value="formState.name" placeholder="请输入植物名称" />
        </a-form-item>

        <a-form-item label="昵称" name="nickname">
          <a-input v-model:value="formState.nickname" placeholder="给它起个可爱的名字" />
        </a-form-item>

        <a-form-item label="植物品种" name="species">
          <a-input v-model:value="formState.species" placeholder="如：龟背竹、绿萝等" />
        </a-form-item>

        <a-form-item label="摆放位置" name="location">
          <a-select v-model:value="formState.location" placeholder="请选择摆放位置" allow-clear>
            <a-select-option v-for="loc in locations" :key="loc" :value="loc">
              {{ loc }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="购买日期" name="purchaseDate">
          <a-date-picker
            v-model:value="formState.purchaseDate"
            placeholder="选择购买日期"
            style="width: 100%"
            :disabled-date="disabledDate"
          />
        </a-form-item>
      </a-card>

      <a-card class="form-card">
        <template #title>
          <CloudOutlined /> 养护要求
        </template>

        <a-form-item label="浇水频率（天）" name="wateringFrequency">
          <a-input-number
            v-model:value="formState.wateringFrequency"
            :min="1"
            :max="30"
            placeholder="每几天浇一次水"
            style="width: 100%"
          />
          <div class="form-tip">建议：大多数室内植物每3-7天浇水一次</div>
        </a-form-item>

        <a-form-item label="上次浇水时间" name="lastWateredDate">
          <a-date-picker
            v-model:value="formState.lastWateredDate"
            placeholder="选择上次浇水日期"
            style="width: 100%"
            :disabled-date="disabledDate"
          />
        </a-form-item>

        <a-form-item label="光照需求" name="lightRequirements">
          <a-select v-model:value="formState.lightRequirements" placeholder="请选择光照需求">
            <a-select-option value="low">低光照</a-select-option>
            <a-select-option value="medium">中等光照</a-select-option>
            <a-select-option value="high">高光照</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="湿度需求" name="humidityRequirements">
          <a-select v-model:value="formState.humidityRequirements" placeholder="请选择湿度需求">
            <a-select-option value="low">低湿度</a-select-option>
            <a-select-option value="medium">中等湿度</a-select-option>
            <a-select-option value="high">高湿度</a-select-option>
          </a-select>
        </a-form-item>
      </a-card>

      <a-card class="form-card">
        <template #title>
          <EditOutlined /> 备注
        </template>

        <a-form-item label="描述" name="description">
          <a-textarea
            v-model:value="formState.description"
            placeholder="描述一下这株植物"
            :rows="3"
            show-count
            :max-length="200"
          />
        </a-form-item>

        <a-form-item label="养护笔记" name="notes">
          <a-textarea
            v-model:value="formState.notes"
            placeholder="记录养护小贴士"
            :rows="3"
            show-count
            :max-length="500"
          />
        </a-form-item>
      </a-card>

      <div class="form-actions">
        <a-button size="large" @click="handleCancel">取消</a-button>
        <a-button type="primary" size="large" html-type="submit" :loading="loading">
          保存植物
        </a-button>
      </div>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import type { FormInstance, FormRules } from 'ant-design-vue'
import {
  EnvironmentOutlined,
  CloudOutlined,
  EditOutlined
} from '@ant-design/icons-vue'
import { usePlantsStore } from '@/stores/plantsStore'
import { mockLocations } from '@/data/mockData'
import type { Plant } from '@/types'
import dayjs from 'dayjs'

const router = useRouter()
const plantsStore = usePlantsStore()
const formRef = ref<FormInstance>()
const loading = ref(false)

const locations = computed(() => {
  const existingLocations = plantsStore.getPlantLocations()
  const allLocations = new Set([...mockLocations.map(l => l.name), ...existingLocations])
  return Array.from(allLocations)
})

const formState = reactive<{
  name: string
  nickname: string
  species: string
  location: string
  purchaseDate: dayjs.Dayjs | null
  wateringFrequency: number
  lastWateredDate: dayjs.Dayjs | null
  lightRequirements: Plant['lightRequirements']
  humidityRequirements: Plant['humidityRequirements']
  description: string
  notes: string
}>({
  name: '',
  nickname: '',
  species: '',
  location: '',
  purchaseDate: dayjs(),
  wateringFrequency: 3,
  lastWateredDate: dayjs(),
  lightRequirements: 'medium',
  humidityRequirements: 'medium',
  description: '',
  notes: ''
})

const rules: FormRules = {
  name: [
    { required: true, message: '请输入植物名称', trigger: 'blur' },
    { max: 50, message: '名称不能超过50个字符', trigger: 'blur' }
  ],
  species: [
    { required: true, message: '请输入植物品种', trigger: 'blur' }
  ],
  location: [
    { required: true, message: '请选择摆放位置', trigger: 'change' }
  ],
  purchaseDate: [
    { required: true, message: '请选择购买日期', trigger: 'change' }
  ],
  wateringFrequency: [
    { required: true, message: '请输入浇水频率', trigger: 'blur' },
    { type: 'number', min: 1, max: 30, message: '浇水频率应在1-30天之间', trigger: 'blur' }
  ],
  lastWateredDate: [
    { required: true, message: '请选择上次浇水日期', trigger: 'change' }
  ]
}

const disabledDate = (current: dayjs.Dayjs) => {
  return current && current > dayjs().endOf('day')
}

const handleSubmit = () => {
  formRef.value?.validate().then(() => {
    Modal.confirm({
      title: '确认保存',
      content: '确定要保存这株植物的信息吗？',
      okText: '确认保存',
      cancelText: '取消',
      onOk: () => {
        loading.value = true

        const newPlant = plantsStore.addPlant({
          name: formState.name,
          nickname: formState.nickname || undefined,
          species: formState.species,
          location: formState.location,
          purchaseDate: formState.purchaseDate?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD'),
          lastWateredDate: formState.lastWateredDate?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD'),
          wateringFrequency: formState.wateringFrequency,
          lightRequirements: formState.lightRequirements,
          humidityRequirements: formState.humidityRequirements,
          description: formState.description || undefined,
          notes: formState.notes || undefined
        })

        setTimeout(() => {
          loading.value = false
          message.success('植物添加成功！')
          router.push('/')
        }, 500)
      }
    })
  }).catch(() => {
    message.error('请填写必填项')
  })
}

const handleCancel = () => {
  router.back()
}
</script>

<style scoped>
.add-plant-view {
  padding-bottom: 100px;
}

.form-card {
  margin-bottom: 16px;
  border-radius: 12px;
}

.form-tip {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 8px;
}

.form-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 16px;
  padding-bottom: calc(16px + 64px);
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.form-actions .ant-btn {
  min-width: 100px;
}
</style>
