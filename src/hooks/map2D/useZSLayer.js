import * as olProj from 'ol/proj';
import * as layer from 'ol/layer';
import * as source from 'ol/source';
import Feature from 'ol/Feature';
import * as geom from 'ol/geom';
import {Circle, Fill, Stroke, Style} from 'ol/style';
import {fromLonLat} from 'ol/proj';
import {useEffect} from 'react';
import {useSelector} from 'react-redux';


const useZSLayer = (map) => {

  const zsList = useSelector(state => state.earthStations.zsList)
  const isZSShow = useSelector(state => state.earthStations.isShow)

  useEffect(() => {
    const layers = map.current.getLayers().getArray()

    layers.filter((value) => value.get('type') === 'zs').forEach(value => map.current.removeLayer(value))

    zsList.forEach(zs => {
      addZS(zs)
    })
    // eslint-disable-next-line
  }, [zsList])

  function addZS(zs) {
    const zone5 = zs.zone5.map(coordinate => olProj.fromLonLat(coordinate))
    const zone7 = zs.zone7.map(coordinate => olProj.fromLonLat(coordinate))

    const ZSZone5 = new layer.Vector({
      source: new source.Vector({
        features: [new Feature(new geom.Polygon([zone5]))]
      }),
      style: new Style({
        stroke: new Stroke({
          color: 'rgb(145,9,50)',
          width: 3
        }),
        fill: new Fill({
          color: 'rgba(222,22,75,0.2)'
        })
      }),
      name: zs.name,
      type: 'zs',
      zIndex: 10
    })

    const ZSZone7 = new layer.Vector({
      source: new source.Vector({
        features: [new Feature(new geom.Polygon([zone7]))]
      }),
      style: new Style({
        stroke: new Stroke({
          color: 'rgb(11,105,6)',
          width: 3
        }),
        fill: new Fill({
          color: 'rgba(27,231,11,0.2)'
        })
      }),
      name: zs.name,
      type: 'zs',
      zIndex: 11
    })

    const ZSPoint = new layer.Vector({
      source: new source.Vector({
        features: [new Feature({
          geometry: new geom.Point(fromLonLat([zs.longitude, zs.latitude]))
        })]
      }),
      style: new Style({
        image: new Circle({
          radius: 5,
          fill: new Fill({color: 'rgba(222,22,75)'}),
          stroke: new Stroke({color: '#2b2b2b', width: 2})
        })
      }),
      name: zs.name,
      type: 'zs',
      zIndex: 12
    })

    map.current.addLayer(ZSZone5)
    map.current.addLayer(ZSZone7)
    map.current.addLayer(ZSPoint)
  }

  useEffect(() => {
    const layers = map.current.getLayers().getArray()
    layers.forEach(layer => {
      zsList.forEach(zs => {
        if (layer.get('name') === zs.name) {
          layer.setVisible(isZSShow)
        }
      })
    })
    // eslint-disable-next-line
  }, [isZSShow])

}

export default useZSLayer