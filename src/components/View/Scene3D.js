import React, {Suspense} from 'react'
import {Canvas} from '@react-three/fiber';
import {Provider, useSelector} from 'react-redux';
import store from '../../store/store';

import EarthStation from '../Models/EarthStation';
import Atmosphere from '../Models/Atmosphere';
import LoadingView from './LoadingView';
import {Html} from '@react-three/drei';

//Lazy loading components
const Sun = React.lazy(() => import('../Models/Sun'))
const Earth = React.lazy(() => import('../Models/Earth'))
const CameraControl = React.lazy(() => import('../CameraControl'))
const Spacecraft = React.lazy(() => import('../Models/Spacecraft'))
const Galaxy = React.lazy(() => import('../Models/Galaxy'))


function Scene3D({className}) {

  const localDate = new Date(useSelector(state => state.appState.localDate))
  const {tle, orbitIsView, orientationEdges} = useSelector(state => state.spacecraft)
  const {isAxes, isGrid} = useSelector(state => state.interface)
  const isAtmosphere = useSelector(state => state.atmosphere.isShow)
  const isEarthStations = useSelector(state => state.earthStations.isShow)

  return (
    <Canvas
      className={className}
      frameloop='demand'
      shadows
    >
      <Suspense fallback={<Html fullscreen><LoadingView/></Html>}>
        <Provider store={store}>
          <Galaxy/>
          <Sun date={localDate}/>
          <Atmosphere isVisible={isAtmosphere}/>
          <Earth/>
          <CameraControl/>
          {isAxes ? <axesHelper args={[5]}/> : null}
          {isGrid ? <gridHelper/> : null}
          <Spacecraft date={localDate}
                      tle={tle}
                      isOrbit={orbitIsView}
                      orientationEdges={orientationEdges}
          />
          <EarthStation isVisible={isEarthStations}/>
        </Provider>
        <hemisphereLight args={[0xffffff, 0x444444, 0.2]} position={[0, 0, 0]}/>
      </Suspense>
    </Canvas>
  )
}

export default Scene3D