import React, { useState } from 'react'
import Block from './Block'
import Styles from '../scss/components/Playground.module.scss'

// Playground
const Playground = () => {
  const [state, setState] = useState(false)

  // TODO: Show all blocks
  // TODO: Get coordination and write db

  return (
    <div className={Styles.playground}>
      <Block />
    </div>
  )
}

export default Playground
