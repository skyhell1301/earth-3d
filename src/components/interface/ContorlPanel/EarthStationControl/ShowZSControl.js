import React from "react"
import './ShowZSControl.css'
import {setShowState} from "../../../../store/reducers/earthStationsReducer";
import {useDispatch, useSelector} from "react-redux";

function ShowZSControl() {

  const isZSShow = useSelector(state => state.earthStations.isShow)
  const dispatch = useDispatch()

  return (
    <label className='show-zs'>
      Показать:
      <input type="checkbox" onChange={() => dispatch(setShowState(!isZSShow))} checked={isZSShow}/>
    </label>
  )
}

export default ShowZSControl