import * as React from 'react'
import './app.css'

const App: React.FC = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col">
        <div className="">toolbar</div>
        <div className="h-full w-full flex flex-row justify-stretch">
          <div>groups</div>
          <div>editor</div>
          <div>preview</div>
        </div>
      </div>
    </div>
  )

}

export default App
