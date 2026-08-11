import React from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/rubik'
import './global.css'
import { Providers } from '@/components/providers'
import { App } from '@/app'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>
)
