import React, {useRef} from "react"
import {OrbitControls, OrthographicCamera} from '@react-three/drei';
import {useDispatch, useSelector} from "react-redux"
import {useFrame, useThree} from "@react-three/fiber";
import {setZoom} from "../store/reducers/cameraPositionReducer";

function CameraControl() {
  const {camera} = useThree()
  const controls = useRef()
  const camRef = useRef()
  const camZoom = useSelector(state => state.camPosition.zoom)
  const dispatch = useDispatch()

  const cameraParams = {
    position: [3, 0, 0],
    zoom: camZoom
  }

  useFrame(()=>{
    if(camera.zoom !== camZoom) {
      dispatch(setZoom(camera.zoom))
    }
  })

  return (
    <>
      <OrthographicCamera ref={camRef} makeDefault={true} {...cameraParams}/>
      <OrbitControls
        ref={controls}
        camera={camRef.current}
        minZoom={250}

      />
    </>
  )
}

export default CameraControl