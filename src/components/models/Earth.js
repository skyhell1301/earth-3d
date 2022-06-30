import React, {useEffect, useRef} from 'react'
import getEarth from '../../models/earth';
import useVectorCountries from '../../hooks/earth/useVectorCountries';

function Earth() {
  const countries = useVectorCountries('map3D')
  const earth = useRef(null)

  useEffect(() => {
    earth.current = <primitive object={getEarth()} name={'Earth'}/>
  }, [])

  return (
    <>
      {earth.current}
      {countries.current}
    </>
  )
}

export default Earth