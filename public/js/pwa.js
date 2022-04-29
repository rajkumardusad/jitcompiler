// Make sure sw are supported
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/service_worker.js')
      .then(function (reg) {
        console.log('Service Worker: Registered (Pages)');
      })
      .catch(function (err) {
        console.log(`Service Worker: Error: ${err}`)
      });
  });
}
