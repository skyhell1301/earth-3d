import React, {useEffect, useState} from "react"
import * as THREE from "three";
import {useSelector} from "react-redux";
import {degreesToRadians} from "satellite.js";
import {useThree} from "@react-three/fiber";

function Atmosphere({isVisible = true}) {

    const {invalidate} = useThree()

    const atmData = useSelector(state => state.atmosphere.atmosphereData)
    const [atm, setAtm] = useState(null)


    // useEffect(() => {
    //   updateAtmosphere()
    // }, []);

    function updateAtmosphere() {
        let canvas = document.createElement('CANVAS')
        canvas.width = 8000
        canvas.height = 4000
        canvas.background = 'transparent'
        canvas.style.transform = 'matrix(1.11111, 0, 0, 1.11111, 0, 0)'
        let ctx = canvas.getContext('2d');
        let transform = canvas.style.transform;

        let matrix = transform
            // eslint-disable-next-line
            .match(/^matrix\(([^\(]*)\)$/)[1]
            .split(',')
            .map(Number);
        // Apply the transform to the export map context
        CanvasRenderingContext2D.prototype.setTransform.apply(
            ctx,
            matrix
        )


        // ctx.fillRect(1000, 1000, 500, 500)
        // ctx.filter = `blur(50px)`
        // ctx.drawImage(canvas, 0, 0, 7300, 3600)
        // ctx.fillRect(1000, 1044, 44, 44)
        // ctx.fillRect(1000, 1088, 44, 44)
        // ctx.fillRect(1000, 1000, 44, 44)
        // ctx.fillRect(1000, 1000, 44, 44)
        for (let lat in atmData) {
          for (let lon in atmData[lat]) {
            if(atmData[lat][lon] > 0) {
              let x = lon
              let y = Math.abs(parseInt(lat, 10) - 90)
              if (lon < 0) x = 360 + parseInt(lon, 10)
              ctx.fillStyle = `rgb(255,255,255,${atmData[lat][lon] / 10})`
              ctx.fillRect(x * 22.2222, y * 22.2222, 24, 24)
            }
          }
        }

        let blurCanvas = document.createElement('CANVAS')
        blurCanvas.width = 8000
        blurCanvas.height = 4000
        blurCanvas.background = 'transparent'
        blurCanvas.style.transform = 'matrix(1.11111, 0, 0, 1.11111, 0, 0)'
        let ctxBlur = blurCanvas.getContext('2d');
        transform = blurCanvas.style.transform;

        matrix = transform
            // eslint-disable-next-line
            .match(/^matrix\(([^\(]*)\)$/)[1]
            .split(',')
            .map(Number);
        CanvasRenderingContext2D.prototype.setTransform.apply(
            ctxBlur,
            matrix
        )
        ctxBlur.filter = `blur(10px)`
        ctxBlur.drawImage(canvas, 0, 0, 7300, 3600)


        let pointGeometry = new THREE.SphereGeometry(1.04, 64, 64)
        let pointMaterial = new THREE.MeshLambertMaterial({transparent: true})
        let point = new THREE.Mesh(pointGeometry, pointMaterial)
        point.material.map = new THREE.CanvasTexture(blurCanvas)
        point.material.side = THREE.DoubleSide
        point.material.needsUpdate = true
        point.rotateY(degreesToRadians(180))
        setAtm(<primitive object={point}/>)
    }

    useEffect(() => {
        if (isVisible) {
            updateAtmosphere()
            invalidate()
        } else {
            setAtm(null)
        }
        // eslint-disable-next-line
    }, [isVisible])

    return (
        <>
            {atm}
        </>
    )
}

export default Atmosphere