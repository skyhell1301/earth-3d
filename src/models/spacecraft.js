import * as satellite from 'satellite.js';
import {WGSToTHREECoordinates, getNormalHeight, radToDeg} from '../help/coordinatesCalculate';
import * as THREE from 'three';
import TLE from '../help/tleParser';
import {STLLoader} from 'three/examples/jsm/loaders/STLLoader';

export async function createSpacecraft(tle, stl, date) {
  let model = new THREE.Mesh(await loadModel(stl), new THREE.MeshPhongMaterial({color: 'rgb(121,121,121)'}))
  let satrec = getSatrec(tle)
  let positionAndVelocity = satellite.propagate(satrec, date)
  let positionEci = positionAndVelocity.position

  model.scale.set(0.00003, 0.00003, 0.00003)
  model.name = 'spacecraft'

  const spacecraft = {
    tle: TLE.parse(tle),
    tleString: tle,
    date: date,
    satrec: satrec,
    height: 0, //км
    orbit: createOrbit(),
    orbitPointsArray: [],
    spacecraftPoint: createSpacecraftPoint(getSpacecraftPointCoordinates(WGSToTHREECoordinates(positionEci), date)),
    lonAndLat: {},
    eci_coord: {},
    ecf_coord: {},
    motionVector: {},
    direction: new THREE.Vector3(),
    currentScannerProjection: {
      left: new THREE.Vector3(),
      right: new THREE.Vector3()
    },
    deviationBandProjection: {
      left: new THREE.Vector3(),
      right: new THREE.Vector3(),
      center: new THREE.Vector3()
    },
    orientationEdges: {
      roll: 0, //крен (ось Y) в градусах
      yaw: 0, //рысканье (ось Z) в градусах
      pitch: 0 //тангаж (ось X) в градусах
    },
    isOrbitShow: false,
    move: function move(date) {
      this.date = date
      positionAndVelocity = satellite.propagate(this.satrec, this.date)
      this.eci_coord = positionAndVelocity.position
      this.ecf_coord = satellite.eciToEcf(positionAndVelocity.position, satellite.gstime(this.date))

      let geodetic = satellite.eciToGeodetic(this.eci_coord, satellite.gstime(this.date))
      let lonAndLat = {}
      lonAndLat.x = radToDeg(geodetic.longitude)
      lonAndLat.y = radToDeg(geodetic.latitude)
      this.height = geodetic.height
      this.lonAndLat = lonAndLat

      const threeCoordinate = WGSToTHREECoordinates(this.ecf_coord)
      this.position.set(getNormalHeight(threeCoordinate.x), getNormalHeight(threeCoordinate.y), getNormalHeight(threeCoordinate.z))

      this.updateSpacecraftPoint(getSpacecraftPointCoordinates(threeCoordinate, this.date))

      this.updateMotionVector()

      spacecraft.up.set(this.motionVector.ecfNormal.x, this.motionVector.ecfNormal.y, this.motionVector.ecfNormal.z)
      const quaternion = new THREE.Quaternion();
      let matrix = new THREE.Matrix4()

      matrix.lookAt(this.spacecraftPoint.position, this.position, this.up)
      quaternion.setFromRotationMatrix(matrix)
      this.quaternion.rotateTowards(quaternion, 5)

      this.updateDeviationBand()

      this.rotateX(satellite.degreesToRadians(this.orientationEdges.pitch))
      this.rotateY(satellite.degreesToRadians(this.orientationEdges.roll))
      this.rotateZ(satellite.degreesToRadians(this.orientationEdges.yaw))

      this.updateCurrentObzorBand()

      this.updateMatrixWorld()
    },
    updateDeviationBand: function () {
      let clone = this.clone()
      let edge_rad = satellite.degreesToRadians(45)

      clone.getWorldDirection(this.deviationBandProjection.center)

      clone.rotateY(edge_rad)
      clone.getWorldDirection(this.deviationBandProjection.left)

      clone.rotateY(-2 * edge_rad)
      clone.getWorldDirection(this.deviationBandProjection.right)
    },
    updateCurrentObzorBand: function () {
      let clone = this.clone()

      let Obzor_rad = 0.02359562
      let widthEdge_rad = Obzor_rad / 2

      clone.rotateY(widthEdge_rad)
      clone.getWorldDirection(this.currentScannerProjection.left)

      clone.rotateY(-2 * widthEdge_rad)
      clone.getWorldDirection(this.currentScannerProjection.right)
    },
    updateOrientationEdges: function (edges) {
      this.orientationEdges = edges
      this.move(this.date)
    },
    updateOrbit: function () {
      let minuteForTurn = 1440 * 60 / 4//Math.round(1440 / motion)
      let positionAndVelocity
      let orbitPointsMeshArray = []
      let orbitPointsLonLatArray = []
      for (let i = 0; i <= minuteForTurn; i = i + 1) {
        let newDate = addSeconds(this.date, i)
        positionAndVelocity = satellite.propagate(this.satrec, newDate)
        let ecf = satellite.eciToEcf(positionAndVelocity.position, satellite.gstime(newDate))
        let geodetic = satellite.eciToGeodetic(positionAndVelocity.position, satellite.gstime(newDate))

        let lonAndLat = [0, 0]
        lonAndLat[0] = radToDeg(geodetic.longitude)
        lonAndLat[1] = radToDeg(geodetic.latitude)

        const threeCoordinate = WGSToTHREECoordinates(ecf)
        orbitPointsMeshArray.push(new THREE.Vector3(getNormalHeight(threeCoordinate.x), getNormalHeight(threeCoordinate.y), getNormalHeight(threeCoordinate.z)))
        orbitPointsLonLatArray.push(lonAndLat)
      }
      this.orbitPointsArray = orbitPointsLonLatArray
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(orbitPointsMeshArray)
      this.orbit.geometry.copy(lineGeometry)
    },
    updateMotionVector: function () {
      const newDate = addMinutes(this.date, 1)
      this.motionVector.eci = satellite.propagate(this.satrec, newDate).position
      this.motionVector.ecf = satellite.eciToEcf(this.motionVector.eci, satellite.gstime(newDate))
      this.motionVector.ecfThree = WGSToTHREECoordinates(this.motionVector.ecf)
      this.motionVector.eciThree = WGSToTHREECoordinates(this.motionVector.eci)
      this.motionVector.ecfNormal = new THREE.Vector3(
        getNormalHeight(this.motionVector.ecfThree.x),
        getNormalHeight(this.motionVector.ecfThree.y),
        getNormalHeight(this.motionVector.ecfThree.z)
      )
      this.motionVector.eciNormal = new THREE.Vector3(
        getNormalHeight(this.motionVector.eciThree.x),
        getNormalHeight(this.motionVector.eciThree.y),
        getNormalHeight(this.motionVector.eciThree.z)
      )
    },
    updateTLE(tle) {
      this.tle = TLE.parse(tle)
      this.satrec = getSatrec(tle)
      this.move(this.date)
      this.updateOrbit()
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
  spacecraft.matrixWorldNeedsUpdate = true
  // spacecraft.hideOrbit()
  spacecraft.move(spacecraft.date)
  spacecraft.updateOrbit()
  return spacecraft
}

/**
 * Создание орбиты спутника
 * @return {THREE.Line} Возвращает объект орбиты типа THREE.Line
 */
export function createOrbit() {
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 'rgb(85,28,131)',
    linewidth: 2
  });
  const lineGeometry = new THREE.BufferGeometry()

  return new THREE.Line(lineGeometry, lineMaterial)
}

