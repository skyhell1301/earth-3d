import React, {useEffect, useState} from "react"
import './ZSList.css'
import {useDispatch, useSelector} from "react-redux";
import cancel from '../../../assets/img/svg/cancel.svg'
import {deleteEarthStation} from "../../../store/reducers/earthStationsReducer";

function ZSList() {
  const stationsList = useSelector(state => state.earthStations.zsList)
  const [info, setInfo] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    setInfo(
      stationsList.map(zs => {
        return(
          <div key={zs.name} className='zs-information__row'>
            <div className='zs-information__item' title={`Долгота: ${zs.longitude}, широта: ${zs.latitude}`}>{zs.name}</div>
            <div className='zs-information__item item-value'>{zs.longitude}</div>
            <div className='zs-information__item item-value'>{zs.latitude}</div>
            <div className='zs-information__item-button'>
              <button onClick={()=>dispatch(deleteEarthStation(zs.name))}>
                <img src={cancel} alt=''/>
              </button>
            </div>
          </div>
        )
      })
    )
    // eslint-disable-next-line
  }, [stationsList]);

  return(
    <div className='zs-information'>
      <div className="zs-information__title">Список ЗС</div>
      <div className="zs-information__table">
        <div className='zs-information__row'>
          <div className='zs-information__item item-title'>Название</div>
          <div className='zs-information__item item-title'>Долгота</div>
          <div className='zs-information__item item-title'>Широта</div>
          <div/>
        </div>
        {info}
      </div>
    </div>
  )
}

export default ZSList