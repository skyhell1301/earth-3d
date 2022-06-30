import React, {useCallback, useEffect, useRef} from 'react';
import {Fill, Stroke, Style, Text} from 'ol/style';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import geojson from '../../assets/json/countries.json';
import VectorLayer from 'ol/layer/Vector';
import View from 'ol/View';
import Map from 'ol/Map';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';


const useVectorCountries = (mapId) => {

  const {invalidate} = useThree()
  const rerender = useCallback(invalidate, [invalidate])

  const countries = useRef(null);
  const map = useRef(null)

  useEffect(() => {
    let style = new Style({
      stroke: new Stroke({
        color: '#000',
        width: 1,
        lineCap: 'round'
      }),
      text: new Text({
        font: '20px Calibri,sans-serif',
        fill: new Fill({
          color: '#000'
        }),
        stroke: new Stroke({
          color: '#000',
          width: 1
        })
      })
    })


    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: new GeoJSON().readFeatures(geojson)
      }),
      style: function (feature) {
        style.getText().setText(feature.values_.ADMIN);
        return style;
      }
    })

    let view = new View({
      projection: 'EPSG:4326',
      extent: [-180, -90, 180, 90],
      center: [0, 0],
      zoom: 1,
      resolution: 0.225
      // resolution: 0.1702
    })

    map.current = new Map({
      layers: [vectorLayer],
      target: mapId,
      view: view
    })

    map.current.once('rendercomplete', function () {
      const mapCanvas = document.createElement('canvas');
      mapCanvas.width = 8000;
      mapCanvas.height = 4000;
      const mapContext = mapCanvas.getContext('2d');

      Array.prototype.forEach.call(
        document.querySelectorAll(`#${mapId} .ol-layer canvas`),
        canvas => {
          canvas.background = 'transparent'
          if (canvas.width > 0) {
            const opacity = canvas.parentNode.style.opacity;
            mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
            const transform = canvas.style.transform;
            // Get the transform parameters from the style's transform matrix
            const matrix = transform
              // eslint-disable-next-line
              .match(/^matrix\(([^\(]*)\)$/)[1]
              .split(',')
              .map(Number);
            // Apply the transform to the export map context
            CanvasRenderingContext2D.prototype.setTransform.apply(
              mapContext,
              matrix
            )
            mapContext.drawImage(canvas, 0, 0)
          }

          let newMesh = new THREE.Mesh(
            new THREE.SphereGeometry(1.006, 32, 32),
            new THREE.MeshPhongMaterial({transparent: true})
          )
          newMesh.material.map = new THREE.CanvasTexture(mapCanvas)
          newMesh.material.needsUpdate = true
          if (newMesh !== countries.current) countries.current = <primitive object={newMesh}/>
          rerender()
        }
      )
    })
  }, [rerender, mapId])

  return countries
}

export default useVectorCountries