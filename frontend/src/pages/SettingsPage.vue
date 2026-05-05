<template>
  <q-page class="settings-page q-pa-md q-pa-md-xl">
    <div class="row items-center justify-between q-mb-xl">
      <div>
        <div class="text-h4 text-weight-bolder text-primary tracking-tight">{{ $t('settings') }}</div>
        <div class="text-subtitle1 text-grey-7">Manage your account preferences</div>
      </div>
    </div>

    <div class="row q-col-gutter-xl">
      <!-- Sidebar / Tab list -->
      <div class="col-12 col-md-3">
        <q-card class="no-border no-shadow border-radius-24 q-pa-md sticky-nav">
          <q-tabs
            v-model="tab"
            :vertical="$q.screen.gt.sm"
            class="text-grey-7"
            active-color="primary"
            active-bg-color="blue-1"
            indicator-color="transparent"
            align="left"
            narrow-indicator
          >
            <q-tab name="profile" icon="person" :label="$q.screen.gt.sm ? $t('profile') : ''" class="border-radius-16 q-py-md tab-item" />
            <q-tab name="security" icon="security" :label="$q.screen.gt.sm ? $t('security') : ''" class="border-radius-16 q-py-md tab-item" />
            <q-tab name="notifications" icon="notifications" :label="$q.screen.gt.sm ? $t('notifications') : ''" class="border-radius-16 q-py-md tab-item" />
            <q-tab name="preferences" icon="tune" :label="$q.screen.gt.sm ? $t('preferences') : ''" class="border-radius-16 q-py-md tab-item" />
          </q-tabs>
        </q-card>
      </div>

      <!-- Main Content -->
      <div class="col-12 col-md-9">
        <q-tab-panels v-model="tab" animated class="bg-transparent no-shadow">
          <!-- Profile Tab -->
          <q-tab-panel name="profile" class="q-pa-none">
            <q-card class="no-border no-shadow border-radius-32 q-pa-lg q-pa-sm-xl">
              <div class="row items-center q-mb-xl">
                <q-avatar size="100px" class="shadow-4">
                  <img :src="avatarUrl" alt="Profile avatar">
                  <q-badge floating color="primary" rounded class="q-pa-xs cursor-pointer" @click="triggerAvatarUpload">
                    <q-icon name="edit" color="white" size="14px" />
                  </q-badge>
                </q-avatar>
                <div class="q-ml-lg">
                  <div class="text-h5 text-weight-bold">{{ form.firstName }} {{ form.lastName }}</div>
                  <div class="text-grey-6">Software Engineer</div>
                  <q-btn outline color="primary" label="Change Avatar" no-caps class="q-mt-sm border-radius-8" size="sm" @click="triggerAvatarUpload" />
                  <input type="file" ref="avatarInput" class="hidden" accept="image/*" @change="handleAvatarChange" />
                </div>
              </div>

              <div class="text-h6 text-weight-bold q-mb-md">Personal Information</div>
              <div class="row q-col-gutter-lg q-mb-xl">
                <div class="col-12 col-sm-6">
                  <q-input outlined v-model="form.firstName" label="First Name" />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input outlined v-model="form.lastName" label="Last Name" />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input outlined v-model="form.email" label="Email Address" type="email" />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input outlined v-model="form.phone" label="Phone Number" mask="+92 ### #######" />
                </div>
              </div>
              
              <div class="row justify-end q-gutter-x-sm">
                <q-btn flat label="Cancel" color="grey-7" no-caps class="q-px-md text-weight-bold" @click="resetProfile" :disable="isSavingProfile" />
                <q-btn color="primary" label="Save Changes" rounded unelevated no-caps class="q-px-xl text-weight-bold" @click="saveProfile" :loading="isSavingProfile" />
              </div>
            </q-card>
          </q-tab-panel>

          <!-- Security Tab -->
          <q-tab-panel name="security" class="q-pa-none">
            <q-card class="no-border no-shadow border-radius-32 q-pa-lg q-pa-sm-xl">
              <div class="text-h6 text-weight-bold q-mb-lg">Password & Authentication</div>
              
              <q-list class="q-gutter-y-md">
                <q-item class="q-pa-md border-radius-16 control-item">
                  <q-item-section avatar>
                    <q-avatar color="red-1" text-color="red" icon="lock" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">Change Password</q-item-label>
                    <q-item-label caption>It's a good idea to use a strong password</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn outline color="grey-8" label="Update" no-caps class="border-radius-8" @click="showPasswordDialog = true" />
                  </q-item-section>
                </q-item>

                <q-item class="q-pa-md border-radius-16 control-item">
                  <q-item-section avatar>
                    <q-avatar color="blue-1" text-color="blue" icon="fingerprint" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">Biometric Login</q-item-label>
                    <q-item-label caption>Use fingerprint or Face ID to login</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-toggle v-model="security.biometric" color="primary" size="lg" @update:model-value="toggleSecurity('Biometric Login', security.biometric)" />
                  </q-item-section>
                </q-item>
                
                <q-item class="q-pa-md border-radius-16 control-item">
                  <q-item-section avatar>
                    <q-avatar color="green-1" text-color="green" icon="verified_user" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">Two-Factor Authentication</q-item-label>
                    <q-item-label caption>Add an extra layer of security</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-toggle v-model="security.twoFactor" color="primary" size="lg" @update:model-value="toggleSecurity('Two-Factor Authentication', security.twoFactor)" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </q-tab-panel>

          <!-- Notifications Tab -->
          <q-tab-panel name="notifications" class="q-pa-none">
            <q-card class="no-border no-shadow border-radius-32 q-pa-lg q-pa-sm-xl">
              <div class="text-h6 text-weight-bold q-mb-lg">Notification Preferences</div>
              <q-list class="q-gutter-y-md">
                <q-item v-for="notif in notifications" :key="notif.title" class="q-pa-md border-radius-16 control-item">
                  <q-item-section>
                    <q-item-label class="text-weight-bold">{{ notif.title }}</q-item-label>
                    <q-item-label caption>{{ notif.desc }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-toggle v-model="notif.value" color="primary" size="md" @update:model-value="toggleNotification(notif.title, notif.value)" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </q-tab-panel>
          
          <q-tab-panel name="preferences" class="q-pa-none">
            <q-card class="no-border no-shadow border-radius-32 q-pa-lg q-pa-sm-xl">
              <div class="text-h6 text-weight-bold q-mb-xl">{{ $t('app_preferences') }}</div>
              
              <div class="row q-col-gutter-xl">
                <!-- Left Column: Theme & Localization -->
                <div class="col-12 col-md-6">
                  <div class="text-subtitle1 text-weight-bold q-mb-md" :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-8'">{{ $t('appearance') }}</div>
                  <div class="row q-col-gutter-sm q-mb-xl">
                    <div class="col-4" v-for="t in themes" :key="t.value">
                      <q-card 
                        class="theme-card cursor-pointer flex flex-center column q-pa-md border-radius-16 transition-hover"
                        :class="preferences.theme === t.value ? ($q.dark.isActive ? 'selected-border bg-grey-9 text-primary' : 'selected-border bg-blue-1 text-primary') : ($q.dark.isActive ? 'bg-grey-10 text-grey-5' : 'bg-grey-1 text-grey-7')"
                        @click="setTheme(t.value)"
                        flat
                      >
                        <q-icon :name="t.icon" size="28px" class="q-mb-sm" />
                        <div class="text-weight-bold text-caption">{{ t.label }}</div>
                      </q-card>
                    </div>
                  </div>

                  <div class="text-subtitle1 text-weight-bold q-mb-md" :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-8'">{{ $t('language_region') }}</div>
                  <q-select outlined v-model="preferences.language" :options="languageOptions" label="Language" emit-value map-options class="q-mb-md text-weight-bold" behavior="menu" />
                  <q-select outlined v-model="preferences.currency" :options="currencyOptions" label="Default Currency" emit-value map-options class="text-weight-bold" behavior="menu" />
                </div>

                <!-- Right Column: Privacy & Data -->
                <div class="col-12 col-md-6">
                  <div class="text-subtitle1 text-weight-bold q-mb-md" :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-8'">{{ $t('privacy_data') }}</div>
                  <q-list class="q-gutter-y-sm">
                    <q-item class="q-pa-md border-radius-16 control-item">
                      <q-item-section>
                        <q-item-label class="text-weight-bold">Analytics Sharing</q-item-label>
                        <q-item-label caption>Help us improve by sharing crash reports</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-toggle v-model="preferences.analytics" color="primary" @update:model-value="savePreferences" />
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-md border-radius-16 control-item">
                      <q-item-section>
                        <q-item-label class="text-weight-bold">Personalized Offers</q-item-label>
                        <q-item-label caption>Receive tailored financial products</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-toggle v-model="preferences.offers" color="primary" @update:model-value="savePreferences" />
                      </q-item-section>
                    </q-item>
                  </q-list>
                  
                  <q-btn color="negative" outline :label="$t('delete_account')" icon="warning" no-caps class="full-width q-mt-xl q-py-md text-weight-bold border-radius-16" @click="confirmDeleteAccount = true" />
                </div>
              </div>
            </q-card>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>

    <!-- Password Dialog -->
    <q-dialog v-model="showPasswordDialog" :position="$q.screen.lt.sm ? 'bottom' : 'standard'">
      <q-card class="column no-wrap" :class="[$q.screen.lt.sm ? 'border-radius-top-32' : 'border-radius-32', $q.dark.isActive ? 'bg-grey-10' : 'bg-white']" style="width: 100%; max-width: 400px;">
        <q-card-section class="q-pa-lg row items-center justify-between pb-none">
          <div class="text-h5 text-weight-bolder" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">Update Password</div>
          <q-btn icon="close" flat round dense v-close-popup color="grey-6" />
        </q-card-section>
        
        <q-card-section class="q-pa-lg pt-none">
          <div class="text-subtitle2 text-grey-6 text-uppercase tracking-widest q-mb-xs text-weight-bold">Current Password</div>
          <q-input v-model="passwords.current" outlined type="password" rounded class="q-mb-md text-weight-bold" placeholder="••••••••" />
          
          <div class="text-subtitle2 text-grey-6 text-uppercase tracking-widest q-mb-xs mt-md text-weight-bold">New Password</div>
          <q-input v-model="passwords.new" outlined type="password" rounded class="q-mb-md text-weight-bold" placeholder="••••••••" />
          
          <div class="text-subtitle2 text-grey-6 text-uppercase tracking-widest q-mb-xs text-weight-bold">Confirm New Password</div>
          <q-input v-model="passwords.confirm" outlined type="password" rounded class="q-mb-xl text-weight-bold" placeholder="••••••••" />
          
          <q-btn :color="$q.dark.isActive ? 'primary' : 'dark'" label="Secure Password" unelevated rounded class="full-width q-py-md text-weight-bold text-subtitle1 shadow-1" @click="confirmPasswordChange" :loading="isUpdatingPassword" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Delete Account Dialog -->
    <q-dialog v-model="confirmDeleteAccount" persistent :position="$q.screen.lt.sm ? 'bottom' : 'standard'">
      <q-card class="border-radius-24" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-white'" style="width: 100%; max-width: 400px">
        <q-card-section class="q-pa-lg text-center column items-center">
          <q-avatar icon="warning" color="red-1" text-color="red" size="80px" class="q-mb-md shadow-1" />
          <div class="text-h6 text-weight-bold q-mb-sm" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">Delete Account?</div>
          <p class="text-grey-7 q-mb-none">This action is irreversible. All your financial data, transaction histories, and stored cards will be permanently removed.</p>
        </q-card-section>
        <q-card-actions class="q-pa-md row justify-between" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-1'">
          <q-btn flat label="Cancel" color="grey-8" class="col text-weight-bold q-mr-sm" v-close-popup />
          <q-btn flat label="Yes, Delete" color="negative" class="col text-weight-bold" :class="$q.dark.isActive ? 'bg-red-10' : 'bg-red-1'" @click="executeDelete" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth'

const $q = useQuasar()
const { locale } = useI18n({ useScope: 'global' })
const authStore = useAuthStore()

const tab = ref('profile')

// --- Avatar Logic ---
const avatarInput = ref<HTMLInputElement | null>(null)
const avatarUrl = ref('https://cdn.quasar.dev/img/avatar.png')

const triggerAvatarUpload = () => {
  if (avatarInput.value) avatarInput.value.click()
}

// --- Profile Form Logic ---
const defaultProfile = {
  firstName: 'Umer',
  lastName: 'Sheraz Ali',
  email: 'umersherazali@example.com',
  phone: '3001234567'
}

const form = ref({ ...defaultProfile })
const originalForm = ref({ ...defaultProfile })
const isSavingProfile = ref(false)

onMounted(() => {
  // Populate from Auth Store first
  if (authStore.user) {
    const names = (authStore.user.full_name || '').split(' ')
    form.value.firstName = names[0] || ''
    form.value.lastName = names.slice(1).join(' ') || ''
    form.value.email = authStore.user.email || ''
    if (authStore.user.avatar_url) {
      avatarUrl.value = authStore.user.avatar_url
    }
  }

  const saved = localStorage.getItem('swiftpay_profile')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      form.value = { ...defaultProfile, ...parsed }
      originalForm.value = { ...form.value }
    } catch {
      // safe fallback
    }
  }
  
  const savedPrefs = localStorage.getItem('swiftpay_prefs')
  if (savedPrefs) {
    try {
      const parsed = JSON.parse(savedPrefs)
      preferences.value = { ...preferences.value, ...parsed }
      $q.dark.set(preferences.value.theme === 'dark' ? true : preferences.value.theme === 'light' ? false : 'auto')
      locale.value = preferences.value.language
    } catch {
      // safe fallback
    }
  }
  
  // Load avatar if any
  const savedAvatar = localStorage.getItem('swiftpay_avatar')
  if (savedAvatar) {
    avatarUrl.value = savedAvatar
  }
})

