import {useDispatch, useSelector} from 'react-redux';
import {useEffect} from 'react';
import * as layer from 'ol/layer';
import * as source from 'ol/source';
import Feature from 'ol/Feature';
import {fromExtent} from 'ol/geom/Polygon';
import {Fill, Stroke, Style} from 'ol/style';
import {fetchOrders} from '../../store/reducers/oredersSlices/ordersSlice';

const useOrdersLayer = (map) => {
  const orders = useSelector(state => state.orders.ordersArray)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchOrders())
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (orders.length) {
      orders.forEach(value => {
        let order = new layer.Vector({
          source: new source.Vector({
            features: [new Feature({
              geometry: fromExtent(value.geometry_parsed)
            })]
          }),
          style: new Style({
            stroke: new Stroke({
              color: 'blue',
              width: 3
            }),
            fill: new Fill({
              color: 'rgba(0, 0, 255, 0.1)'
            })
          })
        })
        map.current.addLayer(order)
      })
    }
    // eslint-disable-next-line
  }, [orders])
}

export default useOrdersLayer