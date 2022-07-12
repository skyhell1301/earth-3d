import {useMemo} from 'react';
import * as THREE from 'three';
import countries from '../../assets/img/earth/countries.png'


const useVectorCountries = () => {

  return useMemo(() => {
    const newMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1.006, 32, 32),
      new THREE.MeshPhongMaterial({transparent: true})
    )
    const textureLoader = new THREE.TextureLoader()
    textureLoader.crossOrigin = true
    textureLoader.load(countries, function (texture) {
      newMesh.material.map = texture
      newMesh.material.needsUpdate = true
    })
    newMesh.material.needsUpdate = true
    return newMesh
  }, [])
}

export default useVectorCountries