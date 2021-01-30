import { useEffect, useState } from 'react'
import { ResizableBox, ResizableBoxProps } from 'react-resizable'
import './Resizable.css'

interface ResizableProps {
  direction: 'horizontal' | 'vertical'
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {

  let resizableProps: ResizableBoxProps
  const [height, setHeight] = useState(window.innerHeight)
  const [width, setWidth] = useState(window.innerWidth)
  const [resizeWidth, setResizeWidth] = useState(window.innerWidth * 0.75)

  useEffect(() => {
    let timer: any
    const listener = () => {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        setHeight(window.innerHeight)
        setWidth(window.innerWidth)
        if (window.innerWidth * 0.75 < resizeWidth) {
          setResizeWidth(window.innerWidth * 0.75)
        }
      }, 90)

    }
    window.addEventListener('resize', listener)

    return () => {
      window.removeEventListener('resize', listener)
    }
  }, [resizeWidth])

  if (direction === 'horizontal') {
    resizableProps = {
      className: 'resize-horizontal',
      minConstraints: [width * 0.2, Infinity],
      maxConstraints: [width * 0.75, Infinity],
      height: Infinity,
      width: resizeWidth,
      resizeHandles: ['e'],
      onResizeStop: (event, data) => {
        setResizeWidth(data.size.width)
      }

    }
  } else {
    resizableProps = {
      minConstraints: [Infinity, 24],
      maxConstraints: [Infinity, height * 0.9],
      height: 300,
      width: Infinity,
      resizeHandles: ['s']
    }
  }

  return (
    <ResizableBox {...resizableProps}  >
      {children}
    </ResizableBox>);
}

export default Resizable