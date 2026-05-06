<template>
  <q-page class="q-pa-md q-pa-md-xl">
    <div class="row items-center justify-between q-gutter-y-md q-mb-xl">
      <div class="col-12 col-sm-auto">
        <div class="text-h4 text-weight-bold text-primary">Card Management</div>
        <div class="text-subtitle1 text-grey-7">Monitoring {{ 142 }} active virtual cards.</div>
      </div>
      <div class="col-12 col-sm-auto text-right">
        <q-btn color="primary" unelevated label="Issue New Card" icon="add" class="border-radius-12 q-px-md full-width-xs" />
      </div>
    </div>

    <div class="row q-col-gutter-xl">
      <div v-for="n in 6" :key="n" class="col-12 col-sm-6 col-md-4">
        <q-card flat class="card-item glass-panel border-radius-20 q-pa-md shadow-transition">
          <q-card-section class="q-pb-none">
            <div class="row justify-between items-center q-mb-lg">
              <q-img src="logo.png" style="width: 24px; height: 24px;" />
              <q-badge color="primary" class="q-px-sm q-py-xs border-radius-12">ACTIVE</q-badge>
            </div>
            
            <div class="text-h5 text-weight-bold q-mb-sm text-dark tracking-widest">
              **** **** **** {{ 1234 + n }}
            </div>
            
            <div class="row justify-between items-end q-mt-xl">
              <div>
                <div class="text-caption text-grey-6 uppercase">Card Holder</div>
                <div class="text-weight-bold text-dark">USER_00{{ n }}</div>
              </div>
              <q-icon name="contactless" size="24px" color="grey-4" />
            </div>
          </q-card-section>

          <q-card-actions align="around" class="q-mt-lg q-pt-md border-top-dashed">
            <q-btn flat color="orange" label="Freeze" icon="ac_unit" dense class="border-radius-12 q-px-sm" />
            <q-btn flat color="red" label="Terminate" icon="delete" dense class="border-radius-12 q-px-sm" />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <div class="q-mt-xl text-center">
      <q-btn label="Load More Analytics" color="primary" flat class="text-weight-bold" />
    </div>
  </q-page>
</template>

<style scoped>
.card-item {
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important;
  }
}

.border-top-dashed {
  border-top: 1px dashed rgba(0,0,0,0.05);
}

.tracking-widest {
  letter-spacing: 0.15em;
}

.border-radius-20 {
  border-radius: 20px !important;
}

.border-radius-12 {
  border-radius: 12px !important;
}
</style>
