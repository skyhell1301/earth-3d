import {createSlice} from '@reduxjs/toolkit'
import calculateZSRadius from "../../help/earthStation";

export const earthStationsSlice = createSlice({
  name: 'earthStations',
  initialState: {
    zsList: [
      {
        name: 'ТКЦ', longitude: 37.378847, latitude: 55.558741, zone5: calculateZSRadius(37.378847, 55.558741),
        zone7: calculateZSRadius(37.378847, 55.558741, 7)
      },
      {
        name: 'Хабаровск',
        longitude: 135,
        latitude: 48,
        zone5: calculateZSRadius(135, 48),
        zone7: calculateZSRadius(135, 48, 7)
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