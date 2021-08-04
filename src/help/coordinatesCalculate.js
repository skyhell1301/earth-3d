export const getXYZCoordinates = XYCoordinates => {
  const h = 20
  const x = XYCoordinates[0] * Math.PI / 180 //долгота в радианах
  const y = XYCoordinates[1] * Math.PI / 180 //широта в радианах
  const earthEquatorRadius = 6378.137 //экваториальный радиус
  const earthPolarRadius = 6356.863 //полярный радиус
  const earthEquatorRadiusN = 1 //экваториальный радиус нормированный
  const f = (earthEquatorRadius - earthPolarRadius) / earthEquatorRadius
  const e2 = f * (2 - f) //первый эксцентриситет
  const N1 = earthEquatorRadiusN / Math.sqrt(1 - (e2 * (Math.sin(y) ** 2))) //радиус кривизны первого вертикаля

  const X = (N1 + h) * Math.cos(x) * Math.cos(y)
  const Y = (N1 + h - (e2 * N1)) * Math.sin(y)
  const Z = -((N1 + h) * Math.sin(x) * Math.cos(y))

  return [X, Y, Z]
}

export const getNormalHeight = height => {
  return height / 6378.137
}

export const eciToLocalCoordinates = eci => {
  let local = {}
  local.x = eci.x
  local.y = eci.z
  local.z = -eci.y
  return local
}
export const localToEciCoordinates = local => {
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