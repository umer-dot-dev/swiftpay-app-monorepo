<template>
  <q-page class="flex flex-center auth-bg">
    <q-card class="auth-card glass-panel" flat>
      <q-card-section class="q-pt-xl q-pb-lg text-center">
        <div class="text-h4 text-weight-bold text-primary q-mb-xs">Join SwiftPay</div>
        <div class="text-subtitle1 text-grey-7">Start your digital banking journey.</div>
      </q-card-section>

      <q-card-section class="q-px-xl">
        <q-form @submit="handleSubmit" class="q-gutter-md">
          <q-input
            v-model="form.full_name"
            label="Full Name"
            outlined
            rounded
            bg-color="white"
            :rules="[val => !!val || 'Name is required']"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="primary" />
            </template>
          </q-input>

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
            type="password"
            outlined
            rounded
            bg-color="white"
            :rules="[val => !!val || 'Password is required', val => val.length >= 8 || 'Minimum 8 characters']"
          >
            <template v-slot:prepend>
              <q-icon name="lock" color="primary" />
            </template>
          </q-input>

          <div class="q-mt-lg">
            <q-btn
              label="Create Account"
              type="submit"
              color="primary"
              class="full-width rounded-lg q-py-md text-weight-bold"
              size="lg"
              :loading="loading"
              unelevated
            />
          </div>
        </q-form>
      </q-card-section>

      <q-card-section class="text-center q-pb-xl">
        <div class="text-grey-7 text-subtitle2">
          Already have an account? 
          <q-btn flat color="primary" label="Login" to="/login" class="text-weight-bold" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import { useQuasar } from 'quasar'

const router = useRouter()
const auth = useAuthStore()
const $q = useQuasar()

const loading = ref(false)
const form = reactive({
  full_name: '',
  email: '',
  password: ''
})

async function handleSubmit() {
  loading.value = true
  try {
    await auth.register(form)
    $q.notify({ type: 'positive', message: 'Account created successfully!' })
    await router.push('/')
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Signup failed'
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
