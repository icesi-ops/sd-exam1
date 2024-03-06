import React from 'react'
import { BrowserRouter,Routes, Route } from "react-router-dom";
import ReactDOM from 'react-dom/client'
import {NextUIProvider} from '@nextui-org/react'
import App from './pages/Main.jsx'
import GlobalLayout from './layout/index.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NextUIProvider>
      <GlobalLayout>
        <App />
      </GlobalLayout>
    </NextUIProvider>
  </React.StrictMode>,
)
