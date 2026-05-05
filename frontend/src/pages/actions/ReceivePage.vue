<template>
  <q-page class="receive-page q-pa-md q-pa-md-xl flex flex-center">
    <div class="receive-content full-width" style="max-width: 600px">
      <div class="row items-center q-mb-xl">
        <q-btn flat round icon="arrow_back" color="primary" @click="$router.back()" class="back-btn q-mr-lg" />
        <div>
          <div class="text-h4 text-weight-bolder text-primary tracking-tight">Receive Money</div>
          <div class="text-subtitle1 text-grey-7">Accept payments instantly via QR</div>
        </div>
      </div>

      <q-card class="premium-receive-card no-border no-shadow q-pa-none overflow-hidden">
        <div class="card-header q-pa-xl text-white text-center">
          <div class="glass-orb orb-1"></div>
          <div class="glass-orb orb-2"></div>
          
          <div class="text-subtitle1 opacity-80 q-mb-md">Your Personal QR Code</div>
          <div class="qr-container q-mx-auto q-mb-lg">
            <div class="qr-border"></div>
            <q-img 
              src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=swiftpay:umer_ali_324&color=0F172A" 
              class="qr-code"
            />
          </div>
          <div class="text-h5 text-weight-bold">@umer_ali_324</div>
          <div class="text-subtitle2 opacity-60">Umer Sheraz Ali</div>
        </div>

        <div class="card-footer q-pa-xl bg-white">
          <div class="row q-col-gutter-lg">
            <div class="col-12 col-sm-6">
              <q-btn 
                outline 
                color="primary" 
                icon="content_copy" 
                label="Copy Link" 
                class="full-width q-py-lg text-weight-bold" 
                rounded 
                no-caps 
                @click="copyLink"
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-btn 
                color="primary" 
                icon="share" 
                label="Share QR" 
                class="full-width q-py-lg text-weight-bold" 
                rounded 
                unelevated 
                no-caps 
              />
            </div>
          </div>

          <div class="q-mt-xl text-center">
            <p class="text-grey-6 text-caption">
              Your SwiftPay ID is unique. Anyone can scan this code using their SwiftPay app or any standard QR scanner to send you money.
            </p>
          </div>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'

const $q = useQuasar()

const copyLink = () => {
  $q.notify({
    message: 'Payment link copied!',
    color: 'primary',
    icon: 'check',
    position: 'top',
    classes: 'premium-toast'
  })
}
</script>

<style scoped>
.receive-page {
  background: #fbfcfe;
}

.premium-receive-card {
  border-radius: 40px;
  box-shadow: 0 40px 80px -20px rgba(15, 23, 42, 0.15) !important;
}

.card-header {
  background: #0F172A;
  position: relative;
  overflow: hidden;
}

.glass-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
}

.orb-1 {
  width: 200px;
  height: 200px;
  background: rgba(59, 130, 246, 0.3);
  top: -50px;
  right: -50px;
}

.orb-2 {
  width: 150px;
  height: 150px;
  background: rgba(139, 92, 246, 0.2);
  bottom: -30px;
  left: -30px;
}

.qr-container {
  width: 240px;
  height: 240px;
  background: white;
  padding: 20px;
  border-radius: 32px;
  position: relative;
  z-index: 10;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}

.qr-border {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border: 2px solid rgba(255,255,255,0.1);
  border-radius: 40px;
  pointer-events: none;
}

.qr-code {
  border-radius: 12px;
}

.tracking-tight {
  letter-spacing: -0.02em;
}

.opacity-80 {
  opacity: 0.8;
}

.opacity-60 {
  opacity: 0.6;
}
</style>

