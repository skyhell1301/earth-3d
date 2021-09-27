import React from "react"
import './EarthStationControl.css'
import PanelItem from "../PanelItem";
import AddEarthStation from "./AddEarthStation";
import ShowZSControl from "./ShowZSControl";

function EarthStationControl() {

  return (
    <PanelItem title='Земная станция'>
      <div className='earth-station__container'>
        <ShowZSControl/>
        <AddEarthStation/>
      </div>

    </PanelItem>

  )
}

export default EarthStationControl