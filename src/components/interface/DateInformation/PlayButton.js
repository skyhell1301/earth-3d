import React, {useEffect, useRef} from 'react'
import './PlayButton.css'
import playSvg from '../../../assets/img/svg/play.svg'
import pauseSvg from '../../../assets/img/svg/pause.svg'
import {useDispatch, useSelector} from 'react-redux';
import {addSecond, setPlayed} from '../../../store/reducers/appSlices/appStateSlice';

function PlayButton({className}) {
  const isPlayed = useSelector(state => state.appState.isPlayed)
  const timer = useRef(null)

  const dispatch = useDispatch()

  const start = () => {
    dispatch(setPlayed(!isPlayed))
  }

  useEffect(() => {
    if (isPlayed) {
      timer.current = setInterval(() => {
          dispatch(addSecond())
        }, 17)
    } else {
      clearInterval(timer.current)
      timer.current = null
    }
  }, [isPlayed, dispatch])

  return (
    <button onClick={start}
            className={className + ' play-button'}
    >
      <img alt='' className='play-button__img' src={isPlayed ? pauseSvg : playSvg}/>
    </button>
  )
}

export default PlayButton