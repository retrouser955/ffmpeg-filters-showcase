import React from 'react'
import "./loading.css"

export default function Loading() {
  return (
    <div className="h-screen w-screen bg-gray-900 flex justify-center items-center">
      <div className="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
  )
}