// Optional: save avatar persistence
const handleAvatarChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          avatarUrl.value = e.target.result as string
          localStorage.setItem('swiftpay_avatar', avatarUrl.value)
          $q.notify({ message: 'Avatar updated successfully', color: 'positive', position: 'top', icon: 'check_circle', classes: 'text-weight-bold', timeout: 2500 })
        }
      }
      reader.readAsDataURL(file)
    }
  }
}

const resetProfile = () => {
  form.value = { ...originalForm.value }
}

const saveProfile = () => {
  isSavingProfile.value = true
  setTimeout(() => {
    originalForm.value = { ...form.value }
    localStorage.setItem('swiftpay_profile', JSON.stringify(form.value))
    
    // Update Auth Store as well
    if (authStore.user) {
      authStore.user.full_name = `${form.value.firstName} ${form.value.lastName}`.trim()
      authStore.user.email = form.value.email
      localStorage.setItem('swiftpay_user', JSON.stringify(authStore.user))
    }
    
    isSavingProfile.value = false
    $q.notify({ message: 'Profile updated successfully', color: 'positive', position: 'top', icon: 'check_circle', classes: 'text-weight-bold', timeout: 2500 })
  }, 800)
}

// --- Security Toggles Logic ---
const security = ref({
  biometric: true,
  twoFactor: false
})

