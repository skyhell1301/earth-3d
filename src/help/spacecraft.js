import * as satellite from "satellite.js";
import {eciToLocalCoordinates, getNormalHeight} from "./coordinatesCalculate";
import * as THREE from "three";
import TLE from "tle";
import {STLLoader} from "three/examples/jsm/loaders/STLLoader";

export async function createSpacecraft(tle, stl) {

  let tleArray = tle.split('\n')
  let tleLine1, tleLine2

  if (tleArray.length > 2) {
    tleLine1 = tleArray[1]
    tleLine2 = tleArray[2]
  } else {
    tleLine1 = tleArray[0]
    tleLine2 = tleArray[1]
  }

  let model = await loadModel(stl)
  model = new THREE.Mesh(model, new THREE.MeshBasicMaterial())

  let satrec = satellite.twoline2satrec(tleLine1, tleLine2)

  let date = new Date()
  let positionAndVelocity = satellite.propagate(satrec, date)
  let positionEci = positionAndVelocity.position

  model.scale.set(0.00003, 0.00003, 0.00003)
  // model.scale.set(0.1, 0.1, 0.1)
  model.position.set(getNormalHeight(positionEci.x), getNormalHeight(positionEci.z), -getNormalHeight(positionEci.y))
  model.lookAt(0, 0, 0)
  model.rotateY(satellite.degreesToRadians(180))
  model.name = 'spacecraft'

  let spacecraft = {
    tle: TLE.parse(tle),
    date: date,
    orbit: createOrbit(satrec, date, TLE.parse(tle).motion),
    spacecraftPoint: createSpacecraftPoint(getSpacecraftPoint(positionEci, date)),
    isOrbitShow: true,
    move: function move(date) {
      this.date = date
      positionAndVelocity = satellite.propagate(satrec, date)
      const localCoordinate = eciToLocalCoordinates(positionAndVelocity.position)
      spacecraft.position.set(getNormalHeight(localCoordinate.x), getNormalHeight(localCoordinate.y), getNormalHeight(localCoordinate.z))

      this.updateSpacecraftPoint(getSpacecraftPoint(localCoordinate, date))

      spacecraft.lookAt(0, 0, 0)
      spacecraft.rotateY(satellite.degreesToRadians(180))
      spacecraft.updateMatrixWorld()
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
  return spacecraft
}

function createOrbit(satrec, date, motion) {
  let minuteForTurn = Math.round(1440 / motion)
  let positionAndVelocity = satellite.propagate(satrec, date)
  let positionEci = positionAndVelocity.position
  let orbitPointsArray = []
  for (let i = 0; i <= minuteForTurn + 1; i = i + 1) {
    positionAndVelocity = satellite.propagate(satrec, addMinutes(date, i))
    positionEci = positionAndVelocity.position
    orbitPointsArray.push(new THREE.Vector3(getNormalHeight(positionEci.x), getNormalHeight(positionEci.z), -getNormalHeight(positionEci.y)))
  }
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 'red'
  });
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(orbitPointsArray)

  return new THREE.Line(lineGeometry, lineMaterial)
}


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
  let b = ecfToEci(satellite.geodeticToEcf(spacecraftLonLatHeight),satellite.gstime(date))
  let pointCoordinates = {}
  pointCoordinates.x = getNormalHeight(b.x)
  pointCoordinates.y = getNormalHeight(b.y)
  pointCoordinates.z = getNormalHeight(b.z)
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