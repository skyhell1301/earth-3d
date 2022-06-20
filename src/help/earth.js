// Planet Proto
import * as THREE from 'three'
import earthMap from '../assets/img/earth/8081_earthmap4k.jpg'
import earthBump from '../assets/img/earth/8081_earthbump10k.jpg'

let planetProto = {
  sphere: function (size, segments) {

    return new THREE.SphereGeometry(size, segments, segments)
  }, material: function (options) {
    const material = new THREE.MeshPhongMaterial()
    if (options) {
      for (let property in options) {
        material[property] = options[property]
      }
    }

    return material
  }, texture: function (material, property, uri) {
    let textureLoader = new THREE.TextureLoader()
    textureLoader.crossOrigin = true
    textureLoader.load(uri, function (texture) {
      material[property] = texture
      material.needsUpdate = true
    })
  }
}

let createPlanet = function (options) {
  // Create the planet's Surface
  let surfaceGeometry = planetProto.sphere(options.surface.size, options.surface.segments)
  let surfaceMaterial = planetProto.material(options.surface.material)
  let surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial)

  // Nest the planet's Surface and Atmosphere into a planet object
  let planet = new THREE.Object3D()
  surface.name = 'Earth'
  planet.add(surface)

  // Load the Surface's textures
  for (let textureProperty in options.surface.textures) {
    planetProto.texture(surfaceMaterial, textureProperty, options.surface.textures[textureProperty])
  }

  // Load the Atmosphere's texture
  for (let textureProperty in options.atmosphere.textures) {
    planetProto.texture(textureProperty, options.atmosphere.textures[textureProperty])
  }

  return planet
}

let getEarth = function () {

  return createPlanet({
    surface: {
      size: 1, segments: 64, material: {
        bumpScale: 0.05, specular: new THREE.Color('grey'), shininess: 10
      },
      textures: {
        map: earthMap, bumpMap: earthBump
      }
    },
    atmosphere: {
      size: 0.003, material: {
        opacity: 0.7
      }, textures: {}, glow: {
        size: 0.02, intensity: 0.1, fade: 7, color: 0x93cfef
      }
    }
  })
}

export default getEarth