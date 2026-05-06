import { defineStore } from 'pinia'
import { ref } from 'vue'
import { request } from '../api'

export const useAccountStore = defineStore('account', () => {
  const balance = ref(0)
  const accountNumber = ref('')
  const transactions = ref([])
  const isLoading = ref(false)

  const fetchDashboardData = async () => {
    isLoading.value = true
    try {
      // Fetch balance and transactions using the new request utility
      const balanceData = await request('/accounts/balance')
      balance.value = balanceData.balance
      accountNumber.value = balanceData.accountNumber
      
      // Sync status to auth store
      const authStore = (await import('./auth')).useAuthStore()
      authStore.updateStatus(balanceData.status)

      transactions.value = await request('/transactions')
    } catch (error) {
      // If request failed, check if it's because we are blocked
      const authStore = (await import('./auth')).useAuthStore()
      const storedUser = localStorage.getItem('swiftpay_user')
      if (storedUser) {
        const user = JSON.parse(storedUser)
        if (user.status === 'blocked') {
          authStore.updateStatus('blocked')
        }
      }
      console.error('Failed to fetch dashboard data', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    balance,
    accountNumber,
    transactions,
    isLoading,
    fetchDashboardData
  }
})
