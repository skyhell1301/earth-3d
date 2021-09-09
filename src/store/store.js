import {configureStore} from '@reduxjs/toolkit'
import camPositionReducer from "./reducers/cameraPositionReducer";
import appStateReducer from "./reducers/appStateReducer";
import spacecraftStateReducer from "./reducers/spacecraftStateReducer";
import ordersReducer from "./reducers/ordersReducer";
import interfaceStateReducer from "./reducers/interfaceStateReducer";

export default configureStore({
  reducer: {
    camPosition: camPositionReducer,
    appState: appStateReducer,
    spacecraft: spacecraftStateReducer,
    orders: ordersReducer,
    interface: interfaceStateReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
})