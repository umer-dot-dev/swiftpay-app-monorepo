<template>
  <q-page class="send-page q-pa-md q-pa-md-xl">
    <div class="row items-center q-mb-xl">
      <q-btn flat round icon="arrow_back" color="primary" @click="$router.back()" class="back-btn q-mr-lg" />
      <div>
        <div class="text-h4 text-weight-bolder text-primary tracking-tight">Send Money</div>
        <div class="text-subtitle1 text-grey-7">Transfer funds instantly to anyone</div>
      </div>
    </div>

    <div class="row q-col-gutter-xl items-stretch justify-center">
      <!-- Recipient Selection -->
      <div class="col-12 col-lg-8">
        <q-card class="premium-card no-border no-shadow q-pa-lg q-pa-sm-xl">
          <div class="row items-center justify-between q-mb-lg">
            <div class="text-h5 text-weight-bold">Select Recipient</div>
            <q-btn flat color="accent" label="View All" no-caps class="text-weight-bold" />
          </div>

          <div class="search-wrapper q-mb-xl">
            <q-input 
              v-model="search" 
              placeholder="Search by name, @id or card" 
              outlined 
              rounded
              bg-color="grey-1"
            >
              <template v-slot:prepend>
                <q-icon name="search" color="grey-6" />
              </template>
            </q-input>
          </div>

          <div class="text-subtitle1 text-weight-bold text-grey-6 q-mb-md">Recently Sent</div>
          <div class="row q-col-gutter-md q-mb-xl">
            <div v-for="contact in recentContacts" :key="contact.id" class="col-4 col-sm-3 col-md-2 text-center">
              <div 
                class="contact-bubble cursor-pointer" 
                :class="{ 'active': selectedContact?.id === contact.id }"
                @click="selectContact(contact)"
              >
                <q-avatar size="68px" class="q-mb-sm shadow-10">
                  <img :src="contact.avatar" />
                  <div class="contact-status"></div>
                </q-avatar>
                <div class="contact-name text-weight-bold text-caption">{{ contact.name.split(' ')[0] }}</div>
              </div>
            </div>
          </div>

          <q-list class="q-mt-md custom-list">
            <q-item 
              v-for="contact in recentContacts" 
              :key="'list-'+contact.id" 
              clickable 
              v-ripple 
              @click="selectContact(contact)"
              class="q-pa-md border-radius-20 q-mb-sm"
              :active="selectedContact?.id === contact.id"
              active-class="selected-row"
            >
              <q-item-section avatar>
                <q-avatar size="52px">
                  <img :src="contact.avatar" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold text-body1">{{ contact.name }}</q-item-label>
                <q-item-label caption class="text-grey-7">{{ contact.info }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="text-caption text-grey-5">{{ contact.lastSent }}</div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>

    <!-- Amount & Transfer Dialog -->
    <q-dialog 
      v-model="showAmountDialog" 
      :position="$q.screen.lt.md ? 'bottom' : 'standard'"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card 
        class="transfer-card column no-wrap no-border q-pa-lg q-pa-sm-xl text-white overflow-hidden"
        :class="{ 'mobile-sheet': $q.screen.lt.md }" 
        style="width: 100%; max-width: 480px; max-height: 100vh;"
        v-touch-swipe.mouse.down="handleSwipe"
      >
        <div class="glass-overlay"></div>
        
        <q-card-section class="q-pa-none shrink">
          <div class="row justify-center q-mb-md" v-if="$q.screen.lt.md">
            <div class="drag-handle"></div>
          </div>
          <div class="row justify-between items-center relative-position z-top q-mb-md q-mb-sm-lg">
            <div v-if="selectedContact" class="recipient-badge row items-center q-pa-xs q-pr-md animate-fade">
              <q-avatar size="28px" class="q-mr-sm">
                <img :src="selectedContact.avatar" />
              </q-avatar>
              <div class="text-weight-medium text-caption text-white opacity-90">To: {{ selectedContact.name }}</div>
            </div>
            <q-btn flat round dense icon="close" v-close-popup color="white" class="opacity-70 q-ml-auto" />
          </div>
        </q-card-section>

        <!-- Non-scrollable Body to prevent friction -->
        <q-card-section class="q-pa-none">
          <div class="text-center relative-position z-top">
            <div class="text-subtitle1 text-white opacity-70 q-mb-xs">Amount to Send</div>
            <div class="amount-display row items-center justify-center q-pa-sm q-mt-sm">
              <span class="text-h3 text-weight-regular opacity-40 q-mr-sm q-pb-md">Rs</span>
              <span class="text-weight-bolder" style="font-size: clamp(3rem, 12vw, 4.5rem); letter-spacing: -0.04em; line-height: 1;">{{ amount || '0' }}</span>
              <div class="cursor-blink" style="height: 60px;"></div>
            </div>
          </div>

          <div class="numpad q-mt-md relative-position z-top">
            <div class="row justify-center">
              <div v-for="n in ['1','2','3','4','5','6','7','8','9','.', '0']" :key="n" class="col-4 q-pa-xs flex flex-center">
                <q-btn flat class="numpad-btn full-width q-py-sm text-h5 text-weight-medium" :label="n" @click="addDigit(n)" />
              </div>
              <div class="col-4 q-pa-xs flex flex-center">
                <q-btn flat class="numpad-btn full-width q-py-sm text-h5" icon="backspace" @click="backspace" />
              </div>
            </div>
          </div>
        </q-card-section>

        <!-- Footer / Action -->
        <q-card-section class="q-pa-none shrink q-mt-sm relative-position z-top">
          <q-btn 
            unelevated 
            label="Send Now" 
            class="full-width q-py-md text-h6 text-weight-bold btn-send" 
            rounded 
            no-caps
            :disable="!amount || amount === '0' || !selectedContact"
            @click="processTransfer"
          >
            <q-icon name="send" class="q-ml-md" />
          </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAccountStore } from 'src/stores/account'
