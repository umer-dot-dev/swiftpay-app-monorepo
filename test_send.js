const BASE = 'http://localhost:8787/api'

async function run() {
  // Login first
  console.log('1. Logging in...')
  const lr = await fetch(BASE + '/auth/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email: 'apitest2@swift.com', password: 'Test1234!'})
  })
  const ld = await lr.json()
  if (!ld.token) { console.log('Login failed', ld); return }
  const token = ld.token
  console.log('   OK. Balance:', ld.user.balance)

  // Test recharge exactly as RechargePage.vue sends it
  console.log('\n2. Testing POST /transactions/recharge...')
  const rr = await fetch(BASE + '/transactions/recharge', {
    method: 'POST',
    headers: {'Content-Type': 'application/json', Authorization: 'Bearer ' + token},
    body: JSON.stringify({
      phoneNumber: '3001234567',
      amount: 500
    })
  })
  const rd = await rr.json()
  console.log('   HTTP Status:', rr.status, rr.statusText)
  console.log('   Response:', JSON.stringify(rd))

  // Also test bill-payment
  console.log('\n3. Testing POST /transactions/bill-payment...')
  const br = await fetch(BASE + '/transactions/bill-payment', {
    method: 'POST',
    headers: {'Content-Type': 'application/json', Authorization: 'Bearer ' + token},
    body: JSON.stringify({
      amount: 1000,
      description: 'Utility Bill: IESCO Electricity (14 12345 6789012 U)'
    })
  })
  const bd = await br.json()
  console.log('   HTTP Status:', br.status, br.statusText)
  console.log('   Response:', JSON.stringify(bd))
}

run().catch(function(e) { console.error('FATAL:', e.message) })
