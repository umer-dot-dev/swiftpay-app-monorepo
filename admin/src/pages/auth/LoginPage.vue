<template>
  <q-page class="flex flex-center auth-bg">
    <q-card class="auth-card glass-panel" flat>
      <q-card-section class="q-pt-xl q-pb-lg text-center">
        <div class="row justify-center q-mb-md">
          <div class="logo-circle bg-white row items-center justify-center border-radius-12 overflow-hidden shadow-1">
            <q-img src="logo.png" style="width: 72px; height: 72px;" fit="contain" />
          </div>
        </div>
        <div class="text-h4 text-weight-bold text-primary q-mb-xs">SwiftPay</div>
        <div class="text-subtitle1 text-grey-7">Welcome back! Please login.</div>
      </q-card-section>

      <q-card-section class="q-px-xl">
        <q-form @submit="handleSubmit" class="q-gutter-md">
          <q-input
            v-model="form.email"
            label="Email Address"
            outlined
            rounded
            bg-color="white"
            :rules="[val => !!val || 'Email is required', val => /.+@.+\..+/.test(val) || 'Invalid email']"
          >
            <template v-slot:prepend>
              <q-icon name="email" color="primary" />
            </template>
          </q-input>

          <q-input
            v-model="form.password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            outlined
            rounded
            bg-color="white"
            :rules="[val => !!val || 'Password is required']"
          >
            <template v-slot:prepend>
              <q-icon name="lock" color="primary" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <div v-if="biometricAvailable && !auth.isBiometricEnabled" class="q-mt-sm">
            <q-checkbox
              v-model="useBiometrics"
              label="Enable Biometric Login"
              color="primary"
              dense
              class="text-grey-8"
            />
          </div>

          <div class="q-mt-lg">
            <div class="row items-center q-gutter-x-md">
              <q-btn
                label="Login"
                type="submit"
                color="primary"
                rounded
                class="col q-py-md text-weight-bold"
                :loading="loading"
                style="font-size: 1.1rem; letter-spacing: 1px;"
              />
              
              <q-btn
                v-if="auth.isBiometricEnabled"
                round
                elevated
                padding="md"
                color="primary"
                icon="fingerprint"
                @click="handleBiometricLogin"
              >
                <q-tooltip>Login with Biometrics</q-tooltip>
              </q-btn>
            </div>
          </div>
        </q-form>
      </q-card-section>

      <q-card-section class="text-center q-pb-xl">
        <div class="text-grey-7 text-subtitle2">
          Don't have an account? 
          <q-btn flat color="primary" label="Sign Up" to="/signup" class="text-weight-bold" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import { useQuasar } from 'quasar'
import { authenticateWithBiometrics, checkBiometricAvailability } from 'src/utils/biometric'

const router = useRouter()
const auth = useAuthStore()
const $q = useQuasar()

const loading = ref(false)
const showPassword = ref(false)
const biometricAvailable = ref(false)
const useBiometrics = ref(false)

const form = reactive({
  email: '',
  password: ''
})

onMounted(async () => {
  // Check availability
  biometricAvailable.value = await checkBiometricAvailability()
  
  // If biometrics enabled, try to auto-authenticate after a small delay for UI smoothness
  if (auth.isBiometricEnabled) {
    setTimeout(() => {
      void handleBiometricLogin()
    }, 500)
  }
})

async function handleBiometricLogin() {
  const credentials = await authenticateWithBiometrics()
  if (credentials) {
    loading.value = true
    try {
      await auth.login(credentials)
      $q.notify({ type: 'positive', message: 'Logged in with biometrics!' })
      await router.push('/')
    } catch {
      $q.notify({ type: 'negative', message: 'Biometric login failed on server' })
    } finally {
      loading.value = false
    }
  }
}

async function handleSubmit() {
  loading.value = true
  try {
    await auth.login(form, useBiometrics.value)
    $q.notify({ type: 'positive', message: 'Welcome back!' })
    await router.push('/')
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Login failed'
    $q.notify({ type: 'negative', message })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.auth-bg {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.auth-card {
  width: 100%;
  max-width: 450px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
}

.rounded-lg {
  border-radius: 12px;
}
</style>
