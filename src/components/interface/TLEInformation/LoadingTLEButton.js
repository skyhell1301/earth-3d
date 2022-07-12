import React, {useRef} from "react"
import './LoadingTLEButton.css'
import {useDispatch} from "react-redux";
import {setTLE} from "../../../store/reducers/spacecraftSlices/spacecraftSlice";

function LoadingTLEButton() {
  const inputRef = useRef()

  const dispatch = useDispatch()

  const clickInput = () => {
    inputRef.current.click()
  }

  const loadTLE = (input) => {
    let files = input.files
    if (files.length > 0) {
      const reader = new FileReader()
      reader.readAsText(files[0], 'utf-8')
      reader.onload = function () {
        dispatch(setTLE(reader.result))
      }
    }
  }
  
  return(
    <>
      <button onClick={clickInput}
              className='load-button'
      >
        Загрузить TLE
      </button>
      <input ref={inputRef}
             type='file'
             className='load-input'
             onChange={e => loadTLE(e.target)}
      />
    </>
  )
}

export default LoadingTLEButton