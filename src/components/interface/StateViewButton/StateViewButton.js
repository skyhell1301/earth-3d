import React from "react"
import './StateViewButton.css'
import {useDispatch, useSelector} from "react-redux";
import {setSceneState} from "../../../store/reducers/appSlices/appStateSlice";

function StateViewButton() {
  const is3D = useSelector(state => state.appState.is3D)
  const dispatch = useDispatch()

  const changeSceneState = () => {
    dispatch(setSceneState(!is3D))
  }

  return (
    <button className='view-button'
            onClick={changeSceneState}
    >
      {is3D ? '2D' : '3D'}
    </button>
  )
}

export default StateViewButton