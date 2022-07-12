import * as layer from 'ol/layer';
import * as source from 'ol/source';
import {Fill, Stroke, Style} from 'ol/style';
import {useCallback, useEffect, useRef} from 'react';
import * as olProj from 'ol/proj';
import {useSelector} from 'react-redux';
import Feature from 'ol/Feature';
import * as geom from 'ol/geom';

const useDeviationProjectionLayer = (is3D) => {

  const deviationProjection = useSelector(state => state.spacecraft.deviationProjection)
  const deviationProjectionFeature = useRef(new Feature(new geom.Polygon([])))

  const deviationProjectionLayer = useRef(new layer.Vector({
    source: new source.Vector({
      features: [deviationProjectionFeature.current]
    }),
    style: new Style({
      stroke: new Stroke({
        color: 'blue',
        width: 10
      }),
      fill: new Fill({
        color: 'rgba(0, 0, 255, 0.5)'
      })
    }),
    zIndex: 20
  }))

  const updateDeviationProjectionLayer = useCallback(() => {
    if (deviationProjection.length) {
      let points = deviationProjection.map(val => {
        return olProj.transform([val.longitude, val.latitude], 'EPSG:4326', 'EPSG:3857')
      })
      deviationProjectionFeature.current.getGeometry().setCoordinates([points])
    }
  }, [deviationProjection])

  useEffect(() => {
    if (!is3D) updateDeviationProjectionLayer()
  }, [deviationProjection, is3D, updateDeviationProjectionLayer])

  return {deviationProjectionLayer, updateDeviationProjectionLayer}
}

export default useDeviationProjectionLayer