<template>
  <q-page class="cards-page q-pa-md q-pa-md-xl">
    <div class="row items-center justify-between q-mb-xl">
      <div class="row items-center">
        <q-btn flat round icon="arrow_back" color="primary" @click="$router.back()" class="back-btn q-mr-lg" />
        <div>
          <div class="text-h4 text-weight-bolder text-primary tracking-tight">{{ $t('manage_cards') }}</div>
          <div class="text-subtitle1 text-grey-7">Your digital and physical assets</div>
        </div>
      </div>
      <q-btn color="primary" icon="add" label="New Card" rounded unelevated no-caps class="q-px-lg q-py-md text-weight-bold" @click="showNewCardDialog = true" />
    </div>

    <div class="row q-col-gutter-xl">
      <div class="col-12 col-lg-7">
        <div class="text-h6 text-weight-bold q-mb-lg">Active Cards</div>
        <div class="row q-col-gutter-lg q-mb-xl cards-container">
          <div v-for="card in cards" :key="card.number" class="col-12 col-sm-12 col-md-auto card-col">
            <q-card 
              class="premium-credit-card text-white no-shadow relative-position overflow-hidden" 
              :style="{ background: card.gradient }"
            >
              <div class="card-glass-shine"></div>
              <div class="card-content full-height column justify-between">
                <div class="row justify-between items-start">
                  <div class="column">
                    <div class="card-label opacity-80">Primary Card</div>
                    <div class="card-provider text-weight-bold italic">{{ card.provider }}</div>
                  </div>
                  <q-icon name="contactless" class="contactless-icon opacity-80" />
                </div>
                
                <div class="row items-center q-my-sm">
                  <div class="card-chip-premium q-mr-md"></div>
                  <div class="card-number text-weight-bolder">
                    {{ formatCardNumber(card.number) }}
                  </div>
                </div>

                <div class="row justify-between items-end">
                  <div class="column">
                    <div class="card-label opacity-60 text-uppercase">Card Holder</div>
                    <div class="card-value text-weight-bold">{{ card.holder }}</div>
                  </div>
                  <div class="column items-end">
                    <div class="card-label opacity-60 text-uppercase">Expires</div>
                    <div class="card-value text-weight-bold">{{ card.expiry }}</div>
                  </div>
                </div>
              </div>
            </q-card>
          </div>
        </div>


      </div>

      <div class="col-12 col-lg-5">
        <div class="text-h6 text-weight-bold q-mb-lg">Card Security</div>
        <q-card class="premium-card no-border no-shadow q-pa-lg q-pa-sm-xl bg-white border-radius-32">
          <q-list class="q-gutter-y-md">
            <q-item v-for="control in controls" :key="control.label" class="q-pa-md border-radius-20 control-item">
              <q-item-section avatar>
                <q-avatar :color="control.color + '-1'" :text-color="control.color" :icon="control.icon" size="48px" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold text-body1">{{ control.label }}</q-item-label>
                <q-item-label caption class="text-grey-6">{{ control.desc }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle v-model="control.value" :color="control.color" size="lg" @update:model-value="toggleSecurity(control)" />
              </q-item-section>
            </q-item>
          </q-list>
          
          <q-separator class="q-my-xl opacity-10" />
          
          <div class="text-h6 text-weight-bold q-mb-md">Settings</div>
          <div class="column q-gutter-y-sm">
            <q-btn flat class="settings-btn justify-start" no-caps icon="lock_open" label="Change Security PIN" color="grey-8" @click="showPinDialog = true" />
            <q-btn flat class="settings-btn justify-start" no-caps icon="visibility" label="Show Card Details" color="grey-8" />
            <q-btn flat class="settings-btn justify-start text-negative" no-caps icon="block" label="Freeze Card Temporarily" />
          </div>
        </q-card>
      </div>
    </div>

    <!-- New Card Dialog -->
    <q-dialog v-model="showNewCardDialog" :position="$q.screen.lt.sm ? 'bottom' : 'standard'">
      <q-card class="bg-white column no-wrap" :class="$q.screen.lt.sm ? 'border-radius-top-32' : 'border-radius-32'" style="width: 100%; max-width: 480px;">
        <q-card-section class="q-pa-lg row items-center justify-between pb-none">
          <div class="text-h5 text-weight-bolder text-dark">Request New Card</div>
          <q-btn icon="close" flat round dense v-close-popup color="grey-6" />
        </q-card-section>
        
        <q-card-section class="q-pa-lg pt-none column q-gutter-y-md">
          <div class="text-subtitle1 text-grey-6 q-mb-sm">Choose your preferred card format</div>
          
          <q-card class="card-type-option q-pa-md cursor-pointer border-radius-20 transition-hover" :class="newCardType === 'Virtual' ? 'selected-border bg-blue-1' : 'bg-grey-1 no-border'" @click="newCardType = 'Virtual'" flat>
            <div class="row items-center q-gutter-x-md">
              <q-avatar color="blue-2" text-color="primary" icon="credit_card" />
              <div class="col">
                <div class="text-weight-bold text-body1">Virtual Card</div>
                <div class="text-caption text-grey-7">Ready instantly for online purchases</div>
              </div>
              <q-radio v-model="newCardType" val="Virtual" />
            </div>
          </q-card>
          
          <q-card class="card-type-option q-pa-md cursor-pointer border-radius-20 transition-hover" :class="newCardType === 'Physical' ? 'selected-border bg-blue-1' : 'bg-grey-1 no-border'" @click="newCardType = 'Physical'" flat>
            <div class="row items-center q-gutter-x-md">
              <q-avatar color="blue-2" text-color="primary" icon="local_shipping" />
              <div class="col">
                <div class="text-weight-bold text-body1">Physical Card</div>
                <div class="text-caption text-grey-7">Shipped to your address in 3-5 days</div>
              </div>
              <q-radio v-model="newCardType" val="Physical" />
            </div>
          </q-card>
          
          <q-btn color="primary" label="Confirm & Generate" unelevated rounded class="full-width q-py-md q-mt-xl text-weight-bold text-subtitle1 shadow-1" @click="confirmNewCard" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Change PIN Dialog -->
    <q-dialog v-model="showPinDialog" :position="$q.screen.lt.sm ? 'bottom' : 'standard'">
      <q-card class="bg-white column no-wrap" :class="$q.screen.lt.sm ? 'border-radius-top-32' : 'border-radius-32'" style="width: 100%; max-width: 400px;">
        <q-card-section class="q-pa-lg row items-center justify-between pb-none">
          <div class="text-h5 text-weight-bolder text-dark">Security PIN</div>
          <q-btn icon="close" flat round dense v-close-popup color="grey-6" />
        </q-card-section>
        
        <q-card-section class="q-pa-lg pt-none">
          <div class="text-subtitle2 text-grey-6 text-uppercase tracking-widest q-mb-xs text-weight-bold">Current PIN</div>
          <q-input v-model="currentPin" outlined type="password" rounded class="q-mb-md text-weight-bold" maxlength="4" placeholder="••••" />
          
          <div class="text-subtitle2 text-grey-6 text-uppercase tracking-widest q-mb-xs mt-md text-weight-bold">New PIN</div>
          <q-input v-model="newPin" outlined type="password" rounded class="q-mb-sm text-weight-bold" maxlength="4" placeholder="••••" />
          <div class="text-caption text-grey-6 q-mb-xl q-px-sm">Must be a secure 4-digit number.</div>
          
          <q-btn color="dark" label="Update Security PIN" unelevated rounded class="full-width q-py-md text-weight-bold text-subtitle1 shadow-1" @click="confirmChangePin" />
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// State Logic for Dialogs & Features
const showNewCardDialog = ref(false)
const newCardType = ref('Virtual')

const confirmNewCard = () => {
  showNewCardDialog.value = false
  $q.notify({
    message: `${newCardType.value} Card requested successfully`,
    color: 'positive',
    icon: 'check_circle',
    position: 'top',
    classes: 'text-weight-bold',
    timeout: 3000
  })
  
  // Generating a randomized 16 length string
  let generatedNum = '';
  for(let i=0; i<16; i++) {
    generatedNum += Math.floor(Math.random() * 10).toString();
  }
  
  cards.value.push({
    number: generatedNum,
    holder: 'Umer Sheraz Ali',
    expiry: '08/30',
    provider: newCardType.value === 'Virtual' ? 'VISA Virtual' : 'VISA',
    gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)' // Elegant emerald style
  })
}

