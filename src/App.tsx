import React, { useRef } from 'react'
import Playground from './components/Playground'
import './scss/App.scss'

const App = () => {
  const AppRef = useRef(null)

  return (
    <div ref={AppRef} className="App">
      <Playground AppRef={AppRef} />
    </div>
  )
}

export default App
