<template>
  <q-card class="quick-transfer-card q-pa-lg no-shadow border-light">
    <div class="text-h6 text-weight-bold q-mb-lg">Quick Transfer</div>
    
    <div class="row q-col-gutter-md">
      <div v-for="contact in recentContacts" :key="contact.id" class="col-3 text-center cursor-pointer contact-item">
        <q-avatar size="56px" class="q-mb-xs">
          <img :src="contact.avatar" />
        </q-avatar>
        <div class="text-caption text-weight-medium truncate">{{ contact.name }}</div>
      </div>
      <div class="col-3 text-center cursor-pointer">
        <q-avatar size="56px" color="blue-1" text-color="accent" icon="add" />
        <div class="text-caption text-weight-medium">Add New</div>
      </div>
    </div>

    <div class="q-mt-xl">
      <q-input 
        v-model="amount" 
        label="Amount"
        prefix="Rs" 
        type="number"
        filled
        rounded
        class="bg-white"
      />
      
      <q-btn 
        color="accent" 
        label="Send Money" 
        class="full-width q-mt-md q-py-md" 
        rounded
        no-caps
        unelevated
        @click="sendMoney"
      />
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'

import { useAccountStore } from 'src/stores/account'
import { request } from 'src/api'

const $q = useQuasar()
const accountStore = useAccountStore()
const amount = ref('')

const recentContacts = [
  { id: 1, name: 'Alice', email: 'alice@example.com', avatar: 'https://cdn.quasar.dev/img/avatar1.jpg' },
  { id: 2, name: 'Bob', email: 'bob@example.com', avatar: 'https://cdn.quasar.dev/img/avatar2.jpg' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', avatar: 'https://cdn.quasar.dev/img/avatar3.jpg' }
]

const sendMoney = async () => {
  if (!amount.value) {
    $q.notify({
      type: 'negative',
      message: 'Please enter an amount'
    })
    return
  }

  $q.loading.show({ message: 'Sending money...' })
  
  const contact = recentContacts[0]
  if (!contact) return

  try {
    await request('/transactions/transfer', {
      method: 'POST',
      body: JSON.stringify({
        recipientEmail: contact.email,
        amount: parseFloat(amount.value),
        description: `Quick Transfer to ${contact.name}`
      })
    })

    // Refresh store
    await accountStore.fetchDashboardData()

    $q.notify({
      type: 'positive',
      message: `Successfully sent Rs ${amount.value}!`,
      position: 'top',
      timeout: 3000
    })
    amount.value = ''
  } catch (error: unknown) {
    const err = error as Error
    $q.notify({
      type: 'negative',
      message: 'Transfer failed',
      caption: err.message || 'Please try again later'
    })
  } finally {
    $q.loading.hide()
  }
}
</script>

<style scoped>
.quick-transfer-card {
  border: 1px solid #e2e8f0;
  border-radius: 20px !important;
}

.contact-item:hover .q-avatar {
  transform: translateY(-4px);
  transition: transform 0.2s ease;
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.border-light {
  border: 1px solid #f1f5f9;
}
</style>
