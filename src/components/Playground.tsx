import React, { useCallback, useEffect, useState } from 'react'
import firebase from 'firebase/compat/app'
import db from "../configs/FirebaseConfig";
import useMousePosition from './UseMousePosition'
import BlocksData from '../data/BlocksData'
import Block from './Block'
import Styles from '../scss/components/Playground.module.scss'

// Blocks data types in DB
type BlocksLog = {
  blocks: [
    {
      id: string
      x: number
      y: number
    }
  ]
  createdAt: firebase.firestore.Timestamp
  updatedAt: firebase.firestore.Timestamp
}

// Playground
const Playground = () => {
  const movement = useMousePosition()
  const [blocks, setBlocks] = useState(BlocksData)
  const [isDrag, setIsDrag] = useState(false)
  const [current, setCurrent] = useState<HTMLDivElement | null>(null)

  // Set current element via parent function
  const setCurrentElement = (state: boolean, div: HTMLDivElement | null) => {
    setIsDrag(state)
    setCurrent(div)
  }

  // Synchronous processing



  // Mouse up
  const updatePosition =  useCallback(async (e: MouseEvent | TouchEvent) => {
      if (e.target === current && current) {
        const updatedBlocks = blocks.map((block) => {
          const el = document.querySelector(`#${block.id}`)
          let x = 0
          let y = 0
          if (el) {
            const pos = el.getBoundingClientRect()
            x = pos.x
            y = pos.y
          } else {
            x = block.defaultX
            y = block.defaultY
          }

          return { id: block.id, x, y }
        })

        const useRef = db.collection('blocks').doc('position')
        await useRef.update({
          blocks: updatedBlocks,
          updatedAt: firebase.firestore.Timestamp.now()
        })
      }
    },
    [blocks, current]
  )

  useEffect(() => {
    const onMouseUpHandler = (e: MouseEvent | TouchEvent) => {
      // eslint-disable-next-line no-void
      void (async () => {
        try {
          await updatePosition(e)
        } catch (err) {
          console.error(err)
        } finally {
          setIsDrag(false)
          setCurrent(null)
        }
      })()
    }

    window.addEventListener('mouseup', onMouseUpHandler)

    return () => {
      window.removeEventListener('mouseup', onMouseUpHandler)
    }
  }, [updatePosition])

  // Mouse move
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
      {Object.entries(blocks).map(([key, value]) => (
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
