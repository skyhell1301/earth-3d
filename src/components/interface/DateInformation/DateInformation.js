import React from 'react'
import './DateInformation.css'
import {useDispatch, useSelector} from 'react-redux';
import {setLocalDate} from '../../../store/reducers/appSlices/appStateSlice';
import PlayButton from './PlayButton';
import {useDate} from '../../../hooks/useDate';

function DateInformation() {

  const localDate = useSelector(state => state.appState.localDate)
  const {localDateString} = useDate(localDate)
  const dispatch = useDispatch()

  const changeDate = (e) => {
    const newDate = e.target.value
    newDate && dispatch(setLocalDate(new Date(newDate)))
  }

  return (
    <div className='date-container'>
      <div className='date-information'>Текущее время (GMT+3):</div>
      <div className='date-time'>
        <input className='date-input'
               onChange={changeDate} type='datetime-local'
               value={localDateString}
               step={1}
        />
        <PlayButton className='date-button'/>
      </div>
    </div>
  )
}

export default DateInformation