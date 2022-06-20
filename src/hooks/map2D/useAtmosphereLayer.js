import {useRef} from 'react';
import Feature from 'ol/Feature';
import * as layer from 'ol/layer';
import {Fill, Stroke, Style} from 'ol/style';
import {Circle} from 'ol/geom';
import * as geom from 'ol/geom';
import * as source from 'ol/source';
import {fromLonLat} from 'ol/proj';

const useAtmosphereLayer = () => {

  let atm = []
  for(let lat = -90; lat < 90; lat ++) {
    for(let lon = -180; lon < 180; lon ++) {
      atm.push(new Feature({geometry: new geom.Point(fromLonLat([lon, lat]))}))
    }
  }
  return useRef(new layer.Vector({
    source: new source.Vector({
      features: atm
    }),
    style: new Style({
      image: new Circle({
        radius: 1,
        fill: new Fill({color: '#e4eae2'}),
        stroke: new Stroke({color: '#2b2b2b', width: 2})
      }),
    })
  }))
}

export default useAtmosphereLayer