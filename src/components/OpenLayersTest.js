import React, {useEffect, useRef, useState} from "react";
import * as THREE from "three";
import './OpenLayersTest.css'
// import Map from 'ol/Map';
// import View from 'ol/View';
import * as layer from 'ol/layer';
import * as source from 'ol/source'
// import * as ol from 'ol'
// import * as geom from 'ol/geom'
import * as olProj from 'ol/proj';
// import {toStringXY} from 'ol/coordinate';
// import Feature from 'ol/Feature';
// import Circle from 'ol/geom/Circle';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import starField from "../assets/img/starfield.png";
import getEarth from "../help/earth";
import {getXYZCoordinates} from "../help/coordinatesCalculate";
// import satelliteMtl from '../assets/models/satellite_obj.mtl'
// import satelliteMtl from '../assets/models/smotr/smotr.mtl'
// import satelliteObj from '../assets/models/satellite_obj.obj'
// import satelliteObj from '../assets/models/smotr/smotr.obj'
import satelliteStl from '../assets/models/smotr/smotr_1.stl'

import {createSpacecraft} from "../help/spacecraft";
import {createSun} from "../help/sun";
import * as dat from "dat.gui";
import TLEParams from "./TLEParams";
import {createAxes} from "../help/sceneManager";

function OpenLayersTest() {

  const map2dRef = useRef(null);
  const map3dRef = useRef(null);
  const [TleParams, setTleParams] = useState(null);

  useEffect(() => {

    let is3dState = true

    let renderer = new THREE.WebGLRenderer()
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.autoClear = true
    map3dRef.current.appendChild(renderer.domElement)

    let scene = new THREE.Scene()

    //------------Сетка---------------------
    const gridSize = 5;
    const gridDivisions = 20;

    const grid = new THREE.GridHelper(gridSize, gridDivisions);
    grid.visible = false
    scene.add(grid);

    //-----------Оси координат-----------
    let coordAxes = createAxes()
    coordAxes.visible = false
    scene.add(coordAxes);

    //--------------Свет-----------------------
    let hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8)
    hemiLight.position.set(100, 0, 0)
    hemiLight.matrixAutoUpdate = false
    hemiLight.updateMatrix()

    scene.add(hemiLight)

    //--------Галактика----------------
    let textureLoader = new THREE.TextureLoader();
    let galaxyMaterial = new THREE.MeshBasicMaterial({
      side: THREE.BackSide
    })
    let galaxy = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), galaxyMaterial);
    galaxy.name = 'galaxy'

    textureLoader.crossOrigin = true
    textureLoader.load(
      starField,
      function (texture) {
        galaxyMaterial.map = texture
        scene.add(galaxy);
      }
    );

    //--------------Камера--------------------
    const width = window.innerWidth
    const height = window.innerHeight
    const aspect = width / height
    const deltaZoom = -0.4
    const cameraSize = 5;
    let cameraCoefficient = 4

    let cameraOrt = new THREE.OrthographicCamera(
      (cameraSize * aspect) / -cameraCoefficient,
      (cameraSize * aspect) / cameraCoefficient,
      cameraSize / cameraCoefficient,
      cameraSize / -cameraCoefficient,
      0,
      1000
    )

    // let cameraOrt = new THREE.PerspectiveCamera(45, aspect, 0.1, 2000)
    cameraOrt.position.set(20, 0, 0);

    let controls = new OrbitControls(cameraOrt, renderer.domElement)
    controls.maxZoom = 6
    // controls.enableDamping = true
    controls.enableDamping = true;
    controls.dampingFactor = 1.5;
    controls.zoomSpeed = 0.6
    scene.add(cameraOrt);
    //------------------Земля---------------------------------
    let earth = getEarth(cameraOrt)
    earth.visible = true
    scene.add(earth)

    let globe = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.MeshPhongMaterial()
    );
    globe.name = 'globus'
    globe.visible = false
    globe.position.set(0, 0, 0)

    scene.add(globe);

    //-----------Спутник-------------
    let tle = 'TRITON-1\n' +
      '1 39427U 13066M   21203.82189194  .00000294  00000-0  54799-4 0  9994\n' +
      '2 39427  97.7764 149.8720 0111916 237.6857 121.3472 14.68267694410407';

    let date = new Date()

    let spacecraft
    let myObjPromise = createSpacecraft(tle, satelliteStl, date)
    myObjPromise.then(myStl => {
      spacecraft = myStl
      scene.add(spacecraft)
      scene.add(spacecraft.orbit)
      scene.add(spacecraft.spacecraftPoint)
      setTleParams(spacecraft.tle)
      // startMove()
      guiOpen()
    });


    let moveInterval
    let i = 0
    const startMove = () => {
      let deltaMin = 0.04
      moveInterval = setInterval(() => {
        if (spacecraft) {
          spacecraft.move(addMinutes(date, i))
          Sun.move(addMinutes(date, i))
          if (spacecraft.tle !== TleParams) {
            setTleParams(spacecraft.tle)
          }
          // 0.250684477 градуса за 1 минуту вращается Земля
          // globe.rotateY(satellite.degreesToRadians(deltaMin * 0.250684477))
          // earth.rotateY(satellite.degreesToRadians(deltaMin * 0.250684477))
          i = i + deltaMin
        }
      }, 33.3333)
    }

    const stopMove = () => {
      clearInterval(moveInterval)
    }

    //------Солнце----------------
    let Sun = createSun(date)
    scene.add(Sun)
    scene.add(Sun.point)

    //---------Рендер---------------------
    let fps = 30
    let eachNthFrame = Math.round((1000 / fps) / 16.66);
    let frameCount = eachNthFrame

    requestAnimationFrame(frame);
    function frame() {
      if (frameCount === eachNthFrame) {
        frameCount = 0
        render()
      }
      frameCount++
      requestAnimationFrame(frame)
    }
    function render() {
      // requestAnimationFrame(render)

      renderer.render(scene, cameraOrt)
    }

    function addMinutes(date, minutes) {
      return new Date(date.getTime() + minutes * 60000)
    }

    let osm = new layer.Tile({
      extent: [-180, -90, 180, 90],
      source: new source.OSM()
    })

    let view3d = new View({
      projection: "EPSG:4326",
      extent: [-180, -90, 180, 90],
      center: [0, 0],
      zoom: 1
    })

    let view2d = new View({
      center: [0, 0],
      zoom: 1
    })

    let map2d = new Map({
      layers: [
        new TileLayer({
          minZoom: 5.3,
          source: new XYZ({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          })
        })
      ],
      view: view2d,
      target: map2dRef.current.id
    })

    let map3d = new Map({
      layers: [
        osm
      ],
      target: map3dRef.current.id,
      view: view3d
    })


    map3d.on("rendercomplete", function () {
      let mapCanvas = document.createElement("canvas");
      let size = map3d.getSize();
      mapCanvas.width = size[0];
      mapCanvas.height = size[1];
      let mapContext = mapCanvas.getContext("2d");
      Array.prototype.forEach.call(
        // document.querySelectorAll(".ol-layer canvas"),
        map3dRef.current.querySelectorAll(".ol-layer canvas"),
        function (canvas) {
          if (canvas.width > 0) {
            let opacity = canvas.parentNode.style.opacity;
            mapContext.globalAlpha = opacity === "" ? 1 : Number(opacity);
            let transform = canvas.style.transform;

            // eslint-disable-next-line
            let matrix = transform.match(/^matrix\(([^\(]*)\)$/)[1].split(",").map(Number);

            CanvasRenderingContext2D.prototype.setTransform.apply(
              mapContext,
              matrix
            );
            mapContext.drawImage(canvas, 0, 0);
          }
        }
      );

      globe.material.map = new THREE.CanvasTexture(mapCanvas)
      globe.material.needsUpdate = true
    })

    map2d.on('rendercomplete', () => {
      if (!is3dState) {
        cameraOrt.zoom = view2d.getZoom() + deltaZoom
        const xyz = getXYZCoordinates(olProj.transform(view2d.getCenter(), 'EPSG:3857', 'EPSG:4326'))
        cameraOrt.position.set(xyz[0], xyz[1], xyz[2])
        cameraOrt.lookAt(0, 0, 0)
      }
      updateView()
    })

    let raycaster = new THREE.Raycaster();
    let currentWidth = 1000;

    // Track mouse movement to pick objects
    const mouse = new THREE.Vector2();

    window.addEventListener('mousemove', ({clientX, clientY}) => {
      const {innerWidth, innerHeight} = window

      mouse.x = (clientX / innerWidth) * 2 - 1
      mouse.y = -(clientY / innerHeight) * 2 + 1

      //------Для перспективной камеры----
      // let vector = new THREE.Vector3(mouse.x, mouse.y, 1);
      // vector.unproject(cameraOrt);
      // let ray = new THREE.Raycaster(cameraOrt.position, vector.sub(cameraOrt.position).normalize());
      //-----------------------------------

      let ray = new THREE.Raycaster()
      ray.setFromCamera(mouse, cameraOrt)
      if (spacecraft) {
        let intersects = ray.intersectObject(spacecraft, true)
        if (intersects.length > 0) {
          spacecraft.traverse(obj => {
            if (obj.isMesh) {
              obj.material.color?.set('red')
              document.body.style.cursor = 'pointer'
            }
          })
        } else {
          spacecraft.traverse(obj => {
            if (obj.isMesh) {
              obj.material.color?.set('white')
              document.body.style.cursor = 'default'
            }
          })
        }
      }
    })
    window.addEventListener('click', ({clientX, clientY}) => {
      const {innerWidth, innerHeight} = window

      mouse.x = (clientX / innerWidth) * 2 - 1
      mouse.y = -(clientY / innerHeight) * 2 + 1

      let ray = new THREE.Raycaster()
      ray.setFromCamera(mouse, cameraOrt)
      if (spacecraft) {
        let intersects = ray.intersectObject(spacecraft, true)
        if (intersects.length > 0) {
          if (spacecraft.isOrbitShow) {
            spacecraft.hideOrbit()
          } else {
            spacecraft.showOrbit()
          }
        }
      }
    })

    controls.addEventListener('change', () => {
      // console.log(cameraOrt.position)
      if (is3dState) {
        view2d.setZoom(cameraOrt.zoom - deltaZoom)
      }
      render()
    })

    controls.addEventListener('end', function () {
      raycaster.setFromCamera({x: 0, y: 0}, cameraOrt);

      let intersects = raycaster.intersectObject(globe);
      let x = map3d.getCoordinateFromPixel([
        intersects[0].uv.x * currentWidth,
        (intersects[0].uv.y * currentWidth) / 2
      ])[0];

      let y = -map3d.getCoordinateFromPixel([
        intersects[0].uv.x * currentWidth,
        (intersects[0].uv.y * currentWidth) / 2
      ])[1];

      // let circle = new ol.Feature({
      //   geometry: new geom.Circle([y, x], 40)
      // });
      // let circleSource = new source.Vector({
      //   features: [circle]
      // });
      // osm.setExtent(circleSource.getExtent());

      view2d.setCenter(olProj.transform([x, y], 'EPSG:4326', 'EPSG:3857'))
      updateView()
    })

    let updateView = () => {
      switch (Math.floor(cameraOrt.zoom)) {
        case 2:
          earth.visible = true
          globe.visible = false
          break;
        case 3:
          globe.visible = true
          earth.visible = false
          map3dRef.current.style.width = "2000px"
          map3dRef.current.style.height = "1000px"
          if (currentWidth !== 2000) {
            map3d.updateSize()
            view3d.setResolution(0.225)
            currentWidth = 2000;
          }
          break;
        case 4:
          map3dRef.current.style.width = "4000px"
          map3dRef.current.style.height = "2000px"
          if (currentWidth !== 4000) {
            map3d.updateSize()
            view3d.setResolution(0.18)
            currentWidth = 4000;
          }
          break;
        default:
          break;
      }
      if (spacecraft) {
        spacecraft.visible = Math.floor(cameraOrt.zoom) < 3
      }

      if (Math.floor(cameraOrt.zoom) < 6) {
        if (!is3dState) {
          is3dState = true
          open3dMap()
        }
      } else {
        if (is3dState) {
          is3dState = false
          open2dMap()
        }
      }
    }
    const open2dMap = () => {
      map2dRef.current.style.visibility = 'visible'
      map3dRef.current.style.visibility = 'hidden'
    }
    const open3dMap = () => {
      map2dRef.current.style.visibility = 'hidden'
      map3dRef.current.style.visibility = 'visible'
    }

    // On window resize, adjust camera aspect ratio and renderer size
    window.addEventListener('resize', function () {

      const newWidth = window.innerWidth
      const newHeight = window.innerHeight
      const newAspect = newWidth / newHeight

      cameraOrt.left = (cameraSize * newAspect) / -cameraCoefficient
      cameraOrt.right = (cameraSize * newAspect) / cameraCoefficient
      // cameraOrt.aspect = newAspect
      cameraOrt.updateProjectionMatrix()

      renderer.setSize(newWidth, newHeight)
    })

    //GUi
    let gui = new dat.GUI();

    function guiOpen() {
      let guiCoordinatesSystem = gui.addFolder('Система координат')
      let guiSpacecraft = gui.addFolder('Космический аппарат')

      let guiParams = {
        loadTLE: function () {
          let input = document.getElementById('loadTLE')
          input.click()
          input.addEventListener('change', () => {
            let files = input.files
            if (files.length > 0) {
              let reader = new FileReader()
              reader.readAsText(files[0], 'utf-8')
              reader.onload = function () {
                spacecraft.updateTLE(reader.result)
              }
            }
          }, false)
        },
        'Оси координат': coordAxes.visible,
        'Сетка': grid.visible,
        'Орбита': spacecraft.isOrbitShow,
        'Движение': false
      }
      //Система координат
      guiCoordinatesSystem.add(guiParams, 'Оси координат').onChange(function (value) {
        coordAxes.visible = value;
      })
      guiCoordinatesSystem.add(guiParams, 'Сетка').onChange(function (value) {
        grid.visible = value;
      })

      //Космический аппарат
      guiSpacecraft.add(guiParams, 'Орбита').onChange(function (value) {
        value ? spacecraft.showOrbit() : spacecraft.hideOrbit()
      })
      guiSpacecraft.add(guiParams, 'Движение').onChange(function (value) {
        value ? startMove() : stopMove()
      })

      //Загрузка TLE
      gui.add(guiParams, 'loadTLE').name('Загрузка TLE файла')

    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div id="container" className='container'>
      <TLEParams tle={TleParams}/>
      <div>
        <div ref={map3dRef} className='map3d' id='map3d'/>
        <input id="loadTLE" type="file" style={{visibility: 'hidden'}}/>
      </div>
      <div>
        <div ref={map2dRef} className='map2d' id='map2d'/>
      </div>
    </div>
  )
}

export default OpenLayersTest