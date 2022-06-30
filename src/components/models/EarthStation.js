import React from 'react'
import {useSelector} from 'react-redux'
import {useZsGroup} from '../../hooks/earthStation/useZsGroup';

function EarthStation({isVisible = true}) {
  const stationsList = useSelector(state => state.earthStations.zsList)
  const {zsGroup} = useZsGroup(stationsList)

  return <>{isVisible && zsGroup}</>
}

export default EarthStation