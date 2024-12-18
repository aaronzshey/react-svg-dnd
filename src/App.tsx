// code edited from https://codesandbox.io/p/sandbox/2w0oy6qnvn

import { useState, useRef, MouseEvent } from 'react'

function Circle() {
  //set a default position
  const [position, setPosition] = useState({ x: 50, y: 50, coords: { x: 0, y: 0 } })

  function handleMouseMove(e: MouseEvent) {
    setPosition(position => {
      const xDiff = position.coords.x - e.pageX
      const yDiff = position.coords.y - e.pageY
      return {
        x: position.x - xDiff,
        y: position.y - yDiff,
        coords: {
          x: e.pageX,
          y: e.pageY,
        },
      }
    })
  }

  const handleMouseMoveRef = useRef<EventListener>(handleMouseMove as unknown as EventListener)

  function handleMouseDown(e: MouseEvent<SVGElement>) {
    const pageX = e.pageX
    const pageY = e.pageY
    setPosition(position =>
      Object.assign({}, position, {
        coords: {
          x: pageX,
          y: pageY,
        },
      }),
    )
    document.addEventListener('mousemove', handleMouseMoveRef.current)
  }

  function handleMouseUp() {
    document.removeEventListener('mousemove', handleMouseMoveRef.current)
    setPosition(position => Object.assign({}, position, { coords: {} }))
  }

  return (
    <circle
      cx={position.x}
      cy={position.y}
      r={25}
      fill="black"
      stroke="black"
      strokeWidth="1"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    />
  )
}

export default function App() {
  return (
    <svg
      style={{
        border: '1px solid green',
        height: '200px',
        width: '100%',
      }}
    >
      <Circle />
    </svg>
  )
}
