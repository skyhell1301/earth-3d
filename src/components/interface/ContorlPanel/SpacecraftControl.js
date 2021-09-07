import React from "react"
import './SpacecraftControl.css'
import PanelItem from "./PanelItem";
import {useDispatch, useSelector} from "react-redux";
import {setOrbitIsView} from "../../../store/reducers/spacecraftStateReducer";

function SpacecraftControl() {
  const isOrbit = useSelector(state=> state.spacecraft.orbitIsView)
  const dispatch = useDispatch()
  return(
    <div>
      <PanelItem title='КА'>
        <label>
          Орбита:
          <input type="checkbox" value={isOrbit} onInput={()=>dispatch(setOrbitIsView(!isOrbit))}/>
        </label>
      </PanelItem>
    </div>
  )
}

export default SpacecraftControl