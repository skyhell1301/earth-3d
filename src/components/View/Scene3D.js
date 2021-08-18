import React, {Suspense} from "react"
import {Canvas} from "@react-three/fiber";
import {Provider} from "react-redux";
import store from "../../store/store";
import LoadingCanvas from "../LoadingCanvas";
import Stats from "../Stats";

//Lazy loading components
const Sun = React.lazy(() => import("../Models/Sun"))
const Earth = React.lazy(() => import("../Models/Earth"))
const CameraControl = React.lazy(() => import("../CameraControl"))
const Spacecraft = React.lazy(() => import("../Models/Spacecraft"))
const Galaxy = React.lazy(() => import("../Models/Galaxy"))


function Scene3D({className}) {
  return (
    <Canvas
      className={className}
      frameloop="demand"
      concurrent
      // orthographic
      // camera={{position:[2,0,0], left: -10000, right: 10000, top: 10000, bottom: -10000, near: 0.1, far:1000}}
    >
        <Suspense fallback={<LoadingCanvas/>}>
          <Provider store={store}>
            <Galaxy/>
            <Sun/>
            <Earth/>
            <CameraControl/>
            <Spacecraft/>
          </Provider>
        </Suspense>
        <hemisphereLight args={[0xffffff, 0x444444, 0.4]} position={[100, 0, 0]}/>
      <Stats/>
    </Canvas>

  )
}

export default Scene3D