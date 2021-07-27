import React, {useEffect, useRef} from "react";
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
import {eciToLocalCoordinates, getNormalHeight, getXYZCoordinates} from "../help/coordinatesCalculate";
import satelliteMtl from '../assets/models/satellite_obj.mtl'
import satelliteObj from '../assets/models/satellite_obj.obj'

import * as satellite from 'satellite.js'
import {createSpacecraft} from "../help/spacecraft";

function OpenLayersTest() {

  // const [cameraZoom, setCameraZoom] = useState(1);

  const map2dRef = useRef(null);
  const map3dRef = useRef(null);

  useEffect(() => {

    let is3dState = true

    let renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    map3dRef.current.appendChild(renderer.domElement)

    let scene = new THREE.Scene();

    //--------------Свет-----------------------
    let hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.3);
    let dirLight = new THREE.DirectionalLight(0xffffff, 0.65);
    hemiLight.position.set(100, 0, 0);
    hemiLight.matrixAutoUpdate = false;
    hemiLight.updateMatrix();

    dirLight.position.set(1000, 0, 0);
    dirLight.castShadow = true;

    scene.add(hemiLight);
    scene.add(dirLight);

    //--------Галактика----------------
    let textureLoader = new THREE.TextureLoader();
    let galaxyMaterial = new THREE.MeshBasicMaterial({
      side: THREE.BackSide
    })
    let galaxy = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), galaxyMaterial);
    galaxy.name = 'galaxy'

    textureLoader.crossOrigin = true;
    textureLoader.load(
      starField,
      function (texture) {
        galaxyMaterial.map = texture;
        scene.add(galaxy);
      }
    );

    //--------------Камера--------------------
    const width = window.innerWidth
    const height = window.innerHeight
    const aspect = width / height
    const deltaZoom = 0.7
    const cameraSize = 5;
    let cameraCoefficient = 2

    // let cameraOrt = new THREE.OrthographicCamera(
    //   (cameraSize * aspect) / -cameraCoefficient,
    //   (cameraSize * aspect) / cameraCoefficient,
    //   cameraSize / cameraCoefficient,
    //   cameraSize / -cameraCoefficient,
    //   0,
    //   1000
    // )

    let cameraOrt = new THREE.PerspectiveCamera(45,aspect,0.1, 2000)
    cameraOrt.position.set(1.05, 0, -1.05);

    let controls = new OrbitControls(cameraOrt, renderer.domElement);
    // controls.zoomSpeed = 0.6
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
    // TRITON-1
    let tleLine1 = '1 39427U 13066M   21203.82189194  .00000294  00000-0  54799-4 0  9994',
      tleLine2 = '2 39427  97.7764 149.8720 0111916 237.6857 121.3472 14.68267694410407';

    //YAMAL-601
    // let tleLine1 = '1 44307U 19031A   21207.54368872  .00000104  00000-0  00000-0 0  9992',
    //   tleLine2 = '2 44307   0.0114  89.4434 0002164  41.7034  58.0069  1.00271648  8016'

    let date = new Date()

    let spacecraft
    let myObjPromise = createSpacecraft(tleLine1, tleLine2, satelliteMtl, satelliteObj)
    myObjPromise.then(myObj => {
      spacecraft = myObj
      scene.add(spacecraft)
      spacecraft.orbit.visible = false
      scene.add(spacecraft.orbit)
      startSpacecraftMove()
      console.log(scene)
      return myObj
    });

    //---------Ось Земли--------------
    const axisMaterial = new THREE.LineBasicMaterial({
      color: 'white'
    });
    let axisPoints = [new THREE.Vector3(0, 1.5, 0), new THREE.Vector3(0, -1.5, 0)]
    const axisGeometry = new THREE.BufferGeometry().setFromPoints(axisPoints);
    let earthAxis = new THREE.Line(axisGeometry, axisMaterial)
    earthAxis.name = 'axis'
    scene.add(earthAxis)

    //----------------------

    function animate() {
      // requestAnimationFrame(animate)

      renderer.render(scene, cameraOrt);
    }

    function addMinutes(date, minutes) {
      return new Date(date.getTime() + minutes * 60000);
    }

    // setTimeout(animate,1000)
    const startSpacecraftMove = () => {
      let i = 0
      let deltaMin = 0.1
      setInterval(() => {
        if (spacecraft) spacecraft.move(addMinutes(date, i))

        // 0.250684477 градуса за 1 минуту вращается Земля
        globe.rotateY(satellite.degreesToRadians(deltaMin * 0.250684477))
        earth.rotateY(satellite.degreesToRadians(deltaMin * 0.250684477))

        i = i + deltaMin
        animate()
      }, 30)
    }


    let osm = new layer.Tile({
      extent: [-180, -90, 180, 90],
      source: new source.OSM()
    });

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
    });

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

            let matrix = transform
              // eslint-disable-next-line
              .match(/^matrix\(([^\(]*)\)$/)[1]
              .split(",")
              .map(Number);

            CanvasRenderingContext2D.prototype.setTransform.apply(
              mapContext,
              matrix
            );
            mapContext.drawImage(canvas, 0, 0);
          }
        }
      );

      let texture = new THREE.CanvasTexture(mapCanvas);
      globe.material.map = texture;
      globe.material.needsUpdate = true;
    });

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

    window.addEventListener('click', ({clientX, clientY}) => {
      const {innerWidth, innerHeight} = window;

      mouse.x = (clientX / innerWidth) * 2 - 1;
      mouse.y = -(clientY / innerHeight) * 2 + 1;
      let vector = new THREE.Vector3(mouse.x, mouse.y, 1);
      vector.unproject(cameraOrt);
      let ray = new THREE.Raycaster(cameraOrt.position, vector.sub(cameraOrt.position).normalize());
      // let raycasterOver = new THREE.Raycaster();
      // raycasterOver.setFromCamera(mouse, cameraOrt);

      let intersects = ray.intersectObjects(scene.children, true)
      // let intersects = raycasterOver.intersectObject(spacecraft)
      // if(intersects.length > 0) console.log(intersects)
      console.log(intersects[0]?.object)
      // if(intersects.length > 0) {
      //   if (intersects[0].object.name === 'Satellite_Grp pCube19 group2 group3') {
      //     container.style.cursor = 'pointer';
          // console.log('Mouse is over')
        // } else {

          // container.style.cursor = 'auto';
          // console.log('Mouse is off')
        // }
      // }
      // console.log(intersects)
      // if (intersects) {
      //   spacecraft.orbit.visible = true
      // } else {
      //   spacecraft.orbit.visible = false
      // }
      // const intersects = raycaster.intersectObjects( scene.children );
      //
      // for ( let i = 0; i < intersects.length; i ++ ) {
      //
      //   intersects[ i ].object.material.color.set( 0xff0000 );
      //
      // }
    });

    controls.addEventListener('change', () => {
      if (is3dState) {
        view2d.setZoom(cameraOrt.zoom - deltaZoom)
      }
      animate()
    })

    controls.addEventListener('end', function (event) {
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
          map3dRef.current.style.width = "2000px";
          map3dRef.current.style.height = "1000px";
          if (currentWidth !== 2000) {
            map3d.updateSize();
            view3d.setResolution(0.225);
            currentWidth = 2000;
          }
          break;
        case 4:
          map3dRef.current.style.width = "4000px";
          map3dRef.current.style.height = "2000px";
          if (currentWidth !== 4000) {
            map3d.updateSize();
            view3d.setResolution(0.18);
            currentWidth = 4000;
          }
          break;
        default:
          break;
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

      animate()
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

      // cameraOrt.left = (cameraSize * newAspect) / -cameraCoefficient
      // cameraOrt.right = (cameraSize * newAspect) / cameraCoefficient
      cameraOrt.aspect = newAspect
      cameraOrt.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
      animate()
    })


  }, [])
  return (
    <div id="container" className='container'>
      <div ref={map3dRef} className='map3d' id='map3d'></div>
      <div ref={map2dRef} className='map2d' id='map2d'></div>
    </div>
  )
}

export default OpenLayersTest