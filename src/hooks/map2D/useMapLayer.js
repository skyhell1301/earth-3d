import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import {useRef} from 'react';

const useMapLayer = () => {
  return useRef(new TileLayer({
    source: new XYZ({
      url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    })
  }))
}

export default useMapLayer