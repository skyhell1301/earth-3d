import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import sendRESTCommand from "../../help/REST";

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async () => {
    const response = await sendRESTCommand('http://kvp/map/querieslist')
    return response.json()
  }
)

export const ordersSlice = createSlice({
  name: 'ordersState',
  initialState: {
    ordersArray: []
  },
  reducers: {
  },
  extraReducers:  {
    [fetchOrders.fulfilled]: (state, action) => {
      state.ordersArray = action.payload
    }
  }
})



// export const {} = ordersSlice.actions
export default ordersSlice.reducer