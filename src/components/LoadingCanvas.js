import React from "react"

function LoadingCanvas() {
  //
  // const textParams = {
  //   size: 80,
  //   height: 5,
  //   curveSegments: 12,
  //   bevelEnabled: true,
  //   bevelThickness: 10,
  //   bevelSize: 8,
  //   bevelOffset: 0,
  //   bevelSegments: 5
  // }
  return(
    <mesh>
      <boxGeometry args={[1,1,1]}/>
      <meshStandardMaterial/>
    </mesh>
  )
}

export default LoadingCanvas