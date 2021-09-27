import { createSlice } from '@reduxjs/toolkit'

export const earthStationsSlice = createSlice({
  name: 'earthStations',
  initialState: {
    zsList: [
      {name: 'ТКЦ', longitude: 37.378847, latitude:  55.558741},
      {name: 'Хабаровск', longitude: 135, latitude:  48}
    ],
    isShow: true
  },
  reducers: {
    addEarthStation: (state, action) => {
      state.zsList.push(action.payload)
    },
    setShowState: (state,action) => {
      state.isShow = action.payload
    }
  }
})

export const {addEarthStation, setShowState} = earthStationsSlice.actions
export default earthStationsSlice.reducer