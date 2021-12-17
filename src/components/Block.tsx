import React from 'react'
import isMobile from 'ismobilejs'
import Styles from '../scss/components/Block.module.scss'

// Each block
type BlockProps = {
  setCurrent: (arg0: HTMLDivElement) => void
}

const Block = (props: BlockProps) => {
  const { setCurrent } = props

  const onMouseDownHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isMobile().any) {
      setCurrent(e.currentTarget)
    }
  }

  const onTouchStartHandler = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isMobile().any) {
      setCurrent(e.currentTarget)
    }
  }

  return (
    <div
      role="button"
      tabIndex={-1}
      onMouseDown={(e) => onMouseDownHandler(e)}
      onTouchStart={(e) => onTouchStartHandler(e)}
      onDragStart={(e) => e.preventDefault()}
      className={Styles.block}
    >
      block_1
    </div>
  )
}

export default Block