/**
 * Получение инициализированой спутниковой записи
 * @param {[tle]} tle TLE спутника
 * @return Возвращает инициализированую спутниковую запись
 */
function getSatrec(tle) {
  let tleArray = tle.split('\n')
  let tleLine1, tleLine2

  if (tleArray.length > 2) {
    tleLine1 = tleArray[1]
    tleLine2 = tleArray[2]
  } else {
    tleLine1 = tleArray[0]
    tleLine2 = tleArray[1]
  }
  return satellite.twoline2satrec(tleLine1, tleLine2)
}

/**
 * Создание подспутниковой точки
 * @param {{Координаты}} coordinates TLE спутника
 * @return {THREE.Mesh} Возвращает инициализированую спутниковую запись
 */
function createSpacecraftPoint(coordinates) {
  let pointGeometry = new THREE.SphereGeometry(0.006)
  let pointMaterial = new THREE.MeshBasicMaterial({color: 'blue'})
  let point = new THREE.Mesh(pointGeometry, pointMaterial)
  point.position.set(coordinates.x, coordinates.y, coordinates.z)
  return point
}

/**
 * Получение нормированных координат подспутниковой точки
 * @param spacecraftCoordinates - координаты КА
 * @param date - дата расчета
 * @return {{Координаты}}
 */
function getSpacecraftPointCoordinates(spacecraftCoordinates, date) {
  let geo = satellite.eciToGeodetic(spacecraftCoordinates, satellite.gstime(date))
  geo.height = 0

  let eci = ecfToEci(satellite.geodeticToEcf(geo), satellite.gstime(date))
  let pointCoordinates = {}
  pointCoordinates.x = getNormalHeight(eci.x)
  pointCoordinates.y = getNormalHeight(eci.y)
  pointCoordinates.z = getNormalHeight(eci.z)
  return pointCoordinates
}

/**
 * Загрузка модели
 * @param stl - модель в формате STL
 */
async function loadModel(stl) {
  return await new Promise(function (resolve, reject) {
    let stlLoader = new STLLoader();
    stlLoader.load(stl, resolve, null, reject)
  })
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

function addSeconds(date, sec) {
  return new Date(date.getTime() + sec * 1000);
}

/**
 * Перевод координат из ECF в ECI
 * @param ecf - координаты
 * @param gmst
 * @return {{x: number, y: number, z: number}}
 */
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
  return {x: X, y: Y, z: Z};
}