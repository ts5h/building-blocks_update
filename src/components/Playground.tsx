import React, { useState } from 'react'
import useMousePosition from './UseMousePosition'
import Block from './Block'
import Styles from '../scss/components/Playground.module.scss'

// Playground
const Playground = () => {
  const position = useMousePosition()
  const [state, setState] = useState(false)

  // TODO: Show all blocks
  // TODO: Get coordination and write db

  return (
    <div className={Styles.playground}>
      <Block position={position} />
    </div>
  )
}

export default Playground
