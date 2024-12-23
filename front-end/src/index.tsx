import React from 'react';
import ReactDOM from 'react-dom/client';
import Providers from './contexts/Providers';
import { Toaster } from 'react-hot-toast';
import Router from './Router';

import './css/tailwind-generated.css';
import './css/index.scss';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <>
    <Providers>
      <Router />
    </Providers>
    <Toaster />
  </>
);
