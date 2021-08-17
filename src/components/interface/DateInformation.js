import React from "react"
import './DateInformation.css'

function DateInformation() {
  function changeDate(newDate) {
  }
  return (
    <div className='date-container'>
      <div className='date-information'>Текущее время:</div>
      <input className='date-input' onChange={e => changeDate(e.target.value)} type='datetime-local' value={currentDate.toISOString().substring(0,19)}/>
    </div>
  )
}

export default DateInformation