import { useState, useEffect } from 'react';
import { DashboardProvider } from './context/DashboardContext';
import { Dashboard } from './components/Dashboard';
import { ToastContainer } from './components/ui/Toast';
import { PDFViewerModal } from './components/PDFViewerModal';
import { Factura } from './types';
import './mocks'; // Inicializar MSW

interface AppToast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  onClose: () => void;
}

function App() {
  const [toasts, setToasts] = useState<AppToast[]>([]);
  const [pdfModal, setPdfModal] = useState<{
    isOpen: boolean;
    factura: Factura | null;
  }>({ isOpen: false, factura: null });

  const addToast = (toast: Omit<AppToast, 'id'>) => {
    const newToast: AppToast = {
      ...toast,
      id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Escuchar eventos de facturación exitosa
  useEffect(() => {
    const handleFacturacionSuccess = (event: CustomEvent) => {
      const { factura } = event.detail;
      addToast({
        type: 'success',
        title: 'Factura emitida exitosamente',
        message: `CAE: ${factura.caeFake} - Comprobante: ${factura.nroComprobante}`,
        onClose: () => {}
      });
      
      // Mostrar modal de PDF después de un breve delay
      setTimeout(() => {
        setPdfModal({ isOpen: true, factura });
      }, 1000);
    };

    const handleFacturacionError = (event: CustomEvent) => {
      const { error } = event.detail;
      addToast({
        type: 'error',
        title: 'Error al emitir factura',
        message: error,
        onClose: () => {}
      });
    };

    const handleShowPDF = (event: CustomEvent) => {
      const { factura } = event.detail;
      setPdfModal({ isOpen: true, factura });
    };

    window.addEventListener('facturacion-success', handleFacturacionSuccess as EventListener);
    window.addEventListener('facturacion-error', handleFacturacionError as EventListener);
    window.addEventListener('show-pdf', handleShowPDF as EventListener);

    return () => {
      window.removeEventListener('facturacion-success', handleFacturacionSuccess as EventListener);
      window.removeEventListener('facturacion-error', handleFacturacionError as EventListener);
      window.removeEventListener('show-pdf', handleShowPDF as EventListener);
    };
  }, []);

  return (
    <DashboardProvider>
      <div className="App">
        <Dashboard />
        <ToastContainer 
          toasts={toasts.map(toast => ({
            ...toast,
            onClose: () => removeToast(toast.id)
          }))} 
          onClose={removeToast}
        />
        
        <PDFViewerModal
          isOpen={pdfModal.isOpen}
          onClose={() => setPdfModal({ isOpen: false, factura: null })}
          factura={pdfModal.factura}
        />
      </div>
    </DashboardProvider>
  );
}

export default App;
