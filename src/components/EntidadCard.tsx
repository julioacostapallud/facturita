// import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Building2, TrendingUp, TrendingDown } from 'lucide-react';
import { Entidad, FacturacionARCA } from '../types';

interface EntidadCardProps {
  entidad: Entidad;
  facturacion: FacturacionARCA | undefined;
  onClick?: () => void;
}

export function EntidadCard({ entidad, facturacion, onClick }: EntidadCardProps) {
  const total = facturacion?.total || 0;
  const objetivo = 400000; // Objetivo simulado
  const delta = total - objetivo;
  const porcentajeObjetivo = objetivo > 0 ? (total / objetivo) * 100 : 0;

  return (
    <Card 
      className="bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200 overflow-hidden" 
      onClick={onClick}
      hover={!!onClick}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-600 rounded-lg">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base text-primary-900">{entidad.nombre}</CardTitle>
              <p className="text-xs text-primary-700">{entidad.cuit}</p>
            </div>
          </div>
          {delta !== 0 && (
            <div className={`flex items-center space-x-1 ${
              delta > 0 ? 'text-success-600' : 'text-warning-600'
            }`}>
              {delta > 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-semibold">
                {delta > 0 ? '+' : ''}${Math.abs(delta).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-primary-700 mb-1">Facturado este período</p>
            <p className="text-xl font-bold text-primary-900">
              ${total.toLocaleString()}
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-primary-700 font-medium">Progreso objetivo</span>
              <span className="text-primary-700 font-semibold">{porcentajeObjetivo.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-primary-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  porcentajeObjetivo >= 100 ? 'bg-success-500' : 'bg-primary-500'
                }`}
                style={{ width: `${Math.min(Math.max(porcentajeObjetivo, 0), 100)}%` }}
              />
            </div>
          </div>
          
          {onClick && (
            <p className="text-xs text-primary-600 mt-2 font-medium">
              Click para ver detalles →
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
