import {configureStore} from '@reduxjs/toolkit'
import camPositionReducer from "./reducers/cameraPositionReducer";
import appStateReducer from "./reducers/appStateReducer";
import spacecraftStateReducer from "./reducers/spacecraftStateReducer";

export default configureStore({
  reducer: {
    camPosition: camPositionReducer,
    appState: appStateReducer,
    spacecraft: spacecraftStateReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
})