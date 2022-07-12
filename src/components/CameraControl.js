import React, {useRef} from 'react'
import {OrbitControls, OrthographicCamera} from '@react-three/drei';

const cameraParams = {
  position: [20, 0, 0],
  zoom: 450
}

const CameraControl = () => {
  const camRef = useRef()

  return (
    <>
      <OrthographicCamera ref={camRef} makeDefault={true} {...cameraParams}/>
      <OrbitControls
        camera={camRef.current}
        minZoom={200}
        maxZoom={4000}
      />
    </>
  )
}

export default CameraControl