import React, {useCallback} from 'react'
import './DateInformation.css'
import {useDispatch, useSelector} from 'react-redux';
import {setLocalDate} from '../../../store/reducers/appStateReducer';
import PlayButton from './PlayButton';
import {getLocalDateString} from '../../../help/date';

function DateInformation() {

  const localDate = useSelector(state => state.appState.localDate)
  const dispatch = useDispatch()

  const changeDate = (newDate) => {
    newDate && dispatch(setLocalDate(new Date(newDate)))
  }

  const localDateString = useCallback(getLocalDateString, [])

  return (
    <div className='date-container'>
      <div className='date-information'>Текущее время (GMT+3):</div>
      <div className='date-time'>
        <input className='date-input'
               onChange={e => changeDate(e.target.value)} type='datetime-local'
               value={localDateString(localDate)}
        />
        <PlayButton className='date-button'/>
      </div>
    </div>
  )
}

export default DateInformation