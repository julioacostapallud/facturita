import React from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Download, FileText, Calendar, Hash, Building2 } from 'lucide-react';
import { Factura } from '../types';

interface PDFViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  factura: Factura | null;
}

export function PDFViewerModal({ isOpen, onClose, factura }: PDFViewerModalProps) {
  if (!factura) return null;

  const handleDownload = () => {
    // Simular descarga de PDF
    const content = generatePDFContent(factura);
    const blob = new Blob([content], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `factura-${factura.nroComprobante}.html`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const generatePDFContent = (factura: Factura) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Factura ${factura.nroComprobante}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
        .info { display: flex; justify-content: space-between; margin-bottom: 20px; }
        .section { margin-bottom: 20px; }
        .table { width: 100%; border-collapse: collapse; }
        .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .table th { background-color: #f2f2f2; }
        .total { font-weight: bold; font-size: 1.2em; }
        .footer { margin-top: 40px; text-align: center; font-size: 0.9em; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>FACTURA</h1>
        <h2>Nº ${factura.nroComprobante}</h2>
    </div>
    
    <div class="info">
        <div>
            <p><strong>Fecha de Emisión:</strong> ${factura.fechaEmision}</p>
            <p><strong>CAE:</strong> ${factura.caeFake}</p>
            <p><strong>Vencimiento CAE:</strong> ${factura.vtoCaeFake}</p>
        </div>
    </div>
    
    <div class="section">
        <h3>Datos del Comprobante</h3>
        <table class="table">
            <tr>
                <th>Concepto</th>
                <th>Importe</th>
            </tr>
            <tr>
                <td>Servicios de Recaudación</td>
                <td>$${factura.monto.toLocaleString()}</td>
            </tr>
        </table>
    </div>
    
    <div class="section">
        <p class="total">TOTAL: $${factura.monto.toLocaleString()}</p>
    </div>
    
    <div class="footer">
        <p>Este es un comprobante simulado para fines de demostración.</p>
        <p>No tiene validez fiscal real.</p>
    </div>
</body>
</html>`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Comprobante de Factura" size="lg">
      <div className="space-y-6">
        {/* Información de la factura */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Hash className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Número de Comprobante</p>
                <p className="font-mono font-semibold">{factura.nroComprobante}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Fecha de Emisión</p>
                <p className="font-semibold">{factura.fechaEmision}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">CAE</p>
                <p className="font-mono font-semibold">{factura.caeFake}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Vencimiento CAE</p>
                <p className="font-semibold">{factura.vtoCaeFake}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vista previa del PDF */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Vista Previa del Comprobante</span>
            </div>
          </div>
          
          <div className="p-6 bg-white">
            <div className="text-center border-b-2 border-gray-300 pb-4 mb-6">
              <h1 className="text-2xl font-bold text-gray-900">FACTURA</h1>
              <h2 className="text-xl text-gray-700">Nº {factura.nroComprobante}</h2>
            </div>
            
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600"><strong>Fecha de Emisión:</strong> {factura.fechaEmision}</p>
                  <p className="text-gray-600"><strong>CAE:</strong> {factura.caeFake}</p>
                </div>
                <div>
                  <p className="text-gray-600"><strong>Vencimiento CAE:</strong> {factura.vtoCaeFake}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Datos del Comprobante</h3>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Concepto</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Importe</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Servicios de Recaudación</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">${factura.monto.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="text-right">
              <p className="text-xl font-bold text-gray-900">TOTAL: ${factura.monto.toLocaleString()}</p>
            </div>
            
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>Este es un comprobante simulado para fines de demostración.</p>
              <p>No tiene validez fiscal real.</p>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex items-center justify-end space-x-3">
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
          <Button onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Descargar PDF (Simulado)
          </Button>
        </div>
      </div>
    </Modal>
  );
}
