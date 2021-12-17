import React, { useState } from 'react'
import Block from './Blocks'
import Styles from '../scss/components/Playground.module.scss'

// Playground
const Playground = () => {
  const [state, setState] = useState(false)

  return (
    <div className={Styles.playground}>
      <Block />
    </div>
  )
}

export default Playground
