# Facturita Dashboard - Prototipo Interactivo

Un prototipo interactivo y visual para demostrar un tablero de control que permite ver la facturación real por entidad (simulada como si viniera de ARCA/AFIP) y la recaudación por puntos (simulada como si viniera del sistema de cobros).

## 🚀 Características

- **Dashboard Interactivo**: Visualización en tiempo real de facturación y recaudación
- **Facturación Simulada**: Emisión de facturas con CAE fake y comprobantes
- **Partir Recaudaciones**: Posibilidad de facturar parcialmente una recaudación
- **API Mock**: Simulación completa de endpoints ARCA/AFIP
- **Responsive Design**: Funciona en desktop y móvil
- **Persistencia Demo**: Los datos se mantienen en localStorage durante la sesión

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript + Vite
- **Estilos**: TailwindCSS con paleta pastel moderna
- **Estado**: React Context + useReducer
- **API Mock**: MSW (Mock Service Worker)
- **Iconos**: Lucide React
- **Persistencia**: localStorage

## 📦 Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone <repository-url>
   cd facturita
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**:
   ```bash
   npm run dev
   # o
   npm run start:develop
   ```

4. **Abrir en el navegador**:
   ```
   http://localhost:3000
   ```

## 🎯 Guión de Demo (3 pasos)

### Paso 1: Explorar el Dashboard
1. Abrir la aplicación en el navegador
2. Observar las tarjetas de entidades con montos facturados (500k, 300k, 250k)
3. Ver la tarjeta de recaudación total (450k pendiente)
4. Explorar los puntos de recaudación (P1, P2, P3, P4)

### Paso 2: Ver Detalles de Recaudación
1. Hacer click en "RECAUDACIÓN TOTAL" o en cualquier punto de recaudación
2. Se abre un modal con la tabla de recaudaciones
3. Observar las columnas: ID, Fecha, Punto, Medio, Importe, Facturado, Pendiente
4. Ver que algunas recaudaciones tienen saldo pendiente

### Paso 3: Facturar una Recaudación
1. Hacer click en "Facturar" en cualquier recaudación pendiente
2. Seleccionar una entidad (A, B o C) del dropdown
3. Ajustar el monto si se desea facturar parcialmente
4. Hacer click en "Emitir Factura (Simulada)"
5. **Observar los cambios en tiempo real**:
   - Toast de confirmación con CAE fake
   - Modal de PDF con el comprobante
   - Actualización de las tarjetas del dashboard
   - Cambio en los totales de ARCA

## 🎨 Funcionalidades Principales

### Dashboard Principal
- **Tarjetas de Entidades**: Muestran facturación por período y progreso hacia objetivo
- **Tarjeta de Recaudación**: Total recaudado, facturado y pendiente
- **Puntos de Recaudación**: 4 puntos con sus respectivos totales
- **Botón Refrescar ARCA**: Simula actualización de datos desde ARCA

### Modales Interactivos
- **Detalle de Recaudación**: Tabla completa con filtros y exportación CSV
- **Facturación**: Formulario para emitir facturas con validaciones
- **Visor de PDF**: Comprobante simulado con CAE fake

### Funcionalidades Avanzadas
- **Partir Recaudaciones**: Facturar múltiples veces la misma recaudación
- **Exportación**: CSV de recaudaciones y JSON del dashboard
- **Logs de API**: En modo desarrollo, muestra todas las llamadas mock
- **Reset Demo**: Regenerar datos de prueba

## 📊 Datos Simulados

### Entidades (3)
- **Entidad A**: CUIT 30-11111111-1 - Facturado: $500,000
- **Entidad B**: CUIT 30-22222222-2 - Facturado: $300,000  
- **Entidad C**: CUIT 30-33333333-3 - Facturado: $250,000

### Puntos de Recaudación (4)
- **P1**: Sucursal Resistencia
- **P2**: Sucursal Corrientes
- **P3**: Kiosco Centro
- **P4**: Ventanilla Online

### Recaudaciones (10)
Total de $450,000 distribuido entre los 4 puntos con diferentes medios de pago:
- Tarjeta, Efectivo, MercadoPago, Transferencia

## 🔧 Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes base (Modal, Button, Card, Toast)
│   ├── Dashboard.tsx   # Componente principal
│   ├── EntidadCard.tsx # Tarjeta de entidad
│   ├── RecaudacionCard.tsx # Tarjeta de recaudación
│   ├── PuntoRecaudacionCard.tsx # Tarjeta de punto
│   ├── DetalleRecaudacionModal.tsx # Modal de detalles
│   ├── FacturarModal.tsx # Modal de facturación
│   └── PDFViewerModal.tsx # Visor de comprobantes
├── context/            # Context de React para estado global
├── data/              # Datos mock y utilidades
├── mocks/             # Configuración de MSW
├── types/             # Tipos TypeScript
└── App.tsx            # Componente raíz
```

## 🌐 Endpoints Mock

- `GET /api/arca/facturacion?periodo=YYYY-MM` - Obtener facturación ARCA
- `GET /api/arca/ultimoNumero?cuit=...&pv=...` - Último número autorizado
- `POST /api/facturar` - Emitir factura
- `GET /api/recaudaciones?punto=...` - Obtener recaudaciones
- `POST /api/demo/reset` - Resetear datos demo
- `POST /api/demo/generate` - Generar nueva data demo

## 🎭 Simulaciones

### CAE Fake
- Formato: 12 dígitos aleatorios
- Vencimiento: 30 días desde emisión
- Ejemplo: `123456789234`

### Comprobantes
- Formato: `0001-XXXXXXXX`
- Número secuencial automático
- PDF simulado en HTML

### Persistencia
- Los datos se guardan en `localStorage`
- Clave: `facturita-dashboard-data`
- Se mantiene entre sesiones del navegador

## 🚀 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linter
npm run start:develop # Alias para dev (preferido por el usuario)
```

## 🎯 Criterios de Aceptación Cumplidos

✅ **Mostrar montos iniciales**: 500k, 300k, 250k por entidad y 450k recaudación pendiente  
✅ **Actualización en tiempo real**: Al facturar se actualizan todas las tarjetas  
✅ **Partir recaudaciones**: Múltiples facturas por recaudación  
✅ **CAE fake y PDF**: Confirmación con CAE y visor de comprobante  
✅ **Diseño presentable**: Paleta pastel, responsive, accesible  

## 🔍 Notas Técnicas

- **MSW**: Se activa automáticamente en desarrollo
- **Responsive**: Breakpoints de Tailwind (sm, md, lg, xl)
- **Accesibilidad**: ARIA labels, navegación por teclado, foco visible
- **Performance**: Lazy loading de modales, optimización de re-renders
- **Error Handling**: Manejo de errores con toasts y estados de carga

## 📝 Notas para la Demo

- Este es un **prototipo de demostración**
- **NO** integra con sistemas reales de AFIP/ARCA
- Todos los datos son **simulados** y **fake**
- Prioriza la **experiencia de usuario** y **fluidez visual**
- Ideal para presentaciones y validación de conceptos

---

**Desarrollado con ❤️ para demostrar capacidades de integración y UX en sistemas de facturación**
