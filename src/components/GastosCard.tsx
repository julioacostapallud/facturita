import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Receipt, DollarSign, FileText, TrendingDown } from 'lucide-react';
import { Gasto, GastosPorEntidad } from '../types';

interface GastosCardProps {
  gastos: Gasto[];
  gastosPorEntidad: GastosPorEntidad[];
  onClick?: () => void;
}

export function GastosCard({ gastos, gastosPorEntidad, onClick }: GastosCardProps) {
  // Calcular totales
  const totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0);
  const totalFacturasA = gastos.length;

  return (
    <Card 
      className="bg-gradient-to-br from-error-50 to-error-100 border-error-200" 
      onClick={onClick}
      hover={!!onClick}
    >
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-error-600 rounded-lg">
            <TrendingDown className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg text-error-900">GASTOS TOTALES</CardTitle>
            <p className="text-sm text-error-700">Facturas A desde ARCA</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          {/* Total Gastos - Item principal */}
          <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-error-200">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-error-600" />
              <span className="text-xs font-semibold text-error-700">Total Gastos</span>
            </div>
            <span className="text-lg font-bold text-error-900">
              ${totalGastos.toLocaleString()}
            </span>
          </div>
          
          {/* Facturas A y Entidades en fila */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-error-200">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-error-600" />
                <span className="text-xs font-semibold text-error-700">Facturas A</span>
              </div>
              <span className="text-lg font-bold text-error-900">
                {totalFacturasA}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-error-200">
              <div className="flex items-center space-x-2">
                <Receipt className="w-4 h-4 text-error-600" />
                <span className="text-xs font-semibold text-error-700">Entidades</span>
              </div>
              <span className="text-lg font-bold text-error-900">
                {gastosPorEntidad.length}
              </span>
            </div>
          </div>
          
          {onClick && (
            <p className="text-xs text-error-600 mt-2 font-medium text-center">
              Click para ver detalles →
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
