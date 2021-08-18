import { createSlice } from '@reduxjs/toolkit'

export const appStateSlice = createSlice({
  name: 'appState',
  initialState: {
    is3D: true,
    currentDate: getUTCDate(new Date())
  },
  reducers: {
    /**
     * Установка состояния сцены
     * @param action - true -> 3D, false -> 2D
     */
    setSceneState: (state, action) => {
      state.is3D = action.payload
    },
    /**
     * @param state
     * @param action date.toISOString().subscribe(0, 19)
     */
    setCurrentDate: (state, action) => {
      state.currentDate = action.payload
    },
    addMinute(state) {
      let cur = new Date(state.currentDate)
      let newDate = new Date(cur.getTime() + 1)
      // console.log(newDate.toLocaleString())
      // console.log(new Date(newDate.toLocaleString()))
      state.currentDate = getUTCDate(newDate)
    }
  }
})

function getUTCDate(date) {
  const year = date.getUTCFullYear()
  let month = addZeroToDate(date.getUTCMonth() + 1)
  let day = addZeroToDate(date.getUTCDate())
  let hour = addZeroToDate(date.getUTCHours() )
  const minute = addZeroToDate(date.getUTCMinutes() )
  const sec = addZeroToDate(date.getUTCSeconds())
  return `${year}-${month}-${day}T${hour}:${minute}:${sec}`
}

function addZeroToDate(number) {
  return number < 10 ? '0' + number : number
}

export const {setSceneState, setCurrentDate,addMinute} = appStateSlice.actions
export default appStateSlice.reducer