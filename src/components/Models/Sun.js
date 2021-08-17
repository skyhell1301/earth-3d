import React, {useState} from "react"
import {createSun} from "../../help/sun";

function Sun() {
  const [sun] = useState(createSun(new Date()))

  return (
    <>
      <primitive object={sun}/>
      <primitive object={sun.point}/>
      <primitive object={sun.terminator}/>
    </>
  )
}

export default Sun