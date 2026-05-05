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
      notifications.value = data
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
    // This could be an API call if implemented on backend, 
    // for now we'll do it sequentially or just update local state
    const unread = notifications.value.filter(n => !n.is_read)
    await Promise.all(unread.map(n => markAsRead(n.id)))
  }

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  }
})
