import React from 'react'
import {useThree} from '@react-three/fiber'
import useProjection from '../../hooks/spacecraft/useProjection';
import useSpacecraft from '../../hooks/spacecraft/useSpacecraft';

function Spacecraft({date, tle, isOrbit = true, orientationEdges}) {

  const {invalidate} = useThree()

  const spacecraft = useSpacecraft(tle, date, orientationEdges, isOrbit)

  const {deviationLineProjection, currentLineProjection} = useProjection(spacecraft, orientationEdges)

  function hoveredHandler() {
    if (spacecraft) {
      spacecraft.material.color?.set('red')
      document.body.style.cursor = 'pointer'
      invalidate()
    }
  }

  function leaveHandler() {
    if (spacecraft) {
      spacecraft.material.color?.set('white')
      document.body.style.cursor = 'default'
      invalidate()
    }
  }

  if (!spacecraft) {
    return null
  }

  return (
    <>
      <primitive object={spacecraft}
                 onPointerOver={hoveredHandler}
                 onPointerLeave={leaveHandler}
      />
      <primitive object={spacecraft.orbit}/>
      {/*<primitive object={spacecraft.spacecraftPoint}/>*/}
      <primitive object={deviationLineProjection.current}/>
      <primitive object={currentLineProjection.current}/>
    </>
  )
}

export default Spacecraft