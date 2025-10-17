import { http, HttpResponse } from 'msw';
import { initialData, generateFakeCAE, generateComprobanteNumber, generateVtoCAE } from '../data/mockData';
import { FacturarRequest, FacturarResponse } from '../types';

// Estado global simulado
let mockData = { ...initialData };
let facturaCounter = 4;

// Función para obtener datos del localStorage
const getStoredData = () => {
  const stored = localStorage.getItem('facturita-dashboard-data');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      mockData = { ...initialData, ...parsed };
      facturaCounter = mockData.facturas.length + 1;
    } catch (e) {
      console.error('Error parsing stored data:', e);
    }
  }
};

// Función para guardar datos en localStorage
const saveData = () => {
  localStorage.setItem('facturita-dashboard-data', JSON.stringify({
    facturas: mockData.facturas,
    recaudacionFacturas: mockData.recaudacionFacturas,
    facturacionARCA: mockData.facturacionARCA
  }));
};

// Inicializar datos
getStoredData();

export const handlers = [
  // Endpoint para obtener facturación ARCA
  http.get('/api/arca/facturacion', async ({ request }) => {
    const url = new URL(request.url);
    const periodo = url.searchParams.get('periodo') || '2025-10';
    
    const response = mockData.facturacionARCA.filter(f => f.periodo === periodo);
    
    // Simular latencia de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return HttpResponse.json({
      success: true,
      data: response,
      periodo
    });
  }),

  // Endpoint para obtener último número autorizado
  http.get('/api/arca/ultimoNumero', async ({ request }) => {
    const url = new URL(request.url);
    const cuit = url.searchParams.get('cuit');
    const pv = url.searchParams.get('pv') || '0001';
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return HttpResponse.json({
      success: true,
      data: {
        cuit,
        pv,
        ultimoNumero: Math.floor(Math.random() * 1000) + 1
      }
    });
  }),

  // Endpoint para facturar
  http.post('/api/facturar', async ({ request }) => {
    const body: FacturarRequest = await request.json();
    
    // Validar que la recaudación existe y tiene saldo pendiente
    const recaudacion = mockData.recaudaciones.find(r => r.id === body.recaudacionId);
    if (!recaudacion) {
      return HttpResponse.json({
        success: false,
        message: 'Recaudación no encontrada'
      }, { status: 404 });
    }

    // Calcular monto pendiente
    const facturado = mockData.recaudacionFacturas
      .filter(rf => rf.recaudacionId === body.recaudacionId)
      .reduce((sum, rf) => sum + rf.monto, 0);
    
    const pendiente = recaudacion.importe - facturado;
    
    if (body.monto > pendiente) {
      return HttpResponse.json({
        success: false,
        message: `El monto solicitado ($${body.monto.toLocaleString()}) excede el saldo pendiente ($${pendiente.toLocaleString()})`
      }, { status: 400 });
    }

    // Crear nueva factura
    const nuevaFactura = {
      id: `F-${facturaCounter.toString().padStart(3, '0')}`,
      entidadId: body.entidadId,
      recaudacionId: body.recaudacionId,
      monto: body.monto,
      caeFake: generateFakeCAE(),
      vtoCaeFake: generateVtoCAE(),
      nroComprobante: generateComprobanteNumber(),
      pdfFakeUrl: `/pdfs/factura-${facturaCounter}.pdf`,
      fechaEmision: new Date().toISOString().split('T')[0]
    };

    // Crear vínculo recaudación-factura
    const nuevaRecaudacionFactura = {
      id: `RF-${mockData.recaudacionFacturas.length + 1}`,
      recaudacionId: body.recaudacionId,
      facturaId: nuevaFactura.id,
      monto: body.monto
    };

    // Actualizar estado
    mockData.facturas.push(nuevaFactura);
    mockData.recaudacionFacturas.push(nuevaRecaudacionFactura);
    
    // Actualizar facturación ARCA
    const entidad = mockData.entidades.find(e => e.id === body.entidadId);
    if (entidad) {
      const arcaEntry = mockData.facturacionARCA.find(f => f.cuit === entidad.cuit);
      if (arcaEntry) {
        arcaEntry.total += body.monto;
      } else {
        mockData.facturacionARCA.push({
          cuit: entidad.cuit,
          total: body.monto,
          periodo: '2025-10'
        });
      }
    }

    facturaCounter++;
    saveData();

    const response: FacturarResponse = {
      factura: nuevaFactura,
      success: true,
      message: 'Factura emitida exitosamente'
    };

    // Simular tiempo de procesamiento
    await new Promise(resolve => setTimeout(resolve, 800));

    return HttpResponse.json(response);
  }),

  // Endpoint para obtener gastos
  http.get('/api/gastos', async ({ request }) => {
    const url = new URL(request.url);
    const entidadId = url.searchParams.get('entidadId');
    
    let gastos = mockData.gastos;
    let gastosPorEntidad = mockData.gastosPorEntidad;
    
    if (entidadId) {
      gastos = gastos.filter(g => g.entidadId === entidadId);
      gastosPorEntidad = gastosPorEntidad.filter(g => g.entidadId === entidadId);
    }

    await new Promise(resolve => setTimeout(resolve, 300));

    return HttpResponse.json({
      success: true,
      data: { gastos, gastosPorEntidad }
    });
  }),

  // Endpoint para obtener recaudaciones
  http.get('/api/recaudaciones', async ({ request }) => {
    const url = new URL(request.url);
    const punto = url.searchParams.get('punto');
    
    let recaudaciones = mockData.recaudaciones;
    if (punto) {
      recaudaciones = recaudaciones.filter(r => r.punto === punto);
    }

    // Calcular montos facturados y pendientes
    const recaudacionesConCalculos = recaudaciones.map(rec => {
      const facturado = mockData.recaudacionFacturas
        .filter(rf => rf.recaudacionId === rec.id)
        .reduce((sum, rf) => sum + rf.monto, 0);
      
      return {
        ...rec,
        facturado,
        pendiente: rec.importe - facturado
      };
    });

    await new Promise(resolve => setTimeout(resolve, 300));

    return HttpResponse.json({
      success: true,
      data: recaudacionesConCalculos
    });
  }),

  // Endpoint para resetear datos demo
  http.post('/api/demo/reset', async () => {
    mockData = { ...initialData };
    facturaCounter = 4;
    localStorage.removeItem('facturita-dashboard-data');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return HttpResponse.json({
      success: true,
      message: 'Datos demo reseteados exitosamente'
    });
  }),

  // Endpoint para generar nueva data demo
  http.post('/api/demo/generate', async () => {
    // Regenerar recaudaciones con nuevos montos
    const nuevasRecaudaciones = [
      { id: "R-101", punto: "P1", fecha: "2025-10-01", importe: 120000, medio: "Tarjeta", referencia: "TX-AAA" },
      { id: "R-102", punto: "P1", fecha: "2025-10-02", importe: 50000, medio: "Efectivo", referencia: "EF-001" },
      { id: "R-103", punto: "P2", fecha: "2025-10-03", importe: 80000, medio: "MercadoPago", referencia: "MP-45" },
      { id: "R-104", punto: "P3", fecha: "2025-10-04", importe: 100000, medio: "Transferencia", referencia: "TR-77" },
      { id: "R-105", punto: "P4", fecha: "2025-10-05", importe: 10000, medio: "Tarjeta", referencia: "TX-BBB" },
      { id: "R-106", punto: "P1", fecha: "2025-10-06", importe: 75000, medio: "Efectivo", referencia: "EF-002" },
      { id: "R-107", punto: "P2", fecha: "2025-10-07", importe: 45000, medio: "MercadoPago", referencia: "MP-46" },
      { id: "R-108", punto: "P3", fecha: "2025-10-08", importe: 60000, medio: "Transferencia", referencia: "TR-78" },
      { id: "R-109", punto: "P4", fecha: "2025-10-09", importe: 25000, medio: "Tarjeta", referencia: "TX-CCC" },
      { id: "R-110", punto: "P1", fecha: "2025-10-10", importe: 90000, medio: "Efectivo", referencia: "EF-003" }
    ];

    mockData.recaudaciones = nuevasRecaudaciones;
    mockData.facturas = initialData.facturas;
    mockData.recaudacionFacturas = initialData.recaudacionFacturas;
    mockData.facturacionARCA = initialData.facturacionARCA;
    facturaCounter = 4;
    
    saveData();

    await new Promise(resolve => setTimeout(resolve, 500));

    return HttpResponse.json({
      success: true,
      message: 'Nueva data demo generada exitosamente',
      data: {
        totalRecaudaciones: nuevasRecaudaciones.reduce((sum, r) => sum + r.importe, 0)
      }
    });
  })
];