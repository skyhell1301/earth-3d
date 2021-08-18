import { createSlice } from '@reduxjs/toolkit'

export const cameraPositionSlice = createSlice({
  name: 'camPosition',
  initialState: {
    zoom: 450,
    center: [0, 0],
  },
  reducers: {
    setZoom: (state, action) => {
      state.zoom = action.payload
    },
    setCenter: (state, action) => {
      state.center = action.payload
    },
  }
})

export const {setZoom, setCenter} = cameraPositionSlice.actions
export default cameraPositionSlice.reducer