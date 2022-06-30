import * as THREE from "three";

export function createAxes() {
  const Xdir = new THREE.Vector3(1, 0, 0);
  const Ydir = new THREE.Vector3(0, 1, 0);
  const Zdir = new THREE.Vector3(0, 0, 1);
  Xdir.normalize();
  Ydir.normalize();
  Zdir.normalize();

  const origin = new THREE.Vector3(0, 0, 0);
  const length = 1.5;

  const axisX = new THREE.ArrowHelper(Xdir, origin, length, 'blue');
  const axisY = new THREE.ArrowHelper(Ydir, origin, length, 'yellow');
  const axisZ = new THREE.ArrowHelper(Zdir, origin, length, 'green');

  const axisGroup = new THREE.Group()
  axisGroup.add(axisX)
  axisGroup.add(axisY)
  axisGroup.add(axisZ)

  return axisGroup
}

export function  createGrid() {
  const gridSize = 5;
  const gridDivisions = 20;

  return new THREE.GridHelper(gridSize, gridDivisions);
}