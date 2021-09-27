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
            <div>{zs.name}</div>
            <div>{zs.longitude}</div>
            <div>{zs.latitude}</div>
            <button onClick={()=>dispatch(deleteEarthStation(zs.name))}>
              <img src={cancel} alt=''/>
            </button>
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
          <div>Название</div>
          <div>Долгота</div>
          <div>Широта</div>
          <div/>
        </div>
        {info}
      </div>
    </div>
  )
}

export default ZSList