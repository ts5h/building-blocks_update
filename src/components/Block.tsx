import React, { useState } from 'react'
import isMobile from 'ismobilejs'
import Styles from '../scss/components/Block.module.scss'

// Each block
type BlockProps = {
  position: {
    x: number,
    y: number
  }
}

const Block = (props: BlockProps) => {
  const { position } = props
  const [isDrag, setIsDrag] = useState(false)

  const onMoveHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>) => {
    const block = e.currentTarget
    if (isDrag) {
      console.log(position)
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
      onMouseMove={(e) => onMoveHandler(e)}
      onTouchStart={() => onTouchHandler(true)}
      onTouchEnd={() => onTouchHandler(false)}
      onTouchMove={(e) => onMoveHandler(e)}
      className={Styles.block}
    >
      block_1
    </div>
  )
}

export default Block
