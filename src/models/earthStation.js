import {degreesToRadians} from 'satellite.js';
import * as satellite from 'satellite.js'
import {getNormalHeight, WGSToTHREECoordinates} from '../help/coordinatesCalculate';
import * as THREE from 'three';

export default function calculateZSRadius(LonStation = 37.378847, LatStation = 55.558741, edge = 5, orbitHeight = 500) {
  const Re = 6378.137  //Радиус Земли (км)

  const edge_rad = edge * Math.PI / 180 //рад (0,087266463)

  const B = Math.acos(Re * Math.cos(edge_rad) / (orbitHeight + Re)) - edge_rad //угол (рад)

  const zoneRadius = 2 * Re * Math.sin(B / 2)

  LatStation = LatStation / 180 * Math.PI // Широта ЗС (рад)
  LonStation = LonStation / 180 * Math.PI // Долгота ЗС (рад)
  const theta = zoneRadius / Re

  let coordinates = []

  for (let fi = -90; fi < 90; fi = fi + 0.01) {
    let coordinate = {}
    const lon = LonStation + Math.acos((Math.cos(theta) - Math.sin(fi * Math.PI / 180) * Math.sin(LatStation))
      / (Math.cos(fi * Math.PI / 180) * Math.cos(LatStation)))
    if (lon) {
      coordinate.latitude = fi
      coordinate.longitude = lon * 180 / Math.PI
      coordinates.push([coordinate.longitude, coordinate.latitude])
    }
  }
  for (let fi = 90; fi > -90; fi = fi - 0.01) {
    let coordinate = {}
    const lon = LonStation - Math.acos((Math.cos(theta) - Math.sin(fi * Math.PI / 180) * Math.sin(LatStation))
      / (Math.cos(fi * Math.PI / 180) * Math.cos(LatStation)))
    if (lon) {
      coordinate.latitude = fi
      coordinate.longitude = lon * 180 / Math.PI
      coordinates.push([coordinate.longitude, coordinate.latitude])
    }
  }
  return coordinates
}
/**
 * Пересчет зоны радиовидимости в вектора
 * @param array
 * @returns {THREE.Vector3[]}
 */
export const generateZsZone = (array) => {
  const zoneArray = array.map(coordinate => {
    let ecf = satellite.geodeticToEcf({
      longitude: degreesToRadians(coordinate[0]),
      latitude: degreesToRadians(coordinate[1]),
      height: 30
    })
    ecf = WGSToTHREECoordinates(ecf)
    return new THREE.Vector3(getNormalHeight(ecf.x), getNormalHeight(ecf.y), getNormalHeight(ecf.z))
  })
  zoneArray.push(zoneArray[0])
  return zoneArray
}