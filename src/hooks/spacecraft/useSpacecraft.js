import {useEffect, useState} from 'react';
import {setLoadStatus} from '../../store/reducers/appStateReducer';
import {useDispatch, useSelector} from 'react-redux';
import {useThree} from '@react-three/fiber';
import {setOrbitPoint, setSubPoint, setTLE} from '../../store/reducers/spacecraftStateReducer';
import {createSpacecraft} from '../../help/spacecraft';
import satelliteStl from '../../assets/models/smotr/smotr_ver2.stl';

const useSpacecraft = (tle, date, orientationEdges, isOrbit) => {
  const {invalidate} = useThree()
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
    setSpacecraftModel()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (spacecraft) {
      invalidate()
      dispatch(setLoadStatus(true))
    }
    // eslint-disable-next-line
  }, [spacecraft])

  useEffect(() => {
      if (spacecraft) {
        spacecraft.updateOrientationEdges(orientationEdges)
      }
    // eslint-disable-next-line
  }, [orientationEdges])

  useEffect(() => {
    if (spacecraft) {
      spacecraft.updateTLE(tle)
      dispatch(setSubPoint(spacecraft.lonAndLat))
      dispatch(setOrbitPoint(spacecraft.orbitPointsArray))
    }
    // eslint-disable-next-line
  }, [tle])

  useEffect(() => {
    if (spacecraft) {
      spacecraft.move(date)
      if (!isPlayed) spacecraft.updateOrbit()
      invalidate()
      dispatch(setSubPoint(spacecraft.lonAndLat))
      dispatch(setOrbitPoint(spacecraft.orbitPointsArray))
    }
    // eslint-disable-next-line
  }, [date.toString()])

  useEffect(() => {
    if (spacecraft) {
      isOrbit ? spacecraft.showOrbit() : spacecraft.hideOrbit()
      invalidate()
    }
    // eslint-disable-next-line
  }, [isOrbit])

  return spacecraft
}

export default useSpacecraft