import React, {useEffect, useState} from 'react';
import {degreesToRadians} from 'satellite.js';
import * as satellite from 'satellite.js';
import {getNormalHeight, WGSToTHREECoordinates} from '../../help/coordinatesCalculate';
import * as THREE from 'three';
import {generateZsZone} from '../../models/earthStation';

export const useZsGroup = (zsList) => {
  const [zsGroup, setZsGroup] = useState(null)
  useEffect(() => {
    setZsGroup(zsList.map(zs => {
      if (zs.zone5.length && zs.zone7.length) {

        //Центральная точка
        let ecf = satellite.geodeticToEcf({
          longitude: degreesToRadians(zs.longitude),
          latitude: degreesToRadians(zs.latitude),
          height: 0
        })
        ecf = WGSToTHREECoordinates(ecf)
        const ecfN = new THREE.Vector3(getNormalHeight(ecf.x), getNormalHeight(ecf.y), getNormalHeight(ecf.z))
        const pointGeometry = new THREE.SphereGeometry(0.006)
        const pointMaterial = new THREE.MeshBasicMaterial({color: 'rgb(250,1,45)'})
        const point = new THREE.Mesh(pointGeometry, pointMaterial)
        point.position.set(ecfN.x, ecfN.y, ecfN.z)

        //Зоны 5 и 7 градусов угла места
        const zone5Array = generateZsZone(zs.zone5)
        const zone7Array = generateZsZone(zs.zone7)

        const lineGeometry5 = new THREE.BufferGeometry().setFromPoints(zone5Array)
        const lineGeometry7 = new THREE.BufferGeometry().setFromPoints(zone7Array)
        const lineMaterial5 = new THREE.LineBasicMaterial({
          color: 'rgb(145,9,50)',
          linewidth: 2
        })
        const lineMaterial7 = new THREE.LineBasicMaterial({
          color: 'rgb(11,105,6)',
          linewidth: 2
        })

        const zone5 = new THREE.Line(lineGeometry5, lineMaterial5)
        const zone7 = new THREE.Line(lineGeometry7, lineMaterial7)

        return <group key={zs.name}>
          <primitive object={point}/>
          <primitive object={zone5}/>
          <primitive object={zone7}/>
        </group>
      } else {
        return null
      }
    }))
  }, [zsList])

  return {zsGroup}
}