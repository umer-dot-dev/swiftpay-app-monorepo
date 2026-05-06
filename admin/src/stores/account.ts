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

      transactions.value = await request('/transactions')
    } catch (error) {
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
