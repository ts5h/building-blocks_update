import { useEffect, useState } from 'react'

const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const setFromEvent = (e: { movementX: number; movementY: number }) =>
      setPosition({
        x: e.movementX,
        y: e.movementY,
      })

    window.addEventListener('mousemove', setFromEvent)
    return () => {
      window.removeEventListener('mousemove', setFromEvent)
    }
  }, [])

  return position
}

export default useMousePosition
