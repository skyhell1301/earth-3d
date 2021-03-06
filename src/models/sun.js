import {degToRad} from 'three/src/math/MathUtils';
import * as THREE from 'three';
import {WGSToTHREECoordinates, getNormalHeight, radToDeg} from '../help/coordinatesCalculate';
import * as satellite from 'satellite.js';

/**
 * Расчет координат Солнца в гринвической системе координат
 * @param date - Дата расчета
 * @return {{x: number, y: number, z: number}} - Возвращает объет с координатами (в км)
 */
export function getSunCoordinates(date) {
  //  UT – всемирное время в часах
  const UT = date.getUTCHours() + (date.getUTCMinutes() / 60) + (date.getUTCSeconds() / 3600)
  // Вычисление модифицированной юлианской даты дня расчета.
  // let MD = 367 * date.getFullYear() - Math.floor(7 * (Math.floor((date.getMonth() + 9) / 12)) / 4) + Math.floor(275 * (date.getMonth() + 1) / 9) + date.getDate() - 678987
  const MD = 367 * date.getUTCFullYear() - Math.trunc(7 * (date.getUTCFullYear() + (Math.trunc((date.getUTCMonth() + 1 + 9) / 12))) / 4)
    + Math.trunc(275 * (date.getUTCMonth() + 1) / 9) + date.getUTCDate() - 678987

  // Вычисление единичного геоцентрического вектора Солнца (X,Y,Z) на дату MD и время UT в эклиптической системе координат.
  const T = (MD - 51544.5) / 36525
  const W = 357.528 + 35999.05 * T + 0.04107 * UT
  const L = 280.46 + 36000.772 * T + 0.04107 * UT + (1.915 - 0.0048 * T) * Math.sin(degToRad(W)) + 0.02 * Math.sin(2 * degToRad(W))

  const X = Math.cos(degToRad(L))
  const Y = Math.sin(degToRad(L))
  const Z = 0

  // Вычисление вектора Солнца (Xe,Ye,Ze) в экваториальной системе координат.
  const E2 = 84381.488 - 46.815 * T - 0.00059 * (T ** 2) + 0.001813 * (T ** 3)
  const E = E2 / 3600

  const Xe = X
  const Ye = Y * Math.cos(degToRad(E)) - Z * Math.sin(degToRad(E))
  const Ze = Y * Math.sin(degToRad(E)) + Z * Math.cos(degToRad(E))

  // Вычисление среднего звездного времени на дату MD и время UT.
  const S0 = 24110.54841 + 8640184 * T + 0.093104 * (T ** 2) - 0.0000062 * (T ** 3) // звездное гринвичевское время в полночь в секундах
  const w = 1.002737909350795
  const dT = UT / 24 * 86400 * w
  const Ss = S0 + dT // звездное время в секундах
  const S = Ss / 240 // Звездное время в градусах

  // Перевод вектора Солнца в гринвическую систему координат.
  const Xg = Xe * Math.cos(degToRad(S)) + Ye * Math.sin(degToRad(S))
  const Yg = -Xe * Math.sin(degToRad(S)) + Ye * Math.cos(degToRad(S))
  const Zg = Ze

  return {x: Xg, y: Yg, z: Zg}
}

/**
 * Расчет массива координат точек линии терменатора с шагом 1 градус
 * @param {longitude, latitude} - Геодезическая долгота и широта подсолнечной точки (град)
 * @return {[Vector3]} Возвращает массив координат точек линии терминатора
 */
export function getTerminatorArray({longitude, latitude}) {
  const array = []
  let lon = -180
  // Для четкого терминатора необходимо расчитывать точки с шагом 0.001
  for (lon; lon < 180; lon += 1) {
    const ecf = satellite.geodeticToEcf({
      longitude: degToRad(lon),
      latitude: degToRad((180 / Math.PI) * Math.atan(-(Math.cos(degToRad(lon) - degToRad(longitude)) / Math.tan(degToRad(latitude))))),
      height: 30
    })
    ecf.x = getNormalHeight(ecf.x)
    ecf.y = getNormalHeight(ecf.y)
    ecf.z = getNormalHeight(ecf.z)
    array.push(new THREE.Vector3(ecf.x, ecf.y, ecf.z))
  }
  array.push(array[0])
  return array
}

/**
 * Создание объекта Солнце
 * @param date Дата расчета
 * @return {THREE.DirectionalLight} Возвращает объет класса THREE.DirectionalLight
 */
export function createSun(date) {
  const Sun = new THREE.DirectionalLight(0xFFFFE1, 0.7)
  Sun.point = new THREE.Mesh(new THREE.SphereGeometry(0.02), new THREE.MeshBasicMaterial({color: 'yellow'}))
  Sun.geoCoordinate = {}
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 'orange',
    linewidth: 2
  })
  Sun.terminator = null
  Sun.updateTerminator = function () {
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(getTerminatorArray(Sun.geoCoordinate))
    if (this.terminator) {
      this.terminator.geometry.copy(lineGeometry)
    } else {
      this.terminator = new THREE.Line(lineGeometry, lineMaterial)
    }

  }
  Sun.move = function (date) {
    const coordinates = WGSToTHREECoordinates(getSunCoordinates(date))
    const geo = {
      height: 1e6,
      latitude: Math.atan2(coordinates.z, Math.sqrt(coordinates.x ** 2 + coordinates.y ** 2)),
      longitude: Math.atan2(coordinates.y, coordinates.x)
    }
    const ecf = satellite.geodeticToEcf(geo)
    this.geoCoordinate = {height: 1000000, latitude: radToDeg(geo.latitude), longitude: radToDeg(geo.longitude)}
    this.position.set(getNormalHeight(ecf.x), getNormalHeight(ecf.y), getNormalHeight(ecf.z))

    const geoPoint = {height: 0, latitude: geo.latitude, longitude: geo.longitude}
    const ecfPoint = satellite.geodeticToEcf(geoPoint)
    this.point.position.set(getNormalHeight(ecfPoint.x), getNormalHeight(ecfPoint.y), getNormalHeight(ecfPoint.z))
    this.updateTerminator()
  }
  Sun.move(date)
  Sun.castShadow = true;

  return Sun
}

