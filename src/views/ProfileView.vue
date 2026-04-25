<template>
  <div class="profile-view">
    <a-card class="profile-card">
      <div class="profile-header">
        <a-avatar :size="80" class="profile-avatar">
          <UserOutlined />
        </a-avatar>
        <div class="profile-info">
          <div class="profile-name">绿植爱好者</div>
          <div class="profile-bio">用心呵护每一株绿植</div>
        </div>
      </div>

      <a-divider />

      <a-list>
        <a-list-item @click="showInfo('appVersion')" class="clickable-item">
          <template #prefix>
            <a-icon-component :is="InfoCircleOutlined" class="list-icon" />
          </template>
          <a-list-item-meta title="应用版本" description="当前版本信息" />
          <template #extra>
            <span class="list-extra">v1.0.0</span>
          </template>
        </a-list-item>

        <a-list-item @click="showInfo('dataBackup')" class="clickable-item">
          <template #prefix>
            <a-icon-component :is="CloudSyncOutlined" class="list-icon" />
          </template>
          <a-list-item-meta title="数据备份" description="备份和恢复数据" />
          <template #extra>
            <RightOutlined class="list-arrow" />
          </template>
        </a-list-item>

        <a-list-item @click="showInfo('reminderSettings')" class="clickable-item">
          <template #prefix>
            <a-icon-component :is="BellOutlined" class="list-icon" />
          </template>
          <a-list-item-meta title="提醒设置" description="管理提醒通知" />
          <template #extra>
            <a-switch v-model:checked="reminderEnabled" disabled />
          </template>
        </a-list-item>

        <a-list-item @click="showInfo('theme')" class="clickable-item">
          <template #prefix>
            <a-icon-component :is="BgColorsOutlined" class="list-icon" />
          </template>
          <a-list-item-meta title="主题设置" description="浅色/深色模式" />
          <template #extra>
            <span class="list-extra">浅色</span>
          </template>
        </a-list-item>

        <a-list-item @click="showInfo('language')" class="clickable-item">
          <template #prefix>
            <a-icon-component :is="GlobalOutlined" class="list-icon" />
          </template>
          <a-list-item-meta title="语言设置" description="选择应用语言" />
          <template #extra>
            <span class="list-extra">简体中文</span>
          </template>
        </a-list-item>
      </a-list>
    </a-card>

    <a-card class="about-card">
      <template #title>
        <HeartOutlined class="heart-icon" /> 关于应用
      </template>
      <p class="about-text">
        家庭绿植养护是一款帮助你记录和管理家庭绿植的应用。
        通过记录浇水、光照、生长情况，让你的绿植更加健康茁壮地成长。
      </p>
      <p class="about-text">
        每一株绿植都是生命，用心呵护，静待花开。
      </p>
    </a-card>

    <a-card class="quick-actions-card">
      <template #title>
        <ToolOutlined /> 快捷操作
      </template>
      <a-row :gutter="[16, 16]">
        <a-col :span="8">
          <div class="quick-action" @click="handleExportData">
            <ExportOutlined class="action-icon" />
            <div class="action-text">导出数据</div>
          </div>
        </a-col>
        <a-col :span="8">
          <div class="quick-action" @click="handleClearCache">
            <DeleteOutlined class="action-icon" />
            <div class="action-text">清除缓存</div>
          </div>
        </a-col>
        <a-col :span="8">
          <div class="quick-action" @click="handleRateApp">
            <StarOutlined class="action-icon" />
            <div class="action-text">给个好评</div>
          </div>
        </a-col>
      </a-row>
    </a-card>

    <div class="footer">
      <p class="footer-text">Made with ❤️ for plant lovers</p>
      <p class="footer-copyright">© 2024 家庭绿植养护</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { message, Popconfirm } from 'ant-design-vue'
import {
  UserOutlined,
  InfoCircleOutlined,
  CloudSyncOutlined,
  BellOutlined,
  BgColorsOutlined,
  GlobalOutlined,
  RightOutlined,
  HeartOutlined,
  ToolOutlined,
  ExportOutlined,
  DeleteOutlined,
  StarOutlined
} from '@ant-design/icons-vue'

const reminderEnabled = ref(true)

const aIconComponent = (props: { is: any }) => h(props.is)

const showInfo = (type: string) => {
  const messages: Record<string, string> = {
    appVersion: '当前应用版本 v1.0.0 MVP版本',
    dataBackup: '数据备份功能开发中，敬请期待',
    reminderSettings: '提醒设置功能开发中',
    theme: '主题设置功能开发中',
    language: '语言设置功能开发中'
  }
  message.info(messages[type] || '功能开发中')
}

const handleExportData = () => {
  message.info('数据导出功能开发中')
}

const handleClearCache = () => {
  message.confirm({
    title: '确定要清除缓存吗？',
    content: '清除缓存不会删除你的植物数据',
    okText: '确定',
    cancelText: '取消',
    onOk() {
      message.success('缓存已清除')
    }
  })
}

const handleRateApp = () => {
  message.info('感谢您的支持！请在应用商店给我们好评')
}
</script>

<style scoped>
.profile-view {
  padding-bottom: 20px;
}

.profile-card {
  margin-bottom: 16px;
  border-radius: 12px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.profile-avatar {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 20px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 4px;
}

.profile-bio {
  font-size: 14px;
  color: #8c8c8c;
}

.list-icon {
  font-size: 20px;
  color: #52c41a;
}

.clickable-item {
  cursor: pointer;
  transition: background 0.2s;
}

.clickable-item:hover {
  background: #fafafa;
}

.list-extra {
  color: #8c8c8c;
}

.list-arrow {
  color: #8c8c8c;
  font-size: 14px;
}

.about-card {
  margin-bottom: 16px;
  border-radius: 12px;
}

.heart-icon {
  color: #ff4d4f;
}

.about-text {
  font-size: 14px;
  color: #595959;
  line-height: 1.8;
  margin: 0 0 12px 0;
}

.about-text:last-child {
  margin-bottom: 0;
}

.quick-actions-card {
  margin-bottom: 16px;
  border-radius: 12px;
}

.quick-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 8px;
  cursor: pointer;
  transition: transform 0.2s;
  border-radius: 8px;
}

.quick-action:hover {
  background: #fafafa;
  transform: translateY(-2px);
}

.action-icon {
  font-size: 28px;
  color: #52c41a;
  margin-bottom: 8px;
}

.action-text {
  font-size: 13px;
  color: #595959;
}

.footer {
  text-align: center;
  padding: 24px 16px;
}

.footer-text {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0 0 8px 0;
}

.footer-copyright {
  font-size: 12px;
  color: #bfbfbf;
  margin: 0;
}
</style>
