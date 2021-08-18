import React, {useEffect, useRef, useState} from "react"
import {createSpacecraft} from "../../help/spacecraft";
import satelliteStl from '../../assets/models/smotr/smotr_1.stl'
import {useThree} from "@react-three/fiber";
import {useDispatch, useSelector} from "react-redux";
import {setTLE} from "../../store/reducers/spacecraftStateReducer";

function Spacecraft() {

  const {invalidate} = useThree()
  const date = new Date(useSelector(state => state.appState.currentDate))
  const tle = useSelector(state => state.spacecraft.tle)
  const dispatch = useDispatch()
  const spacecraftRef = useRef(null);

  const [spacecraft, setSpacecraft] = useState(null)

  function showOrbit() {
    spacecraft.isOrbitShow ? spacecraft.hideOrbit() : spacecraft.showOrbit()
    invalidate()
  }

  useEffect(() => {
    let myObjPromise = createSpacecraft(tle, satelliteStl, date)
    myObjPromise.then(myStl => {
      setSpacecraft(myStl)
      dispatch(setTLE(myStl.tleString))
    })
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (spacecraft) {
      spacecraft.move(date)
      invalidate()
    }
  // eslint-disable-next-line
  }, [date.toString()])

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