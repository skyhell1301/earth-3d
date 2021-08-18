import React, {useEffect, useState} from "react"
import getEarth from "../../help/earth";
import {useFrame, useThree} from "@react-three/fiber"
import Map from 'ol/Map'
import View from 'ol/View'
import * as THREE from "three"
import {Fill, Stroke, Style, Text} from 'ol/style'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import geojson from '../../assets/JSON/countries.json'
import {useDispatch, useSelector} from "react-redux";
import {setCenter} from "../../store/reducers/cameraPositionReducer";

function Earth() {
  const {camera} = useThree()
  const [globe, setGlobe] = useState(null);
  const [earth] = useState(getEarth(camera))
  const [map, setMap] = useState(null)

  const is3D = useSelector(state=> state.appState.is3D)
  const dispatch = useDispatch()

  function getGlobe() {
    if (earth && globe) {
      return (
        <>
          <primitive object={earth}/>
          <primitive object={globe}/>
        </>
      )
    } else {
      return null
    }
  }

  useEffect(() => {
    // const osm = new layer.Tile({
    //   extent: [-180, -90, 180, 90],
    //   source: new source.OSM()
    // })

    let style = new Style({
      stroke: new Stroke({
        color: '#000',
        width: 1,
        lineCap: 'round'
      }),
      text: new Text({
        font: '20px Calibri,sans-serif',
        fill: new Fill({
          color: '#000',
        }),
        stroke: new Stroke({
          color: '#000',
          width: 1,
        }),
      }),
    })
    let vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(geojson),
    })

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: function (feature) {
        style.getText().setText(feature.values_.ADMIN);
        return style;
      }
    })

    let view = new View({
      projection: "EPSG:4326",
      extent: [-180, -90, 180, 90],
      center: [0, 0],
      zoom: 1,
      resolution: 0.225
      // resolution: 0.1702
    })

    let map3D = new Map({
      layers: [vectorLayer],
      target: 'map3D',
      view: view
    })
    setMap(map3D)
    //
    map3D.once('rendercomplete', function () {
      let mapCanvas = document.createElement('canvas');
      mapCanvas.width = 8000;
      mapCanvas.height = 4000;
      let mapContext = mapCanvas.getContext('2d');
      Array.prototype.forEach.call(
        document.querySelectorAll('#map3D .ol-layer canvas'),
        function (canvas) {
          canvas.background = 'transparent'
          if (canvas.width > 0) {
            let opacity = canvas.parentNode.style.opacity;
            mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
            let transform = canvas.style.transform;
            // Get the transform parameters from the style's transform matrix
            let matrix = transform
              // eslint-disable-next-line
              .match(/^matrix\(([^\(]*)\)$/)[1]
              .split(',')
              .map(Number);
            // Apply the transform to the export map context
            CanvasRenderingContext2D.prototype.setTransform.apply(
              mapContext,
              matrix
            );
            mapContext.drawImage(canvas, 0, 0);
          }
          let newMesh = new THREE.Mesh(
            new THREE.SphereGeometry(1, 32, 32),
            new THREE.MeshLambertMaterial({transparent: true})
          )
          newMesh.material.map = new THREE.CanvasTexture(mapCanvas)
          newMesh.material.needsUpdate = true
          if (newMesh !== globe) setGlobe(newMesh)
        }
      )
    })
    // eslint-disable-next-line
  }, [])

  useFrame(() => {
    if (is3D) {
      if (map && globe) {
        const currentWidth = 8000
        let ray = new THREE.Raycaster()
        ray.setFromCamera({x: 0, y: 0}, camera)
        let intersects = ray.intersectObject(globe)

        let x = map.getCoordinateFromPixel([
          intersects[0]?.uv.x * currentWidth,
          (intersects[0]?.uv.y * currentWidth) / 2
        ])[0];

        let y = -map.getCoordinateFromPixel([
          intersects[0]?.uv.x * currentWidth,
          (intersects[0]?.uv.y * currentWidth) / 2
        ])[1];
        dispatch(setCenter([x, y]))
      }
    }
  })

  return getGlobe()
}

export default Earth