import React, { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { ToggleLeft, ToggleRight, Receipt, Calendar, MapPin, CreditCard, Hash } from 'lucide-react';
import { Recaudacion, Entidad, Factura, RecaudacionFactura } from '../types';
import { useDashboard } from '../context/DashboardContext';
import { FacturarModal } from './FacturarModal';

interface DetalleRecaudacionModalProps {
  isOpen: boolean;
  onClose: () => void;
  recaudaciones: Recaudacion[];
  entidades: Entidad[];
  facturas: Factura[];
  recaudacionFacturas: RecaudacionFactura[];
  titulo: string;
  puntoId?: string;
}

export function DetalleRecaudacionModal({
  isOpen,
  onClose,
  recaudaciones,
  entidades,
  facturas,
  recaudacionFacturas,
  titulo,
  puntoId
}: DetalleRecaudacionModalProps) {
  const [vistaAgrupada, setVistaAgrupada] = useState(false);
  const [recaudacionesConCalculos, setRecaudacionesConCalculos] = useState<Recaudacion[]>([]);
  const [facturarModal, setFacturarModal] = useState<{
    isOpen: boolean;
    recaudacion: Recaudacion | null;
  }>({ isOpen: false, recaudacion: null });

  const { fetchRecaudaciones } = useDashboard();

  useEffect(() => {
    if (isOpen) {
      loadRecaudaciones();
    }
  }, [isOpen, puntoId]);

  const loadRecaudaciones = async () => {
    try {
      const data = await fetchRecaudaciones(puntoId);
      setRecaudacionesConCalculos(data);
    } catch (error) {
      console.error('Error loading recaudaciones:', error);
    }
  };

  const handleFacturar = (recaudacion: Recaudacion) => {
    setFacturarModal({ isOpen: true, recaudacion });
  };

  const handleFacturarSuccess = () => {
    setFacturarModal({ isOpen: false, recaudacion: null });
    loadRecaudaciones(); // Recargar datos
  };

  const getFacturasRecaudacion = (recaudacionId: string) => {
    return recaudacionFacturas
      .filter(rf => rf.recaudacionId === recaudacionId)
      .map(rf => {
        const factura = facturas.find(f => f.id === rf.facturaId);
        return { ...rf, factura };
      })
      .filter(rf => rf.factura);
  };

  const getMedioIcon = (medio: string) => {
    switch (medio.toLowerCase()) {
      case 'tarjeta':
        return <CreditCard className="w-4 h-4" />;
      case 'efectivo':
        return <Receipt className="w-4 h-4" />;
      case 'mercadopago':
        return <CreditCard className="w-4 h-4" />;
      case 'transferencia':
        return <CreditCard className="w-4 h-4" />;
      default:
        return <Receipt className="w-4 h-4" />;
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Fecha', 'Punto', 'Medio', 'Importe', 'Facturado', 'Pendiente', 'Estado'];
    const rows = recaudacionesConCalculos.map(r => [
      r.id,
      r.fecha,
      r.punto,
      r.medio,
      r.importe,
      r.facturado || 0,
      r.pendiente || 0,
      (r.pendiente || 0) > 0 ? 'Pendiente' : 'Completo'
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recaudaciones-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={titulo} size="xl">
        <div className="space-y-6">
          {/* Controles */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Vista:</span>
                <button
                  onClick={() => setVistaAgrupada(!vistaAgrupada)}
                  className="flex items-center space-x-2 text-sm"
                >
                  {vistaAgrupada ? (
                    <>
                      <ToggleRight className="w-5 h-5 text-primary-600" />
                      <span className="text-primary-600">Por Entidad</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">General</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <Button variant="secondary" onClick={exportToCSV}>
              Exportar CSV
            </Button>
          </div>

          {/* Tabla de recaudaciones */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Fecha</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Punto</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Medio</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Importe</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Facturado</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Pendiente</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {recaudacionesConCalculos.map((recaudacion) => {
                  const facturasRecaudacion = getFacturasRecaudacion(recaudacion.id);
                  const pendiente = recaudacion.pendiente || 0;
                  
                  return (
                    <tr key={recaudacion.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Hash className="w-4 h-4 text-gray-400" />
                          <span className="font-mono text-sm">{recaudacion.id}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{recaudacion.fecha}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{recaudacion.punto}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {getMedioIcon(recaudacion.medio)}
                          <span className="text-sm">{recaudacion.medio}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-medium">${recaudacion.importe.toLocaleString()}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-primary-600 font-medium">
                          ${(recaudacion.facturado || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`font-medium ${pendiente > 0 ? 'text-warning-600' : 'text-success-600'}`}>
                          ${pendiente.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          {pendiente > 0 && (
                            <Button
                              size="sm"
                              onClick={() => handleFacturar(recaudacion)}
                            >
                              Facturar
                            </Button>
                          )}
                          {facturasRecaudacion.length > 0 && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                // TODO: Mostrar modal con facturas de esta recaudación
                                console.log('Ver facturas:', facturasRecaudacion);
                              }}
                            >
                              Ver Facturas ({facturasRecaudacion.length})
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Resumen */}
          <Card>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">Total Recaudado</p>
                  <p className="text-xl font-bold text-gray-900">
                    ${recaudacionesConCalculos.reduce((sum, r) => sum + r.importe, 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-primary-600">Total Facturado</p>
                  <p className="text-xl font-bold text-primary-900">
                    ${recaudacionesConCalculos.reduce((sum, r) => sum + (r.facturado || 0), 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-warning-600">Total Pendiente</p>
                  <p className="text-xl font-bold text-warning-900">
                    ${recaudacionesConCalculos.reduce((sum, r) => sum + (r.pendiente || 0), 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Modal>

      <FacturarModal
        isOpen={facturarModal.isOpen}
        onClose={() => setFacturarModal({ isOpen: false, recaudacion: null })}
        recaudacion={facturarModal.recaudacion}
        entidades={entidades}
        onSuccess={handleFacturarSuccess}
      />
    </>
  );
}
