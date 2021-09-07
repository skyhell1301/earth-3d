import React, {useEffect, useRef, useState} from "react"
import {createSpacecraft, ecfToEci} from "../../help/spacecraft";
import satelliteStl from '../../assets/models/smotr/smotr_ver2.stl'
import {useThree} from "@react-three/fiber";
import {useDispatch} from "react-redux";
import {setOrbitPoint, setScannerProjection, setSubPoint, setTLE} from "../../store/reducers/spacecraftStateReducer";
import * as THREE from "three";
import * as satellite from "satellite.js";
import {getNormalHeight, normalToRealHeight} from "../../help/coordinatesCalculate";

function Spacecraft({date, tle, isOrbit}) {

  const {scene, invalidate} = useThree()
  const dispatch = useDispatch()
  const spacecraftRef = useRef(null);

  const [spacecraft, setSpacecraft] = useState(null)

  const [lineProjection] = useState(new THREE.Line(
    new THREE.BufferGeometry(),
    new THREE.LineBasicMaterial({
      color: 'red',
      linewidth: 5,
    })))

  const [projectionPoints, setProjectionPoints] = useState([])

  function updateProjection() {
    if (spacecraft) {
      let earth
      scene.children.forEach(val => {
        if (val.name === 'Earth') {
          earth = val


          let ray1 = new THREE.Raycaster(spacecraft.position, spacecraft.scannerProjection.topLeft);
          let ray2 = new THREE.Raycaster(spacecraft.position, spacecraft.scannerProjection.topMid);
          let ray3 = new THREE.Raycaster(spacecraft.position, spacecraft.scannerProjection.topRight);
          let ray4 = new THREE.Raycaster(spacecraft.position, spacecraft.scannerProjection.downRight);
          let ray5 = new THREE.Raycaster(spacecraft.position, spacecraft.scannerProjection.downMid);
          let ray6 = new THREE.Raycaster(spacecraft.position, spacecraft.scannerProjection.downLeft);

          let rayIntersects1 = ray1.intersectObject(earth, true);
          let rayIntersects2 = ray2.intersectObject(earth, true);
          let rayIntersects3 = ray3.intersectObject(earth, true);
          let rayIntersects4 = ray4.intersectObject(earth, true);
          let rayIntersects5 = ray5.intersectObject(earth, true);
          let rayIntersects6 = ray6.intersectObject(earth, true);


          if (rayIntersects1[0]?.point && rayIntersects2[0]?.point && rayIntersects3[0]?.point && rayIntersects4[0]?.point && rayIntersects5[0]?.point && rayIntersects6[0]?.point) {
            setProjectionPoints([])

            projectionPoints.push(rayIntersects1[0].point)
            projectionPoints.push(rayIntersects2[0].point)
            projectionPoints.push(rayIntersects3[0].point)
            projectionPoints.push(rayIntersects4[0].point)
            projectionPoints.push(rayIntersects5[0].point)
            projectionPoints.push(rayIntersects6[0].point)

            let scannerGeoProjection = []

            let newArray = projectionPoints.map(ecf => {
              ecf.x = normalToRealHeight(ecf.x)
              ecf.y = normalToRealHeight(ecf.y)
              ecf.z = normalToRealHeight(ecf.z)
              let gmst = satellite.gstime(spacecraft.date)
              let eci = ecfToEci(ecf, gmst)
              let geo = satellite.eciToGeodetic(eci, gmst)
              scannerGeoProjection.push(geo)
              geo.height = 30
              ecf = satellite.geodeticToEcf(geo)
              ecf.x = getNormalHeight(ecf.x)
              ecf.y = getNormalHeight(ecf.y)
              ecf.z = getNormalHeight(ecf.z)
              return ecf
            })

            dispatch(setScannerProjection(scannerGeoProjection))
            newArray.push(newArray[0])

            const lineGeometry = new THREE.BufferGeometry().setFromPoints(newArray)
            lineProjection.geometry.copy(lineGeometry)
          }
        }
      })
    }
  }

  useEffect(() => {
    if (spacecraft) {
      updateProjection()
      invalidate()
    }
    // eslint-disable-next-line
  }, [spacecraft])

  useEffect(() => {
    if (spacecraft) {
      isOrbit ? spacecraft.showOrbit() : spacecraft.hideOrbit()
      invalidate()
    }
    // eslint-disable-next-line
  }, [isOrbit])

  useEffect(() => {
    let myObjPromise = createSpacecraft(tle, satelliteStl, date)
    myObjPromise.then(myStl => {
      setSpacecraft(myStl)
      dispatch(setTLE(myStl.tleString))
      dispatch(setSubPoint(myStl.lonAndLat))
      dispatch(setOrbitPoint(myStl.orbitPointsArray))
    })
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (spacecraft) {
      spacecraft.move(date)
      updateProjection()
      invalidate()
      dispatch(setSubPoint(spacecraft.lonAndLat))
      dispatch(setOrbitPoint(spacecraft.orbitPointsArray))
    }
    // eslint-disable-next-line
  }, [date.toString()])

  useEffect(() => {
    if (spacecraft) {
      spacecraft.updateTLE(tle)
      invalidate()
      dispatch(setSubPoint(spacecraft.lonAndLat))
      dispatch(setOrbitPoint(spacecraft.orbitPointsArray))
    }
    // eslint-disable-next-line
  }, [tle])

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
    return (
      <>
        <primitive ref={spacecraftRef} object={spacecraft}
                   onPointerOver={hoveredHandler}
                   onPointerLeave={leaveHandler}
                   onContextMenu={() => console.log('kek')}
        />
        <primitive object={spacecraft.orbit}/>
        <primitive object={spacecraft.spacecraftPoint}/>
        <primitive object={lineProjection}></primitive>
      </>
    )
  } else {
    return null
  }
}

export default Spacecraft