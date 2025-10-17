import { DashboardData, Entidad, PuntoRecaudacion, Recaudacion, Factura, RecaudacionFactura, FacturacionARCA, Gasto, GastosPorEntidad } from '../types';

export const entidades: Entidad[] = [
  { id: "E-A", nombre: "Entidad A", cuit: "30-11111111-1" },
  { id: "E-B", nombre: "Entidad B", cuit: "30-22222222-2" },
  { id: "E-C", nombre: "Entidad C", cuit: "30-33333333-3" }
];

export const puntosRecaudacion: PuntoRecaudacion[] = [
  { id: "P1", nombre: "Sucursal Resistencia" },
  { id: "P2", nombre: "Sucursal Corrientes" },
  { id: "P3", nombre: "Kiosco Centro" },
  { id: "P4", nombre: "Ventanilla Online" }
];

export const recaudaciones: Recaudacion[] = [
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

// Facturas pre-existentes para que coincida con los montos ARCA iniciales
// Estas facturas se crean a partir de recaudaciones existentes
export const facturas: Factura[] = [
  {
    id: "F-001",
    entidadId: "E-A",
    recaudacionId: "R-101", // Facturamos parte de R-101
    monto: 500000,
    caeFake: "123456789234",
    vtoCaeFake: "2025-11-17",
    nroComprobante: "0001-00000001",
    pdfFakeUrl: "/pdfs/factura-001.pdf",
    fechaEmision: "2025-10-01"
  },
  {
    id: "F-002",
    entidadId: "E-B",
    recaudacionId: "R-102", // Facturamos parte de R-102
    monto: 300000,
    caeFake: "234567890345",
    vtoCaeFake: "2025-11-18",
    nroComprobante: "0001-00000002",
    pdfFakeUrl: "/pdfs/factura-002.pdf",
    fechaEmision: "2025-10-02"
  },
  {
    id: "F-003",
    entidadId: "E-C",
    recaudacionId: "R-103", // Facturamos parte de R-103
    monto: 250000,
    caeFake: "345678901456",
    vtoCaeFake: "2025-11-19",
    nroComprobante: "0001-00000003",
    pdfFakeUrl: "/pdfs/factura-003.pdf",
    fechaEmision: "2025-10-03"
  }
];

export const recaudacionFacturas: RecaudacionFactura[] = [
  { id: "RF-001", recaudacionId: "R-101", facturaId: "F-001", monto: 500000 },
  { id: "RF-002", recaudacionId: "R-102", facturaId: "F-002", monto: 300000 },
  { id: "RF-003", recaudacionId: "R-103", facturaId: "F-003", monto: 250000 }
];

export const facturacionARCA: FacturacionARCA[] = [
  { cuit: "30-11111111-1", total: 500000, periodo: "2025-10" },
  { cuit: "30-22222222-2", total: 300000, periodo: "2025-10" },
  { cuit: "30-33333333-3", total: 250000, periodo: "2025-10" }
];

// Gastos por entidad (Facturas A desde ARCA)
export const gastos: Gasto[] = [
  { id: "G-001", entidadId: "E-A", concepto: "Servicios de Administración", monto: 150000, fecha: "2025-10-01", facturaA: "FA-00000001", puntoRecaudacion: "P1" },
  { id: "G-002", entidadId: "E-A", concepto: "Mantenimiento de Sistemas", monto: 80000, fecha: "2025-10-05", facturaA: "FA-00000002", puntoRecaudacion: "P2" },
  { id: "G-003", entidadId: "E-A", concepto: "Consultoría Técnica", monto: 120000, fecha: "2025-10-10", facturaA: "FA-00000003", puntoRecaudacion: "P1" },
  { id: "G-004", entidadId: "E-B", concepto: "Servicios de Administración", monto: 100000, fecha: "2025-10-02", facturaA: "FA-00000004", puntoRecaudacion: "P3" },
  { id: "G-005", entidadId: "E-B", concepto: "Infraestructura", monto: 90000, fecha: "2025-10-08", facturaA: "FA-00000005", puntoRecaudacion: "P4" },
  { id: "G-006", entidadId: "E-C", concepto: "Servicios de Administración", monto: 75000, fecha: "2025-10-03", facturaA: "FA-00000006", puntoRecaudacion: "P2" },
  { id: "G-007", entidadId: "E-C", concepto: "Desarrollo de Software", monto: 110000, fecha: "2025-10-12", facturaA: "FA-00000007", puntoRecaudacion: "P3" }
];

export const gastosPorEntidad: GastosPorEntidad[] = [
  {
    entidadId: "E-A",
    cuit: "30-11111111-1",
    totalGastos: 350000,
    cantidadFacturasA: 3,
    gastos: gastos.filter(g => g.entidadId === "E-A")
  },
  {
    entidadId: "E-B", 
    cuit: "30-22222222-2",
    totalGastos: 190000,
    cantidadFacturasA: 2,
    gastos: gastos.filter(g => g.entidadId === "E-B")
  },
  {
    entidadId: "E-C",
    cuit: "30-33333333-3", 
    totalGastos: 185000,
    cantidadFacturasA: 2,
    gastos: gastos.filter(g => g.entidadId === "E-C")
  }
];

export const initialData: DashboardData = {
  entidades,
  puntosRecaudacion,
  recaudaciones,
  facturas,
  recaudacionFacturas,
  facturacionARCA,
  gastos,
  gastosPorEntidad
};

// Función para generar CAE fake
export const generateFakeCAE = (): string => {
  return Math.floor(Math.random() * 900000000000) + 100000000000 + "";
};

// Función para generar número de comprobante
export const generateComprobanteNumber = (): string => {
  const numero = Math.floor(Math.random() * 99999999) + 1;
  return `0001-${numero.toString().padStart(8, '0')}`;
};

// Función para generar fecha de vencimiento CAE
export const generateVtoCAE = (): string => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + 30);
  return fecha.toISOString().split('T')[0];
};