const toggleSecurity = (feature: string, st: boolean) => {
  $q.notify({
    message: `${feature} ${st ? 'enabled' : 'disabled'}`,
    color: st ? 'positive' : 'warning',
    icon: st ? 'verified_user' : 'security_update_warning',
    position: 'top',
    classes: 'text-weight-bold',
    timeout: 2500
  })
}

// --- Password Dialog Logic ---
const showPasswordDialog = ref(false)
const isUpdatingPassword = ref(false)
const passwords = ref({
  current: '',
  new: '',
  confirm: ''
})

const confirmPasswordChange = () => {
  if (!passwords.value.current || !passwords.value.new || !passwords.value.confirm) {
    $q.notify({ message: 'Please fill out all fields', color: 'negative', position: 'top', icon: 'warning', classes: 'text-weight-bold', timeout: 2500 })
    return
  }
  if (passwords.value.new !== passwords.value.confirm) {
    $q.notify({ message: 'Passwords do not match', color: 'negative', position: 'top', icon: 'warning', classes: 'text-weight-bold', timeout: 2500 })
    return
  }
  
  isUpdatingPassword.value = true
  setTimeout(() => {
    isUpdatingPassword.value = false
    showPasswordDialog.value = false
    passwords.value = { current: '', new: '', confirm: '' }
    $q.notify({ message: 'Password updated successfully', color: 'positive', position: 'top', icon: 'lock', classes: 'text-weight-bold', timeout: 2500 })
  }, 1000)
}

