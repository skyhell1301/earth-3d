import * as satellite from "satellite.js";
import {eciToLocalCoordinates, getNormalHeight} from "./coordinatesCalculate";
import * as THREE from "three";
import TLE from "tle";
import {STLLoader} from "three/examples/jsm/loaders/STLLoader";

export async function createSpacecraft(tle, stl, date) {

  let model = await loadModel(stl)
  model = new THREE.Mesh(model, new THREE.MeshBasicMaterial())

  let satrec = getSatrec(tle)
  let positionAndVelocity = satellite.propagate(satrec, date)
  let positionEci = positionAndVelocity.position

  model.scale.set(0.00003, 0.00003, 0.00003)
  // model.scale.set(0.1, 0.1, 0.1)
  // model.position.set(getNormalHeight(positionEci.x), getNormalHeight(positionEci.z), -getNormalHeight(positionEci.y))
  // model.lookAt(0, 0, 0)
  // model.rotateY(satellite.degreesToRadians(180))
  model.name = 'spacecraft'

  let spacecraft = {
    tle: TLE.parse(tle),
    date: date,
    satrec: satrec,
    orbit: createOrbit(satrec, date, TLE.parse(tle).motion),
    spacecraftPoint: createSpacecraftPoint(getSpacecraftPoint(eciToLocalCoordinates(positionEci), date)),
    isOrbitShow: false,
    move: function move(date) {
      this.date = date
      positionAndVelocity = satellite.propagate(this.satrec, this.date)
      let ecf = satellite.eciToEcf(positionAndVelocity.position, satellite.gstime(this.date))
      const localCoordinate = eciToLocalCoordinates(ecf)
      spacecraft.position.set(getNormalHeight(localCoordinate.x), getNormalHeight(localCoordinate.y), getNormalHeight(localCoordinate.z))

      this.updateSpacecraftPoint(getSpacecraftPoint(localCoordinate, this.date))
      // this.updateOrbit()
      spacecraft.lookAt(0, 0, 0)
      spacecraft.rotateY(satellite.degreesToRadians(180))
      spacecraft.updateMatrixWorld()
    },
    updateOrbit: function () {
      let minuteForTurn =  1440//Math.round(1440 / motion)
      let positionAndVelocity = satellite.propagate(this.satrec, this.date)
      let positionEci = positionAndVelocity.position
      let orbitPointsArray = []
      for (let i = 0; i <= minuteForTurn + 1; i = i + 1) {
        positionAndVelocity = satellite.propagate(this.satrec, addMinutes(this.date, i))
        positionEci = positionAndVelocity.position
        let positionEcf = satellite.eciToEcf(positionEci, satellite.gstime(addMinutes(this.date, i)))
        positionEcf = eciToLocalCoordinates(positionEcf)
        orbitPointsArray.push(new THREE.Vector3(getNormalHeight(positionEcf.x), getNormalHeight(positionEcf.y), getNormalHeight(positionEcf.z)))
      }
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(orbitPointsArray)
      this.orbit.geometry.copy(lineGeometry)
    },
    updateTLE(tle) {
      this.tle = TLE.parse(tle)
      this.satrec = getSatrec(tle)
      this.updateOrbit()
      console.log(this.date)
      this.move(this.date)
    },
    showOrbit: function () {
      this.orbit.visible = true
      this.isOrbitShow = true
    },
    hideOrbit: function () {
      this.orbit.visible = false
      this.isOrbitShow = false
    },
    updateSpacecraftPoint: function (coordinates) {
      this.spacecraftPoint.position.set(coordinates.x, coordinates.y, coordinates.z)
    }
  }
  spacecraft.__proto__ = model
  spacecraft.hideOrbit()
  spacecraft.move(spacecraft.date)
  return spacecraft
}
/**
 * Создание орбиты спутника
 * @param {[satellite.twoline2satrec]} satrec Инициализированая спутниковая запись
 * @param {[Date]} date Начальное время расчета
 * @param {[Number]} motion Длительность расчета (мин)
 * @return {[Line]} Возвращает объект орбиты типа THREE.Line
 */
function createOrbit(satrec, date, motion) {
  let minuteForTurn =  1440//Math.round(1440 / motion)
  let positionAndVelocity = satellite.propagate(satrec, date)
  let positionEci = positionAndVelocity.position
  let orbitPointsArray = []
  for (let i = 0; i <= minuteForTurn + 1; i = i + 1) {
    positionAndVelocity = satellite.propagate(satrec, addMinutes(date, i))
    positionEci = positionAndVelocity.position
    let positionEcf = satellite.eciToEcf(positionEci, satellite.gstime(addMinutes(date, i)))
    positionEcf = eciToLocalCoordinates(positionEcf)
    orbitPointsArray.push(new THREE.Vector3(getNormalHeight(positionEcf.x), getNormalHeight(positionEcf.y), getNormalHeight(positionEcf.z)))
  }
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 'red'
  });
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(orbitPointsArray)

  return new THREE.Line(lineGeometry, lineMaterial)
}
/**
 * Получение инициализированой спутниковой записи
 * @param {[tle]} tle TLE спутника
 * @return {[satellite.twoline2satrec]} Возвращает инициализированую спутниковую запись
 */
function getSatrec (tle) {
  let tleArray = tle.split('\n')
  let tleLine1, tleLine2

  if (tleArray.length > 2) {
    tleLine1 = tleArray[1]
    tleLine2 = tleArray[2]
  } else {
    tleLine1 = tleArray[0]
    tleLine2 = tleArray[1]
  }
  let satrec = satellite.twoline2satrec(tleLine1, tleLine2)
  return satrec
}

/**
 * Создание подспутниковой точки
 * @param {[tle]} coordinates TLE спутника
 * @return {[satellite.twoline2satrec]} Возвращает инициализированую спутниковую запись
 */
function createSpacecraftPoint(coordinates) {
  let pointGeometry = new THREE.SphereGeometry(0.01)
  let pointMaterial = new THREE.MeshBasicMaterial({color: 'red'})
  let point = new THREE.Mesh(pointGeometry, pointMaterial)
  point.position.set(coordinates.x, coordinates.y, coordinates.z)
  return point
}
function getSpacecraftPoint(spacecraftCoordinates, date) {
  let spacecraftLonLatHeight = satellite.eciToGeodetic(spacecraftCoordinates, satellite.gstime(date))
  spacecraftLonLatHeight.height = 0
  let eci = ecfToEci(satellite.geodeticToEcf(spacecraftLonLatHeight),satellite.gstime(date))
  let pointCoordinates = {}
  pointCoordinates.x = getNormalHeight(eci.x)
  pointCoordinates.y = getNormalHeight(eci.y)
  pointCoordinates.z = getNormalHeight(eci.z)
  return pointCoordinates
}

async function loadModel(stl) {
  return new Promise(function (resolve, reject) {
    let stlLoader = new STLLoader();
    stlLoader.load(stl, resolve, null, reject)
  })
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

export function ecfToEci(ecf, gmst) {
  // ccar.colorado.edu/ASEN5070/handouts/coordsys.doc
  //
  // [X]     [C -S  0][X]
  // [Y]  =  [S  C  0][Y]
  // [Z]eci  [0  0  1][Z]ecf
  //
  const X = (ecf.x * Math.cos(gmst)) - (ecf.y * Math.sin(gmst));
  const Y = (ecf.x * (Math.sin(gmst))) + (ecf.y * Math.cos(gmst));
  const Z = ecf.z;
  return { x: X, y: Y, z: Z };
}