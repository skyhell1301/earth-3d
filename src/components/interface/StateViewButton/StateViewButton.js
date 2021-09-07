import React from "react"
import './StateViewButton.css'
import {useDispatch, useSelector} from "react-redux";
import {setSceneState} from "../../../store/reducers/appStateReducer";

function StateViewButton() {
  const is3D = useSelector(state => state.appState.is3D)
  const dispatch = useDispatch()
  return (
    <button className='view-button'
            onClick={() => dispatch(setSceneState(!is3D))}
    >
      {is3D ? '2D' : '3D'}
    </button>
  )
}

export default StateViewButton