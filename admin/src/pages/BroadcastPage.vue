<template>
  <q-page class="q-pa-md q-pa-md-xl">
    <div class="row items-center justify-between q-gutter-y-md q-mb-xl">
      <div class="col-12 col-sm-auto">
        <div class="text-h4 text-weight-bold text-primary">System Broadcast</div>
        <div class="text-subtitle1 text-grey-7">Send push notifications and global alerts.</div>
      </div>
      <div class="col-12 col-sm-auto row q-gutter-sm">
        <q-btn
          :color="pushEnabled ? 'positive' : 'grey-7'"
          :label="pushEnabled ? 'Push Active' : 'Enable Push Notifications'"
          :icon="pushEnabled ? 'notifications_active' : 'notifications_paused'"
          unelevated
          @click="togglePush"
          :loading="pushLoading"
          class="border-radius-12 q-px-md"
        />
        <q-btn
          v-if="pushEnabled"
          color="primary"
          outline
          label="Test Real-time Push"
          icon="sensors"
          @click="sendTestPush"
          class="border-radius-12 q-px-md"
        />
      </div>
    </div>

    <div class="row q-col-gutter-xl">
      <div class="col-12 col-md-6">
        <q-card flat class="glass-panel border-radius-20 q-pa-md">
          <q-card-section>
            <div class="text-h6 text-weight-bold q-mb-lg">Compose Notification</div>
            <q-form @submit="sendBroadcast" class="q-gutter-md">
              <q-input
                v-model="notification.title"
                label="Notification Title"
                outlined
                rounded
                bg-color="white"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please type a title']"
              >
                <template v-slot:prepend>
                  <q-icon name="title" color="primary" />
                </template>
              </q-input>

              <q-input
                v-model="notification.message"
                label="Message Content"
                type="textarea"
                outlined
                rounded
                bg-color="white"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please type a message']"
              >
                <template v-slot:prepend>
                  <q-icon name="message" color="primary" />
                </template>
              </q-input>

              <q-select
                v-model="notification.type"
                :options="['info', 'success', 'warning', 'error']"
                label="Severity Level"
                outlined
                rounded
                bg-color="white"
              >
                <template v-slot:prepend>
                  <q-icon name="priority_high" color="primary" />
                </template>
              </q-select>

              <div class="row justify-end q-mt-lg">
                <q-btn label="Reset" type="reset" color="grey-7" flat class="q-mr-sm border-radius-12" />
                <q-btn label="Broadcast to All" type="submit" color="primary" unelevated :loading="sending" icon="send" class="border-radius-12 q-px-lg" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card flat class="glass-panel border-radius-20 q-pa-md">
          <q-card-section>
            <div class="text-h6 text-weight-bold q-mb-lg">Broadcast History</div>
          </q-card-section>
          <q-list separator>
            <q-item v-for="n in recentBroadcasts" :key="n.id" class="q-py-lg">
              <q-item-section avatar>
                <div class="icon-box" :class="'bg-' + getColor(n.type) + '-1'">
                  <q-icon :name="getIcon(n.type)" :color="getColor(n.type)" size="28px" />
                </div>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold text-dark">{{ n.title }}</q-item-label>
                <q-item-label caption lines="2" class="text-grey-6">{{ n.message }}</q-item-label>
                <q-item-label caption class="q-mt-xs text-primary text-weight-medium">{{ n.date }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge color="blue-1" text-color="blue-9" label="SENT" class="q-px-sm q-py-xs border-radius-12" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { request } from 'src/api'

const $q = useQuasar()
const sending = ref(false)
const pushEnabled = ref(false)
const pushLoading = ref(false)

const notification = ref({
  title: '',
  message: '',
  type: 'info'
})

const recentBroadcasts = ref([
  { id: 1, title: 'System Maintenance', message: 'SwiftPay will be undergoing maintenance on Saturday from 2 AM to 4 AM.', type: 'warning', date: '2 days ago' },
  { id: 2, title: 'New Cashback Offer', message: 'Get 5% cashback on all bill payments this weekend!', type: 'success', date: '5 days ago' }
])

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function togglePush() {
  if (pushEnabled.value) {
    pushEnabled.value = false
    return
  }

  pushLoading.value = true
  try {
    const registration = await navigator.serviceWorker.register('/sw.js')
    
    // Get public key from backend
    const { publicKey } = await request('/push/key')
    
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey)
    })

    await request('/push/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription)
    })

    pushEnabled.value = true
    $q.notify({
      type: 'positive',
      message: 'Real-time push notifications enabled!',
      icon: 'notifications_active'
    })
  } catch (err) {
    console.error('Failed to subscribe to push:', err)
    $q.notify({
      type: 'negative',
      message: 'Failed to enable push notifications. Check console for details.'
    })
  } finally {
    pushLoading.value = false
  }
}

async function sendTestPush() {
  try {
    await request('/push/send-test', { method: 'POST' })
    $q.notify({
      type: 'info',
      message: 'Test push signal sent to your devices.',
      icon: 'sensors'
    })
  } catch {
    $q.notify({ type: 'negative', message: 'Failed to send test push.' })
  }
}

function sendBroadcast() {
  sending.value = true
  setTimeout(() => {
    $q.notify({
      color: 'positive',
      message: 'Notification broadcasted to all users!',
      icon: 'check',
      position: 'top'
    })
    recentBroadcasts.value.unshift({
      id: Date.now(),
      ...notification.value,
      date: 'Just now'
    })
    notification.value = { title: '', message: '', type: 'info' }
    sending.value = false
  }, 1500)
}

function getIcon(type: string) {
  switch (type) {
    case 'warning': return 'warning'
    case 'success': return 'check_circle'
    case 'error': return 'error'
    default: return 'info'
  }
}

function getColor(type: string) {
  switch (type) {
    case 'warning': return 'orange'
    case 'success': return 'positive'
    case 'error': return 'negative'
    default: return 'primary'
  }
}
</script>

<style scoped>
.icon-box {
  width: 54px;
  height: 54px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.border-radius-20 {
  border-radius: 20px !important;
}

.border-radius-12 {
  border-radius: 12px !important;
}
</style>
