<template>
  <q-menu anchor="bottom right" self="top right" :offset="[0, 8]" class="notification-menu border-radius-24 no-shadow">
    <div class="row items-center justify-between q-pa-md border-bottom">
      <div class="text-h6 text-weight-bold">Notifications</div>
      <q-btn flat dense no-caps color="primary" label="Mark all read" class="text-caption text-weight-medium" @click="store.markAllAsRead" />
    </div>

    <q-list class="notification-list pb-sm">
      <q-item 
        v-for="notif in store.notifications" 
        :key="notif.id" 
        clickable 
        v-ripple
        :class="['q-py-md px-lg transition-hover', { 'bg-blue-0': !notif.is_read }]"
        @click="store.markAsRead(notif.id)"
      >
        <q-item-section avatar top>
          <q-avatar :color="getColor(notif.type) + '-1'" :text-color="getColor(notif.type)" :icon="getIcon(notif.type)" rounded class="soft-avatar" />
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-weight-bold text-subtitle2 q-mb-xs">{{ notif.title }}</q-item-label>
          <q-item-label caption lines="2" class="text-grey-7">{{ notif.message }}</q-item-label>
          <q-item-label caption class="text-primary text-weight-medium q-mt-sm">
            {{ formatFullDate(notif.created_at) }}
          </q-item-label>
        </q-item-section>
        
        <q-item-section side top v-if="!notif.is_read">
          <q-badge color="accent" rounded class="unread-dot" />
        </q-item-section>
      </q-item>

      <div v-if="store.notifications.length === 0" class="text-center q-pa-xl column items-center">
        <q-icon name="notifications_none" size="48px" color="grey-4" />
        <div class="text-body1 text-grey-6 q-mt-sm font-weight-bold">You're all caught up!</div>
      </div>
    </q-list>
    
    <div class="q-pa-sm text-center border-top">
      <q-btn flat full-width color="grey-8" label="View all notifications" no-caps class="text-weight-bold" />
    </div>
  </q-menu>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useNotificationStore } from 'src/stores/notifications'
import { date } from 'quasar'

const store = useNotificationStore()
let pollingInterval: ReturnType<typeof setInterval> | null = null

const getIcon = (type: string) => {
  switch (type) {
    case 'success': return 'check_circle'
    case 'warning': return 'warning'
    case 'error': return 'error'
    default: return 'notifications'
  }
}

const getColor = (type: string) => {
  switch (type) {
    case 'success': return 'green'
    case 'warning': return 'orange'
    case 'error': return 'red'
    default: return 'primary'
  }
}

const formatFullDate = (timestamp: string) => {
  // Ensure the timestamp is treated as UTC if no timezone is specified
  const utcDate = timestamp.endsWith('Z') || timestamp.includes('+') 
    ? timestamp 
    : timestamp.replace(' ', 'T') + 'Z'
    
  return date.formatDate(utcDate, 'MMMM D, YYYY • h:mm A')
}

onMounted(() => {
  void store.fetchNotifications()
  // Poll every 10 seconds for real-time feel
  pollingInterval = setInterval(() => {
    void store.fetchNotifications()
  }, 10000)
})

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval)
})
</script>

<style scoped>
.notification-menu {
  width: 380px;
  max-width: 90vw;
  border: 1px solid rgba(226, 232, 240, 0.8) !important;
  box-shadow: 0 40px 80px -20px rgba(15, 23, 42, 0.15) !important;
}

.border-radius-24 {
  border-radius: 24px !important;
}

.border-bottom {
  border-bottom: 1px solid #f1f5f9;
}

.border-top {
  border-top: 1px solid #f1f5f9;
}

.soft-avatar {
  border-radius: 14px;
}

.notification-list {
  max-height: 450px;
  overflow-y: auto;
}

.transition-hover {
  transition: all 0.3s ease;
}

.transition-hover:hover {
  background: #f8fafc;
}

.unread-dot {
  width: 8px;
  height: 8px;
  padding: 0;
  min-height: unset;
}
</style>
