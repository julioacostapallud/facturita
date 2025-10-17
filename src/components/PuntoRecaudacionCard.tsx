import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { MapPin, DollarSign, Receipt, Clock } from 'lucide-react';
import { PuntoRecaudacion, Recaudacion, RecaudacionFactura } from '../types';

interface PuntoRecaudacionCardProps {
  punto: PuntoRecaudacion;
  recaudaciones: Recaudacion[];
  recaudacionFacturas: RecaudacionFactura[];
  onClick?: () => void;
}

export function PuntoRecaudacionCard({ 
  punto, 
  recaudaciones, 
  recaudacionFacturas, 
  onClick 
}: PuntoRecaudacionCardProps) {
  // Filtrar recaudaciones por punto
  const recaudacionesPunto = recaudaciones.filter(r => r.punto === punto.id);
  
  // Calcular totales para este punto
  const totalRecaudado = recaudacionesPunto.reduce((sum, r) => sum + r.importe, 0);
  const totalFacturado = recaudacionFacturas.reduce((sum, rf) => {
    const recaudacion = recaudacionesPunto.find(r => r.id === rf.recaudacionId);
    return sum + (recaudacion ? rf.monto : 0);
  }, 0);
  const totalPendiente = totalRecaudado - totalFacturado;

  const porcentajeFacturado = totalRecaudado > 0 ? (totalFacturado / totalRecaudado) * 100 : 0;

  return (
    <Card 
      className="bg-gradient-to-br from-secondary-50 to-secondary-100 border-secondary-200 overflow-hidden" 
      onClick={onClick}
      hover={!!onClick}
    >
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-secondary-600 rounded-lg">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-sm text-secondary-900">{punto.nombre}</CardTitle>
            <p className="text-xs text-secondary-700">Punto de Recaudación</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-white rounded border border-secondary-200">
              <DollarSign className="w-4 h-4 text-secondary-600 mx-auto mb-1" />
              <p className="text-xs text-secondary-700 font-medium">Recaudado</p>
              <p className="text-sm font-bold text-secondary-900">
                ${totalRecaudado.toLocaleString()}
              </p>
            </div>
            
            <div className="p-2 bg-white rounded border border-primary-200">
              <Receipt className="w-4 h-4 text-primary-600 mx-auto mb-1" />
              <p className="text-xs text-primary-700 font-medium">Facturado</p>
              <p className="text-sm font-bold text-primary-900">
                ${totalFacturado.toLocaleString()}
              </p>
            </div>
            
            <div className="p-2 bg-white rounded border border-warning-200">
              <Clock className="w-4 h-4 text-warning-600 mx-auto mb-1" />
              <p className="text-xs text-warning-700 font-medium">Pendiente</p>
              <p className="text-sm font-bold text-warning-900">
                ${totalPendiente.toLocaleString()}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-secondary-700 font-medium">Progreso</span>
              <span className="text-secondary-700 font-semibold">{porcentajeFacturado.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-secondary-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-secondary-500 transition-all duration-300"
                style={{ width: `${Math.min(Math.max(porcentajeFacturado, 0), 100)}%` }}
              />
            </div>
          </div>
          
          {onClick && (
            <p className="text-xs text-secondary-600 mt-2 font-medium">
              Click para ver detalles →
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
