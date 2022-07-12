import React from "react"
import './SpacecraftControl.css'
import PanelItem from "../PanelItem";
import {useDispatch, useSelector} from "react-redux";
import {setOrbitIsView} from "../../../../store/reducers/spacecraftSlices/spacecraftSlice";
import OrientationControl from "./OrientationControl";

function SpacecraftControl() {
  const isOrbit = useSelector(state => state.spacecraft.orbitIsView)
  const dispatch = useDispatch()
  return (
    <PanelItem title='КА'>
      <div className='spacecraft-control'>
        <label className='spacecraft-control__orbit'>
          Орбита:
          <input type="checkbox" checked={isOrbit}
                 onChange={() => dispatch(setOrbitIsView(!isOrbit))}
          />
        </label>
        <OrientationControl/>
      </div>
    </PanelItem>
  )
}

export default SpacecraftControl