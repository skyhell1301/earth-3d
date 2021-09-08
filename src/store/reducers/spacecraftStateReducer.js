import { createSlice } from '@reduxjs/toolkit'

export const spacecraftStateSlice = createSlice({
  name: 'camPosition',
  initialState: {
    tle: 'TRITON-1\n' +
      '1 39427U 13066M   21203.82189194  .00000294  00000-0  54799-4 0  9994\n' +
      '2 39427  97.7764 149.8720 0111916 237.6857 121.3472 14.68267694410407',
    lonAndLat: {x:0, y:0},
    orbitPoints: [],
    scannerProjection: [],
    orientationEdges: {
      roll: 0, //крен (ось Y) в градусах
      yaw: 0, //рысканье (ось Z) в градусах
      pitch: 0, //тангаж (ось X) в градусах
    },
    orbitIsView: true
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
    setOrbitIsView: (state, action) => {
      state.orbitIsView = action.payload
    },
    setScannerProjection: (state, action) => {
      state.scannerProjection = action.payload
    },
    setOrientationEdges: (state, action) => {
      state.orientationEdges = action.payload
    },
  }
})

export const {setTLE, setSubPoint, setOrbitPoint, setOrbitIsView, setScannerProjection, setOrientationEdges} = spacecraftStateSlice.actions
export default spacecraftStateSlice.reducer