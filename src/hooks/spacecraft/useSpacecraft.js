import {useEffect, useState} from 'react';
import {setLoadStatus} from '../../store/reducers/appStateReducer';
import {useDispatch, useSelector} from 'react-redux';
import {setOrbitPoint, setSubPoint, setTLE} from '../../store/reducers/spacecraftStateReducer';
import {createSpacecraft} from '../../models/spacecraft';
import satelliteStl from '../../assets/models/smotr/smotr_ver2.stl';

const useSpacecraft = (tle, date, orientationEdges, isOrbit) => {

  const isPlayed = useSelector(state => state.appState.isPlayed)
  const dispatch = useDispatch()

  const [spacecraft, setSpacecraft] = useState(null)

  useEffect(() => {
    const setSpacecraftModel = async () => {
      const myStl = await createSpacecraft(tle, satelliteStl, date)
      setSpacecraft(myStl)
      dispatch(setTLE(myStl.tleString))
      dispatch(setSubPoint(myStl.lonAndLat))
      dispatch(setOrbitPoint(myStl.orbitPointsArray))
    }
    if(!spacecraft) setSpacecraftModel()
  }, [spacecraft, dispatch, tle, date])

  useEffect(() => {
    if (spacecraft) {
      dispatch(setLoadStatus(true))
    }
  }, [spacecraft, dispatch])

  useEffect(() => {

    if (spacecraft) {
      spacecraft.updateOrientationEdges(orientationEdges)
    }
  }, [spacecraft, orientationEdges])

  useEffect(() => {
    if (spacecraft) {
      spacecraft.updateTLE(tle)
      dispatch(setSubPoint(spacecraft.lonAndLat))
      dispatch(setOrbitPoint(spacecraft.orbitPointsArray))
    }
  }, [tle, spacecraft, dispatch])

  useEffect(() => {
    if (spacecraft) {
      spacecraft.move(date)
      if (!isPlayed) spacecraft.updateOrbit()
      dispatch(setSubPoint(spacecraft.lonAndLat))
      dispatch(setOrbitPoint(spacecraft.orbitPointsArray))
    }
  }, [date, spacecraft, dispatch, isPlayed])


  useEffect(() => {
    if (spacecraft) {
      isOrbit ? spacecraft.showOrbit() : spacecraft.hideOrbit()
    }

  }, [isOrbit, spacecraft])

  return spacecraft
}

export default useSpacecraft