import React, {useEffect, useRef} from 'react'
import './LoadingView.css'


function LoadingView() {
  const circle = useRef()

  useEffect(() => {
    for (let i = 0; i < circle.current?.children.length; i++) {
      circle.current?.children[i].style.setProperty('--i', i + 1)
    }
  }, [circle])

  return (
    <div className='container'>
      <div className='circle' ref={circle}>
        {Array(20).fill(0).map((_, index) => <span key={index}/>)}
      </div>
      <div className='loading__text'>Загрузка</div>
    </div>
  )
}

export default LoadingView