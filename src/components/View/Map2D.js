import React, {useEffect, useState} from "react"
import View from "ol/View";
import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import {useDispatch, useSelector} from "react-redux";
import {setZoom} from "../../store/reducers/cameraPositionReducer";

function Map2D({className}) {
  const coefficient = 240
  const zoom = useSelector(state => state.camPosition.zoom)
  const center = useSelector(state => state.camPosition.center)
  const dispatch = useDispatch()
  const [view] = useState( new View({
    center: [0, 0],
  }))
  view.setZoom(zoom / coefficient)
  view.setCenter(center)

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
    })
  }, [])

  useEffect(()=>{
  }, [view])

  return (
    <div id='map2D' className={className}/>
  )
}

export default Map2D