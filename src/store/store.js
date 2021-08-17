import { configureStore } from '@reduxjs/toolkit'
import camPositionReducer from "./reducers/cameraPositionReducer";

export default configureStore({
  reducer: {
    camPosition: camPositionReducer
  }
})