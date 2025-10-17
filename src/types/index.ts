export interface Entidad {
  id: string;
  nombre: string;
  cuit: string;
}

export interface PuntoRecaudacion {
  id: string;
  nombre: string;
}

export interface Recaudacion {
  id: string;
  punto: string;
  fecha: string;
  importe: number;
  medio: string;
  referencia: string;
  facturado?: number;
  pendiente?: number;
}

export interface Factura {
  id: string;
  entidadId: string;
  recaudacionId: string;
  monto: number;
  caeFake: string;
  vtoCaeFake: string;
  nroComprobante: string;
  pdfFakeUrl: string;
  fechaEmision: string;
}

export interface RecaudacionFactura {
  id: string;
  recaudacionId: string;
  facturaId: string;
  monto: number;
}

export interface FacturacionARCA {
  cuit: string;
  total: number;
  periodo: string;
}

export interface Gasto {
  id: string;
  entidadId: string;
  concepto: string;
  monto: number;
  fecha: string;
  facturaA: string;
  puntoRecaudacion: string;
}

export interface GastosPorEntidad {
  entidadId: string;
  cuit: string;
  totalGastos: number;
  cantidadFacturasA: number;
  gastos: Gasto[];
}

export interface DashboardData {
  entidades: Entidad[];
  puntosRecaudacion: PuntoRecaudacion[];
  recaudaciones: Recaudacion[];
  facturas: Factura[];
  recaudacionFacturas: RecaudacionFactura[];
  facturacionARCA: FacturacionARCA[];
  gastos: Gasto[];
  gastosPorEntidad: GastosPorEntidad[];
}

export interface FacturarRequest {
  recaudacionId: string;
  entidadId: string;
  monto: number;
}

export interface FacturarResponse {
  factura: Factura;
  success: boolean;
  message: string;
}

export interface ApiLog {
  id: string;
  timestamp: string;
  method: string;
  url: string;
  request?: any;
  response?: any;
}
