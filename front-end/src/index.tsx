import React from 'react';
import ReactDOM from 'react-dom/client';
import Providers from './contexts/Providers';
import Signup from './pages/signup/Signup';
import { Toaster } from 'react-hot-toast';

import './css/tailwind-generated.css';
import './css/index.scss';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <Providers>
      <div className='container'>
        <Signup />
      </div>
    </Providers>
    <Toaster />
  </React.StrictMode>
);
