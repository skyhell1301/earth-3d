import {degToRad, radToDeg} from "three/src/math/MathUtils";
import * as THREE from "three";
import {eciToLocalCoordinates, getNormalHeight} from "./coordinatesCalculate";
import * as satellite from "satellite.js";
import {ecfToEci} from "./spacecraft";

export function getSunCoordinates(date) {
  //  UT – всемирное время в часах
  let UT = date.getHours() + (date.getMinutes() / 60) + (date.getSeconds() / 3600)
  // Вычисление модифицированной юлианской даты дня расчета.
  let MD = 367 * date.getFullYear() - Math.floor(7 * (Math.floor((date.getMonth() + 9) / 12)) / 4) + Math.floor(275 * (date.getMonth() + 1) / 9) + date.getDate() - 678987

  // Вычисление единичного геоцентрического вектора Солнца (X,Y,Z) на дату MD и время UT в эклиптической системе координат.
  let T = (MD - 51544.5) / 36525
  let W = 357.528 + 35999.05 * T + 0.04107 * UT
  let L = 280.46 + 36000.772 * T + 0.04107 * UT + (1.915 - 0.0048 * T) * Math.sin(degToRad(W)) + 0.02 * Math.sin(2 * degToRad(W))

  let X = Math.cos(degToRad(L))
  let Y = Math.sin(degToRad(L))
  let Z = 0

  // Вычисление вектора Солнца (X,Y,Z) в экваториальной системе координат.
  let E2 = 84381.488 - 46.815 * T - 0.00059 * (T**2) + 0.001813 * (T**3)
  let E = E2 / 3600

  let Xe = X
  let Ye = Y * Math.cos(degToRad(E)) - Z * Math.sin(degToRad(E))
  let Ze = Y * Math.sin(degToRad(E)) - Z * Math.cos(degToRad(E))

  // Вычисление среднего звездного времени на дату MD и время UT.
  let S0 = 24110.54841 + 8640184 * T + 0.093104 * (T**2) - 0.0000062 * (T**3) // звездное гринвичевское время в полночь в секундах
  let w = 1.002737909350795
  let dT = UT / 24 * 86400 * w
  let Ss = S0 + dT // звездное время в секундах
  let S = Ss / 240 // Звездное время в градусах

  // Перевод вектора Солнца в гринвическую систему координат.
  let Xg = Xe * Math.cos(degToRad(S)) + Ye * Math.sin(degToRad(S))
  let Yg = -Xe * Math.sin(degToRad(S)) + Ye * Math.cos(degToRad(S))
  let Zg = Ze

  return {x:Xg, y: Yg, z: Zg}
}
export function createSun(date) {
  let Sun = new THREE.DirectionalLight(0xffffff, 0.85)
  Sun.point = new THREE.Mesh(new THREE.SphereGeometry(0.02), new THREE.MeshBasicMaterial({color: 'yellow'}))
  Sun.move = function (date) {
    let coordinates = eciToLocalCoordinates(getSunCoordinates(date))
    let geo = {height: 1000000, latitude: Math.atan2(coordinates.z, Math.sqrt(coordinates.x**2 + coordinates.y**2)), longitude: Math.atan2(coordinates.y, coordinates.x)}
    let ecf = satellite.geodeticToEcf(geo)
    this.position.set(getNormalHeight(ecf.x), getNormalHeight(ecf.y), getNormalHeight(ecf.z))

    let geoPoint = {height: 0, latitude: geo.latitude, longitude: geo.longitude}
    let ecfPoint = satellite.geodeticToEcf(geoPoint)
    this.point.position.set(getNormalHeight(ecfPoint.x), getNormalHeight(ecfPoint.y), getNormalHeight(ecfPoint.z))
  }

  Sun.move(date)
  Sun.castShadow = true;


  return Sun
}

