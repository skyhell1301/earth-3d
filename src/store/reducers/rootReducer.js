import camPositionReducer from './appSlices/cameraPositionSlice';
import appStateReducer from './appSlices/appStateSlice';
import spacecraftStateReducer from './spacecraftSlices/spacecraftSlice';
import ordersReducer from './oredersSlices/ordersSlice';
import interfaceStateReducer from './appSlices/interfaceSlice';
import earthStationsReducer from './earthSlices/earthStationsSlice';
import atmosphereReducer from './earthSlices/atmosphereSlice';

const rootReducer = {
  camPosition: camPositionReducer,
  appState: appStateReducer,
  spacecraft: spacecraftStateReducer,
  orders: ordersReducer,
  interface: interfaceStateReducer,
  earthStations: earthStationsReducer,
  atmosphere: atmosphereReducer
}

export default rootReducer