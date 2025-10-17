import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Building2, DollarSign, FileText, TrendingDown } from 'lucide-react';
import { Entidad, GastosPorEntidad } from '../types';

interface GastoEntidadCardProps {
  entidad: Entidad;
  gastosEntidad: GastosPorEntidad | undefined;
  facturacionEntidad?: number;
  onClick?: () => void;
}

export function GastoEntidadCard({ entidad, gastosEntidad, facturacionEntidad = 0, onClick }: GastoEntidadCardProps) {
  const totalGastos = gastosEntidad?.totalGastos || 0;
  const cantidadFacturasA = gastosEntidad?.cantidadFacturasA || 0;
  
  // Calcular el porcentaje de gastos sobre facturación
  const porcentajeGastos = facturacionEntidad > 0 ? (totalGastos / facturacionEntidad) * 100 : 0;

  return (
    <Card 
      className="bg-gradient-to-br from-error-50 to-error-100 border-error-200 overflow-hidden" 
      onClick={onClick}
      hover={!!onClick}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-error-600 rounded-lg">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base text-error-900">{entidad.nombre}</CardTitle>
              <p className="text-xs text-error-700">{entidad.cuit}</p>
            </div>
          </div>
          {/* Porcentaje de gastos sobre facturación */}
          <div className="text-right">
            <div className="text-lg font-bold text-error-900">
              {porcentajeGastos.toFixed(1)}%
            </div>
            <div className="text-xs text-error-700">
              vs Facturación
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-1">
          {/* Información principal en una línea */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-error-700">Total Gastos</p>
              <p className="text-sm font-bold text-error-900">
                ${totalGastos.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-error-700">Facturas A</p>
              <p className="text-sm font-bold text-error-900">{cantidadFacturasA}</p>
            </div>
          </div>
          
          {/* Barra de progreso compacta */}
          <div className="w-full bg-error-200 rounded-full h-1">
            <div 
              className="h-1 rounded-full bg-error-500 transition-all duration-300"
              style={{ width: `${Math.min(Math.max((cantidadFacturasA / 5) * 100, 0), 100)}%` }}
            />
          </div>
          
          {onClick && (
            <p className="text-xs text-error-600 mt-1 font-medium text-center">
              Click para ver detalles →
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