interface SecurityControl {
  label: string;
  desc: string;
  icon: string;
  color: string;
  value: boolean;
}

const toggleSecurity = (control: SecurityControl) => {
  const statusStr = control.value ? 'enabled' : 'disabled'
  $q.notify({
    message: `${control.label} has been ${statusStr}`,
    color: control.color,
    icon: control.icon,
    position: 'top',
    classes: 'text-weight-bold',
    timeout: 2500
  })
}

const showPinDialog = ref(false)
const currentPin = ref('')
const newPin = ref('')

const confirmChangePin = () => {
  if (newPin.value.length !== 4) {
     $q.notify({
      message: 'PIN must be exactly 4 digits long',
      color: 'negative',
      icon: 'warning',
      position: 'top',
      classes: 'text-weight-bold',
      timeout: 2500
    })
    return
  }
  showPinDialog.value = false
  $q.notify({
    message: 'Security PIN updated successfully',
    color: 'positive',
    icon: 'lock',
    position: 'top',
    classes: 'text-weight-bold',
    timeout: 3000
  })
  currentPin.value = ''
  newPin.value = ''
}

const cards = ref([
  { 
    number: '4290123456789012', 
    holder: 'Umer Sheraz Ali', 
    expiry: '05/28', 
    provider: 'VISA',
    gradient: 'linear-gradient(135deg, #0F172A 0%, #1e293b 100%)'
  },
  { 
    number: '5412887766554433', 
    holder: 'Umer Sheraz Ali', 
    expiry: '12/26', 
    provider: 'Mastercard',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'
  }
])

