import * as satellite from "satellite.js";
import {WGSToTHREECoordinates, getNormalHeight, radToDeg} from "./coordinatesCalculate";
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
    tleString: tle,
    date: date,
    satrec: satrec,
    height: 0, //км
    orbit: createOrbit(satrec, date, TLE.parse(tle).motion),
    orbitPointsArray: [],
    spacecraftPoint: createSpacecraftPoint(getSpacecraftPointCoordinates(WGSToTHREECoordinates(positionEci), date)),
    lonAndLat: {},
    eci_coord: {},
    ecf_coord: {},
    motionVector: {},
    direction: new THREE.Vector3(),
    scannerProjection: {
      topRight: new THREE.Vector3(),
      topLeft: new THREE.Vector3(),
      topMid: new THREE.Vector3(),
      downLeft: new THREE.Vector3(),
      downRight: new THREE.Vector3(),
      downMid: new THREE.Vector3(),
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

      this.updateMotionVector()

      this.updateSpacecraftPoint(getSpacecraftPointCoordinates(threeCoordinate, this.date))
      spacecraft.up.set(this.motionVector.ecfNormal.x, this.motionVector.ecfNormal.y, this.motionVector.ecfNormal.z)

      // this.updateOrbit()
      const quaternion = new THREE.Quaternion();
      let matrix = new THREE.Matrix4()

      matrix.lookAt(this.spacecraftPoint.position, this.position, this.up)
      quaternion.setFromRotationMatrix(matrix)
      this.quaternion.rotateTowards(quaternion, 5)

      // this.rotateZ(satellite.degreesToRadians(45))


      let clone = this.clone()

      let Obzor_rad = 0.02359562
      let widthEdge = Obzor_rad  / 2
      let widthEdge_rad = satellite.degreesToRadians(45) + widthEdge
      let heightEdge_deg = 1

      //down left
      clone.rotateY(widthEdge_rad)
      clone.rotateX(satellite.degreesToRadians(heightEdge_deg))
      clone.getWorldDirection(this.scannerProjection.downLeft)

      //top left
      clone.rotateX(satellite.degreesToRadians(-2 * heightEdge_deg))
      clone.getWorldDirection(this.scannerProjection.topLeft)


      //top mid
      clone.rotateX(satellite.degreesToRadians(heightEdge_deg))
      clone.rotateY(-widthEdge_rad)
      clone.rotateX(satellite.degreesToRadians(-heightEdge_deg))
      clone.getWorldDirection(this.scannerProjection.topMid)

      //down mid
      clone.rotateX(satellite.degreesToRadians(2 * heightEdge_deg))
      clone.getWorldDirection(this.scannerProjection.downMid)

      //down right
      clone.rotateX(satellite.degreesToRadians(-heightEdge_deg))
      clone.rotateY(-widthEdge_rad)
      clone.rotateX(satellite.degreesToRadians(heightEdge_deg))
      clone.getWorldDirection(this.scannerProjection.downRight)

      //top right
      clone.rotateX(satellite.degreesToRadians(-2 * heightEdge_deg))
      clone.getWorldDirection(this.scannerProjection.topRight)

      clone.getWorldDirection(this.direction)
      this.updateMatrixWorld()
    },
    updateOrbit: function () {
      let minuteForTurn = 1440 * 60 / 4//Math.round(1440 / motion)
      let positionAndVelocity
      let orbitPointsMeshArray = []
      let orbitPointsLonLatArray = []
      for (let i = 0; i <= minuteForTurn + 1; i = i + 1) {
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
  spacecraft.hideOrbit()
  spacecraft.move(spacecraft.date)
  spacecraft.updateOrbit()
  return spacecraft
}

/**
 * Создание орбиты спутника
 * @return {[Line]} Возвращает объект орбиты типа THREE.Line
 */
function createOrbit() {
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 'red'
  });
  const lineGeometry = new THREE.BufferGeometry()

  return new THREE.Line(lineGeometry, lineMaterial)
}

/**
 * Получение инициализированой спутниковой записи
 * @param {[tle]} tle TLE спутника
 * @return {[satellite.twoline2satrec]} Возвращает инициализированую спутниковую запись
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
  let satrec = satellite.twoline2satrec(tleLine1, tleLine2)
  return satrec
}

/**
 * Создание подспутниковой точки
 * @param {[tle]} coordinates TLE спутника
 * @return {[satellite.twoline2satrec]} Возвращает инициализированую спутниковую запись
 */
function createSpacecraftPoint(coordinates) {
  let pointGeometry = new THREE.SphereGeometry(0.008)
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
  let spacecraftLonLatHeight = satellite.eciToGeodetic(spacecraftCoordinates, satellite.gstime(date))
  spacecraftLonLatHeight.height = 0
  let eci = ecfToEci(satellite.geodeticToEcf(spacecraftLonLatHeight), satellite.gstime(date))
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

function addSeconds(date, sec) {
  return new Date(date.getTime() + sec * 1000);
}

/**
 * Перевод координат из ECF в ECI
 * @param ecf - координаты
 * @param gmst
 * @return {{x: number, y: number, z}}
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