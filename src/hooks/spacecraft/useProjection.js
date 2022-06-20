import * as THREE from 'three';
import {
  normalToRealCoordinates,
  realToNormalCoordinates,
  THREEToWGSCoordinates,
  WGSToTHREECoordinates
} from '../../help/coordinatesCalculate';
import * as satellite from 'satellite.js'
import {ecfToEci} from '../../help/spacecraft';
import {setDeviationScannerProjection, setScannerProjection} from '../../store/reducers/spacecraftStateReducer';
import {useDispatch} from 'react-redux';
import {useThree} from '@react-three/fiber';
import {useEffect, useRef} from 'react';

const useProjection = (spacecraft, orientationEdges) => {
  const deviationLineProjection = useRef(new THREE.Line(
    new THREE.BufferGeometry(),
    new THREE.LineBasicMaterial({
      color: 'orange',
      linewidth: 4
    })))

  const currentLineProjection = useRef(new THREE.Line(
    new THREE.BufferGeometry(),
    new THREE.LineBasicMaterial({
      color: 'red',
      linewidth: 5
    })))

  const {scene, invalidate} = useThree()
  const dispatch = useDispatch()

  useEffect(() => {
    updateProjection()
    invalidate()
    // eslint-disable-next-line
  }, [spacecraft, spacecraft?.tle, spacecraft?.date, orientationEdges])

  const updateProjection = () => {
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
            newArray = helpArrayGenerator(newArray, geo => deviationScannerGeoProjection.push(geo))
            deviationScannerGeoProjection.push(deviationScannerGeoProjection[1])
            dispatch(setDeviationScannerProjection(deviationScannerGeoProjection))

            const lineGeometry = new THREE.BufferGeometry().setFromPoints(newArray)
            deviationLineProjection.current.geometry.copy(lineGeometry)
          } else {
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([])
            deviationLineProjection.current.geometry.copy(lineGeometry)
            dispatch(setDeviationScannerProjection([]))
          }

          if (rayIntersects4[0]?.point && rayIntersects5[0]?.point) {
            let array = []
            array.push(rayIntersects4[0].point)
            array.push(rayIntersects5[0].point)

            const scannerGeoProjection = []
            array = helpArrayGenerator(array, (geo) => scannerGeoProjection.push(geo))

            dispatch(setScannerProjection(scannerGeoProjection))
            const lineGeometry = new THREE.BufferGeometry().setFromPoints(array)
            currentLineProjection.current.geometry.copy(lineGeometry)
          } else {
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([])
            currentLineProjection.current.geometry.copy(lineGeometry)
            dispatch(setScannerProjection([]))
          }

          invalidate()
        }
      })
    }
  }

  const helpArrayGenerator = (array, callback) => {
    return array.map(ecf => {
      const normalEcf = normalToRealCoordinates(ecf)
      const normalEcfWGS = THREEToWGSCoordinates(normalEcf)

      const gmst = satellite.gstime(spacecraft.date)
      const eci = ecfToEci(normalEcfWGS, gmst)
      const geo = satellite.eciToGeodetic(eci, gmst)

      geo.height = 40
      const newEcfWGS = satellite.geodeticToEcf(geo)
      const newEcf = WGSToTHREECoordinates(newEcfWGS)
      const newEcfNormal = realToNormalCoordinates(newEcf)

      geo.longitude = geo.longitude * 180 / Math.PI
      geo.latitude = geo.latitude * 180 / Math.PI

      callback(geo)

      return newEcfNormal
    })
  }

  return {currentLineProjection, deviationLineProjection, updateProjection}
}

export default useProjection