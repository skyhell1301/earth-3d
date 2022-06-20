import {useEffect, useRef} from 'react';
import Feature from 'ol/Feature';
import * as geom from 'ol/geom';
import {fromLonLat} from 'ol/proj';
import {useSelector} from 'react-redux';
import * as layer from 'ol/layer';
import * as source from 'ol/source';
import {Circle, Fill, Stroke, Style} from 'ol/style';


const useSpacecraftLayer = () => {

  const is3D = useSelector(state => state.appState.is3D)
  const spacecraftSubPoint = useSelector(state => state.spacecraft.lonAndLat)

  const spacecraftPoint = useRef(new Feature({
    geometry: new geom.Point(fromLonLat([spacecraftSubPoint.x, spacecraftSubPoint.y])),
    name: 'A point'
  }))

  const spacecraftLayer = useRef(new layer.Vector({
    source: new source.Vector({
      features: [spacecraftPoint.current]
    }),
    style: new Style({
      image: new Circle({
        radius: 10,
        fill: new Fill({color: '#e4eae2'}),
        stroke: new Stroke({color: '#2b2b2b', width: 2})
      })
    }),
    zIndex: 22
  }))

  useEffect(() => {
    if (!is3D) updateSpacecraftLayer()
    // eslint-disable-next-line
  }, [spacecraftSubPoint])

  const updateSpacecraftLayer = () => {
    spacecraftPoint.current.getGeometry().setCoordinates(fromLonLat([spacecraftSubPoint.x, spacecraftSubPoint.y]))
  }

  return {spacecraftLayer, updateSpacecraftLayer}
}

export default useSpacecraftLayer