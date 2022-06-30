import React, {useCallback, useEffect, useState} from 'react'
import * as THREE from 'three';
import {useSelector} from 'react-redux';
import {degreesToRadians} from 'satellite.js';
import {createCanvas, setMatrixToCanvasContext} from '../../help/canvas';

function Atmosphere({isVisible = true}) {

  const atmData = useSelector(state => state.atmosphere.atmosphereData)
  const [atm, setAtm] = useState(null)


  const updateAtmosphere = useCallback(() => {
    console.log('kek')
    let canvas = createCanvas(8000, 4000, 'matrix(1.11111, 0, 0, 1.11111, 0, 0)')
    let ctx = canvas.getContext('2d');
    setMatrixToCanvasContext(canvas)


    for (let lat in atmData) {
      for (let lon in atmData[lat]) {
        if (atmData[lat][lon] > 0) {
          let x = lon
          const y = Math.abs(parseInt(lat, 10) - 90)
          if (lon < 0) x = 360 + parseInt(lon, 10)
          ctx.fillStyle = `rgb(255,255,255,${atmData[lat][lon] / 10})`
          ctx.fillRect(x * 22.2222, y * 22.2222, 24, 24)
        }
      }
    }

    const blurCanvas = createCanvas(8000, 4000, 'matrix(1.11111, 0, 0, 1.11111, 0, 0)')
    setMatrixToCanvasContext(blurCanvas)
    const ctxBlur = blurCanvas.getContext('2d');

    ctxBlur.filter = `blur(10px)`
    ctxBlur.drawImage(canvas, 0, 0, 7300, 3600)

    let atmosphereGeometry = new THREE.SphereGeometry(1.04, 64, 64)
    let atmosphereMaterial = new THREE.MeshPhongMaterial({transparent: true})
    let atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
    atmosphereMesh.material.map = new THREE.CanvasTexture(blurCanvas)
    atmosphereMesh.material.side = THREE.DoubleSide
    atmosphereMesh.material.needsUpdate = true
    atmosphereMesh.rotateY(degreesToRadians(180))

    setAtm(<primitive object={atmosphereMesh}/>)
  }, [atmData])

  useEffect(() => {
    if (isVisible) {
      updateAtmosphere()
    } else {
      setAtm(null)
    }

  }, [isVisible, updateAtmosphere])

  return <>{atm}</>
}

export default Atmosphere