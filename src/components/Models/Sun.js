import React, {useEffect, useState} from "react"
import {createSun} from "../../help/sun";
import {useThree} from "@react-three/fiber";

function Sun({date}) {
  const {invalidate} = useThree()
  const [sun] = useState(createSun(new Date()))

  useEffect(() => {
    if (sun) {
      sun.move(date)
      invalidate()
    }
    // eslint-disable-next-line 
  }, [date.toString()])

  return (
    <>
      <primitive object={sun}/>
      <primitive object={sun.point}/>
      <primitive object={sun.terminator}/>
    </>
  )
}

export default Sun