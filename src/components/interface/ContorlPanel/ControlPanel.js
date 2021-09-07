import React from "react"
import './ControlPanel.css'
import ViewControl from "./ViewControl";
import SpacecraftControl from "./SpacecraftControl";

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