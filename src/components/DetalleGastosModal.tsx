import { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { Receipt, Calendar, DollarSign, Building2, FileText, Printer, ExternalLink } from 'lucide-react';
import { Gasto, Entidad } from '../types';

interface DetalleGastosModalProps {
  isOpen: boolean;
  onClose: () => void;
  gastos: Gasto[];
  entidades: Entidad[];
  titulo: string;
  entidadId?: string;
}

export function DetalleGastosModal({
  isOpen,
  onClose,
  gastos,
  entidades,
  titulo,
  entidadId
}: DetalleGastosModalProps) {
  const [gastosFiltrados, setGastosFiltrados] = useState<Gasto[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Filtrar gastos por entidad si se especifica
      const filtrados = entidadId 
        ? gastos.filter(g => g.entidadId === entidadId)
        : gastos;
      setGastosFiltrados(filtrados);
    }
  }, [isOpen, gastos, entidadId]);


  const totalGastos = gastosFiltrados.reduce((sum, gasto) => sum + (gasto.importe || gasto.monto || 0), 0);

  const handleImprimirGasto = (gasto: Gasto) => {
    // Simular impresión de factura
    const ventanaImpresion = window.open('', '_blank');
    if (ventanaImpresion) {
      ventanaImpresion.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Factura A - ${gasto.nroComprobante}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
            .info { margin: 10px 0; }
            .total { font-size: 18px; font-weight: bold; margin-top: 20px; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>FACTURA A</h1>
            <h2>${gasto.nombreEmisor}</h2>
            <p>CUIT: ${gasto.cuitEmisor}</p>
          </div>
          
          <div class="info">
            <p><strong>Número de Comprobante:</strong> ${gasto.nroComprobante}</p>
            <p><strong>Fecha:</strong> ${new Date(gasto.fecha).toLocaleDateString('es-AR')}</p>
            <p><strong>Concepto:</strong> ${gasto.concepto}</p>
            <p><strong>Importe:</strong> $${(gasto.importe || gasto.monto || 0).toLocaleString()}</p>
          </div>
          
          <div class="total">
            <p>TOTAL: $${(gasto.importe || gasto.monto || 0).toLocaleString()}</p>
          </div>
          
          <div class="footer">
            <p>Este es un comprobante de prueba - Demo Facturita</p>
          </div>
        </body>
        </html>
      `);
      ventanaImpresion.document.close();
      ventanaImpresion.print();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={titulo} size="xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-error-600 rounded-lg">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{titulo}</h2>
              <p className="text-gray-600">Facturas A ya emitidas - Solo lectura</p>
            </div>
          </div>
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>

        {/* Resumen */}
        <Card className="mb-6">
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">Total Facturado</p>
                <p className="text-2xl font-bold text-error-900">
                  ${totalGastos.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Facturas A</p>
                <p className="text-2xl font-bold text-error-900">
                  {gastosFiltrados.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Promedio por Factura</p>
                <p className="text-2xl font-bold text-error-900">
                  ${gastosFiltrados.length > 0 ? Math.round(totalGastos / gastosFiltrados.length).toLocaleString() : '0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de gastos */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>Comprobante</span>
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Fecha</span>
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4" />
                      <span>Proveedor</span>
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">
                    <div className="flex items-center space-x-2">
                      <Receipt className="w-4 h-4" />
                      <span>Concepto</span>
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right text-sm font-semibold text-gray-900">
                    <div className="flex items-center justify-end space-x-2">
                      <DollarSign className="w-4 h-4" />
                      <span>Monto Facturado</span>
                    </div>
                  </th>
                  <th className="py-3 px-4 text-center text-sm font-semibold text-gray-900">
                    <div className="flex items-center justify-center space-x-2">
                      <Printer className="w-4 h-4" />
                      <span>Acciones</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {gastosFiltrados.map((gasto) => (
                  <tr key={gasto.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-medium text-gray-900">
                          {gasto.nroComprobante}
                        </span>
                        <p className="text-xs text-gray-500">
                          {gasto.facturaA}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-700">
                        {new Date(gasto.fecha).toLocaleDateString('es-AR')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-medium text-gray-900">
                          {gasto.nombreEmisor}
                        </span>
                        <p className="text-xs text-gray-500">
                          CUIT: {gasto.cuitEmisor}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-700">
                        {gasto.concepto}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-semibold text-error-900">
                        ${(gasto.importe || gasto.monto || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleImprimirGasto(gasto)}
                          className="flex items-center space-x-1"
                        >
                          <Printer className="w-4 h-4" />
                          <span>Imprimir</span>
                        </Button>
                        {gasto.pdfUrl && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => window.open(gasto.pdfUrl, '_blank')}
                            className="flex items-center space-x-1"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>PDF</span>
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {gastosFiltrados.length === 0 && (
          <div className="text-center py-8">
            <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No hay facturas A para mostrar</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
