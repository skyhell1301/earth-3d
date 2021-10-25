import React, {useEffect, useState} from "react"
import './PlayButton.css'
import playSvg from '../../../assets/img/svg/play.svg'
import pauseSvg from '../../../assets/img/svg/pause.svg'
import {useDispatch, useSelector} from "react-redux";
import {addSecond, setPlayed} from "../../../store/reducers/appStateReducer";

function PlayButton() {
  const isPlayed = useSelector(state => state.appState.isPlayed)
  const [timer, setTimer] = useState(null)

  const dispatch = useDispatch()

  function start() {
    dispatch(setPlayed(!isPlayed))
  }

  useEffect(()=>{
    if(isPlayed) {
      setTimer(
        setInterval(()=>{
          dispatch(addSecond())
        }, 17)
      )
    } else {
      clearInterval(timer)
    }
    // eslint-disable-next-line
  }, [isPlayed])

  return(
    <button onClick={start}
            className='play-button'
    >
      <img alt='' className='play-button__img' src={isPlayed ? pauseSvg : playSvg}/>
    </button>
  )
}

export default PlayButton