import React, { useEffect, useState } from 'react'
import useMousePosition from './UseMousePosition'
import BlocksData from '../data/BlocksData'
import Block from './Block'
import Styles from '../scss/components/Playground.module.scss'

// Playground
const Playground = () => {
  const movement = useMousePosition()
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

  window.addEventListener('mouseup', onMouseUpHandler)

  useEffect(() => {
    const onMoveHandler = () => {
      if (isDrag && current) {
        const blockPosition = current.getBoundingClientRect()
        let left = movement.x + blockPosition.x + window.scrollX
        let top = movement.y + blockPosition.y + window.scrollY

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
    }
    window.addEventListener('mousemove', onMoveHandler)

    return () => {
      window.removeEventListener('mousemove', onMoveHandler)
    }
  }, [current, isDrag, movement, movement.x, movement.y])

  return (
    <div className={Styles.playground}>
      {Object.entries(BlocksData).map(([key, value]) => (
        <Block
          key={key}
          id={value.id}
          width={value.width}
          height={value.height}
          defaultX={value.defaultX}
          defaultY={value.defaultY}
          isDrag={isDrag}
          current={current}
          setCurrentElement={setCurrentElement}
        />
      ))}
    </div>
  )
}

export default Playground
