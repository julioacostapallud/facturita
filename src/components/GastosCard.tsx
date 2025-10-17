// import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Receipt, DollarSign, FileText, TrendingDown } from 'lucide-react';
import { Gasto, GastosPorEntidad } from '../types';
import { AnimatedValue } from './AnimatedValue';

interface GastosCardProps {
  gastos: Gasto[];
  gastosPorEntidad: GastosPorEntidad[];
  totalFacturado?: number;
  onClick?: () => void;
}

export function GastosCard({ gastos, gastosPorEntidad, totalFacturado = 0, onClick }: GastosCardProps) {
  // Calcular totales
  const totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0);
  const totalFacturasA = gastos.length;
  
  // Calcular porcentaje de gastos sobre facturación total
  const porcentajeGastos = totalFacturado > 0 ? (totalGastos / totalFacturado) * 100 : 0;
  
  // Función para obtener el color según el porcentaje
  const getPorcentajeColor = (porcentaje: number) => {
    if (porcentaje < 40) return 'text-success-600';
    if (porcentaje < 70) return 'text-warning-600';
    return 'text-error-600';
  };

  return (
    <Card 
      className="bg-gradient-to-br from-error-50 to-error-100 border-error-200" 
      onClick={onClick}
      hover={!!onClick}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-error-600 rounded-lg">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg text-error-900">GASTOS TOTALES</CardTitle>
              <p className="text-sm text-error-700">Facturas A desde ARCA</p>
            </div>
          </div>
          {/* Porcentaje de gastos sobre facturación total */}
          <div className="text-right">
            <AnimatedValue 
              value={porcentajeGastos} 
              className={`text-lg font-bold ${getPorcentajeColor(porcentajeGastos)}`}
              suffix="%"
              decimals={1}
            />
            <div className="text-xs text-error-700">
              vs Facturación
            </div>
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
            <AnimatedValue 
              value={totalGastos} 
              className="text-lg font-bold text-error-900"
              prefix="$"
            />
          </div>
          
          {/* Facturas A y Entidades en fila */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-error-200">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-error-600" />
                <span className="text-xs font-semibold text-error-700">Facturas A</span>
              </div>
              <AnimatedValue 
                value={totalFacturasA} 
                className="text-lg font-bold text-error-900"
              />
            </div>
            
            <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-error-200">
              <div className="flex items-center space-x-2">
                <Receipt className="w-4 h-4 text-error-600" />
                <span className="text-xs font-semibold text-error-700">CUITs</span>
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
