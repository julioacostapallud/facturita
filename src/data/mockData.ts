import { DashboardData, Entidad, PuntoRecaudacion, Recaudacion, Factura, RecaudacionFactura, FacturacionARCA, Gasto, GastosPorEntidad } from '../types';

export const entidades: Entidad[] = [
  { id: "E-A", nombre: "CUIT A", cuit: "30-11111111-1" },
  { id: "E-B", nombre: "CUIT B", cuit: "30-22222222-2" },
  { id: "E-C", nombre: "CUIT C", cuit: "30-33333333-3" }
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
  { id: "R-110", punto: "P1", fecha: "2025-10-10", importe: 90000, medio: "Efectivo", referencia: "EF-003" },
  // Más recaudaciones para tener más datos
  { id: "R-111", punto: "P2", fecha: "2025-10-11", importe: 65000, medio: "MercadoPago", referencia: "MP-47" },
  { id: "R-112", punto: "P3", fecha: "2025-10-12", importe: 55000, medio: "Transferencia", referencia: "TR-79" },
  { id: "R-113", punto: "P4", fecha: "2025-10-13", importe: 35000, medio: "Tarjeta", referencia: "TX-DDD" },
  { id: "R-114", punto: "P1", fecha: "2025-10-14", importe: 80000, medio: "Efectivo", referencia: "EF-004" },
  { id: "R-115", punto: "P2", fecha: "2025-10-15", importe: 70000, medio: "MercadoPago", referencia: "MP-48" }
];

// Facturas pre-existentes para que coincida con los montos ARCA iniciales
// Estas facturas se crean a partir de recaudaciones existentes
export const facturas: Factura[] = [
  // Facturas de CUIT A
  {
    id: "F-001",
    entidadId: "E-A",
    recaudacionId: "R-101",
    monto: 200000,
    caeFake: "123456789234",
    vtoCaeFake: "2025-11-17",
    nroComprobante: "0001-00000001",
    pdfFakeUrl: "/pdfs/factura-001.pdf",
    fechaEmision: "2025-10-01"
  },
  {
    id: "F-002",
    entidadId: "E-A",
    recaudacionId: "R-102",
    monto: 150000,
    caeFake: "123456789235",
    vtoCaeFake: "2025-11-18",
    nroComprobante: "0001-00000002",
    pdfFakeUrl: "/pdfs/factura-002.pdf",
    fechaEmision: "2025-10-05"
  },
  {
    id: "F-003",
    entidadId: "E-A",
    recaudacionId: "R-103",
    monto: 150000,
    caeFake: "123456789236",
    vtoCaeFake: "2025-11-19",
    nroComprobante: "0001-00000003",
    pdfFakeUrl: "/pdfs/factura-003.pdf",
    fechaEmision: "2025-10-08"
  },
  // Facturas de CUIT B
  {
    id: "F-004",
    entidadId: "E-B",
    recaudacionId: "R-104",
    monto: 120000,
    caeFake: "234567890345",
    vtoCaeFake: "2025-11-20",
    nroComprobante: "0001-00000004",
    pdfFakeUrl: "/pdfs/factura-004.pdf",
    fechaEmision: "2025-10-02"
  },
  {
    id: "F-005",
    entidadId: "E-B",
    recaudacionId: "R-105",
    monto: 100000,
    caeFake: "234567890346",
    vtoCaeFake: "2025-11-21",
    nroComprobante: "0001-00000005",
    pdfFakeUrl: "/pdfs/factura-005.pdf",
    fechaEmision: "2025-10-06"
  },
  {
    id: "F-006",
    entidadId: "E-B",
    recaudacionId: "R-106",
    monto: 80000,
    caeFake: "234567890347",
    vtoCaeFake: "2025-11-22",
    nroComprobante: "0001-00000006",
    pdfFakeUrl: "/pdfs/factura-006.pdf",
    fechaEmision: "2025-10-10"
  },
  // Facturas de CUIT C
  {
    id: "F-007",
    entidadId: "E-C",
    recaudacionId: "R-107",
    monto: 100000,
    caeFake: "345678901456",
    vtoCaeFake: "2025-11-23",
    nroComprobante: "0001-00000007",
    pdfFakeUrl: "/pdfs/factura-007.pdf",
    fechaEmision: "2025-10-03"
  },
  {
    id: "F-008",
    entidadId: "E-C",
    recaudacionId: "R-108",
    monto: 80000,
    caeFake: "345678901457",
    vtoCaeFake: "2025-11-24",
    nroComprobante: "0001-00000008",
    pdfFakeUrl: "/pdfs/factura-008.pdf",
    fechaEmision: "2025-10-07"
  },
  {
    id: "F-009",
    entidadId: "E-C",
    recaudacionId: "R-109",
    monto: 70000,
    caeFake: "345678901458",
    vtoCaeFake: "2025-11-25",
    nroComprobante: "0001-00000009",
    pdfFakeUrl: "/pdfs/factura-009.pdf",
    fechaEmision: "2025-10-12"
  }
];

