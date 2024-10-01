import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

// Certifique-se de que o elemento raiz existe no seu index.html
const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(<App />);