import React from 'react'
import './OrientationControl.css'
import {useDispatch, useSelector} from 'react-redux';
import {setOrientationEdges} from '../../../../store/reducers/spacecraftStateReducer';

function OrientationControl() {
  const edges = useSelector(state => state.spacecraft.orientationEdges)
  const dispatch = useDispatch()

  function changePitchHandler(value) {
    let newEdges = {
      roll: edges.roll,
      yaw: edges.yaw,
      pitch: edges.pitch
    }
    newEdges.pitch = +value
    dispatch(setOrientationEdges(newEdges))
  }

  function changeYawHandler(value) {
    let newEdges = {
      roll: edges.roll,
      yaw: edges.yaw,
      pitch: edges.pitch
    }
    newEdges.yaw = +value
    dispatch(setOrientationEdges(newEdges))
  }

  function changeRollHandler(value) {
    let newEdges = {
      roll: edges.roll,
      yaw: edges.yaw,
      pitch: edges.pitch
    }
    newEdges.roll = +value
    dispatch(setOrientationEdges(newEdges))
  }

  return (
    <div className='orientation-control'>
      <div className='orientation-control__item'>
        <label>
          Тангаж (°):
          <input type='number' min={-45} max={45} value={edges.pitch}
                 onInput={e => changePitchHandler(e.target.value)}
          />
        </label>
        <input type='range' min={-45} max={45} value={edges.pitch}
               onInput={e => changePitchHandler(e.target.value)}
               className='orientation-control__changer'
        />
      </div>
      <div className='orientation-control__item'>
        <label>
          Крен (°):
          <input type='number' min={-45} max={45} value={edges.roll}
                 onInput={e => changeRollHandler(e.target.value)}
          />
        </label>
        <input type='range' min={-45} max={45} value={edges.roll}
               onInput={e => changeRollHandler(e.target.value)}
               className='orientation-control__changer'
        />
      </div>
      <div className='orientation-control__item'>
        <label>
          Рысканье (°):
          <input type='number' min={-180} max={180} value={edges.yaw}
                 onInput={e => changeYawHandler(e.target.value)}
          />

        </label>
        <input type='range' min={-180} max={180} value={edges.yaw}
               onInput={e => changeYawHandler(e.target.value)}
               className='orientation-control__changer'
        />
      </div>

      <button onClick={() => dispatch(setOrientationEdges({roll: 0, yaw: 0, pitch: 0}))}
      >
        Сбросить
      </button>
    </div>
  )
}

export default OrientationControl