<template>
  <div v-if="plant" class="add-growth-view">
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      layout="vertical"
      @finish="handleSubmit"
    >
      <div class="plant-info-section">
        <a-card class="info-card">
          <div class="plant-summary">
            <img :src="plant.image" :alt="plant.name" class="plant-avatar" />
            <div class="plant-info">
              <div class="plant-name">{{ plant.nickname || plant.name }}</div>
              <div class="plant-species">{{ plant.species }}</div>
            </div>
          </div>
        </a-card>
      </div>

      <a-card class="form-card">
        <template #title>
          <RiseOutlined /> 生长记录
        </template>

        <a-form-item label="记录日期" name="date">
          <a-date-picker
            v-model:value="formState.date"
            placeholder="选择记录日期"
            style="width: 100%"
            :disabled-date="disabledDate"
          />
        </a-form-item>

        <a-form-item label="健康状况" name="health">
          <a-select v-model:value="formState.health" placeholder="请选择健康状况">
            <a-select-option value="excellent">
              <span style="color: #52c41a;">非常好</span>
            </a-select-option>
            <a-select-option value="good">
              <span style="color: #1890ff;">良好</span>
            </a-select-option>
            <a-select-option value="fair">
              <span style="color: #faad14;">一般</span>
            </a-select-option>
            <a-select-option value="poor">
              <span style="color: #ff4d4f;">较差</span>
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-row :gutter="[16, 0]">
          <a-col :span="12">
            <a-form-item label="高度 (cm)" name="height">
              <a-input-number
                v-model:value="formState.height"
                :min="0"
                :max="1000"
                placeholder="可选"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="叶片数" name="leafCount">
              <a-input-number
                v-model:value="formState.leafCount"
                :min="0"
                :max="1000"
                placeholder="可选"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>

      <a-card class="form-card">
        <template #title>
          <EditOutlined /> 备注
        </template>

        <a-form-item label="记录描述" name="notes">
          <a-textarea
            v-model:value="formState.notes"
            placeholder="记录今天的观察和养护情况..."
            :rows="4"
            show-count
            :max-length="500"
          />
        </a-form-item>
      </a-card>

      <div class="quick-tips">
        <a-card class="tips-card">
          <div class="tips-header">
            <BulbOutlined class="tips-icon" />
            <span class="tips-title">养护提示</span>
          </div>
          <a-list size="small" :data-source="quickTips">
            <a-list-item v-slot="{ item }">
              <CheckCircleOutlined style="color: #52c41a; margin-right: 8px;" />
              {{ item }}
            </a-list-item>
          </a-list>
        </a-card>
      </div>

      <div class="form-actions">
        <a-button size="large" @click="handleCancel">取消</a-button>
        <a-button type="primary" size="large" html-type="submit" :loading="loading">
          保存记录
        </a-button>
      </div>
    </a-form>
  </div>

  <div v-else class="not-found">
    <div class="empty-icon"><EnvironmentOutlined /></div>
    <div class="empty-text">植物不存在</div>
    <a-button type="primary" @click="router.push('/')">返回首页</a-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import type { FormInstance, FormRules } from 'ant-design-vue'
import {
  RiseOutlined,
  EditOutlined,
  CheckCircleOutlined,
  BulbOutlined,
  EnvironmentOutlined
} from '@ant-design/icons-vue'
import { usePlantsStore } from '@/stores/plantsStore'
import { useGrowthRecordsStore } from '@/stores/growthRecordsStore'
import type { GrowthRecord, Plant } from '@/types'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const plantsStore = usePlantsStore()
const growthRecordsStore = useGrowthRecordsStore()
const formRef = ref<FormInstance>()
const loading = ref(false)

const plantId = computed(() => route.params.plantId as string)
const plant = computed(() => plantsStore.getPlantById(plantId.value))

const quickTips = ref([
  '观察新叶生长情况',
  '检查叶片是否有病虫害',
  '确认土壤湿度是否适宜',
  '记录任何异常的叶片颜色变化'
])

const formState = reactive<{
  date: dayjs.Dayjs | null
  health: GrowthRecord['health']
  height: number | null
  leafCount: number | null
  notes: string
}>({
  date: dayjs(),
  health: 'good',
  height: null,
  leafCount: null,
  notes: ''
})

const rules: FormRules = {
  date: [
    { required: true, message: '请选择记录日期', trigger: 'change' }
  ],
  health: [
    { required: true, message: '请选择健康状况', trigger: 'change' }
  ]
}

const disabledDate = (current: dayjs.Dayjs) => {
  return current && current > dayjs().endOf('day')
}

const handleSubmit = () => {
  formRef.value?.validate().then(() => {
    Modal.confirm({
      title: '确认保存',
      content: '确定要保存这条生长记录吗？',
      okText: '确认保存',
      cancelText: '取消',
      onOk: () => {
        loading.value = true

        const newRecord = growthRecordsStore.addRecord({
          plantId: plantId.value,
          date: formState.date?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD'),
          health: formState.health,
          height: formState.height || undefined,
          leafCount: formState.leafCount || undefined,
          notes: formState.notes || undefined
        })

        setTimeout(() => {
          loading.value = false
          message.success('生长记录添加成功！')
          router.push(`/plant/${plantId.value}`)
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
.add-growth-view {
  padding-bottom: 100px;
}

.plant-info-section {
  margin-bottom: 16px;
}

.info-card {
  border-radius: 12px;
}

.plant-summary {
  display: flex;
  align-items: center;
  gap: 16px;
}

.plant-avatar {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  object-fit: cover;
}

.plant-info {
  flex: 1;
}

.plant-name {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 4px;
}

.plant-species {
  font-size: 14px;
  color: #8c8c8c;
}

.form-card {
  margin-bottom: 16px;
  border-radius: 12px;
}

.quick-tips {
  margin-bottom: 16px;
}

.tips-card {
  background: linear-gradient(135deg, #fff7e6 0%, #fffbe6 100%);
  border-radius: 12px;
}

.tips-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.tips-icon {
  font-size: 18px;
  color: #faad14;
}

.tips-title {
  font-size: 14px;
  font-weight: 600;
  color: #d48806;
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

.not-found {
  text-align: center;
  padding: 64px 24px;
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
</style>
