<template>
  <router-view />
</template>

<style>
/* Global Dark Mode Overrides for SwiftPay Application */
body.body--dark .bg-white {
  background-color: #1d1d1d !important;
}

body.body--dark .text-dark {
  color: #ffffff !important;
}

/* Intelligently invert hardcoded deep-navy primary colors globally */
body.body--dark .text-primary.text-h1,
body.body--dark .text-primary.text-h2,
body.body--dark .text-primary.text-h3,
body.body--dark .text-primary.text-h4,
body.body--dark .text-primary.text-h5,
body.body--dark .text-primary.text-h6 {
  color: #ffffff !important;
}

body.body--dark .text-primary:not(.text-h1):not(.text-h2):not(.text-h3):not(.text-h4):not(.text-h5):not(.text-h6) {
  color: #60a5fa !important;
}

body.body--dark .bg-grey-1 {
  background-color: #121212 !important;
}

/* Ensure all page containers globally drop their absolute #fbfcfe light hex */
body.body--dark .dashboard-page,
body.body--dark .transactions-page,
body.body--dark .wallet-page,
body.body--dark .settings-page,
body.body--dark .cards-page,
body.body--dark .bills-page,
body.body--dark .receive-page,
body.body--dark .recharge-page,
body.body--dark .send-page,
body.body--dark .topup-page {
  background: #121212 !important;
}

/* Ensure Dialog and Modals inner inner components strictly adhere to dark mode */
body.body--dark .q-dialog .bg-white {
  background-color: #1d1d1d !important;
}

/* Fix any missing generic inner app borders */
body.body--dark .q-card {
  border-color: rgba(255, 255, 255, 0.1) !important;
}
</style>
