import React, {useEffect, useRef} from 'react'
import getEarth from "../../help/earth";
import useVectorCoutries from '../../hooks/useVectorCountries';

function Earth() {
  const countries = useVectorCoutries('map3D')
  const earth = useRef(null)

  useEffect(() => {
    earth.current = <primitive object={getEarth()} name={'Earth'}/>
    // eslint-disable-next-line
  }, [])

  return <>
    {countries.current}
    {earth.current}
  </>
}

export default Earth