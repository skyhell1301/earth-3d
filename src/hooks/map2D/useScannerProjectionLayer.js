import * as layer from 'ol/layer';
import * as source from 'ol/source';
import {Fill, Stroke, Style} from 'ol/style';
import {useCallback, useEffect, useRef} from 'react';
import * as olProj from 'ol/proj';
import {useSelector} from 'react-redux';
import Feature from 'ol/Feature';
import * as geom from 'ol/geom';

const useScannerProjectionLayer = (is3D) => {

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

  const updateScannerProjectionLayer = useCallback(() => {
    console.log('kek')
    if (scannerProjection.length) {
      const points = scannerProjection.map(val => {
        return olProj.transform([val.longitude, val.latitude], 'EPSG:4326', 'EPSG:3857')
      })
      scannerProjectionFeature.current.getGeometry().setCoordinates([points])
    }
  }, [scannerProjection])

  useEffect(() => {
    if(!is3D) updateScannerProjectionLayer()
  }, [scannerProjection, updateScannerProjectionLayer, is3D])

  return {scannerProjectionLayer, updateScannerProjectionLayer}
}

export default useScannerProjectionLayer