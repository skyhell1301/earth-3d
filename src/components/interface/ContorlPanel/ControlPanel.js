import React from "react"
import './ControlPanel.css'
import ViewControl from "./ViewControl/ViewControl";
import SpacecraftControl from "./SpacecraftControl/SpacecraftControl";

function ControlPanel() {

  return(
    <div className='control-panel'>
      <div className="control-panel__title">Панель управления</div>
      <div className="control-panel__container">
        <ViewControl/>
        <SpacecraftControl/>
      </div>
    </div>
  )
}

export default ControlPanel