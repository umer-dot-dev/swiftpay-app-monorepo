self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : { title: 'SwiftPay', message: 'New Notification!' };
  
  const options = {
    body: data.message,
    icon: '/logo.png',
    badge: '/logo.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      { action: 'explore', title: 'View Dashboard', icon: 'check' },
      { action: 'close', title: 'Close', icon: 'close' },
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
