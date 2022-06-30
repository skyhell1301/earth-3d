import React from 'react';
import './ZSList.css'
import cancel from '../../../assets/img/svg/cancel.svg';

const ZsItem = ({zs, deleteZS}) => {
  return (
    <div key={zs.name} className='zs-information__row'>
      <div className='zs-information__item' title={`Долгота: ${zs.longitude}, широта: ${zs.latitude}`}>{zs.name}</div>
      <div className='zs-information__item item-value'>{zs.longitude}</div>
      <div className='zs-information__item item-value'>{zs.latitude}</div>
      <div className='zs-information__item-button'>
        <button onClick={() => deleteZS(zs.name)}>
          <img src={cancel} alt=''/>
        </button>
      </div>
    </div>
  );
};

export default ZsItem;