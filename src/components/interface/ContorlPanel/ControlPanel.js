import React from "react"
import './ControlPanel.css'
import ViewControl from "./ViewControl/ViewControl";
import SpacecraftControl from "./SpacecraftControl/SpacecraftControl";
import EarthStationControl from "./EarthStationControl/EarthStationControl";

function ControlPanel() {

  return(
    <div className='control-panel'>
      <div className="control-panel__title">Панель управления</div>
      <div className="control-panel__container">
        <ViewControl/>
        <SpacecraftControl/>
        <EarthStationControl/>
      </div>
    </div>
  )
}

export default ControlPanel