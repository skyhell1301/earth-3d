import { createSlice } from '@reduxjs/toolkit'

export const spacecraftStateSlice = createSlice({
  name: 'camPosition',
  initialState: {
    tle: 'TRITON-1\n' +
      '1 39427U 13066M   21203.82189194  .00000294  00000-0  54799-4 0  9994\n' +
      '2 39427  97.7764 149.8720 0111916 237.6857 121.3472 14.68267694410407'
  },
  reducers: {
    setTLE: (state, action) => {
      state.tle = action.payload
    },
  }
})

export const {setTLE} = spacecraftStateSlice.actions
export default spacecraftStateSlice.reducer