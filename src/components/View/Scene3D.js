import React, {Suspense} from "react"
import {Canvas} from "@react-three/fiber";
import Galaxy from "../Models/Galaxy";
import CameraControl from "../CameraControl";
import Earth from "../Models/Earth";
import Sun from "../Models/Sun";
import Spacecraft from "../Models/Spacecraft";
import {Provider} from "react-redux";
import store from "../../store/store";

function Scene3D({className}) {
  return (
    <Canvas
      className={className}
      frameloop="demand"
      // orthographic
      // camera={{position:[2,0,0], left: -10000, right: 10000, top: 10000, bottom: -10000, near: 0.1, far:1000}}
    >
      <Suspense fallback={null}>
        <Provider store={store}>
          <Galaxy/>
          <Sun/>
          <Earth/>
          <CameraControl/>
          <Spacecraft/>
        </Provider>
      </Suspense>
      <hemisphereLight args={[0xffffff, 0x444444, 0.4]} position={[100, 0, 0]}/>
    </Canvas>

  )
}

export default Scene3D