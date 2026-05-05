import { NativeBiometric } from '@capgo/capacitor-native-biometric'

export async function checkBiometricAvailability() {
  try {
    // Check if we are in a web environment (non-native)
    if (typeof window !== 'undefined' && !(window as unknown as { Capacitor?: unknown }).Capacitor) {
      // Return true to match user's web experience, allowing the UI to show
      return true
    }
    
    const result = await NativeBiometric.isAvailable()
    // Returns true if hardware is present, even if no fingerprints are enrolled on some platforms
    return result.isAvailable
  } catch (error) {
    console.warn('Biometric availability check failed', error)
    // If it's web, it might fail because the plugin isn't there, but we want it visible
    if (typeof window !== 'undefined' && !(window as unknown as { Capacitor?: unknown }).Capacitor) {
      return true
    }

    return false
  }
}


export async function setBiometricCredentials(email: string, password: string) {
  try {
    await NativeBiometric.setCredentials({
      username: email,
      password: password,
      server: 'swiftpay.app',
    })
    localStorage.setItem('swiftpay_biometric_email', email)
    return true
  } catch (error) {
    console.error('Failed to set biometric credentials', error)
    return false
  }
}

export async function getBiometricCredentials() {
  try {
    const email = localStorage.getItem('swiftpay_biometric_email')
    if (!email) return null

    const result = await NativeBiometric.getCredentials({
      server: 'swiftpay.app',
    })

    return {
      email: result.username,
      password: result.password
    }
  } catch (error) {
    console.error('Failed to get biometric credentials', error)
    return null
  }
}

export async function deleteBiometricCredentials() {
  try {
    await NativeBiometric.deleteCredentials({
      server: 'swiftpay.app',
    })
    localStorage.removeItem('swiftpay_biometric_email')
    return true
  } catch (error) {
    console.error('Failed to delete biometric credentials', error)
    return false
  }
}

export async function authenticateWithBiometrics() {
  try {
    const available = await checkBiometricAvailability()
    if (!available) return null

    await NativeBiometric.verify({
      reason: 'Please authenticate to log in to SwiftPay',
      title: 'Biometric Login',
      subtitle: 'Authenticate using Fingerprint/Face',
      description: 'Quickly access your account',
      negativeButtonText: 'Cancel',
    })

    return await getBiometricCredentials()
  } catch (error) {
    console.error('Biometric authentication failed', error)
    return null
  }
}
