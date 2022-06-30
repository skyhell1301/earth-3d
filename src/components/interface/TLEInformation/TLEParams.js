import React, {useEffect, useState} from 'react';
import './TLEParams.css'
import {useSelector} from 'react-redux';
import upArrow from '../../../assets/img/svg/up-arrow.svg'
import TLE from '../../../help/tleParser';
import LoadingTLEButton from './LoadingTLEButton'
import TleItem from './TLEItem';

function TLEParams() {

  const [isOpen, setIsOpen] = useState(false)
  const tleString = useSelector(state => state.spacecraft.tle)
  const [tle, setTle] = useState(null)

  useEffect(() => {
    setTle(TLE.parse(tleString))
  }, [tleString])

  function getTLEDate() {
    if (!isOpen) return null
    return (
      <div className='tle-params__table'>
        {
          tle && Object.keys(tle).map((k, i) => <TleItem key={i} tlePropertyValue={tle[k]} tlePropertyName={k}/>)
        }
      </div>
    )
  }

  return (
    <div className='tle-params-container'>
      <div className='tle-params__title'>
        <div onClick={() => setIsOpen(!isOpen)} className='tle-params__open-tle'>
          <div>TLE</div>
          <img alt='' className='tle-params__open-tle-button' src={upArrow}
               style={!isOpen ? {transform: 'rotateX(180deg)'} : null}/>
        </div>
      </div>
      {getTLEDate()}
      <LoadingTLEButton/>
    </div>
  )
}

export default TLEParams