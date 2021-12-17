import React, { useState } from 'react'
import Styles from '../scss/components/Playground.module.scss'

// Playground
const Playground = () => {
  const [state, setState] = useState(false)

  return (
    <div
      className={Styles.playground}
    >
      Playground
    </div>
  )
}

export default Playground
