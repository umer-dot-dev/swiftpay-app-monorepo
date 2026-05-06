import { defineStore } from 'pinia'
import { ref } from 'vue'
import { request } from '../api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('swiftpay_user') || 'null'))
  const token = ref(localStorage.getItem('swiftpay_token') || null)
  const isAuthenticated = ref(!!token.value)
  const isBiometricEnabled = ref(localStorage.getItem('swiftpay_biometric_enabled') === 'true')

  async function login(credentials: Record<string, string>, saveForBiometrics = false) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
    
    setAuth(data.user, data.token)

    if (saveForBiometrics && credentials.email && credentials.password) {
      const { setBiometricCredentials } = await import('../utils/biometric')
      const success = await setBiometricCredentials(credentials.email, credentials.password)
      if (success) {
        isBiometricEnabled.value = true
        localStorage.setItem('swiftpay_biometric_enabled', 'true')
      }
    }

    return data
  }

  async function register(userDetails: Record<string, string>) {
    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userDetails)
    })
    
    setAuth(data.user, data.token)
    return data
  }

  function setAuth(userData: Record<string, unknown>, userToken: string) {
    user.value = userData
    token.value = userToken
    isAuthenticated.value = true
    
    localStorage.setItem('swiftpay_user', JSON.stringify(userData))
    localStorage.setItem('swiftpay_token', userToken)
  }

  function logout() {
    user.value = null
    token.value = null
    isAuthenticated.value = false
    localStorage.removeItem('swiftpay_user')
    localStorage.removeItem('swiftpay_token')
  }

  function updateStatus(newStatus: string) {
    if (user.value) {
      user.value.status = newStatus
      localStorage.setItem('swiftpay_user', JSON.stringify(user.value))
    }
  }

  function disableBiometrics() {
    isBiometricEnabled.value = false
    localStorage.removeItem('swiftpay_biometric_enabled')
  }

  return {
    user,
    token,
    isAuthenticated,
    isBiometricEnabled,
    login,
    register,
    logout,
    updateStatus,
    disableBiometrics
  }
})
