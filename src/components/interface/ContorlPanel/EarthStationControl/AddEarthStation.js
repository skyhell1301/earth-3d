import React, {useState} from "react"
import './AddEarthStation.css'
import {useDispatch} from "react-redux";
import {addEarthStation} from "../../../../store/reducers/earthSlices/earthStationsSlice";

function AddEarthStation() {
  const [name, setName] = useState('')
  const [lon, setLon] = useState(0)
  const [lat, setLat] = useState(0)

  const dispatch = useDispatch()

  const addZS = () => {
    if(name !== '') {
      dispatch(addEarthStation(
        {
          name: name,
          longitude: lon,
          latitude: lat
        }
      ))
      setName('')
      setLon(0)
      setLat(0)
    } else {
      alert('Укажите название станции')
    }
  }

  return (
    <div className='add-station'>
      <div className='add-station__label'>
        Название:
      </div>
      <input type="text" className='add-station__input' onChange={e => setName(e.target.value)} value={name}/>

      <div className='add-station__label'>
        Долгота (°):
      </div>
      <input type='number' className='add-station__input' onChange={e => setLon(e.target.value)} value={lon}/>

      <div className='add-station__label'>
        Широта (°):
      </div>
      <input type='number' className='add-station__input' onChange={e => setLat(e.target.value)} value={lat}/>

      <button className='add-station__button' onClick={addZS}>Добавить ЗС</button>
    </div>
  )
}

export default AddEarthStation