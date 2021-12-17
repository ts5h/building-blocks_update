import React, { useState } from 'react'
import useMousePosition from './UseMousePosition'
import Block from './Block'
import Styles from '../scss/components/Playground.module.scss'

// Playground
const Playground = () => {
  const position = useMousePosition()
  const [isDrag, setIsDrag] = useState(false)
  const [current, setCurrent] = useState<HTMLDivElement | null>(null)

  const onMoveHandler = () => {
    if (isDrag && current) {
      const blockPosition = current.getBoundingClientRect()
      let left = position.x - blockPosition.width / 2
      let top = position.y - blockPosition.height / 2

      if (left < 0) {
        left = 0
      }

      if (top < 0) {
        top = 0
      }

      current.style.left = `${left}px`
      current.style.top = `${top}px`
    }
  }

  const setCurrentElement = (div: HTMLDivElement) => {
    setIsDrag(true)
    setCurrent(div)
  }

  const onMouseUpHandler = () => {
    setIsDrag(false)
    setCurrent(null)
  }

  window.addEventListener('mousemove', onMoveHandler)
  window.addEventListener('mouseup', onMouseUpHandler)

  // TODO: Show all blocks
  // TODO: Get coordination and write db

  return (
    <div className={`playground ${Styles.playground}`}>
      <Block setCurrent={setCurrentElement} />
    </div>
  )
}

export default Playground
