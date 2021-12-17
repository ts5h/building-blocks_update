import React, { useState } from 'react'
import isMobile from "ismobilejs";
import Styles from '../scss/components/Block.module.scss'

// Each block
const Block = () => {
  const [isDrag, setIsDrag] = useState(false)

  const onMoveHandler = () => {
    if (isDrag) {
      console.log('move')
    }
  }

  const onMouseHandler = (drag: boolean) => {
    if (isMobile().any) return
    setIsDrag(drag)
  }

  const onTouchHandler = (drag: boolean) => {
    if (!isMobile().any) return
    setIsDrag(drag)
  }

  return (
    <div
      role="button"
      tabIndex={-1}
      onMouseDown={() => onMouseHandler(true)}
      onMouseUp={() => onMouseHandler(false)}
      onMouseMove={() => onMoveHandler()}
      onTouchStart={() => onTouchHandler(true)}
      onTouchEnd={() => onTouchHandler(false)}
      onTouchMove={() => onMoveHandler()}
      className={Styles.block}
    >
      block_1
    </div>
  )
}

export default Block
