import { createSlice } from '@reduxjs/toolkit'

export const spacecraftStateSlice = createSlice({
  name: 'camPosition',
  initialState: {
    tle: 'TRITON-1\n' +
      '1 39427U 13066M   21203.82189194  .00000294  00000-0  54799-4 0  9994\n' +
      '2 39427  97.7764 149.8720 0111916 237.6857 121.3472 14.68267694410407',
    lonAndLat: {x:0, y:0},
    orbitPoints: []
  },
  reducers: {
    setTLE: (state, action) => {
      state.tle = action.payload
    },
    setSubPoint: (state, action) => {
      state.lonAndLat = action.payload
    },
    setOrbitPoint: (state, action) => {
      state.orbitPoints = action.payload
    },
  }
})

export const {setTLE, setSubPoint, setOrbitPoint} = spacecraftStateSlice.actions
export default spacecraftStateSlice.reducer