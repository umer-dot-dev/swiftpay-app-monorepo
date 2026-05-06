<template>
  <q-layout view="lHh Lpr lFf">
    <q-header :class="['lt-md', $q.dark.isActive ? 'bg-dark text-white' : 'bg-grey-1 text-primary']" flat>
      <q-toolbar class="q-px-md q-py-sm">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-toolbar-title class="text-weight-bold">
          SwiftPay Admin
        </q-toolbar-title>
        <q-btn round flat icon="notifications" class="q-ml-sm">
          <q-badge v-if="notifStore.unreadCount > 0" floating color="red" rounded border :label="notifStore.unreadCount" />
          <NotificationMenu />
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="280"
      :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
    >
      <div class="column full-height">
        <q-scroll-area class="col">
          <div class="q-pa-lg q-pt-xl">
            <div class="row items-center q-gutter-sm q-mb-xl q-px-sm">
              <div class="logo-circle bg-white row items-center justify-center border-radius-12 overflow-hidden shadow-1">
                <q-img src="logo.png" style="width: 32px; height: 32px;" fit="contain" />
              </div>
              <span class="text-h5 text-weight-bolder tracking-tight" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">Admin<span class="text-primary">.</span></span>
            </div>

            <div class="text-caption text-grey-5 text-uppercase tracking-widest q-px-sm q-mb-md font-weight-bold">MANAGEMENT</div>
            <q-list class="q-gutter-y-xs">
              <q-item
                v-for="link in managementLinks"
                :key="link.title"
                clickable
                v-ripple
                :to="link.link"
                exact
                active-class="active-nav-item"
                class="nav-item q-pa-md border-radius-16"
              >
                <q-item-section avatar class="nav-icon-section">
                  <q-icon :name="link.icon" size="24px" class="nav-icon" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold nav-label">{{ link.title }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <div class="text-caption text-grey-5 text-uppercase tracking-widest q-px-sm q-mb-md q-mt-xl font-weight-bold">SYSTEM</div>
            <q-list class="q-gutter-y-xs">
              <q-item
                v-for="link in systemLinks"
                :key="link.title"
                clickable
                v-ripple
                :to="link.link"
                exact
                active-class="active-nav-item"
                class="nav-item q-pa-md border-radius-16"
              >
                <q-item-section avatar class="nav-icon-section">
                  <q-icon :name="link.icon" size="24px" class="nav-icon" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold nav-label">{{ link.title }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-scroll-area>

        <div class="q-pa-lg">
          <q-separator class="q-mb-lg opacity-30" />
          <q-item clickable v-ripple @click="handleLogout" class="nav-item q-pa-md border-radius-16 text-grey-7 logout-item">
            <q-item-section avatar class="nav-icon-section">
              <q-icon name="logout" size="24px" class="nav-icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold nav-label">Logout</q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </div>
    </q-drawer>

    <q-page-container :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-1'">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from 'src/stores/auth'
import { useNotificationStore } from 'src/stores/notifications'
import NotificationMenu from 'src/components/NotificationMenu.vue'

const leftDrawerOpen = ref(false)
const router = useRouter()
const auth = useAuthStore()
const notifStore = useNotificationStore()

const handleLogout = () => {
  auth.logout()
  void router.push('/login')
}

const managementLinks = [
  { title: 'Dashboard', icon: 'grid_view', link: '/' },
  { title: 'Users', icon: 'people', link: '/users' },
  { title: 'Transactions', icon: 'sync_alt', link: '/transactions' },
  { title: 'Cards', icon: 'style', link: '/cards' },
]

const systemLinks = [
  { title: 'Broadcast', icon: 'campaign', link: '/notifications' },
  { title: 'Settings', icon: 'tune', link: '/settings' },
]
</script>

<style scoped>
.nav-item {
  border-radius: 16px;
  color: #64748b;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 4px;
}

.nav-item:hover {
  background: #f8fafc;
  color: #0f172a;
  transform: translateX(4px);
}

.active-nav-item {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  color: var(--q-primary) !important;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.08);
}

.active-nav-item .nav-icon {
  color: var(--q-primary);
  transform: scale(1.1);
}

.nav-icon-section {
  min-width: 40px;
  padding-right: 12px;
}

.nav-icon {
  transition: transform 0.3s ease;
}

.nav-label {
  font-size: 0.95rem;
  letter-spacing: 0.01em;
}

.logout-item:hover {
  color: var(--q-negative) !important;
  background: #fdf2f8;
}

.logout-item:hover .nav-icon {
  color: var(--q-negative);
  transform: translateX(2px);
}

.border-radius-16 {
  border-radius: 16px !important;
}

.border-radius-12 {
  border-radius: 12px !important;
}

.logo-circle {
  width: 44px;
  height: 44px;
}

.tracking-tight {
  letter-spacing: -0.05em;
}

.tracking-widest {
  letter-spacing: 0.15em;
}

.opacity-30 {
  opacity: 0.3;
}
</style>

