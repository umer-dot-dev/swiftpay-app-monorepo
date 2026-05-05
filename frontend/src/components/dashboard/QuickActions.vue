<template>
  <div class="quick-actions-container">
    <!-- Quick Actions Header -->
    <div class="row items-center q-mb-lg">
      <div class="text-h6 text-weight-bold text-dark">Quick Actions</div>
      <q-space />
      <q-btn flat dense :color="$q.dark.isActive ? 'primary' : 'grey-7'" label="Edit" no-caps class="text-caption text-weight-bold q-px-sm" @click="editDialog = true" />
    </div>

    <!-- Active Actions Grid -->
    <div class="row q-col-gutter-lg">
      <div v-for="action in activeActions" :key="action.label" class="col-4 col-sm-4 col-md-4">
        <q-card 
          class="action-card bg-white text-center cursor-pointer no-shadow"
          v-ripple
          @click="$router.push(action.to)"
        >
          <div class="card-content q-pa-md">
            <div class="icon-wrapper q-mx-auto q-mb-sm" :style="{ '--glow-color': action.glowColor }">
              <div class="icon-bg" :style="{ backgroundColor: action.bgColor }">
                <q-icon :name="action.icon" :color="action.iconColor" size="28px" />
              </div>
            </div>
            <div class="text-caption text-weight-bold action-label">{{ action.label }}</div>
          </div>
        </q-card>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-if="activeActions.length === 0" class="text-center q-pa-md text-grey-6 border-radius-16">
      No quick actions pinned. Click Edit to add some!
    </div>

    <!-- Edit Dialog -->
    <q-dialog v-model="editDialog" :position="$q.screen.lt.sm ? 'bottom' : 'standard'">
      <q-card class="bg-white column no-wrap" :class="$q.screen.lt.sm ? 'border-radius-top-32' : 'border-radius-32'" style="width: 100%; max-width: 400px; max-height: 90vh">
        <q-card-section class="row items-center justify-between q-pb-none q-pt-lg q-px-lg bg-white" style="z-index: 10;">
          <div class="text-h6 text-weight-bold text-dark">Customize Actions</div>
          <q-btn icon="close" flat round dense v-close-popup color="grey-6" />
        </q-card-section>
        
        <q-card-section class="q-pa-lg scroll">
          <div class="text-subtitle2 text-grey-6 q-mb-md">Select which shortcuts to display on your dashboard.</div>
          
          <q-list class="q-gutter-y-sm">
            <q-item v-for="action in allActions" :key="action.label" class="q-pa-md border-radius-16" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-1'">
              <q-item-section avatar>
                <div class="icon-bg" :style="{ backgroundColor: action.bgColor, width: '40px', height: '40px' }">
                  <q-icon :name="action.icon" :color="action.iconColor" size="20px" />
                </div>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">{{ action.label }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle v-model="action.visible" color="primary" size="lg" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        
        <q-card-actions class="q-pa-lg q-pt-none bg-white" style="z-index: 10;">
          <q-btn color="primary" label="Save Changes" unelevated rounded class="full-width q-py-md text-weight-bold shadow-2 text-subtitle1" @click="saveActions" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const editDialog = ref(false)

const allActions = ref([
  { label: 'Send', icon: 'send', iconColor: 'green-6', bgColor: 'rgba(16, 185, 129, 0.12)', glowColor: 'rgba(16, 185, 129, 0.3)', to: '/send', visible: true },
  { label: 'Receive', icon: 'qr_code_scanner', iconColor: 'blue-6', bgColor: 'rgba(37, 99, 235, 0.12)', glowColor: 'rgba(37, 99, 235, 0.3)', to: '/receive', visible: true },
  { label: 'Recharge', icon: 'bolt', iconColor: 'deep-purple-5', bgColor: 'rgba(139, 92, 246, 0.12)', glowColor: 'rgba(139, 92, 246, 0.3)', to: '/recharge', visible: true },
  { label: 'Bills', icon: 'receipt_long', iconColor: 'orange-6', bgColor: 'rgba(249, 115, 22, 0.12)', glowColor: 'rgba(249, 115, 22, 0.3)', to: '/bills', visible: true },
  { label: 'Top Up', icon: 'account_balance_wallet', iconColor: 'teal-6', bgColor: 'rgba(6, 182, 212, 0.12)', glowColor: 'rgba(6, 182, 212, 0.3)', to: '/topup', visible: true },
  { label: 'Cards', icon: 'contactless', iconColor: 'pink-6', bgColor: 'rgba(244, 63, 94, 0.12)', glowColor: 'rgba(244, 63, 94, 0.3)', to: '/cards', visible: true },
  { label: 'Tickets', icon: 'local_activity', iconColor: 'cyan-6', bgColor: 'rgba(6, 182, 212, 0.12)', glowColor: 'rgba(6, 182, 212, 0.3)', to: '/tickets', visible: true },
  { label: 'Invest', icon: 'trending_up', iconColor: 'indigo-6', bgColor: 'rgba(99, 102, 241, 0.12)', glowColor: 'rgba(99, 102, 241, 0.3)', to: '/invest', visible: true },
  { label: 'Zakat', icon: 'volunteer_activism', iconColor: 'green-8', bgColor: 'rgba(46, 125, 50, 0.12)', glowColor: 'rgba(46, 125, 50, 0.3)', to: '/zakat', visible: true },
])

onMounted(() => {
  const saved = localStorage.getItem('swiftpay_quickactions')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      allActions.value.forEach(a => {
        const found = parsed.find((p: { label: string; visible: boolean }) => p.label === a.label)
        if (found) a.visible = found.visible
      })
    } catch {
      // safe fallback
    }
  }
})

const activeActions = computed(() => {
  return allActions.value.filter(a => a.visible)
})

const saveActions = () => {
  localStorage.setItem('swiftpay_quickactions', JSON.stringify(
    allActions.value.map(a => ({ label: a.label, visible: a.visible }))
  ))
  editDialog.value = false
  $q.notify({
    message: 'Dashboard shortcuts updated!',
    color: 'positive',
    icon: 'check_circle',
    position: 'top',
    classes: 'text-weight-bold',
    timeout: 2000
  })
}
</script>

<style scoped>
.quick-actions-container {
  max-width: 100%;
}

.action-card {
  border-radius: 20px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
  height: 100%;
}

.action-card:hover {
  transform: translateY(-8px);
  border-color: var(--q-primary);
  box-shadow: 0 15px 30px -10px rgba(15, 23, 42, 0.12) !important;
}

.action-card:hover .icon-wrapper {
  transform: scale(1.1);
  filter: drop-shadow(0 0 8px var(--glow-color));
}

.icon-wrapper {
  width: 58px;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
}

.icon-bg {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-label {
  color: #334155;
  font-size: 0.8rem;
  letter-spacing: 0.01em;
  transition: color 0.3s ease;
}

.action-card:hover .action-label {
  color: var(--q-primary);
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.border-radius-32 {
  border-radius: 32px !important;
}

.border-radius-top-32 {
  border-top-left-radius: 32px !important;
  border-top-right-radius: 32px !important;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.border-radius-16 {
  border-radius: 16px !important;
}
</style>

