<template>
  <q-page class="dashboard-page q-pa-md q-pa-md-xl">
    <div class="header row items-center justify-between q-mb-lg q-mb-sm-xl">
      <div>
        <div class="text-h5 text-sm-h4 text-weight-bold text-primary">{{ t('welcome_back', { name: authStore.user?.full_name || 'User' }) }}</div>
        <div class="text-subtitle2 text-sm-subtitle1 text-grey-7">Ready to manage your finances today?</div>
      </div>
      <q-btn round flat icon="notifications" size="lg" class="gt-sm">
        <q-badge v-if="notifStore.unreadCount > 0" floating color="red" rounded border :label="notifStore.unreadCount" />
        <!-- Notification Dropdown -->
        <NotificationMenu />
      </q-btn>
    </div>

    <div class="row q-col-gutter-xl">
      <!-- Main Content Column -->
      <div class="col-12">
        <!-- 1. Balance Card (Top) -->
        <div class="row justify-center justify-md-start q-mb-xl">
          <BalanceCard 
            :balance="accountStore.balance" 
            :account-number="accountStore.accountNumber" 
          />
        </div>

        <QuickActions class="q-mb-xl q-mt-none" />
        
        <!-- 3. Recent Transactions (Bottom) -->
        <TransactionList :transactions="accountStore.transactions" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAccountStore } from '../stores/account'
import { useAuthStore } from '../stores/auth'
import QuickActions from '../components/dashboard/QuickActions.vue'
import NotificationMenu from '../components/NotificationMenu.vue'
import { useNotificationStore } from '../stores/notifications'

const { t } = useI18n()
const accountStore = useAccountStore()
const authStore = useAuthStore()
const notifStore = useNotificationStore()

onMounted(async () => {
  await accountStore.fetchDashboardData()
})
</script>

<style scoped>
.dashboard-page {
  background-color: #fcfcfd;
  min-height: 100vh;
}

.border-radius-20 {
  border-radius: 20px !important;
}

.opacity-80 {
  opacity: 0.8;
}
</style>
