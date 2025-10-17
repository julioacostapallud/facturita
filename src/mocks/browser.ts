import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Configurar MSW para el navegador
export const worker = setupWorker(...handlers);
