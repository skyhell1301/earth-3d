import React, {useEffect, useState} from "react"
import View from "ol/View";
import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import {useDispatch, useSelector} from "react-redux";
import {setCenter, setZoom} from "../../store/reducers/cameraPositionReducer";
import {fromLonLat} from 'ol/proj';
import Feature from 'ol/Feature'
import * as olProj from "ol/proj";
import * as geom from "ol/geom";
import * as source from "ol/source";
import * as layer from "ol/layer";
import {Circle, Fill, Stroke, Style} from "ol/style";


function Map2D({className}) {
  const coefficient = 240
  const zoom = useSelector(state => state.camPosition.zoom)
  const center = useSelector(state => state.camPosition.center)
  const is3D = useSelector(state => state.appState.is3D)
  const spacecraftSubPoint = useSelector(state => state.spacecraft.lonAndLat)
  const orbitPointsArray = useSelector(state => state.spacecraft.orbitPoints)
  const dispatch = useDispatch()
  const [view] = useState(new View())
  const [map] = useState(new Map({}))


  const [spacecraftPoint] = useState(new Feature({
    geometry: new geom.Point(fromLonLat([spacecraftSubPoint.x, spacecraftSubPoint.y])),
    name: 'A point',
  }))
  const [orbitLine, setOrbitLine] = useState(null)


  useEffect(() => {
    if (!is3D) {
      view.setZoom(zoom / coefficient)
      view.setCenter(olProj.transform([center[0], center[1]], 'EPSG:4326', 'EPSG:3857'))
    }
    // eslint-disable-next-line
  }, [is3D])

  useEffect(() => {
    if (orbitPointsArray.length > 0) {
      setOrbitLine(getOrbitFeaturesArray())
    }
    // eslint-disable-next-line
  }, [orbitPointsArray])

  useEffect(() => {
    if (orbitLine) {
      map.addLayer(new layer.Vector({
        source: new source.Vector({
          features: orbitLine,
        }),
        style: new Style({
          stroke: new Stroke({
            color: '#666666',
            width: 5,
          }),
        }),
      }))
      map.render()
    }
    // eslint-disable-next-line
  }, [orbitLine])

  useEffect(() => {
    spacecraftPoint.getGeometry().setCoordinates(fromLonLat([spacecraftSubPoint.x, spacecraftSubPoint.y]))
    map.render()
    // eslint-disable-next-line
  }, [spacecraftSubPoint])

  useEffect(() => {
    let spacecraftPointLayer = new layer.Vector({
      source: new source.Vector({
        features: [spacecraftPoint]
      }),
      style: new Style({
        image: new Circle({
          radius: 40,
          fill: new Fill({color: '#666666'}),
          stroke: new Stroke({color: '#bada55', width: 1})
        }),
      })
    });

    let mapLayer = new TileLayer({
      source: new XYZ({
        url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      })
    })
    map.setView(view)
    map.addLayer(mapLayer)
    map.addLayer(spacecraftPointLayer)
    map.setTarget('map2D')
    map.render()

    view.on('change', () => {
      dispatch(setZoom(view.getZoom() * coefficient))
      dispatch(setCenter(olProj.transform(view.getCenter(), 'EPSG:3857', 'EPSG:4326')))
    })
    // eslint-disable-next-line
  }, [])

  function getOrbitFeaturesArray() {
    if (orbitPointsArray.length > 3) {
      let featArray = []
      let startPoint = orbitPointsArray[0]
      let endPoint = orbitPointsArray[1]
      // console.log(Math.sign(startPoint[0]), Math.sign(endPoint[0]) )
      // console.log(Math.sign(orbitPointsArray[1][0]), Math.sign(orbitPointsArray[2][0]) )
      // console.log(Math.sign(orbitPointsArray[2][0]), Math.sign(orbitPointsArray[3][0]) )
      for (let i = 2; i < orbitPointsArray.length; i++) {
        // console.log(startPoint[0],endPoint[0], Math.sign(startPoint[0]), Math.sign(endPoint[0]) )
        if (Math.sign(startPoint[0]) === Math.sign(endPoint[0])) {
          featArray.push(new Feature({
            'geometry': new geom.LineString([fromLonLat(startPoint), fromLonLat(endPoint)])
          }))
        }
        startPoint = endPoint
        endPoint = orbitPointsArray[i]
      }
      return featArray
    } else {
      return null
    }
  }

  return (
    <div id='map2D' className={className}/>
  )
}

export default Map2D