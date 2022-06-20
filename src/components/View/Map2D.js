import View from 'ol/View'
import React, {useEffect, useRef} from 'react'
import Map from 'ol/Map'
import {useSelector} from 'react-redux'
import useZSLayer from '../../hooks/map2D/useZSLayer'
import useSpacecraftLayer from '../../hooks/map2D/useSpacecraftLayer'
import useOrbitLayer from '../../hooks/map2D/useOrbitLayer'
import useDeviationProjectionLayer from '../../hooks/map2D/useDeviationProjectionLayer';
import useOrdersLayer from '../../hooks/map2D/useOrdersLayer';
import useScannerProjectionLayer from '../../hooks/map2D/useScannerProjectionLayer';
import useMapLayer from '../../hooks/map2D/useMapLayer';
import useViewZoom from '../../hooks/map2D/useViewZoom';


function Map2D({className}) {

  const is3D = useSelector(state => state.appState.is3D)

  const map = useRef(new Map({}))
  const view = useRef(new View({
    minZoom: 0
  }))

  useViewZoom(view)
  useZSLayer(map)
  useOrdersLayer(map)

  const mapLayer = useMapLayer()
  const {spacecraftLayer, updateSpacecraftLayer} = useSpacecraftLayer()
  const {orbitLayer, updateOrbitLayer} = useOrbitLayer()
  const {deviationProjectionLayer, updateDeviationProjectionLayer} = useDeviationProjectionLayer()
  const {scannerProjectionLayer, updateScannerProjectionLayer} = useScannerProjectionLayer()
  // const atmosphereLayer = useAtmosphereLayer()

  useEffect(() => {
    if (!is3D) {
      updateDeviationProjectionLayer()
      updateScannerProjectionLayer()
      updateOrbitLayer()
      updateSpacecraftLayer()
    }
    // eslint-disable-next-line
  }, [is3D])


  useEffect(() => {

    let flag = true

    map.current.getLayers().forEach(layer => {
      if (layer.values_.name === 'orbit') {
        flag = false
      }
    })

    if (flag) {
      map.current.setView(view.current)
      map.current.addLayer(mapLayer.current)
      map.current.addLayer(orbitLayer.current)
      map.current.addLayer(deviationProjectionLayer.current)
      map.current.addLayer(scannerProjectionLayer.current)
      map.current.addLayer(spacecraftLayer.current)
      // map.current.addLayer(atmosphereLayer.current)
      map.current.setTarget('map2D')
      map.current.render()
    }

    // eslint-disable-next-line
  }, [])

  return (
    <div id='map2D' className={className}/>
  )
}

export default Map2D