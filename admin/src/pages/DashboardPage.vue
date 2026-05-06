<template>
  <q-page class="q-pa-md q-pa-md-xl">
    <!-- Header -->
    <div class="row items-center justify-between q-gutter-y-md q-mb-xl">
      <div class="col-12 col-sm-auto">
        <div class="text-h4 text-weight-bold text-primary">Admin Dashboard</div>
        <div class="text-subtitle1 text-grey-7">Monitor and manage platform growth.</div>
      </div>
      <div class="col-auto gt-xs">
        <q-btn round flat icon="notifications" size="lg">
          <q-badge v-if="notifStore.unreadCount > 0" floating color="red" rounded border :label="notifStore.unreadCount" />
          <NotificationMenu />
        </q-btn>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="row q-col-gutter-lg q-mb-xl">
      <div v-for="stat in statsList" :key="stat.title" class="col-12 col-sm-6 col-md-3">
        <q-card flat class="stats-card glass-panel border-radius-20 q-pa-sm">
          <q-card-section>
            <div class="row items-center justify-between q-mb-sm">
              <div class="text-overline text-grey-7">{{ stat.title }}</div>
              <q-icon :name="stat.icon" size="24px" :color="stat.color" />
            </div>
            <div class="text-h4 text-weight-bold text-dark">{{ stat.prefix }}{{ stat.value.toLocaleString() }}</div>
            <div class="text-caption q-mt-sm row items-center" :class="stat.trendColor">
              <q-icon :name="stat.trendIcon" class="q-mr-xs" />
              {{ stat.trendText }}
            </div>
          </q-card-section>
          <q-inner-loading :showing="loading">
            <q-spinner-tail color="primary" />
          </q-inner-loading>
        </q-card>
      </div>
    </div>

    <!-- Charts & Lists -->
    <div class="row q-col-gutter-xl">
      <div class="col-12 col-md-8">
        <q-card flat class="glass-panel border-radius-20 q-pa-md">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6 text-weight-bold">Platform Activity</div>
            <q-space />
            <q-btn flat round dense icon="more_vert" />
          </q-card-section>
          <q-card-section class="q-pt-xl">
             <div class="text-center text-grey-5 q-pa-xl">
               <q-icon name="insights" size="64px" class="q-mb-md opacity-20" />
               <div class="text-h6 text-weight-medium">Real-time analytics engine</div>
               <div class="text-caption">Syncing platform data across all nodes...</div>
             </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat class="glass-panel border-radius-20 q-pa-md">
          <q-card-section>
            <div class="text-h6 text-weight-bold">Recent Signups</div>
          </q-card-section>
          <q-list separator>
            <q-item v-for="user in recentUsers" :key="user.id" class="q-py-md">
              <q-item-section avatar>
                <q-avatar size="48px" class="bg-primary text-white shadow-1">
                  {{ user.full_name.charAt(0) }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">{{ user.full_name }}</q-item-label>
                <q-item-label caption class="text-grey-6">{{ user.email }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge color="green-1" text-color="green-9" label="Active" class="q-px-sm q-py-xs border-radius-12" />
              </q-item-section>
            </q-item>
          </q-list>
          <q-card-actions align="center" class="q-pt-md">
            <q-btn flat color="primary" label="Manage All Users" to="/users" class="full-width border-radius-12 text-weight-bold" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { request } from 'src/api'
import { useNotificationStore } from 'src/stores/notifications'
import NotificationMenu from 'src/components/NotificationMenu.vue'

const notifStore = useNotificationStore()

interface DashboardStats {
  users: number;
  transactions: number;
  volume: number;
}

interface User {
  id: string | number;
  full_name: string;
  email: string;
}

const loading = ref(true)
const stats = ref<DashboardStats>({
  users: 0,
  transactions: 0,
  volume: 0
})
const recentUsers = ref<User[]>([])

const statsList = computed(() => [
  { 
    title: 'Total Users', 
    value: stats.value.users, 
    prefix: '', 
    icon: 'people', 
    color: 'primary',
    trendText: '+12% this month',
    trendIcon: 'trending_up',
    trendColor: 'text-positive'
  },
  { 
    title: 'Total Volume', 
    value: stats.value.volume, 
    prefix: 'Rs ', 
    icon: 'account_balance_wallet', 
    color: 'orange',
    trendText: '+8.4% growth',
    trendIcon: 'trending_up',
    trendColor: 'text-positive'
  },
  { 
    title: 'Transactions', 
    value: stats.value.transactions, 
    prefix: '', 
    icon: 'sync_alt', 
    color: 'green',
    trendText: 'Last 30 days',
    trendIcon: 'event',
    trendColor: 'text-grey-7'
  },
  { 
    title: 'Active Cards', 
    value: 142, 
    prefix: '', 
    icon: 'style', 
    color: 'purple',
    trendText: 'System Normal',
    trendIcon: 'check_circle',
    trendColor: 'text-positive'
  },
])

async function fetchStats() {
  try {
    loading.value = true
    const data = await request('/admin/stats')
    stats.value = data as DashboardStats
    
    const users = await request('/admin/users')
    recentUsers.value = (users as User[]).slice(0, 5)
  } catch (error) {
    console.error('Failed to fetch stats:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void fetchStats()
})
</script>

<style lang="scss" scoped>
.stats-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.08) !important;
  }
}

.border-radius-20 {
  border-radius: 20px !important;
}

.opacity-20 {
  opacity: 0.15;
}
</style>

