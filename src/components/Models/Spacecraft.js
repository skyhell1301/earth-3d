import React, {useEffect, useRef, useState} from 'react'
import {createSpacecraft, ecfToEci} from '../../help/spacecraft'
import satelliteStl from '../../assets/models/smotr/smotr_ver2.stl'
import {useThree} from '@react-three/fiber'
import {useDispatch, useSelector} from 'react-redux'
import {
  setDeviationScannerProjection,
  setOrbitPoint,
  setScannerProjection,
  setSubPoint,
  setTLE
} from '../../store/reducers/spacecraftStateReducer'
import * as THREE from 'three'
import * as satellite from 'satellite.js'
import {
  getNormalHeight,
  normalToRealHeight,
  THREEToWGSCoordinates,
  WGSToTHREECoordinates
} from '../../help/coordinatesCalculate'
import {setLoadStatus} from '../../store/reducers/appStateReducer'
import calculateZSRadius from '../../help/earthStation'

function Spacecraft({date, tle, isOrbit = true, orientationEdges}) {

  const {scene, invalidate} = useThree()
  const isPlayed = useSelector(state => state.appState.isPlayed)
  const dispatch = useDispatch()
  const spacecraftRef = useRef(null);

  const [spacecraft, setSpacecraft] = useState(null)

  const [deviationLineProjection] = useState(new THREE.Line(
    new THREE.BufferGeometry(),
    new THREE.LineBasicMaterial({
      color: 'orange',
      linewidth: 4
    })))

  const [currentLineProjection] = useState(new THREE.Line(
    new THREE.BufferGeometry(),
    new THREE.LineBasicMaterial({
      color: 'red',
      linewidth: 5
    })))

  // const [projectionPoints, setProjectionPoints] = useState([])

  function updateProjection() {
    if (spacecraft) {
      scene.children.forEach(earth => {
        if (earth.name === 'Earth') {

          let ray1 = new THREE.Raycaster(spacecraft.position, spacecraft.deviationBandProjection.left)
          let ray2 = new THREE.Raycaster(spacecraft.position, spacecraft.deviationBandProjection.center)
          let ray3 = new THREE.Raycaster(spacecraft.position, spacecraft.deviationBandProjection.right)

          let ray4 = new THREE.Raycaster(spacecraft.position, spacecraft.currentScannerProjection.left)
          let ray5 = new THREE.Raycaster(spacecraft.position, spacecraft.currentScannerProjection.right)


          let rayIntersects1 = ray1.intersectObject(earth, true)
          let rayIntersects2 = ray2.intersectObject(earth, true)
          let rayIntersects3 = ray3.intersectObject(earth, true)

          let rayIntersects4 = ray4.intersectObject(earth, true)
          let rayIntersects5 = ray5.intersectObject(earth, true)

          if (rayIntersects1[0]?.point && rayIntersects2[0]?.point && rayIntersects3[0]?.point) {
            let newArray = []
            newArray.push(rayIntersects1[0].point)
            newArray.push(rayIntersects2[0].point)
            newArray.push(rayIntersects3[0].point)

            let deviationScannerGeoProjection = []
            newArray = newArray.map((ecf) => {
              ecf.x = normalToRealHeight(ecf.x)
              ecf.y = normalToRealHeight(ecf.y)
              ecf.z = normalToRealHeight(ecf.z)
              ecf = THREEToWGSCoordinates(ecf)

              let gmst = satellite.gstime(spacecraft.date)
              let eci = ecfToEci(ecf, gmst)
              let geo = satellite.eciToGeodetic(eci, gmst)

              geo.height = 40
              ecf = satellite.geodeticToEcf(geo)
              ecf = WGSToTHREECoordinates(ecf)
              ecf.x = getNormalHeight(ecf.x)
              ecf.y = getNormalHeight(ecf.y)
              ecf.z = getNormalHeight(ecf.z)

              // if(index !== 1) {
              geo.longitude = geo.longitude * 180 / Math.PI
              geo.latitude = geo.latitude * 180 / Math.PI
              deviationScannerGeoProjection.push(geo)
              // }
              return ecf
            })
            deviationScannerGeoProjection.push(deviationScannerGeoProjection[1])
            dispatch(setDeviationScannerProjection(deviationScannerGeoProjection))

            const lineGeometry = new THREE.BufferGeometry().setFromPoints(newArray)
            deviationLineProjection.geometry.copy(lineGeometry)
          } else {
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([])
            deviationLineProjection.geometry.copy(lineGeometry)
            dispatch(setDeviationScannerProjection([]))
          }

          if (rayIntersects4[0]?.point && rayIntersects5[0]?.point) {
            let array = []
            array.push(rayIntersects4[0].point)
            array.push(rayIntersects5[0].point)

            let scannerGeoProjection = []
            array = array.map(ecf => {
              ecf.x = normalToRealHeight(ecf.x)
              ecf.y = normalToRealHeight(ecf.y)
              ecf.z = normalToRealHeight(ecf.z)
              ecf = THREEToWGSCoordinates(ecf)

              let gmst = satellite.gstime(spacecraft.date)
              let eci = ecfToEci(ecf, gmst)
              let geo = satellite.eciToGeodetic(eci, gmst)

              geo.height = 40
              ecf = satellite.geodeticToEcf(geo)
              ecf = WGSToTHREECoordinates(ecf)
              ecf.x = getNormalHeight(ecf.x)
              ecf.y = getNormalHeight(ecf.y)
              ecf.z = getNormalHeight(ecf.z)

              geo.longitude = geo.longitude * 180 / Math.PI
              geo.latitude = geo.latitude * 180 / Math.PI
              scannerGeoProjection.push(geo)

              return ecf
            })
            dispatch(setScannerProjection(scannerGeoProjection))

            const lineGeometry = new THREE.BufferGeometry().setFromPoints(array)
            currentLineProjection.geometry.copy(lineGeometry)
          } else {
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([])
            currentLineProjection.geometry.copy(lineGeometry)
            dispatch(setScannerProjection([]))
          }

          invalidate()
        }
      })
    }
  }

  useEffect(() => {
    if (spacecraft) {
      updateProjection()
      invalidate()
      dispatch(setLoadStatus(true))
    }
    // eslint-disable-next-line
  }, [spacecraft])
  useEffect(() => {
    if (spacecraft) {
      spacecraft.updateOrientationEdges(orientationEdges)
      updateProjection()
    }
    // eslint-disable-next-line
  }, [orientationEdges])


  useEffect(() => {
    if (spacecraft) {
      isOrbit ? spacecraft.showOrbit() : spacecraft.hideOrbit()
      invalidate()
    }
    // eslint-disable-next-line
  }, [isOrbit])

  useEffect(() => {
    const setSpacecraftModel = async () => {
      let myStl = await createSpacecraft(tle, satelliteStl, date)
      setSpacecraft(myStl)
      dispatch(setTLE(myStl.tleString))
      dispatch(setSubPoint(myStl.lonAndLat))
      dispatch(setOrbitPoint(myStl.orbitPointsArray))
    }
    setSpacecraftModel()
    calculateZSRadius()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (spacecraft) {
      spacecraft.move(date)
      updateProjection()
      if (!isPlayed) spacecraft.updateOrbit()
      invalidate()
      dispatch(setSubPoint(spacecraft.lonAndLat))
      dispatch(setOrbitPoint(spacecraft.orbitPointsArray))
    }
    // eslint-disable-next-line
  }, [date.toString()])

  useEffect(() => {
    if (spacecraft) {
      spacecraft.updateTLE(tle)
      updateProjection()
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
        {/*<primitive object={spacecraft.spacecraftPoint}/>*/}
        <primitive object={deviationLineProjection}/>
        <primitive object={currentLineProjection}/>
      </>
    )
  } else {
    return null
  }
}

export default Spacecraft