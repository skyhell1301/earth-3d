import {createSlice} from '@reduxjs/toolkit'
import calculateZSRadius from "../../models/earthStation";

export const earthStationsSlice = createSlice({
  name: 'earthStations',
  initialState: {
    zsList: [
      {
        name: 'Переславль', longitude: 38.8562600, latitude: 56.7393400, zone5: calculateZSRadius(38.8562600, 56.7393400),
        zone7: calculateZSRadius(38.8562600, 56.7393400, 7)
      },
      {
        name: 'Новосибирск',
        longitude: 82.9346000,
        latitude: 55.0415000,
        zone5: calculateZSRadius(82.9346000, 55.0415000),
        zone7: calculateZSRadius(82.9346000, 55.0415000, 7)
      }
    ],
    isShow: true
  },
  reducers: {
    addEarthStation: (state, action) => {
      let newZS = action.payload
      newZS.zone5 = calculateZSRadius(newZS.longitude, newZS.latitude)
      newZS.zone7 = calculateZSRadius(newZS.longitude, newZS.latitude, 7)
      state.zsList.push(newZS)
    },
    setShowState: (state, action) => {
      state.isShow = action.payload
    },
    deleteEarthStation: (state, action) => {
      state.zsList.forEach((zs, index) => {
        if (action.payload === zs.name) state.zsList.splice(index,1)
      })
    },
  }
})

export const {addEarthStation, setShowState, deleteEarthStation} = earthStationsSlice.actions
export default earthStationsSlice.reducer