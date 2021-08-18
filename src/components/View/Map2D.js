import React, {useEffect, useState} from "react"
import View from "ol/View";
import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import {useDispatch, useSelector} from "react-redux";
import {setCenter, setZoom} from "../../store/reducers/cameraPositionReducer";
import * as olProj from "ol/proj";

function Map2D({className}) {
  const coefficient = 240
  const zoom = useSelector(state => state.camPosition.zoom)
  const center = useSelector(state => state.camPosition.center)
  const is3D = useSelector(state=> state.appState.is3D)
  const dispatch = useDispatch()
  const [view] = useState(new View())

  if(is3D) {
    view.setZoom(zoom / coefficient)
    view.setCenter(olProj.transform([center[0], center[1]], 'EPSG:4326', 'EPSG:3857'))
  }

  useEffect(()=>{
    new Map({
      layers: [
        new TileLayer({
          // minZoom: 5.3,
          source: new XYZ({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          })
        })
      ],
      view: view,
      target: 'map2D'
    })
    view.on('change', ()=>{
      dispatch(setZoom(view.getZoom() * coefficient))
      dispatch(setCenter(olProj.transform(view.getCenter(), 'EPSG:3857', 'EPSG:4326')))
      // setView(view)
      // console.log(view.getCenter())
      // updateCenter()
    })
    // eslint-disable-next-line
  }, [])

  return (
    <div id='map2D' className={className}/>
  )
}

export default Map2D