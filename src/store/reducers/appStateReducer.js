import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const appStateSlice = createSlice({
  name: 'appState',
  initialState: {
    is3D: true,
    isLoaded: false,
    isPlayed: false,
    localDate: new Date().toISOString(),
  },
  reducers: {
    /**
     * Установка состояния сцены
     * @param action - true -> 3D, false -> 2D
     */
    setSceneState: (state, action) => {
      state.is3D = action.payload
    },
    setLoadStatus: (state, action) => {
      state.isLoaded = action.payload
    },
    /**
     * @param state
     * @param action date.toISOString().subscribe(0, 19)
     */
    setLocalDate: (state, action: PayloadAction<Date>) => {
      state.localDate = action.payload.toISOString()
    },
    setPlayed:(state, action: PayloadAction<Date>) => {
      state.isPlayed = action.payload
    },
    addMinute(state) {
      let date = new Date(state.localDate)
      date.setMinutes(date.getMinutes() + 1)
      state.localDate = date.toISOString()
    },
    addSecond(state) {
      let date = new Date(state.localDate)
      date.setSeconds(date.getSeconds() + 1)
      state.localDate = date.toISOString()
    },
  }
})





export const {setSceneState, setLoadStatus, setLocalDate,addMinute, addSecond, setPlayed} = appStateSlice.actions
export default appStateSlice.reducer