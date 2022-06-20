import * as layer from 'ol/layer';
import * as source from 'ol/source';
import {Fill, Stroke, Style} from 'ol/style';
import {useEffect, useRef} from 'react';
import * as olProj from 'ol/proj';
import {useSelector} from 'react-redux';
import Feature from 'ol/Feature';
import * as geom from 'ol/geom';

const useScannerProjectionLayer = () => {
  const is3D = useSelector(state => state.appState.is3D)
  const scannerProjection = useSelector(state => state.spacecraft.scannerProjection)
  const scannerProjectionFeature = useRef(new Feature(new geom.Polygon([])))

  const scannerProjectionLayer = useRef(new layer.Vector({
    source: new source.Vector({
      features: [scannerProjectionFeature.current]
    }),
    style: new Style({
      stroke: new Stroke({
        color: 'rgba(26,145,9)',
        width: 10
      }),
      fill: new Fill({
        color: 'rgba(49,222,22,0.5)'
      })
    }),
    zIndex: 21
  }))

  useEffect(() => {
    updateScannerProjectionLayer()
    // eslint-disable-next-line
  }, [scannerProjection])

  const updateScannerProjectionLayer = () => {
    if (scannerProjection.length && !is3D) {
      const points = scannerProjection.map(val => {
        return olProj.transform([val.longitude, val.latitude], 'EPSG:4326', 'EPSG:3857')
      })
      scannerProjectionFeature.current.getGeometry().setCoordinates([points])
    }
  }

  return {scannerProjectionLayer, updateScannerProjectionLayer}
}

export default useScannerProjectionLayer