import {useEffect, useRef} from 'react';
import * as layer from 'ol/layer';
import * as source from 'ol/source';
import {Stroke, Style} from 'ol/style';
import {useSelector} from 'react-redux';
import Feature from 'ol/Feature';
import * as geom from 'ol/geom';
import {fromLonLat} from 'ol/proj';

const useOrbitLayer = () => {

  const orbitPointsArray = useSelector(state => state.spacecraft.orbitPoints)

  const orbitLayer = useRef(new layer.Vector({
    name: 'orbit',
    source: new source.Vector({
      features: []
    }),
    style: new Style({
      stroke: new Stroke({
        color: '#666666',
        width: 5
      })
    })
  }))

  const getOrbitFeaturesArray = () => {
    if (orbitPointsArray.length > 3) {
      let featArray = []
      let startPoint = orbitPointsArray[0]
      let endPoint = orbitPointsArray[1]
      for (let i = 2; i < orbitPointsArray.length; i = i + 4) {
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

  const updateOrbitLayer = () => {
    if (orbitPointsArray.length > 0) {
      orbitLayer.current.getSource().clear()
      orbitLayer.current.getSource().addFeatures(getOrbitFeaturesArray())
    }
  }

  useEffect(() => {
    updateOrbitLayer()
    // eslint-disable-next-line
  }, [orbitPointsArray])

  return {orbitLayer, updateOrbitLayer}
}

export default useOrbitLayer