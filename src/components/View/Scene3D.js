import React, {Suspense} from "react"
import {Canvas} from "@react-three/fiber";
import {Provider, useSelector} from "react-redux";
import store from "../../store/store";
import Stats from "../Stats";
import LoadingView from "./LoadingView";

//Lazy loading components
const Sun = React.lazy(() => import("../Models/Sun"))
const Earth = React.lazy(() => import("../Models/Earth"))
const CameraControl = React.lazy(() => import("../CameraControl"))
const Spacecraft = React.lazy(() => import("../Models/Spacecraft"))
const Galaxy = React.lazy(() => import("../Models/Galaxy"))


function Scene3D({className}) {
  const date = new Date(useSelector(state => state.appState.localDate))
  const tle = useSelector(state => state.spacecraft.tle)
  const orbitIsView = useSelector(state => state.spacecraft.orbitIsView)
  const orientationEdges = useSelector(state => state.spacecraft.orientationEdges)

  return (
    <Canvas
      className={className}
      frameloop="demand"
      concurrent
      shadows
      // orthographic
      // camera={{position:[2,0,0], left: -10000, right: 10000, top: 10000, bottom: -10000, near: 0.1, far:1000}}
    >
      <Suspense fallback={<LoadingView/>}>
        <Provider store={store}>
          <Galaxy/>
          <Sun date={date}/>
          <Earth/>
          <CameraControl/>
          <axesHelper args={[5]}/>
          <Spacecraft date={date} tle={tle} isOrbit={orbitIsView} orientationEdges={orientationEdges}/>
        </Provider>
        <hemisphereLight args={[0xffffff, 0x444444, 0.4]} position={[100, 0, 0]}/>
        <Stats/>
      </Suspense>
    </Canvas>

  )
}

export default Scene3D