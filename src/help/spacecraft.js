import {MTLLoader} from "three/examples/jsm/loaders/MTLLoader";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import * as satellite from "satellite.js";
import {eciToLocalCoordinates, getNormalHeight} from "./coordinatesCalculate";
import * as THREE from "three";

export async function createSpacecraft(tleLine1, tleLine2, mtl, obj) {

  let model = await loadModel(mtl, obj)
  model.children.forEach(mesh => mesh.name = 'spacecraft')
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
    orbit: createOrbit(satrec, date),
    move: function move(date) {
      positionAndVelocity = satellite.propagate(satrec, date)
      const coordinate = eciToLocalCoordinates(positionAndVelocity.position)
      spacecraft.position.set(getNormalHeight(coordinate.x), getNormalHeight(coordinate.y), getNormalHeight(coordinate.z))
      spacecraft.lookAt(0,0,0)
      spacecraft.rotateY(satellite.degreesToRadians(-90))
    },
  }

  spacecraft.__proto__ = model
  console.log(spacecraft)
  return spacecraft
}

function createOrbit(satrec, date) {
  let positionAndVelocity = satellite.propagate(satrec, date)
  let positionEci = positionAndVelocity.position
  let orbitPointsArray = []
  for (let i = 0; i < 1437; i = i + 1) {
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