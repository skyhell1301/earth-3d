/**
 * Добавление нуля, если число однозначное
 * @param number
 * @returns {string|*}
 */
export const addZeroToDate = (number) => {
  return number < 10 ? '0' + number : number
}
