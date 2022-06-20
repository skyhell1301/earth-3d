import * as olProj from 'ol/proj';
import {useEffect, useRef} from 'react';
import {useSelector} from 'react-redux';

const useViewZoom = (view) => {

  const coefficient = useRef(240)
  const is3D = useSelector(state => state.appState.is3D)
  const {zoom, center} = useSelector(state => state.camPosition)

  const updateZoom = () => {
    view.current.setZoom(zoom / coefficient.current)
    view.current.setCenter(olProj.transform([center[0], center[1]], 'EPSG:4326', 'EPSG:3857'))
  }

  useEffect(() => {
    if (!is3D) {
      updateZoom()
    }
    // eslint-disable-next-line
  }, [is3D])

  return updateZoom
}

export default useViewZoom