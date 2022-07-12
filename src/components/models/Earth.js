import React, {useMemo} from 'react'
import getEarth from '../../models/earth';
import useVectorCountries from '../../hooks/earth/useVectorCountries';

function Earth() {
  const vectorMesh = useVectorCountries('map3D')
  const earth = useMemo(getEarth, [])

  return (
    <>
      <primitive object={earth} name={'Earth'}/>
      <primitive object={vectorMesh}/>
    </>
  )
}

export default Earth