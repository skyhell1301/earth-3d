import {useMemo} from 'react';
import {addZeroToDate} from '../help/date';

export const useDate = (date) => {

  /**
   * Преобразование Date к строковуму значению формата ГГГГ-ММ-ДДТЧЧ:ММ:СС
   * @param {Date} date
   * @returns {string} `${number}-${number}-${number}T${number}:${number}:${number}`}
   */
  const localDateString = useMemo(()=> {
    const year = date.getFullYear()
    const month = addZeroToDate(date.getMonth() + 1)
    const day = addZeroToDate(date.getDate())
    const hour = addZeroToDate(date.getHours())
    const minute = addZeroToDate(date.getMinutes())
    const sec = addZeroToDate(date.getSeconds())
    return `${year}-${month}-${day}T${hour}:${minute}:${sec}`
  }, [date])

  return{localDateString}
}