const controls = ref([
  { label: 'Freeze Card', desc: 'Lock card instantly', icon: 'ac_unit', color: 'blue', value: false },
  { label: 'Contactless', desc: 'Tap to pay enabled', icon: 'contactless', color: 'teal', value: true },
  { label: 'International', desc: 'Global transactions', icon: 'public', color: 'purple', value: true }
])

const formatCardNumber = (num: string) => {
  return num.replace(/(.{4})/g, '$1 ').trim()
}
</script>

<style scoped>
.cards-page {
  background: #fbfcfe;
}

.cards-container {
  display: flex;
  justify-content: center;
}

@media (min-width: 1024px) {
  .cards-container {
    justify-content: flex-start;
  }
}

.card-col {
  display: flex;
  justify-content: center;
  width: 100%;
}

@media (min-width: 600px) {
  .card-col {
    width: auto;
    flex: 1 1 auto;
    max-width: 420px;
  }
}

.premium-credit-card {
  border-radius: 24px !important;
  width: 100%;
  max-width: 400px;
  min-width: 280px;
  aspect-ratio: 1.586 / 1;
  box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.4) !important;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  margin: 0 auto;
}

.premium-credit-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 30px 60px -15px rgba(15, 23, 42, 0.5) !important;
}

/* Responsive card content */
.card-content {
  padding: 8%; /* Percentage based padding for responsive scaling */
}

.card-label {
  font-size: clamp(0.65rem, 1.5vw, 0.875rem);
  letter-spacing: 0.1em;
}

.card-provider {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
}

.contactless-icon {
  font-size: clamp(1.5rem, 4vw, 2rem);
}

.card-number {
  font-size: clamp(1.1rem, 4vw, 1.5rem);
  letter-spacing: clamp(1px, 0.3vw, 3px);
}

.card-value {
  font-size: clamp(0.875rem, 2vw, 1rem);
}

.card-glass-shine {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 100%);
  pointer-events: none;
}

.card-chip-premium {
  width: clamp(36px, 10vw, 48px);
  height: clamp(28px, 7.5vw, 36px);
  background: linear-gradient(135deg, #ffd700 0%, #daa520 100%);
  border-radius: 8px;
  position: relative;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
}

.card-chip-premium::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  height: 70%;
  border: 1px solid rgba(0,0,0,0.15);
  border-radius: 3px;
}

.tracking-widest {
  letter-spacing: 0.15em;
}

.border-radius-32 {
  border-radius: 32px !important;
}

.border-radius-20 {
  border-radius: 20px !important;
}

.control-item {
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
}

.control-item:hover {
  background: #f8fafc;
  border-color: var(--q-primary);
}

.settings-btn {
  border-radius: 16px;
  padding: 12px 16px;
}

.settings-btn:hover {
  background: #f1f5f9;
}

.opacity-70 { opacity: 0.7; }
.opacity-80 { opacity: 0.8; }
.opacity-60 { opacity: 0.6; }
.opacity-10 { opacity: 0.1; }

.pb-none { padding-bottom: 0 !important; }
.pt-none { padding-top: 0 !important; }

.border-radius-top-32 {
  border-top-left-radius: 32px !important;
  border-top-right-radius: 32px !important;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.transition-hover {
  transition: all 0.3s ease;
}

.transition-hover:hover {
  transform: translateX(4px);
}

.selected-border {
  border: 2px solid var(--q-primary);
  box-sizing: border-box;
}

.mt-md {
  margin-top: 16px;
}
</style>

