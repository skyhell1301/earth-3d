import React from "react"
import './SpacecraftControl.css'
import PanelItem from "../PanelItem";
import {useDispatch, useSelector} from "react-redux";
import {setOrbitIsView} from "../../../../store/reducers/spacecraftStateReducer";
import OrientationControl from "./OrientationControl";

function SpacecraftControl() {
  const isOrbit = useSelector(state=> state.spacecraft.orbitIsView)
  const dispatch = useDispatch()
  return(
    <div>
      <PanelItem title='КА'>
        <label>
          Орбита:
          <input type="checkbox" checked={isOrbit}
                 onChange={()=>dispatch(setOrbitIsView(!isOrbit))}
          />
        </label>
        <OrientationControl/>
      </PanelItem>

    </div>
  )
}

export default SpacecraftControl