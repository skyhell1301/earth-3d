import React from 'react';
import TLEParams from './TLEInformation/TLEParams';
import StateViewButton from './StateViewButton/StateViewButton';
import ControlPanel from './ContorlPanel/ControlPanel';
import DateInformation from './DateInformation/DateInformation';
import Logo from './Logo/Logo';
import ZSList from './EarthStationsInformation/ZSList';

const Interface = () => {
  return (
    <div>
      <TLEParams/>
      <div className='control-container'>
        <StateViewButton/>
        <ControlPanel/>
      </div>
      <DateInformation/>
      <Logo/>
      <ZSList/>
    </div>
  )
}

export default Interface;