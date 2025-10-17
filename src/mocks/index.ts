// Configuración de MSW para desarrollo
if (import.meta.env.DEV) {
  const { worker } = await import('./browser');
  
  // Iniciar MSW
  worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  });
  
  console.log('🚀 MSW iniciado - API mock activa');
}
