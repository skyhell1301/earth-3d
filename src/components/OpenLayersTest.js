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

function OpenLayersTest() {

  // const [cameraZoom, setCameraZoom] = useState(1);

  const map2dRef = useRef(null);
  const map3dRef = useRef(null);

  useEffect(() => {
    let renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    map3dRef.current.appendChild(renderer.domElement)

    let scene = new THREE.Scene();

    let hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.3);
    let dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    hemiLight.position.set(0, 100, 0);
    hemiLight.matrixAutoUpdate = false;
    hemiLight.updateMatrix();

    dirLight.position.set(3, 10, -1000);
    dirLight.castShadow = true;

    scene.add(hemiLight);
    scene.add(dirLight);

    let textureLoader = new THREE.TextureLoader();
    // Galaxy
    let galaxyMaterial = new THREE.MeshBasicMaterial({
      side: THREE.BackSide
    })
    let galaxy = new THREE.Mesh(new THREE.SphereGeometry(30, 32, 32), galaxyMaterial);

// Load Galaxy Textures
    textureLoader.crossOrigin = true;
    textureLoader.load(
      starField,
      function (texture) {
        galaxyMaterial.map = texture;
        scene.add(galaxy);
      }
    );


    let coef = 500
    let camera = new THREE.OrthographicCamera(
      -window.innerWidth / coef,
      window.innerWidth / coef,
      window.innerHeight / coef,
      -window.innerHeight / coef,
      1,
      200
    )

    camera.position.set(0, 0, 5);

    let controls = new OrbitControls(camera, renderer.domElement);

    let earth = getEarth(camera)
    earth.visible = true

    let globe = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.MeshPhongMaterial()
    );
    globe.name = 'globus'
    globe.visible = false
    globe.position.set(0, 0, 0)

    scene.add(camera);
    scene.add(earth)
    scene.add(globe);

    function animate() {
      // requestAnimationFrame(animate)
      renderer.render(scene, camera);
    }
    setTimeout(animate,1000)


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
        // osm,
        new TileLayer({
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
        osm,
        // new TileLayer({
        //   source: new XYZ({
        //     url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        //   })
        // })
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

    let raycaster = new THREE.Raycaster();
    let currentWidth = 1000;


    // map2d.on('rendercomplete', ()=>{
    //   console.log(view2d.getCenter())
    // })

    controls.addEventListener('change', animate)
    controls.addEventListener('end', function (event) {
      raycaster.setFromCamera({x: 0, y: 0}, camera);
      view2d.setZoom(camera.zoom)
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
      view2d.animate({
        center:olProj.transform([x,y],'EPSG:4326', 'EPSG:3857')
      })
      // view2d.setCenter(olProj.transform([x,y],'EPSG:4326', 'EPSG:3857'))
      // view3d.setCenter(olProj.transform([x,y],'EPSG:4326', 'EPSG:3857'))

      switch (Math.floor(camera.zoom)) {
        case 1:
          earth.visible = true
          globe.visible = false
          break;
        case 2:
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
        case 3:
          map3dRef.current.style.width = "4000px";
          map3dRef.current.style.height = "2000px";
          if (currentWidth !== 4000) {
            map3d.updateSize();
            view3d.setResolution(0.18);
            currentWidth = 4000;
          }
          break;
        case 4:
          if (globe.layers.mask === 0) {
            globe.visible = true
            earth.visible = true
          }
          break
        case 5:
          globe.visible = false
          earth.visible = false
          break;
        default:
          break;
      }
    });
  }, [])
  return (
    <div id="container" className='container'>
      <div>
        <div ref={map3dRef} className='map3d' id='map3d'></div>
      </div>
      <div>
        <div ref={map2dRef} className='map2d' id='map2d'></div>
      </div>
    </div>
  )
}

export default OpenLayersTest