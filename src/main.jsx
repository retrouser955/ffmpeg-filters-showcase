import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserView, MobileView} from 'react-device-detect'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserView>
      <App />
    </BrowserView>
    <MobileView>
      <div className="w-screen h-screen bg-black justify-center items-center flex">
        <div className="w-screen text-center text-white font-extrabold text-4xl">Sorry But this app does not work on mobile</div>
      </div>
    </MobileView>
  </React.StrictMode>,
)
