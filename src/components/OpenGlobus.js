import React, {useEffect} from "react";
import './OpenGlobus.css'
import '@openglobus/og/css/og.css'
import {Globe, layer} from '@openglobus/og'
// import map from '../assets/img/earth/8081_earthmap4k.jpg'

function OpenGlobus() {
  useEffect(() => {

    const osm = new layer.XYZ("OpenStreetMap", {
      IsbaseLayer: true,
      url: "//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", // url
      // url: map, // url
      Visibility: true, // visibility
      Attribution: 'Data @ OpenStreetMap Contributors, ODBL' // Strings
    })

    const globe = new Globe({
      target: 'viewport',
      layers: [osm],
      autoActivated: false,
    })
  }, [])


  return <div id='viewport'></div>
}

export default OpenGlobus