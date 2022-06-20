import React, {useEffect, useRef} from 'react'
import {createSun} from '../../help/sun';
import {useThree} from '@react-three/fiber';

function Sun({date}) {
  const {invalidate} = useThree()
  const sun = useRef(createSun(new Date()))

  useEffect(() => {
    if (sun.current) {
      sun.current.move(date)
      invalidate()
    }
    // eslint-disable-next-line 
  }, [date.toString()])

  return (
    <>
      <primitive object={sun.current}/>
      <primitive object={sun.current.point}/>
      <primitive object={sun.current.terminator}/>
    </>
  )
}

export default Sun