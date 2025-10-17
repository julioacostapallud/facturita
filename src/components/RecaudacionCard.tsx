// import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { DollarSign, Receipt, Clock } from 'lucide-react';
import { Recaudacion, RecaudacionFactura } from '../types';

interface RecaudacionCardProps {
  recaudaciones: Recaudacion[];
  recaudacionFacturas: RecaudacionFactura[];
  onClick?: () => void;
}

export function RecaudacionCard({ recaudaciones, recaudacionFacturas, onClick }: RecaudacionCardProps) {
  // Calcular totales
  const totalRecaudado = recaudaciones.reduce((sum, r) => sum + r.importe, 0);
  const totalFacturado = recaudacionFacturas.reduce((sum, rf) => {
    const recaudacion = recaudaciones.find(r => r.id === rf.recaudacionId);
    return sum + (recaudacion ? rf.monto : 0);
  }, 0);
  const totalPendiente = totalRecaudado - totalFacturado;

  return (
    <Card 
      className="bg-gradient-to-br from-success-50 to-success-100 border-success-200" 
      onClick={onClick}
      hover={!!onClick}
    >
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-success-600 rounded-lg">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg text-success-900">RECAUDACIÓN TOTAL</CardTitle>
            <p className="text-sm text-success-700">Período actual</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {/* Una sola línea con los 3 items */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-success-200">
              <div className="flex items-center space-x-2">
                <Receipt className="w-4 h-4 text-success-600" />
                <span className="text-sm font-semibold text-success-700">Total Recaudado</span>
              </div>
              <span className="text-lg font-bold text-success-900">
                ${totalRecaudado.toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-primary-200">
              <div className="flex items-center space-x-2">
                <Receipt className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-semibold text-primary-700">Ya Facturado</span>
              </div>
              <span className="text-lg font-bold text-primary-900">
                ${totalFacturado.toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-warning-200">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-warning-600" />
                <span className="text-sm font-semibold text-warning-700">Pendiente</span>
              </div>
              <span className="text-lg font-bold text-warning-900">
                ${totalPendiente.toLocaleString()}
              </span>
            </div>
          </div>
          
          {onClick && (
            <p className="text-xs text-success-600 mt-2 font-medium text-center">
              Click para ver detalles →
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
