import React, { useCallback, useEffect, useMemo, useState } from 'react'
import useMousePosition from './UseMousePosition'
import Block from './Block'
import Styles from '../scss/components/Playground.module.scss'

// Playground
const Playground = () => {
  const position = useMousePosition()
  const [isDrag, setIsDrag] = useState(false)
  const [current, setCurrent] = useState<HTMLDivElement | null>(null)

  const setCurrentElement = (state: boolean, div: HTMLDivElement | null) => {
    setIsDrag(state)
    setCurrent(div)
  }

  const onMouseUpHandler = () => {
    setIsDrag(false)
    setCurrent(null)
  }

  useEffect(() => {
    if (isDrag && current) {
      const blockPosition = current.getBoundingClientRect()
      let left = position.x
      let top = position.y

      if (left < 0) {
        left = 0
      } else if (left > 2000 - blockPosition.width) {
        left = 2000 - blockPosition.width
      }

      if (top < 0) {
        top = 0
      } else if (top > 2000 - blockPosition.height) {
        top = 2000 - blockPosition.height
      }

      current.style.left = `${left}px`
      current.style.top = `${top}px`
    }

    window.addEventListener('mouseup', onMouseUpHandler)
  }, [isDrag, current, position])

  return (
    <div className={Styles.playground}>
      <Block id="block_1" isDrag={isDrag} setCurrentElement={setCurrentElement} />
    </div>
  )
}

export default Playground
