import React from "react"
import './DateInformation.css'
import {useDispatch, useSelector} from "react-redux";
import {setCurrentDate} from "../../../store/reducers/appStateReducer";
import PlayButton from "./PlayButton";

function DateInformation() {

  const date = useSelector(state => state.appState.currentDate)
  const dispatch = useDispatch()

  function changeDate(newDate) {
    dispatch(setCurrentDate(newDate))
  }

  return (
    <div className='date-container'>
      <div className='date-information'>Текущее время (GMT+3):</div>
      <input className='date-input'
             onChange={e => changeDate(e.target.value)} type='datetime-local'
             value={date}
      />
      <PlayButton/>
    </div>
  )
}

export default DateInformation