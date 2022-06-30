import {createSlice} from '@reduxjs/toolkit'

export const appStateSlice = createSlice({
  name: 'appState',
  initialState: {
    is3D: true,
    isLoaded: false,
    isPlayed: false,
    localDate: new Date()
  },
  reducers: {
    /**
     * Установка состояния сцены
     * @param state
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
     * @param action date
     */
    setLocalDate: (state, action) => {
      state.localDate = action.payload
    },
    setPlayed: (state, action) => {
      state.isPlayed = action.payload
    },
    addMinute(state) {
      const date = new Date(state.localDate)
      date.setMinutes(date.getMinutes() + 1)
      state.localDate = date
    },
    addSecond(state) {
      const date = new Date(state.localDate)
      date.setSeconds(date.getSeconds() + 1)
      state.localDate = date
    }
  }
})


export const {setSceneState, setLoadStatus, setLocalDate, addMinute, addSecond, setPlayed} = appStateSlice.actions
export default appStateSlice.reducer