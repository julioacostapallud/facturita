import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { DashboardData, Recaudacion, Factura, RecaudacionFactura, FacturacionARCA, FacturarRequest, ApiLog, Gasto, GastosPorEntidad } from '../types';
import { initialData } from '../data/mockData';

interface DashboardState {
  data: DashboardData;
  loading: boolean;
  error: string | null;
  logs: ApiLog[];
  periodo: string;
}

type DashboardAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_DATA'; payload: DashboardData }
  | { type: 'ADD_FACTURA'; payload: { factura: Factura; recaudacionFactura: RecaudacionFactura } }
  | { type: 'UPDATE_ARCA'; payload: FacturacionARCA[] }
  | { type: 'UPDATE_GASTOS'; payload: { gastos: Gasto[]; gastosPorEntidad: GastosPorEntidad[] } }
  | { type: 'ADD_LOG'; payload: ApiLog }
  | { type: 'SET_PERIODO'; payload: string }
  | { type: 'RESET_DATA' };

const initialState: DashboardState = {
  data: initialData,
  loading: false,
  error: null,
  logs: [],
  periodo: '2025-10'
};

function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_DATA':
      return { ...state, data: action.payload };
    
    case 'ADD_FACTURA':
      const { factura, recaudacionFactura } = action.payload;
      
      // Actualizar facturacionARCA para la entidad
      const updatedFacturacionARCA = state.data.facturacionARCA.map(arca => {
        const entidad = state.data.entidades.find(e => e.id === factura.entidadId);
        if (entidad && arca.cuit === entidad.cuit) {
          return { ...arca, total: arca.total + factura.monto };
        }
        return arca;
      });

      return {
        ...state,
        data: {
          ...state.data,
          facturas: [...state.data.facturas, factura],
          recaudacionFacturas: [...state.data.recaudacionFacturas, recaudacionFactura],
          facturacionARCA: updatedFacturacionARCA
        }
      };
    
    case 'UPDATE_ARCA':
      return {
        ...state,
        data: {
          ...state.data,
          facturacionARCA: action.payload
        }
      };
    
    case 'UPDATE_GASTOS':
      return {
        ...state,
        data: {
          ...state.data,
          gastos: action.payload.gastos,
          gastosPorEntidad: action.payload.gastosPorEntidad
        }
      };
    
    case 'ADD_LOG':
      return {
        ...state,
        logs: [action.payload, ...state.logs].slice(0, 50) // Mantener solo los últimos 50 logs
      };
    
    case 'SET_PERIODO':
      return { ...state, periodo: action.payload };
    
    case 'RESET_DATA':
      return { ...state, data: initialData };
    
    default:
      return state;
  }
}

interface DashboardContextType {
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
  // Acciones
  fetchFacturacionARCA: (periodo?: string) => Promise<void>;
  fetchRecaudaciones: (punto?: string) => Promise<Recaudacion[]>;
  fetchGastos: (entidadId?: string) => Promise<{ gastos: Gasto[]; gastosPorEntidad: GastosPorEntidad[] }>;
  facturar: (request: FacturarRequest) => Promise<boolean>;
  resetDemoData: () => Promise<void>;
  generateNewDemoData: () => Promise<void>;
  addLog: (log: Omit<ApiLog, 'id' | 'timestamp'>) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  // Función para agregar logs
  const addLog = (log: Omit<ApiLog, 'id' | 'timestamp'>) => {
    const newLog: ApiLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    dispatch({ type: 'ADD_LOG', payload: newLog });
  };

  // Función para obtener facturación ARCA
  const fetchFacturacionARCA = async (periodo?: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const periodoParam = periodo || state.periodo;
      const url = `/api/arca/facturacion?periodo=${periodoParam}`;
      
      addLog({
        method: 'GET',
        url,
        request: { periodo: periodoParam }
      });

      const response = await fetch(url);
      
      // Verificar si la respuesta es HTML (error de MSW)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error('MSW no está funcionando, usando datos locales');
      }
      
      const result = await response.json();
      
      addLog({
        method: 'GET',
        url,
        response: result
      });

