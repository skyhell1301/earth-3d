import React, {useEffect, useState} from "react"
import {createSun} from "../../help/sun";
import {useSelector} from "react-redux";
import {useThree} from "@react-three/fiber";

function Sun() {
  const {invalidate} = useThree()
  const [sun] = useState(createSun(new Date()))
  const date = new Date(useSelector(state => state.appState.currentDate))

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