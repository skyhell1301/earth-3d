import { createSlice } from '@reduxjs/toolkit'
import {getAtmosphere} from "../../models/atmosphere";

export const atmosphereSlice = createSlice({
  name: 'atmosphere',
  initialState: {
    atmosphereData: getAtmosphere(),
    isShow: false,
  },
  reducers: {
    setAtmosphereShowStatus: (state, action) => {
      state.isShow = action.payload
    },
  }
})

export const {setAtmosphereShowStatus} = atmosphereSlice.actions
export default atmosphereSlice.reducer