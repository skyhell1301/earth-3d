import React, {useEffect, useRef} from "react"
import {OrbitControls, OrthographicCamera} from '@react-three/drei';
import {useDispatch, useSelector} from "react-redux"
import {useThree} from "@react-three/fiber";
import {setZoom} from "../store/reducers/cameraPositionReducer";
import {getXYZCoordinates} from "../help/coordinatesCalculate";

function CameraControl() {
  const {camera} = useThree()
  const controls = useRef()
  const camRef = useRef()
  const camZoom = useSelector(state => state.camPosition.zoom)
  const camCenter = useSelector(state => state.camPosition.center)
  const is3D = useSelector(state => state.appState.is3D)
  const dispatch = useDispatch()


  const cameraParams = {
    position: [20, 0, 0],
    zoom: 450
  }

  useEffect(() => {
    if (is3D && camera.zoom !== camZoom) {
      dispatch(setZoom(camera.zoom))
    }
    // eslint-disable-next-line
  }, [camera.zoom]);


  useEffect(() => {
    if (!is3D) {
      const xyz = getXYZCoordinates(camCenter)
      camera.position.set(xyz[0], xyz[1], xyz[2])
      camera.lookAt(0, 0, 0)
    }
    // eslint-disable-next-line
  }, [camCenter]);


  return (
    <>
      <OrthographicCamera ref={camRef} makeDefault={true} {...cameraParams}/>
      <OrbitControls
        ref={controls}
        camera={camRef.current}
        minZoom={250}
        maxZoom={4000}
      />
    </>
  )
}

export default CameraControl