import React from "react"
import './DateInformation.css'
import {useDispatch, useSelector} from "react-redux";
import {setLocalDate} from "../../../store/reducers/appStateReducer";
import PlayButton from "./PlayButton";

function DateInformation() {

  const localDate = new Date(useSelector(state => state.appState.localDate))
  const dispatch = useDispatch()

  function changeDate(newDate) {
    if(newDate) dispatch(setLocalDate(new Date(newDate)))
  }

  function getLocalDateString(date) {
    const year = date.getFullYear()
    let month = addZeroToDate(date.getMonth() + 1)
    let day = addZeroToDate(date.getDate())
    let hour = addZeroToDate(date.getHours() )
    const minute = addZeroToDate(date.getMinutes() )
    const sec = addZeroToDate(date.getSeconds())
    return `${year}-${month}-${day}T${hour}:${minute}:${sec}`
  }

  function addZeroToDate(number) {
    return number < 10 ? '0' + number : number
  }

  return (
    <div className='date-container'>
      <div className='date-information'>Текущее время (GMT+3):</div>
      <input className='date-input'
             onChange={e => changeDate(e.target.value)} type='datetime-local'
             value={getLocalDateString(localDate)}
      />
      <PlayButton/>
    </div>
  )
}

export default DateInformation