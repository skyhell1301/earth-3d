import camPositionReducer from './cameraPositionReducer';
import appStateReducer from './appStateReducer';
import spacecraftStateReducer from './spacecraftStateReducer';
import ordersReducer from './ordersReducer';
import interfaceStateReducer from './interfaceStateReducer';
import earthStationsReducer from './earthStationsReducer';
import atmosphereReducer from './atmosphereReducer';

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