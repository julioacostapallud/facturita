import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Receipt, Building2, DollarSign, AlertCircle } from 'lucide-react';
import { Recaudacion, Entidad } from '../types';
import { useDashboard } from '../context/DashboardContext';

interface FacturarModalProps {
  isOpen: boolean;
  onClose: () => void;
  recaudacion: Recaudacion | null;
  entidades: Entidad[];
  onSuccess: () => void;
}

export function FacturarModal({ isOpen, onClose, recaudacion, entidades, onSuccess }: FacturarModalProps) {
  const [entidadSeleccionada, setEntidadSeleccionada] = useState<string>('');
  const [monto, setMonto] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const { facturar } = useDashboard();

  React.useEffect(() => {
    if (recaudacion && isOpen) {
      setMonto(recaudacion.importe.toString());
      setEntidadSeleccionada('');
      setError('');
    }
  }, [recaudacion, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recaudacion || !entidadSeleccionada || !monto) {
      setError('Por favor complete todos los campos');
      return;
    }

    const montoNum = parseFloat(monto);
    if (isNaN(montoNum) || montoNum <= 0) {
      setError('El monto debe ser un número válido mayor a 0');
      return;
    }

    if (montoNum > recaudacion.importe) {
      setError('El monto no puede ser mayor al importe de la recaudación');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const success = await facturar({
        recaudacionId: recaudacion.id,
        entidadId: entidadSeleccionada,
        monto: montoNum
      });

      if (success) {
        onSuccess();
        onClose();
      } else {
        setError('Error al procesar la facturación');
      }
    } catch (err) {
      setError('Error inesperado al facturar');
    } finally {
      setLoading(false);
    }
  };

  if (!recaudacion) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Emitir Factura" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información de la recaudación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Receipt className="w-5 h-5 text-primary-600" />
              <span>Recaudación a Facturar</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">ID</p>
                  <p className="font-mono text-sm">{recaudacion.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha</p>
                  <p className="text-sm">{recaudacion.fecha}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Punto</p>
                  <p className="text-sm">{recaudacion.punto}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Medio de Pago</p>
                  <p className="text-sm">{recaudacion.medio}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Importe Total</span>
                  <span className="text-lg font-bold text-gray-900">
                    ${recaudacion.importe.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulario de facturación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-primary-600" />
              <span>Datos de la Factura</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Selección de entidad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entidad Emisora
                </label>
                <select
                  value={entidadSeleccionada}
                  onChange={(e) => setEntidadSeleccionada(e.target.value)}
                  className="input"
                  required
                >
                  <option value="">Seleccione una entidad</option>
                  {entidades.map((entidad) => (
                    <option key={entidad.id} value={entidad.id}>
                      {entidad.nombre} - {entidad.cuit}
                    </option>
                  ))}
                </select>
              </div>

              {/* Monto a facturar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto a Facturar
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    className="input pl-10"
                    placeholder="0.00"
                    min="0.01"
                    max={recaudacion.importe}
                    step="0.01"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Máximo: ${recaudacion.importe.toLocaleString()}
                </p>
              </div>

              {/* Información adicional */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Información importante:</p>
                    <ul className="mt-1 space-y-1 text-xs">
                      <li>• Se generará un CAE automáticamente</li>
                      <li>• El comprobante estará disponible para descarga</li>
                      <li>• Los datos se actualizarán en tiempo real</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Botones */}
        <div className="flex items-center justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={loading}
            disabled={!entidadSeleccionada || !monto}
          >
            Emitir Factura (Simulada)
          </Button>
        </div>
      </form>
    </Modal>
  );
}
