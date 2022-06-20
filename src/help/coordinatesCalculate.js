/**
 * Пересчет из географических координат в трехмерные
 * @param XYCoordinates - [[долгота, широта]}
 * @returns {[X,Y,Z]}
 */
export const getXYZCoordinates = XYCoordinates => {

  const earthEquatorRadius = 6378.137 //экваториальный радиус
  const earthPolarRadius = 6356.863 //полярный радиус

  const h = 20
  const x = XYCoordinates[0] * Math.PI / 180 //долгота в радианах
  const y = XYCoordinates[1] * Math.PI / 180 //широта в радианах

  const earthEquatorRadiusN = 1 //экваториальный радиус нормированный
  const f = (earthEquatorRadius - earthPolarRadius) / earthEquatorRadius
  const e2 = f * (2 - f) //первый эксцентриситет
  const N1 = earthEquatorRadiusN / Math.sqrt(1 - (e2 * (Math.sin(y) ** 2))) //радиус кривизны первого вертикаля

  const X = (N1 + h) * Math.cos(x) * Math.cos(y)
  const Y = (N1 + h - (e2 * N1)) * Math.sin(y)
  const Z = -((N1 + h) * Math.sin(x) * Math.cos(y))

  return [X, Y, Z]
}

/**
 * Получение нормированной высоты (относительно центра земли)
 * @param height высота (км)
 * @returns нормировання высота {number}
 */
export const getNormalHeight = height => {
  return height / 6378.137
}

/**
 * Получение реальной высоты (км)
 * @param height нормировання высота
 * @returns {number} реальная высота (км)
 */
export const normalToRealHeight = height => {
  return height * 6378.137
}

/**
 * Пересчет из реальных координат в нормированные
 * @param real координаты {x,y,z}
 * @returns нормированные координаты {x,y,z}
 */
export const realToNormalCoordinates = real => {
  let normal = {}
  normal.x = getNormalHeight(real.x)
  normal.y = getNormalHeight(real.y)
  normal.z = getNormalHeight(real.z)
  return normal
}

/**
 * Пересчет из нормированных координат в реальные
 * @param normal нормированные координаты {x,y,z}
 * @returns координаты {x,y,z}
 */
export const normalToRealCoordinates = normal => {
  let real = {}
  real.x = normalToRealHeight(normal.x)
  real.y = normalToRealHeight(normal.y)
  real.z = normalToRealHeight(normal.z)
  return real
}

/**
 * Пересчет из WGS координат в координаты движка THREE
 * @param eci WGS координаты {x,y,x}
 * @returns {{x,y,z}} THREE координаты
 */
export const WGSToTHREECoordinates = eci => {
  let local = {}
  local.x = eci.x
  local.y = eci.z
  local.z = -eci.y
  return local
}

/**
 * Пересчет из координат движка THREE в WGS координаты
 * @param local THREE координаты {x,y,x}
 * @returns {{x,y,z}} WGS координаты
 */
export const THREEToWGSCoordinates = local => {
  let eci = {}
  eci.x = local.x
  eci.y = -local.z
  eci.z = local.y
  return eci
}

export function degToRad(deg) {
  return deg * Math.PI / 180
}

export function radToDeg(rad) {
  return rad * 180 / Math.PI
}