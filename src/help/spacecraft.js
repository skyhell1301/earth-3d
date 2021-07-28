import {MTLLoader} from "three/examples/jsm/loaders/MTLLoader";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import * as satellite from "satellite.js";
import {eciToLocalCoordinates, getNormalHeight} from "./coordinatesCalculate";
import * as THREE from "three";
import TLE from "tle";

export async function createSpacecraft(tle, mtl, obj) {

  let tleArray = tle.split('\n')
  let tleLine1, tleLine2

  if(tleArray.length > 2) {
    tleLine1 = tleArray[1]
    tleLine2 = tleArray[2]
  } else {
    tleLine1 = tleArray[0]
    tleLine2 = tleArray[1]
  }

  let model = await loadModel(mtl, obj)
  let satrec = satellite.twoline2satrec(tleLine1, tleLine2)

  let date = new Date()
  let positionAndVelocity = satellite.propagate(satrec, date)
  let positionEci = positionAndVelocity.position

  model.scale.set(0.008, 0.008, 0.008)
  // model.scale.set(0.1, 0.1, 0.1)
  model.position.set(getNormalHeight(positionEci.x), getNormalHeight(positionEci.z), -getNormalHeight(positionEci.y))
  model.lookAt(0, 0, 0)
  model.name = 'spacecraft'
  model.rotateY(satellite.degreesToRadians(-90))

  let spacecraft = {
    tle: TLE.parse(tle),
    date: date,
    orbit: createOrbit(satrec, date, TLE.parse(tle).motion),
    isOrbitShow: true,
    move: function move(date) {
      this.date = date
      positionAndVelocity = satellite.propagate(satrec, date)
      const coordinate = eciToLocalCoordinates(positionAndVelocity.position)
      spacecraft.position.set(getNormalHeight(coordinate.x), getNormalHeight(coordinate.y), getNormalHeight(coordinate.z))
      spacecraft.lookAt(0,0,0)
      spacecraft.rotateY(satellite.degreesToRadians(-90))
      spacecraft.updateMatrixWorld()
    },
    showOrbit: function showOrbit() {
      this.orbit.visible = true
      this.isOrbitShow = true
    },
    hideOrbit: function hideOrbit() {
      this.orbit.visible = false
      this.isOrbitShow = false
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
  for (let i = 0; i <= minuteForTurn; i = i + 1) {
    positionAndVelocity = satellite.propagate(satrec, addMinutes(date, i))
    positionEci = positionAndVelocity.position
    orbitPointsArray.push(new THREE.Vector3(getNormalHeight(positionEci.x), getNormalHeight(positionEci.z), -getNormalHeight(positionEci.y)))
  }
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 'red'
  });
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(orbitPointsArray)

  return  new THREE.Line(lineGeometry, lineMaterial)
}

async function loadModel(mtl, obj) {
  return new Promise(function (resolve, reject) {

    let mtlLoader = new MTLLoader();

    mtlLoader.load(mtl, function (materials) {

      materials.preload();

      let objLoader = new OBJLoader();

      // objLoader.setMaterials(materials);
      objLoader.load(obj, resolve, null, reject);

    }, null, reject);

  });
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}