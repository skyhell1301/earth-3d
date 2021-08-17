import React from "react";
import './App.css';
import Scene3D from "./View/Scene3D";
import {useSelector} from "react-redux";
import Map2D from "./View/Map2D";


const App = () => {
  const zoom = useSelector(state => state.camPosition.zoom)
  const center = useSelector(state => state.camPosition.center)
  console.log(zoom, center)

  function isHide3D() {
    if(zoom > 1200) return ' hide-layer'
    else return ''
  }

  function isHide2D() {
     if(zoom < 1200) return ' hide-layer'
     else return ''
  }

  return (
    <div className='app'>
      <Scene3D className={'scene' + isHide3D()}/>
      <Map2D className={'map2d' + isHide2D()}/>
      <div id='map3D' className='map3d'/>
    </div>
  )
}

export default App;
