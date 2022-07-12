import { createSlice } from '@reduxjs/toolkit'

export const interfaceStateSlice = createSlice({
  name: 'interfaceState',
  initialState: {
    isAxes: false,
    isGrid: false
  },
  reducers: {
    setAxesState: (state, action) => {
      state.isAxes = action.payload
    },
    setGridState: (state, action) => {
      state.isGrid = action.payload
    },
  }
})


export const {setAxesState, setGridState} = interfaceStateSlice.actions
export default interfaceStateSlice.reducer