import { request } from 'src/api'

const router = useRouter()
const $q = useQuasar()
const accountStore = useAccountStore()

const search = ref('')
const amount = ref('')

interface Contact {
  id: string | number;
  name: string;
  info: string;
  email: string;
  avatar: string;
  lastSent?: string;
}

const selectedContact = ref<Contact | null>(null)
const showAmountDialog = ref(false)
const users = ref<Contact[]>([])

interface RawUser { id: string | number; full_name: string; email: string; }

async function fetchUsers() {
  try {
    const data = await request('/admin/users')
    users.value = (data as RawUser[]).map(u => ({
      id: u.id,
      name: u.full_name,
      info: `@${u.full_name.toLowerCase().replace(' ', '_')}`,
      email: u.email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.full_name)}&background=random`,
      lastSent: 'Contact'
    }))
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
}

const recentContacts = computed(() => {
  if (!search.value) return users.value.slice(0, 4)
  const s = search.value.toLowerCase()
  return users.value.filter(u => 
    u.name.toLowerCase().includes(s) || 
    u.email.toLowerCase().includes(s)
  )
})

const selectContact = (contact: Contact) => {
  selectedContact.value = contact
  amount.value = ''
  showAmountDialog.value = true
}

const handleSwipe = () => {
  if ($q.screen.lt.md) {
    showAmountDialog.value = false
  }
}

const addDigit = (n: string) => {
  if (n === '.' && amount.value.includes('.')) return
  if (amount.value === '0') amount.value = n
  else amount.value += n
}

const backspace = () => {
  amount.value = amount.value.slice(0, -1)
}

onMounted(() => {
  void fetchUsers()
})

const processTransfer = async () => {
  if (!amount.value || amount.value === '0' || !selectedContact.value) return
  const amountNum = parseFloat(amount.value)

  if (amountNum > accountStore.balance) {
    $q.notify({
      type: 'negative',
      message: 'Insufficient balance',
      caption: `You need Rs ${amountNum - accountStore.balance} more`
    })
    return
  }

  $q.loading.show({
    backgroundColor: 'primary',
    message: 'Encrypted transfer in progress...',
    messageColor: 'white'
  })
  
  try {
    await request('/transactions/transfer', {
      method: 'POST',
      body: JSON.stringify({
        recipientEmail: selectedContact.value.email,
        amount: amountNum,
        description: `Transfer to ${selectedContact.value.name}`
      })
    })

    // Refresh store data
    await accountStore.fetchDashboardData()
    
    $q.notify({
      type: 'positive',
      message: 'Transaction Successful!',
      caption: `Rs ${amount.value} sent to ${selectedContact.value.name}`,
      position: 'center',
      classes: 'premium-toast',
      timeout: 3000
    })
    showAmountDialog.value = false
    void router.push('/')
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
.send-page {
  background: #fbfcfe;
}

.premium-card {
  background: white;
  border-radius: 32px;
  border: 1px solid rgba(226, 232, 240, 0.6);
}

.transfer-card {
  background: rgba(10, 15, 28, 0.65);
  backdrop-filter: blur(24px);
  border-radius: 32px;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.5) !important;
}

.mobile-sheet {
  border-radius: 32px 32px 0 0 !important;
  margin-bottom: 0 !important;
  max-width: 100% !important;
  width: 100% !important;
}

.glass-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.15) 0%, transparent 50%);
  pointer-events: none;
}

.contact-bubble {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.contact-bubble:hover {
  transform: translateY(-8px);
}

.contact-bubble.active {
  transform: scale(1.15);
}

.contact-bubble.active .q-avatar {
  border: 3px solid #3b82f6;
  padding: 2px;
  background: white;
}

.contact-status {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 14px;
  height: 14px;
  background: #10b981;
  border: 2px solid white;
  border-radius: 50%;
}

.selected-row {
  background: rgba(59, 130, 246, 0.05) !important;
  color: var(--q-primary);
}

.amount-display {
  /* Dynamic padding via vue template instead */
}

.cursor-blink {
  width: 3px;
  height: 48px;
  background: #3b82f6;
  margin-left: 8px;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.numpad-btn {
  border-radius: 20px;
  background: transparent;
  width: 100%;
  transition: all 0.2s ease;
}

.numpad-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.recipient-badge {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.btn-send {
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  color: white !important;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.4) !important;
}

.btn-send:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px -10px rgba(59, 130, 246, 0.6) !important;
}

.tracking-tight {
  letter-spacing: -0.02em;
}

.border-radius-20 {
  border-radius: 20px !important;
}

.animate-fade {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.z-top {
  z-index: 10;
}
.drag-handle {
  width: 40px;
  height: 5px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}
</style>