// --- Notifications Logic ---
const notifications = ref([
  { title: 'Email Notifications', desc: 'Receive daily summary via email', value: true },
  { title: 'Push Notifications', desc: 'Get instant alerts on your device', value: true },
  { title: 'Transactions Alerts', desc: 'Notify me for every transaction', value: true },
  { title: 'Promotions', desc: 'Receive offers and updates', value: false }
])

const toggleNotification = (feature: string, st: boolean) => {
  $q.notify({
     message: `${feature} turned ${st ? 'ON' : 'OFF'}`,
     color: 'primary',
     icon: st ? 'notifications_active' : 'notifications_off',
     position: 'top',
     classes: 'text-weight-bold',
     timeout: 2000
  })
}

// --- Preferences Logic ---
const preferences = ref({
  theme: 'system',
  language: 'en',
  currency: 'PKR',
  analytics: true,
  offers: false
})

const themes = [
  { label: 'Light', value: 'light', icon: 'light_mode' },
  { label: 'Dark', value: 'dark', icon: 'dark_mode' },
  { label: 'System', value: 'system', icon: 'settings_brightness' }
]

const languageOptions = [
  { label: 'English (US)', value: 'en' },
  { label: 'Spanish (ES)', value: 'es' },
  { label: 'French (FR)', value: 'fr' }
]

