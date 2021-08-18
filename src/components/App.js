import React, {useEffect} from "react";
import './App.css';
import Scene3D from "./View/Scene3D";
import {useDispatch, useSelector} from "react-redux";
import Map2D from "./View/Map2D";
import {setSceneState} from "../store/reducers/appStateReducer";
import DateInformation from "./interface/DateInformation/DateInformation";
import TLEParams from "./interface/TLEParams";


const App = () => {
  const zoom = useSelector(state => state.camPosition.zoom)
  // const currentDate = useSelector(state => state.appState.currentDate)
  const is3D = useSelector(state => state.appState.is3D)
  const dispatch = useDispatch()

  // console.log(currentDate)

  useEffect(() => {
    if(zoom > 1200) {
      dispatch(setSceneState(false))
    } else {
      dispatch(setSceneState(true))
    }
  })

  function isHide3D() {
    return !is3D ? ' hide-layer' : ''
  }

  function isHide2D() {
    return is3D ? ' hide-layer' : ''
  }

  return (
    <div className='app'>
      <DateInformation/>
      <TLEParams/>
      <Scene3D className={'scene' + isHide3D()}/>
      <Map2D className={'map2d' + isHide2D()}/>
      <div id='map3D' className='map3d'/>
    </div>
  )
}

export default App;
