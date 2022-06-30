import React from 'react'
import starField from '../../assets/img/starfield.png'
import * as THREE from 'three'
import {useLoader} from '@react-three/fiber'
import {TextureLoader} from 'three'

function Galaxy() {
  const material = useLoader(TextureLoader, starField)

  return (
    <mesh>
      <boxGeometry args={[15, 15, 15]} name={'galaxy'} position={[0, 0, 0]}/>
      <meshBasicMaterial map={material} side={THREE.BackSide}/>
    </mesh>
  )
}

export default Galaxy