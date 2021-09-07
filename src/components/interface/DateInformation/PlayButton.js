import React, {useEffect, useState} from "react"
import './PlayButton.css'
import playSvg from '../../../assets/img/svg/play.svg'
import pauseSvg from '../../../assets/img/svg/pause.svg'
import {useDispatch} from "react-redux";
import {addSecond} from "../../../store/reducers/appStateReducer";

function PlayButton() {
  const [play, setPlay] = useState(false)
  const [timer, setTimer] = useState(null)

  const dispatch = useDispatch()

  function start() {
    setPlay(!play)
  }

  useEffect(()=>{
    if(play) {
      setTimer(
        setInterval(()=>{
          dispatch(addSecond())
        }, 17)
      )
    } else {
      clearInterval(timer)
    }
    // eslint-disable-next-line
  }, [play])

  return(
    <button onClick={start}
            className='play-button'
    >
      <img alt='' className='play-button__img' src={play ? pauseSvg : playSvg}/>
    </button>
  )
}

export default PlayButton