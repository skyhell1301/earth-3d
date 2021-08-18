import React, {useEffect, useState} from "react"
import './PlayButton.css'
import {useDispatch} from "react-redux";
import {addMinute} from "../../../store/reducers/appStateReducer";

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
          dispatch(addMinute())
        }, 60)
      )
    } else {
      clearInterval(timer)
    }
  }, [play])

  function getTemplate() {
    return play ? '⏸' : '⏯'
  }
  return(
    <button onClick={start}
            className='play-button'
    >
      {getTemplate()}
    </button>
  )
}

export default PlayButton