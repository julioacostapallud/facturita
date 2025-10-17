import { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { EntidadCard } from './EntidadCard';
import { RecaudacionCard } from './RecaudacionCard';
import { PuntoRecaudacionCard } from './PuntoRecaudacionCard';
import { GastosCard } from './GastosCard';
import { GastoEntidadCard } from './GastoEntidadCard';
import { DetalleRecaudacionModal } from './DetalleRecaudacionModal';
import { DetalleGastosModal } from './DetalleGastosModal';
import { RefreshCw, Download, RotateCcw, Settings } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { Entidad, PuntoRecaudacion } from '../types';

export function Dashboard() {
  const { state, fetchFacturacionARCA, resetDemoData, generateNewDemoData } = useDashboard();
  const [modalDetalle, setModalDetalle] = useState<{
    isOpen: boolean;
    tipo: 'recaudacion' | 'entidad' | 'punto';
    titulo: string;
    puntoId?: string;
    entidadId?: string;
  }>({ isOpen: false, tipo: 'recaudacion', titulo: '' });

  const [modalGastos, setModalGastos] = useState<{
    isOpen: boolean;
    titulo: string;
    entidadId?: string;
  }>({ isOpen: false, titulo: '' });

  const handleRefreshARCA = async () => {
    await fetchFacturacionARCA();
  };

  const handleVerDetalleRecaudacion = () => {
    setModalDetalle({
      isOpen: true,
      tipo: 'recaudacion',
      titulo: 'Detalle — Ingresos Generales'
    });
  };

  const handleVerDetallePunto = (punto: PuntoRecaudacion) => {
    setModalDetalle({
      isOpen: true,
      tipo: 'punto',
      titulo: `Detalle — Ingresos — Punto: ${punto.nombre}`,
      puntoId: punto.id
    });
  };

  const handleVerDetalleGastos = () => {
    setModalGastos({
      isOpen: true,
      titulo: 'Detalle — Gastos Totales'
    });
  };

  const handleVerDetalleGastosEntidad = (entidad: Entidad) => {
    setModalGastos({
      isOpen: true,
      titulo: `Detalle — Gastos de ${entidad.nombre}`,
      entidadId: entidad.id
    });
  };

  const handleVerDetalleEntidad = (entidad: Entidad) => {
    setModalDetalle({
      isOpen: true,
      tipo: 'entidad',
      titulo: `Detalle — Facturas Emitidas — CUIT: ${entidad.nombre}`,
      entidadId: entidad.id
    });
  };

  const exportDashboardData = () => {
    const data = {
      periodo: state.periodo,
      entidades: state.data.entidades,
      puntosRecaudacion: state.data.puntosRecaudacion,
      facturacionARCA: state.data.facturacionARCA,
      recaudaciones: state.data.recaudaciones,
      facturas: state.data.facturas,
      exportado: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-${state.periodo}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Facturita Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-600">
                Período: {new Date().toLocaleDateString('es-AR', { 
                  year: 'numeric', 
                  month: 'long' 
                }).replace(/^\w/, c => c.toUpperCase())}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Button
                variant="secondary"
                onClick={handleRefreshARCA}
                loading={state.loading}
                size="sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Refrescar ARCA</span>
                <span className="sm:hidden">ARCA</span>
              </Button>
              
              <Button
                variant="secondary"
                onClick={exportDashboardData}
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Exportar</span>
              </Button>
              
              <div className="relative group">
                <Button variant="secondary" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Demo</span>
                </Button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <div className="py-1">
                    <button
                      onClick={generateNewDemoData}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Generar nueva data
                    </button>
                    <button
                      onClick={resetDemoData}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <RotateCcw className="w-4 h-4 inline mr-2" />
                      Resetear demo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-3 h-[calc(100vh-100px)] overflow-hidden">
        {/* Error Message */}
        {state.error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <p className="text-sm text-red-800">{state.error}</p>
            </div>
          </div>
        )}

        {/* Layout principal: 80% izquierda, 20% derecha */}
        <div className="flex flex-col lg:flex-row gap-3 w-full h-full">
          
          {/* Lado izquierdo - Ingresos (80%) */}
          <div className="w-[80%] space-y-3">
            
            {/* Ingresos Totales */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Ingresos Totales</h2>
              <RecaudacionCard
                recaudaciones={state.data.recaudaciones}
                recaudacionFacturas={state.data.recaudacionFacturas}
                onClick={handleVerDetalleRecaudacion}
              />
            </div>

            {/* CUITs */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">CUITs</h2>
              <div className="grid grid-cols-3 gap-2">
                {state.data.entidades.map((entidad) => {
                  const facturacion = state.data.facturacionARCA.find(f => f.cuit === entidad.cuit);
                  return (
                    <EntidadCard
                      key={entidad.id}
                      entidad={entidad}
                      facturacion={facturacion}
                      onClick={() => handleVerDetalleEntidad(entidad)}
                    />
                  );
                })}
              </div>
            </div>

            {/* Puntos de Recaudación */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Puntos de Recaudación</h2>
              <div className="grid grid-cols-4 gap-2">
                {state.data.puntosRecaudacion.map((punto) => (
                  <PuntoRecaudacionCard
                    key={punto.id}
                    punto={punto}
                    recaudaciones={state.data.recaudaciones}
                    recaudacionFacturas={state.data.recaudacionFacturas}
                    onClick={() => handleVerDetallePunto(punto)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Lado derecho - Gastos (20%) */}
          <div className="w-[20%] space-y-2">
            
            {/* Gastos Totales */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Gastos Totales</h2>
              <GastosCard
                gastos={state.data.gastos}
                gastosPorEntidad={state.data.gastosPorEntidad}
                totalFacturado={state.data.facturacionARCA.reduce((sum, f) => sum + f.total, 0)}
                onClick={handleVerDetalleGastos}
              />
            </div>

            {/* Gastos por CUIT - En columna */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Gastos por CUIT</h2>
              <div className="space-y-1">
                {state.data.entidades.map((entidad) => {
                  const gastosEntidad = state.data.gastosPorEntidad.find(g => g.entidadId === entidad.id);
                  const facturacionEntidad = state.data.facturacionARCA.find(f => f.cuit === entidad.cuit)?.total || 0;
                  return (
                    <GastoEntidadCard
                      key={entidad.id}
                      entidad={entidad}
                      gastosEntidad={gastosEntidad}
                      facturacionEntidad={facturacionEntidad}
                      onClick={() => handleVerDetalleGastosEntidad(entidad)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modales */}
      <DetalleRecaudacionModal
        isOpen={modalDetalle.isOpen}
        onClose={() => setModalDetalle({ isOpen: false, tipo: 'recaudacion', titulo: '' })}
        recaudaciones={state.data.recaudaciones}
        entidades={state.data.entidades}
        facturas={state.data.facturas}
        recaudacionFacturas={state.data.recaudacionFacturas}
        titulo={modalDetalle.titulo}
        puntoId={modalDetalle.puntoId}
        entidadId={modalDetalle.entidadId}
      />

      <DetalleGastosModal
        isOpen={modalGastos.isOpen}
        onClose={() => setModalGastos({ isOpen: false, titulo: '' })}
        gastos={state.data.gastos}
        entidades={state.data.entidades}
        titulo={modalGastos.titulo}
        entidadId={modalGastos.entidadId}
      />
    </div>
  );
}
