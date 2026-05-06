import { defineStore } from 'pinia'
import { ref } from 'vue'
import { request } from '../api'

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  is_read: boolean
  created_at: string
}

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([])
  const unreadCount = ref(0)
  const loading = ref(false)

  async function fetchNotifications() {
    try {
      loading.value = true
      const data = await request('/notifications')
      // Ensure DESC order (newest first)
      notifications.value = (data as Notification[]).sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      unreadCount.value = notifications.value.filter(n => !n.is_read).length
    } catch (e) {
      console.error('Failed to fetch notifications', e)
    } finally {
      loading.value = false
    }
  }

  async function markAsRead(id: string) {
    try {
      await request(`/notifications/${id}/read`, { method: 'PATCH' })
      const notif = notifications.value.find(n => n.id === id)
      if (notif && !notif.is_read) {
        notif.is_read = true
        unreadCount.value--
      }
    } catch (e) {
      console.error('Failed to mark notification as read', e)
    }
  }

  async function markAllAsRead() {
    try {
      await request('/notifications/read-all', { method: 'PATCH' })
      notifications.value.forEach(n => {
        n.is_read = true
      })
      unreadCount.value = 0
    } catch (e) {
      console.error('Failed to mark all notifications as read', e)
    }
  }

  async function clearAllNotifications() {
    try {
      await request('/notifications/all', { method: 'DELETE' })
      notifications.value = []
      unreadCount.value = 0
      void fetchNotifications()
    } catch (e) {
      console.error('Failed to clear all notifications', e)
    }
  }

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    clearAllNotifications
  }
})
