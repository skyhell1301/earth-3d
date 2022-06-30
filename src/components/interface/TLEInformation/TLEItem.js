import React, {useEffect, useState} from 'react';
import tleDescription from '../../../constants/tleNames.json';

const TleItem = ({tlePropertyValue, tlePropertyName}) => {
  const [value, setValue] = useState()

  useEffect(()=> {
    if(typeof tlePropertyValue === typeof new Date()) {
      setValue(tlePropertyValue.toLocaleString())
    } else {
      setValue(tlePropertyValue)
    }
  }, [tlePropertyValue])
  return (
    <div className='tle-params__table-row'>
      <div className='tle-params__table-item'>{tleDescription[tlePropertyName]}</div>
      <div className='tle-params__table-item'>{value ? value : 'Нет информации'}</div>
    </div>
  );
};

export default TleItem;