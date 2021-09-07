import {configureStore} from '@reduxjs/toolkit'
import camPositionReducer from "./reducers/cameraPositionReducer";
import appStateReducer from "./reducers/appStateReducer";
import spacecraftStateReducer from "./reducers/spacecraftStateReducer";
import ordersReducer from "./reducers/ordersReducer";

export default configureStore({
  reducer: {
    camPosition: camPositionReducer,
    appState: appStateReducer,
    spacecraft: spacecraftStateReducer,
    orders: ordersReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
})