const currencyOptions = [
  { label: 'Pakistani Rupee (PKR)', value: 'PKR' },
  { label: 'US Dollar (USD)', value: 'USD' },
  { label: 'Euro (EUR)', value: 'EUR' }
]

const savePreferences = () => {
  localStorage.setItem('swiftpay_prefs', JSON.stringify(preferences.value))
}

const setTheme = (theme: string) => {
  preferences.value.theme = theme
  $q.dark.set(theme === 'dark' ? true : theme === 'light' ? false : 'auto')
  savePreferences()
}

watch(() => preferences.value.language, (newLang) => {
  locale.value = newLang
  savePreferences()
})
watch(() => preferences.value.currency, () => savePreferences())

const confirmDeleteAccount = ref(false)

const executeDelete = () => {
  confirmDeleteAccount.value = false
  $q.notify({
    message: 'Account permanently deleted (Simulation)',
    color: 'negative',
    icon: 'warning',
    position: 'top',
    classes: 'text-weight-bold',
    timeout: 3000
  })
}
</script>

<style scoped>
.settings-page {
  /* Let Quasar manage layout background when in dark mode */
}

/* Base Light Mode override if explicitly needed */
body:not(.body--dark) .settings-page {
  background: #fbfcfe;
}

.border-radius-32 {
  border-radius: 32px !important;
}

.border-radius-24 {
  border-radius: 24px !important;
}

.border-radius-16 {
  border-radius: 16px !important;
}

.border-radius-8 {
  border-radius: 8px !important;
}

.tracking-tight {
  letter-spacing: -0.05em;
}

.tab-item {
  transition: all 0.3s ease;
  justify-content: flex-start !important;
  text-align: left !important;
  padding-left: 20px;
}

.tab-item:deep(.q-tab__content) {
  width: 100%;
  justify-content: flex-start;
}

.sticky-nav {
  position: sticky;
  top: 24px;
}

.control-item {
  border: 1px solid var(--q-grey-2);
  transition: all 0.3s ease;
}

body.body--dark .control-item {
  border-color: var(--q-dark-separator);
}

.control-item:hover {
  background: var(--q-grey-1);
  border-color: var(--q-primary);
}

body.body--dark .control-item:hover {
  background: var(--q-dark-page);
  border-color: var(--q-primary);
}

.q-input:deep(.q-field__control) {
  border-radius: 12px;
}

.hidden {
  display: none !important;
}

.pb-none { padding-bottom: 0 !important; }
.pt-none { padding-top: 0 !important; }

.border-radius-top-32 {
  border-top-left-radius: 32px !important;
  border-top-right-radius: 32px !important;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
</style>
