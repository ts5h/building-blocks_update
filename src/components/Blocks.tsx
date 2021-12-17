import React, { useState } from 'react'
import Styles from '../scss/components/Block.module.scss'

// Blocks
const Block = () => {
  const [state, setState] = useState(false)

  return <div className={Styles.block} />
}

export default Block
