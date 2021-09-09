import React from "react";
import './App.css';
import Scene3D from "./View/Scene3D";
import {useSelector} from "react-redux";
import Map2D from "./View/Map2D";
import DateInformation from "./interface/DateInformation/DateInformation";
import TLEParams from "./interface/TLEInformation/TLEParams";
import ControlPanel from "./interface/ContorlPanel/ControlPanel";
import StateViewButton from "./interface/StateViewButton/StateViewButton";
import Logo from "./interface/Logo/Logo";

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
      {isLoaded ?
        <div>
          <StateViewButton/>
          <DateInformation/>
          <TLEParams/>
          <ControlPanel/>
          <Logo/>
        </div> : null
      }
      <Scene3D className={'scene' + isHide3D()}/>
      <Map2D className={'map2d' + isHide2D()}/>
      <div id='map3D' className='map3d'/>
    </div>
  )
}

export default App;