      if (result.success) {
        dispatch({ type: 'UPDATE_ARCA', payload: result.data });
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.message || 'Error al obtener facturación ARCA' });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      // Si MSW falla, usar datos locales
      if (errorMessage.includes('MSW no está funcionando')) {
        console.log('🔄 Usando datos locales como fallback');
        dispatch({ type: 'UPDATE_ARCA', payload: state.data.facturacionARCA });
      } else {
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      }
      
      addLog({
        method: 'GET',
        url: `/api/arca/facturacion?periodo=${periodo || state.periodo}`,
        response: { error: errorMessage }
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Función para obtener gastos
  const fetchGastos = async (entidadId?: string): Promise<{ gastos: Gasto[]; gastosPorEntidad: GastosPorEntidad[] }> => {
    try {
      const url = entidadId ? `/api/gastos?entidadId=${entidadId}` : '/api/gastos';
      
      addLog({
        method: 'GET',
        url,
        request: { entidadId }
      });

      const response = await fetch(url);
      
      // Verificar si la respuesta es HTML (error de MSW)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error('MSW no está funcionando, usando datos locales');
      }
      
      const result = await response.json();
      
      addLog({
        method: 'GET',
        url,
        response: result
      });

      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Error al obtener gastos');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      // Si MSW falla, usar datos locales
      if (errorMessage.includes('MSW no está funcionando')) {
        console.log('🔄 Usando datos locales como fallback para gastos');
        let gastos = state.data.gastos;
        let gastosPorEntidad = state.data.gastosPorEntidad;
        
        if (entidadId) {
          gastos = gastos.filter(g => g.entidadId === entidadId);
          gastosPorEntidad = gastosPorEntidad.filter(g => g.entidadId === entidadId);
        }
        
        return { gastos, gastosPorEntidad };
      }
      
      addLog({
        method: 'GET',
        url: entidadId ? `/api/gastos?entidadId=${entidadId}` : '/api/gastos',
        response: { error: errorMessage }
      });
      throw error;
    }
  };

  // Función para obtener recaudaciones
  const fetchRecaudaciones = async (punto?: string): Promise<Recaudacion[]> => {
    try {
      const url = punto ? `/api/recaudaciones?punto=${punto}` : '/api/recaudaciones';
      
      addLog({
        method: 'GET',
        url,
        request: { punto }
      });

      const response = await fetch(url);
      
      // Verificar si la respuesta es HTML (error de MSW)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error('MSW no está funcionando, usando datos locales');
      }
      
      const result = await response.json();
      
      addLog({
        method: 'GET',
        url,
        response: result
      });

      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Error al obtener recaudaciones');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      // Si MSW falla, usar datos locales
      if (errorMessage.includes('MSW no está funcionando')) {
        console.log('🔄 Usando datos locales como fallback para recaudaciones');
        let recaudaciones = state.data.recaudaciones;
        if (punto) {
          recaudaciones = recaudaciones.filter(r => r.punto === punto);
        }
        
        // Calcular montos facturados y pendientes
        const recaudacionesConCalculos = recaudaciones.map(rec => {
          const facturado = state.data.recaudacionFacturas
            .filter(rf => rf.recaudacionId === rec.id)
            .reduce((sum, rf) => sum + rf.monto, 0);
          
          return {
            ...rec,
            facturado,
            pendiente: rec.importe - facturado
          };
        });
        
        return recaudacionesConCalculos;
      }
      
      addLog({
        method: 'GET',
        url: punto ? `/api/recaudaciones?punto=${punto}` : '/api/recaudaciones',
        response: { error: errorMessage }
      });
      throw error;
    }
  };

  // Función para facturar
  const facturar = async (request: FacturarRequest): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      addLog({
        method: 'POST',
        url: '/api/facturar',
        request
      });

      const response = await fetch('/api/facturar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      // Verificar si la respuesta es HTML (error de MSW)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error('MSW no está funcionando, usando simulación local');
      }

      if (!response.ok) {
        // Si es 404, probablemente MSW no está funcionando
        if (response.status === 404) {
          throw new Error('MSW no está funcionando, usando simulación local');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      addLog({
        method: 'POST',
        url: '/api/facturar',
        response: result
      });

      if (result.success) {
        // Crear vínculo recaudación-factura
        const recaudacionFactura: RecaudacionFactura = {
          id: `RF-${state.data.recaudacionFacturas.length + 1}`,
          recaudacionId: request.recaudacionId,
          facturaId: result.factura.id,
          monto: request.monto
        };

        dispatch({ type: 'ADD_FACTURA', payload: { factura: result.factura, recaudacionFactura } });
        
        // Actualizar ARCA
        await fetchFacturacionARCA();
        
        // Emitir evento de éxito
        window.dispatchEvent(new CustomEvent('facturacion-success', {
          detail: { factura: result.factura }
        }));
        
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.message || 'Error al facturar' });
        
        // Emitir evento de error
        window.dispatchEvent(new CustomEvent('facturacion-error', {
          detail: { error: result.message || 'Error al facturar' }
        }));
        
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      console.log('🚨 Error en facturar:', errorMessage);
      
      // Si MSW falla o hay error de JSON, simular facturación localmente
      if (errorMessage.includes('MSW no está funcionando') || 
          errorMessage.includes('Unexpected end of JSON input') ||
          errorMessage.includes('Failed to execute') ||
          errorMessage.includes('HTTP 404')) {
        console.log('🔄 Simulando facturación localmente');
        
        // Validar que la recaudación existe
        const recaudacion = state.data.recaudaciones.find(r => r.id === request.recaudacionId);
        if (!recaudacion) {
          dispatch({ type: 'SET_ERROR', payload: 'Recaudación no encontrada' });
          return false;
        }

        // Calcular monto pendiente
        const facturado = state.data.recaudacionFacturas
          .filter(rf => rf.recaudacionId === request.recaudacionId)
          .reduce((sum, rf) => sum + rf.monto, 0);
        
        const pendiente = recaudacion.importe - facturado;
        
        if (request.monto > pendiente) {
          dispatch({ type: 'SET_ERROR', payload: `El monto solicitado excede el saldo pendiente` });
          return false;
        }

        // Generar datos realistas para la factura
        const facturaId = state.data.facturas.length + 1;
        const caeFake = Math.floor(Math.random() * 900000000000) + 100000000000;
        const vtoCae = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        
        // Crear factura simulada
        const nuevaFactura: Factura = {
          id: `F-${facturaId.toString().padStart(3, '0')}`,
          entidadId: request.entidadId,
          recaudacionId: request.recaudacionId,
          monto: request.monto,
          caeFake: caeFake.toString(),
          vtoCaeFake: vtoCae.toISOString().split('T')[0],
          nroComprobante: `0001-${facturaId.toString().padStart(8, '0')}`,
          pdfFakeUrl: `/pdfs/factura-${facturaId}.pdf`,
          fechaEmision: new Date().toISOString().split('T')[0]
        };

        const recaudacionFactura: RecaudacionFactura = {
          id: `RF-${state.data.recaudacionFacturas.length + 1}`,
          recaudacionId: request.recaudacionId,
          facturaId: nuevaFactura.id,
          monto: request.monto
        };

        dispatch({ type: 'ADD_FACTURA', payload: { factura: nuevaFactura, recaudacionFactura } });
        
        // Actualizar gastos (simular que al facturar se generan gastos adicionales)
        const nuevoGasto: Gasto = {
          id: `G-${state.data.gastos.length + 1}`,
          entidadId: request.entidadId,
          concepto: "Comisión por Facturación",
          monto: Math.floor(request.monto * 0.02), // 2% de comisión
          importe: Math.floor(request.monto * 0.02), // 2% de comisión
          fecha: new Date().toISOString().split('T')[0],
          facturaA: `FA-${(state.data.gastos.length + 1).toString().padStart(8, '0')}`,
          nroComprobante: `0001-${(state.data.gastos.length + 1).toString().padStart(8, '0')}`,
          puntoRecaudacion: "P1",
          cuitEmisor: "20-12345678-9",
          nombreEmisor: "Sistema de Comisiones",
          pdfUrl: `/pdfs/gasto-${state.data.gastos.length + 1}.pdf`
        };
        
        const gastosActualizados = [...state.data.gastos, nuevoGasto];
        const gastosPorEntidadActualizados = state.data.gastosPorEntidad.map(ge => {
          if (ge.entidadId === request.entidadId) {
            return {
              ...ge,
              totalGastos: ge.totalGastos + nuevoGasto.monto,
              cantidadFacturasA: ge.cantidadFacturasA + 1,
              gastos: [...ge.gastos, nuevoGasto]
            };
          }
          return ge;
        });
        
        dispatch({ type: 'UPDATE_GASTOS', payload: { gastos: gastosActualizados, gastosPorEntidad: gastosPorEntidadActualizados } });
        
        // Emitir evento de éxito
        window.dispatchEvent(new CustomEvent('facturacion-success', {
          detail: { factura: nuevaFactura }
        }));
        
        console.log('✅ Facturación simulada exitosa:', nuevaFactura);
        return true;
      }
      
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      addLog({
        method: 'POST',
        url: '/api/facturar',
        response: { error: errorMessage }
      });
      
      // Emitir evento de error
      window.dispatchEvent(new CustomEvent('facturacion-error', {
        detail: { error: errorMessage }
      }));
      
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Función para resetear datos demo
  const resetDemoData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      addLog({
        method: 'POST',
        url: '/api/demo/reset',
        request: {}
      });

      const response = await fetch('/api/demo/reset', { method: 'POST' });
      const result = await response.json();
      
      addLog({
        method: 'POST',
        url: '/api/demo/reset',
        response: result
      });

      if (result.success) {
        dispatch({ type: 'RESET_DATA' });
        await fetchFacturacionARCA();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Función para generar nueva data demo
  const generateNewDemoData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      addLog({
        method: 'POST',
        url: '/api/demo/generate',
        request: {}
      });

      const response = await fetch('/api/demo/generate', { method: 'POST' });
      const result = await response.json();
      
      addLog({
        method: 'POST',
        url: '/api/demo/generate',
        response: result
      });

      if (result.success) {
        dispatch({ type: 'RESET_DATA' });
        await fetchFacturacionARCA();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    // Cargar datos iniciales después de un breve delay para asegurar que MSW esté listo
    const timer = setTimeout(async () => {
      await Promise.all([
        fetchFacturacionARCA(),
        fetchGastos()
      ]);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const contextValue: DashboardContextType = {
    state,
    dispatch,
    fetchFacturacionARCA,
    fetchRecaudaciones,
    fetchGastos,
    facturar,
    resetDemoData,
    generateNewDemoData,
    addLog
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