export const recaudacionFacturas: RecaudacionFactura[] = [
  // CUIT A
  { id: "RF-001", recaudacionId: "R-101", facturaId: "F-001", monto: 200000 },
  { id: "RF-002", recaudacionId: "R-102", facturaId: "F-002", monto: 150000 },
  { id: "RF-003", recaudacionId: "R-103", facturaId: "F-003", monto: 150000 },
  // CUIT B
  { id: "RF-004", recaudacionId: "R-104", facturaId: "F-004", monto: 120000 },
  { id: "RF-005", recaudacionId: "R-105", facturaId: "F-005", monto: 100000 },
  { id: "RF-006", recaudacionId: "R-106", facturaId: "F-006", monto: 80000 },
  // CUIT C
  { id: "RF-007", recaudacionId: "R-107", facturaId: "F-007", monto: 100000 },
  { id: "RF-008", recaudacionId: "R-108", facturaId: "F-008", monto: 80000 },
  { id: "RF-009", recaudacionId: "R-109", facturaId: "F-009", monto: 70000 }
];

export const facturacionARCA: FacturacionARCA[] = [
  { cuit: "30-11111111-1", total: 500000, periodo: "2025-10" },
  { cuit: "30-22222222-2", total: 300000, periodo: "2025-10" },
  { cuit: "30-33333333-3", total: 250000, periodo: "2025-10" }
];

// Gastos por entidad (Facturas A desde ARCA)
export const gastos: Gasto[] = [
  { 
    id: "G-001", 
    entidadId: "E-A", 
    concepto: "Servicios de Administración", 
    monto: 150000, 
    importe: 150000,
    fecha: "2025-10-01", 
    facturaA: "FA-00000001", 
    nroComprobante: "0001-00000001",
    puntoRecaudacion: "P1",
    cuitEmisor: "20-12345678-9",
    nombreEmisor: "YPF Don Bosco",
    pdfUrl: "/pdfs/gasto-001.pdf"
  },
  { 
    id: "G-002", 
    entidadId: "E-A", 
    concepto: "Mantenimiento de Sistemas", 
    monto: 80000, 
    importe: 80000,
    fecha: "2025-10-05", 
    facturaA: "FA-00000002", 
    nroComprobante: "0001-00000002",
    puntoRecaudacion: "P2",
    cuitEmisor: "30-98765432-1",
    nombreEmisor: "Tech Solutions S.A.",
    pdfUrl: "/pdfs/gasto-002.pdf"
  },
  { 
    id: "G-003", 
    entidadId: "E-A", 
    concepto: "Consultoría Técnica", 
    monto: 120000, 
    importe: 120000,
    fecha: "2025-10-10", 
    facturaA: "FA-00000003", 
    nroComprobante: "0001-00000003",
    puntoRecaudacion: "P1",
    cuitEmisor: "27-45678912-3",
    nombreEmisor: "Consultores del Norte",
    pdfUrl: "/pdfs/gasto-003.pdf"
  },
  { 
    id: "G-004", 
    entidadId: "E-B", 
    concepto: "Servicios de Administración", 
    monto: 100000, 
    importe: 100000,
    fecha: "2025-10-02", 
    facturaA: "FA-00000004", 
    nroComprobante: "0001-00000004",
    puntoRecaudacion: "P3",
    cuitEmisor: "20-11111111-1",
    nombreEmisor: "Shell Corrientes",
    pdfUrl: "/pdfs/gasto-004.pdf"
  },
  { 
    id: "G-005", 
    entidadId: "E-B", 
    concepto: "Infraestructura", 
    monto: 90000, 
    importe: 90000,
    fecha: "2025-10-08", 
    facturaA: "FA-00000005", 
    nroComprobante: "0001-00000005",
    puntoRecaudacion: "P4",
    cuitEmisor: "30-22222222-2",
    nombreEmisor: "Constructora del Litoral",
    pdfUrl: "/pdfs/gasto-005.pdf"
  },
  { 
    id: "G-006", 
    entidadId: "E-C", 
    concepto: "Servicios de Administración", 
    monto: 75000, 
    importe: 75000,
    fecha: "2025-10-03", 
    facturaA: "FA-00000006", 
    nroComprobante: "0001-00000006",
    puntoRecaudacion: "P2",
    cuitEmisor: "20-33333333-3",
    nombreEmisor: "Axion Resistencia",
    pdfUrl: "/pdfs/gasto-006.pdf"
  },
  { 
    id: "G-007", 
    entidadId: "E-C", 
    concepto: "Desarrollo de Software", 
    monto: 110000, 
    importe: 110000,
    fecha: "2025-10-12", 
    facturaA: "FA-00000007", 
    nroComprobante: "0001-00000007",
    puntoRecaudacion: "P3",
    cuitEmisor: "30-44444444-4",
    nombreEmisor: "Software Solutions",
    pdfUrl: "/pdfs/gasto-007.pdf"
  }
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
