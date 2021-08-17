import React, {useEffect, useRef, useState} from "react"
import {createSpacecraft} from "../../help/spacecraft";
import satelliteStl from '../../assets/models/smotr/smotr_1.stl'
import {useThree} from "@react-three/fiber";

function Spacecraft({date = new Date()}) {

  const {invalidate} = useThree()
  const spacecraftRef = useRef(null);
  let tle = 'TRITON-1\n' +
    '1 39427U 13066M   21203.82189194  .00000294  00000-0  54799-4 0  9994\n' +
    '2 39427  97.7764 149.8720 0111916 237.6857 121.3472 14.68267694410407'
  const [spacecraft, setSpacecraft] = useState(null)

  function showOrbit() {
    spacecraft.isOrbitShow ? spacecraft.hideOrbit() : spacecraft.showOrbit()
    invalidate()
  }

  useEffect(() => {
    let myObjPromise = createSpacecraft(tle, satelliteStl, date)
    myObjPromise.then(myStl => {
      setSpacecraft(myStl)
    })
  }, []);

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

  // useEffect(() => {
  //   if (spacecraft) spacecraft.move(date)
  // }, [date])

  if (spacecraft) {
    return <>
      <primitive ref={spacecraftRef} object={spacecraft}
                 onClick={showOrbit}
                 onPointerOver={hoveredHandler}
                 onPointerLeave={leaveHandler}
                 onContextMenu={() => console.log('kek')}
      />
      <primitive object={spacecraft.orbit}/>
      <primitive object={spacecraft.spacecraftPoint}/>
    </>
  } else {
    return null
  }
}

export default Spacecraft