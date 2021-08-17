// Planet Proto
import * as THREE from "three";
import earthMap from "../assets/img/earth/8081_earthmap4k.jpg";
import earthBump from "../assets/img/earth/8081_earthbump10k.jpg";
// import earthSpec1k from "../assets/img/earth/8081_earthspec10k.jpg";
// import earthCloudMap from "../assets/img/earth/earthcloudmap.jpg";
// import earthCloudMapTrans from "../assets/img/earth/earthcloudmaptrans.jpg";

let planetProto = {
  sphere: function (size) {
    let sphere = new THREE.SphereGeometry(size, 32, 32);

    return sphere;
  },
  material: function (options) {
    let material = new THREE.MeshPhongMaterial();
    if (options) {
      for (let property in options) {
        material[property] = options[property];
      }
    }

    return material;
  },
  // glowMaterial: function (intensity, fade, color, camera) {
  //   // Custom glow shader from https://github.com/stemkoski/stemkoski.github.com/tree/master/Three.js
  //   let glowMaterial = new THREE.ShaderMaterial({
  //     uniforms: {
  //       'c': {
  //         type: 'f',
  //         value: intensity
  //       },
  //       'p': {
  //         type: 'f',
  //         value: fade
  //       },
  //       glowColor: {
  //         type: 'c',
  //         value: new THREE.Color(color)
  //       },
  //       viewVector: {
  //         type: 'v3',
  //         value: camera.position
  //       }
  //     },
  //     vertexShader: `
  //       uniform vec3 viewVector;
  //       uniform float c;
  //       uniform float p;
  //       varying float intensity;
  //       void main() {
  //         vec3 vNormal = normalize( normalMatrix * normal );
  //         vec3 vNormel = normalize( normalMatrix * viewVector );
  //         intensity = pow( c - dot(vNormal, vNormel), p );
  //         gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  //       }`
  //     ,
  //     fragmentShader: `
  //       uniform vec3 glowColor;
  //       varying float intensity;
  //       void main()
  //       {
  //         vec3 glow = glowColor * intensity;
  //         gl_FragColor = vec4( glow, 1.0 );
  //       }`
  //     ,
  //     side: THREE.BackSide,
  //     blending: THREE.AdditiveBlending,
  //     transparent: true
  //   });
  //
  //   return glowMaterial;
  // },
  texture: function (material, property, uri) {
    let textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = true;
    textureLoader.load(
      uri,
      function (texture) {
        material[property] = texture;
        material.needsUpdate = true;
      }
    );
  }
};

let createPlanet = function (options) {
  // Create the planet's Surface
  let surfaceGeometry = planetProto.sphere(options.surface.size);
  let surfaceMaterial = planetProto.material(options.surface.material);
  let surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);

  // Create the planet's Atmosphere
  // let atmosphereGeometry = planetProto.sphere(options.surface.size + options.atmosphere.size);
  // let atmosphereMaterialDefaults = {
  //   side: THREE.DoubleSide,
  //   transparent: true
  // }
  // let atmosphereMaterialOptions = Object.assign(atmosphereMaterialDefaults, options.atmosphere.material);
  // let atmosphereMaterial = planetProto.material(atmosphereMaterialOptions);
  // let atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);

  // Create the planet's Atmospheric glow
  // let atmosphericGlowGeometry = planetProto.sphere(options.surface.size + options.atmosphere.size + options.atmosphere.glow.size);
  // let atmosphericGlowMaterial = planetProto.glowMaterial(options.atmosphere.glow.intensity, options.atmosphere.glow.fade, options.atmosphere.glow.color, options.camera);
  // let atmosphericGlow = new THREE.Mesh(atmosphericGlowGeometry, atmosphericGlowMaterial);

  // Nest the planet's Surface and Atmosphere into a planet object
  let planet = new THREE.Object3D();
  surface.name = 'surface';
  // atmosphere.name = 'atmosphere';
  // atmosphericGlow.name = 'atmosphericGlow';
  planet.add(surface);
  // planet.add(atmosphere);
  // planet.add(atmosphericGlow);

  // Load the Surface's textures
  for (let textureProperty in options.surface.textures) {
    planetProto.texture(
      surfaceMaterial,
      textureProperty,
      options.surface.textures[textureProperty]
    );
  }

  // Load the Atmosphere's texture
  for (let textureProperty in options.atmosphere.textures) {
    planetProto.texture(
      // atmosphereMaterial,
      textureProperty,
      options.atmosphere.textures[textureProperty]
    );
  }

  return planet;
};

let getEarth = function (camera) {

  return createPlanet({
    surface: {
      size: 1,
      material: {
        bumpScale: 0.05,
        specular: new THREE.Color('grey'),
        shininess: 10
      },
      textures: {
        map: earthMap,
        bumpMap: earthBump,
        // specularMap: earthSpec1k
      }
    },
    atmosphere: {
      size: 0.003,
      material: {
        opacity: 0.7
      },
      textures: {
        // map: earthCloudMap,
        // alphaMap: earthCloudMapTrans
      },
      glow: {
        size: 0.02,
        intensity: 0.1,
        fade: 7,
        color: 0x93cfef
      }
    },
    camera: camera
  });
}

export default getEarth