import React, {Suspense, lazy} from "react";
import './App.css';

import {useSelector, Provider} from "react-redux";
import LoadingView from "./View/LoadingView";
import store from "../store/store";

const Scene3D = lazy(() => import("./View/Scene3D"))
const Map2D = lazy(() => import("./View/Map2D"))
const DateInformation = lazy(() => import("./interface/DateInformation/DateInformation"))
const TLEParams = lazy(() => import("./interface/TLEInformation/TLEParams"))
const ControlPanel = lazy(() => import("./interface/ContorlPanel/ControlPanel"))
const StateViewButton = lazy(() => import("./interface/StateViewButton/StateViewButton"))
const Logo = lazy(() => import("./interface/Logo/Logo"))
const ZSList = lazy(() => import("./interface/EarthStationsInformation/ZSList"))


const App = () => {
    const is3D = useSelector(state => state.appState.is3D)
    const isLoaded = useSelector(state => state.appState.isLoaded)

    function isHide3D() {
        return !is3D ? ' hide-layer' : ''
    }

    function isHide2D() {
        return is3D ? ' hide-layer' : ''
    }

    return (
        <div className='app'>
            <Suspense fallback={<LoadingView/>}>
                <Provider store={store}>
                    {isLoaded ?
                        <div>
                            <TLEParams/>
                            <div className='control-container'>
                                <StateViewButton/>
                                <ControlPanel/>
                            </div>
                            <DateInformation/>
                            <Logo/>
                            <ZSList/>
                        </div> : null
                    }
                    <Scene3D className={'scene' + isHide3D()}/>
                    <Map2D className={'map2d' + isHide2D()}/>
                    <div id='map3D' className='map3d'/>
                </Provider>
            </Suspense>
        </div>
    )
}

export default App;
