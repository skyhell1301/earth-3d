import React from 'react'
import './ZSList.css'
import {useDispatch, useSelector} from 'react-redux';
import {deleteEarthStation} from '../../../store/reducers/earthSlices/earthStationsSlice';
import ZSItem from './ZSItem';

function ZSList() {
  const stationsList = useSelector(state => state.earthStations.zsList)
  const dispatch = useDispatch()

  const deleteZS = (zsName) => {
    dispatch(deleteEarthStation(zsName))
  }

  return (
    <div className='zs-information'>
      <div className='zs-information__title'>Список ЗС</div>
      <div className='zs-information__table'>
        <div className='zs-information__row'>
          <div className='zs-information__item item-title'>Название</div>
          <div className='zs-information__item item-title'>Долгота</div>
          <div className='zs-information__item item-title'>Широта</div>
          <div/>
        </div>
        {
          stationsList && stationsList.map(zs => <ZSItem key={zs.name} zs={zs} deleteZS={deleteZS}/>)
        }
      </div>
    </div>
  )
}

export default ZSList