import React, {useState} from "react"
import './AddEarthStation.css'
import {useDispatch} from "react-redux";
import {addEarthStation} from "../../../../store/reducers/earthStationsReducer";

function AddEarthStation() {
  const [name, setName] = useState('')
  const [lon, setLon] = useState(0)
  const [lat, setLat] = useState(0)

  const dispatch = useDispatch()

  function addZS() {
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
      <label className='add-station__label'>
        Название:
        <input type="text" onChange={e => setName(e.target.value)} value={name}/>
      </label>

      <label className='add-station__label'>
        Долгота (град):
        <input type='number' onChange={e => setLon(e.target.value)} value={lon}/>
      </label>

      <label className='add-station__label'>
        Широта (град):
        <input type='number' onChange={e => setLat(e.target.value)} value={lat}/>
      </label>

      <button className='add-station__button' onClick={addZS}>Добавить ЗС</button>
    </div>
  )
}

export default AddEarthStation