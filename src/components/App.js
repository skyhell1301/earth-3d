import React, {lazy} from 'react';
import './App.css';
import {useSelector} from 'react-redux';
import Interface from './interface/Interface';

const Scene3D = lazy(() => import('./views/Scene3D'))
const Map2D = lazy(() => import('./views/Map2D'))


const App = () => {
  const is3D = useSelector(state => state.appState.is3D)
  const isLoaded = useSelector(state => state.appState.isLoaded)

  function isHide3D() {
    return !is3D ? ' hide-layer' : ''
  }

  function isHide2D() {
    return is3D ? ' hide-layer' : ''
  }

  return (
    <div className='app'>
      {isLoaded && <Interface/>}
      <Scene3D className={'scene' + isHide3D()}/>
      <Map2D className={'map2d' + isHide2D()}/>
    </div>
  )
}

export default App
