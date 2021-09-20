import React, {useEffect, useState} from "react"
import View from "ol/View";
import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import {useDispatch, useSelector} from "react-redux";
// import {setCenter, setZoom} from "../../store/reducers/cameraPositionReducer";
import {fromLonLat} from 'ol/proj';
import Feature from 'ol/Feature'
import {fromExtent} from 'ol/geom/Polygon';
import * as olProj from "ol/proj";
import * as geom from "ol/geom";
import * as source from "ol/source";
import * as layer from "ol/layer";
import {Circle, Fill, Stroke, Style} from "ol/style";
import {fetchOrders} from "../../store/reducers/ordersReducer";


function Map2D({className}) {
  const coefficient = 240
  const zoom = useSelector(state => state.camPosition.zoom)
  const center = useSelector(state => state.camPosition.center)
  const orders = useSelector(state => state.orders.ordersArray)
  const is3D = useSelector(state => state.appState.is3D)
  const spacecraftSubPoint = useSelector(state => state.spacecraft.lonAndLat)
  const orbitPointsArray = useSelector(state => state.spacecraft.orbitPoints)
  const scannerProjection = useSelector(state => state.spacecraft.scannerProjection)
  const deviationProjection = useSelector(state => state.spacecraft.deviationProjection)


  const dispatch = useDispatch()

  const [view] = useState(new View({
    minZoom: 0
  }))
  const [map] = useState(new Map({}))


  const [spacecraftPoint] = useState(new Feature({
    geometry: new geom.Point(fromLonLat([spacecraftSubPoint.x, spacecraftSubPoint.y])),
    name: 'A point',
  }))

  const [deviationProjectionFeature] = useState(new Feature(new geom.Polygon([])))
  const [scannerProjectionFeature] = useState(new Feature(new geom.Polygon([])))

  const [orbitLayer] = useState(new layer.Vector({
    source: new source.Vector({
      features: [],
    }),
    style: new Style({
      stroke: new Stroke({
        color: '#666666',
        width: 5,
      }),
    }),
  }))


  useEffect(() => {
    if (!is3D) {
      updateZoom()
      updateDeviationProjection()
      updateScannerProjection()
      updateSpacecraftPoint()
    }
    // eslint-disable-next-line
  }, [is3D])

  function updateZoom() {
    view.setZoom(zoom / coefficient)
    view.setCenter(olProj.transform([center[0], center[1]], 'EPSG:4326', 'EPSG:3857'))
  }

  useEffect(() => {
    updateDeviationProjection()
    // eslint-disable-next-line
  }, [deviationProjection])

  function updateDeviationProjection() {
    if (deviationProjection.length && !is3D) {
      let points = deviationProjection.map(val => {
        return olProj.transform([val.longitude, val.latitude], 'EPSG:4326', 'EPSG:3857')
      })
      deviationProjectionFeature.getGeometry().setCoordinates([points])
    }
  }

  useEffect(() => {
    updateScannerProjection()
    // eslint-disable-next-line
  }, [scannerProjection])

  function updateScannerProjection() {
    if (scannerProjection.length && !is3D) {
      let points = scannerProjection.map(val => {
        return olProj.transform([val.longitude, val.latitude], 'EPSG:4326', 'EPSG:3857')
      })
      scannerProjectionFeature.getGeometry().setCoordinates([points])
    }
  }

  useEffect(() => {
    if (orbitPointsArray.length > 0) {
      orbitLayer.getSource().addFeatures(getOrbitFeaturesArray())
    }
    // eslint-disable-next-line
  }, [orbitPointsArray])

  useEffect(() => {
    if(!is3D) updateSpacecraftPoint()
    // eslint-disable-next-line
  }, [spacecraftSubPoint])

  function updateSpacecraftPoint() {
    spacecraftPoint.getGeometry().setCoordinates(fromLonLat([spacecraftSubPoint.x, spacecraftSubPoint.y]))
    map.render()
  }

  useEffect(() => {
    if (orders.length) {
      orders.forEach(value => {
        let order = new layer.Vector({
          source: new source.Vector({
            features: [new Feature({
              geometry: fromExtent(value.geometry_parsed),
            })]
          }),
          style: new Style({
            stroke: new Stroke({
              color: 'blue',
              width: 3,
            }),
            fill: new Fill({
              color: 'rgba(0, 0, 255, 0.1)',
            }),
          })
        })
        map.addLayer(order)
      })
      map.render()
    }
    // eslint-disable-next-line
  }, [orders])

  useEffect(() => {
    dispatch(fetchOrders())
    let spacecraftPointLayer = new layer.Vector({
      source: new source.Vector({
        features: [spacecraftPoint]
      }),
      style: new Style({
        image: new Circle({
          radius: 10,
          fill: new Fill({color: '#e4eae2'}),
          stroke: new Stroke({color: '#2b2b2b', width: 2})
        }),
      })
    });

    let deviationProjectionLayer = new layer.Vector({
      source: new source.Vector({
        features: [deviationProjectionFeature]
      }),
      style: new Style({
        stroke: new Stroke({
          color: 'blue',
          width: 10,
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 255, 0.5)',
        }),
      })
    });

    let scannerProjectionLayer = new layer.Vector({
      source: new source.Vector({
        features: [scannerProjectionFeature]
      }),
      style: new Style({
        stroke: new Stroke({
          color: 'rgba(26,145,9)',
          width: 10,
        }),
        fill: new Fill({
          color: 'rgba(49,222,22,0.5)',
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
    map.addLayer(orbitLayer)
    map.addLayer(deviationProjectionLayer)
    map.addLayer(scannerProjectionLayer)
    map.addLayer(spacecraftPointLayer)
    map.setTarget('map2D')
    map.render()

    // view.on('change', () => {
    //   dispatch(setZoom(view.getZoom() * coefficient))
    //   dispatch(setCenter(olProj.transform(view.getCenter(), 'EPSG:3857', 'EPSG:4326')))
    // })
    // eslint-disable-next-line
  }, [])

  function getOrbitFeaturesArray() {
    if (orbitPointsArray.length > 3) {
      let featArray = []
      let startPoint = orbitPointsArray[0]
      let endPoint = orbitPointsArray[1]
      for (let i = 2; i < orbitPointsArray.length; i++) {
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