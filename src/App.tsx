// code edited from https://codesandbox.io/p/sandbox/2w0oy6qnvn

import { useState, useRef, MouseEvent } from 'react'

function Circle() {
  //set a default position
  const [position, setPosition] = useState({ x: 50, y: 50, coords: { x: 0, y: 0 } })

  function handleMouseMove(e: MouseEvent) {
    setPosition(position => {
      // from the MDN web docs, pageX and pageY are used to access the 
      // x and y coords of the mouse
      // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX
      // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY

      const mouseX = e.pageX;
      const mouseY = e.pageY;


      // by calculating the difference between the current position of the mouse,
      // we can move the circle by clicking anywhere on the circle.
      // without this code, clicking on the circle will make it "jump" to the position
      // of the mouse, which looks weird.
      const xDiff = position.coords.x - mouseX
      const yDiff = position.coords.y - mouseY

      // the coords field stores the current position of the mouse.  
      // without the coords field, the circle will also jump to the position 
      // of the mouse when the mouse is moved
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

  // we need a ref to the function so we can move the SVG without re-rendering
  // we have to write handleMouseMove as unknown as EventListener because typescript doesn't
  // treat Events and MouseEvents the same way.
  const handleMouseMoveRef = useRef<EventListener>(handleMouseMove as unknown as EventListener)


  // when the mouse is clicked, we change the coords field to the current mouse position,
  // so the circle moves accurately, but we don't move anything else.

  function handleMouseDown(e: MouseEvent<SVGElement>) {
    const mouseX = e.pageX
    const mouseY = e.pageY
    setPosition(position =>
      Object.assign({}, position, {
        coords: {
          x: mouseX,
          y: mouseY,
        },
      }),
    )
    document.addEventListener('mousemove', handleMouseMoveRef.current)
  }


  function handleMouseUp() {
    // stop dragging on mouse up
    document.removeEventListener('mousemove', handleMouseMoveRef.current)

    // removing this line doesn't actually change anything
    // I assume it's to cover some edge case, so I'll leave it be
    setPosition(position => Object.assign({}, position, { coords: {} }))
  }

  // here's some new code that makes the circle stop moving when your cursor leaves 
  // the canvas.  I also put in the set position code just in case.  

  function handleMouseLeave() {
    document.removeEventListener('mousemove', handleMouseMoveRef.current);
    setPosition(position => Object.assign({}, position, { coords: {} }))
  }
  return (

    <svg
      style={{
        border: '1px solid green',
        height: '200px',
        width: '100%',
      }}

      onMouseLeave={handleMouseLeave}
    >
      <circle
        cx={position.x}
        cy={position.y}
        r={25}
        fill="white"
        strokeWidth="1"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />

    </svg>
  )
}


export default function App() {
  return (
    <Circle />
  )
}
