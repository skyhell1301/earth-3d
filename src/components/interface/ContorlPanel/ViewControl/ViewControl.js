import React from "react"
import './ViewControl.css'
import PanelItem from "../PanelItem";
import {useDispatch, useSelector} from "react-redux";
import {setAxesState, setGridState} from "../../../../store/reducers/interfaceStateReducer";

function ViewControl() {
  const isAxes = useSelector(state => state.interface.isAxes)
  const isGrid = useSelector(state => state.interface.isGrid)
  const dispatch = useDispatch()
  return (
    <PanelItem title='Вид'>
      <div className='view-control'>
        <label className='view-control__item'>
          Сетка:
          <input type="checkbox" checked={isGrid} onChange={() => dispatch(setGridState(!isGrid))}/>
        </label>
        <label className='view-control__item'>
          Оси координат:
          <input type="checkbox" checked={isAxes} onChange={() => dispatch(setAxesState(!isAxes))}/>
        </label>
      </div>
    </PanelItem>
  )
}

export default ViewControl