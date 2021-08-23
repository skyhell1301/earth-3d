import React, {useEffect, useState} from "react"
import './LoadingView.css'
import {Html} from "@react-three/drei";


function LoadingView() {
  const [curCome, setCurCome] = useState('.')

  function getText() {
    return 'Загрузка' + curCome
  }

  useEffect(() => {
    const massCome =['.', '..', '...']
    let i = 0
    const timer = setInterval(()=>{
      setCurCome(massCome[i])
      i ++
      if(i > 2) i = 0
    },300)
    return function () {
      clearInterval(timer)
    }
  }, []);

  return (
    <Html center>
      <div className='loading__background'>
        <div className="loading__text">
          {getText()}
        </div>
      </div>
    </Html>
  )
}

export default LoadingView