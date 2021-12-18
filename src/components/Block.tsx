import React, { useEffect, useState } from 'react'
import isMobile from 'ismobilejs'
import Styles from '../scss/components/Block.module.scss'

// Each block
type BlockProps = {
  id: string
  width: number
  height: number
  defaultX: number
  defaultY: number
  isDrag: boolean
  current: HTMLDivElement | null
  setCurrentElement: (arg0: boolean, arg1: HTMLDivElement | null) => void
}

const Block = (props: BlockProps) => {
  const { id, width, height, defaultX, defaultY, isDrag, current, setCurrentElement } = props
  const [, idNum] = id.split('_')
  const [zIndex, setZIndex] = useState(0)

  useEffect(() => {
    if (isDrag && current?.id === id) {
      setZIndex(200)
    } else {
      setZIndex(parseInt(idNum, 10))
    }
  }, [idNum, isDrag, current, id])

  const onMouseDownHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isMobile().any) {
      setCurrentElement(true, e.currentTarget)
    }
  }

  const onTouchStartHandler = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isMobile().any) {
      setCurrentElement(true, e.currentTarget)
    }
  }

  return (
    <div
      id={id}
      role="button"
      tabIndex={-1}
      onMouseDown={(e) => onMouseDownHandler(e)}
      onTouchStart={(e) => onTouchStartHandler(e)}
      onDragStart={(e) => e.preventDefault()}
      className={Styles.block}
      style={{ zIndex, width, height, left: defaultX, top: defaultY }}
    >
      {id}
    </div>
  )
}

export default Block
