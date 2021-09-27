import { useState, useEffect } from "react"
import {addEffect, addAfterEffect } from "@react-three/fiber"
// @ts-ignore
import StatsJS from 'stats-js'

export default function Stats({ showPanel = 0, className }) {
  const [stats] = useState(() => new StatsJS())
  useEffect(() => {
    const node = document.body

    stats.showPanel(showPanel)
    node.appendChild(stats.dom)

    stats.dom.style.left = '19%'
    if (className) stats.dom.classList.add(className)

    const begin = addEffect(() => stats.begin())
    const end = addAfterEffect(() => stats.end())

    return () => {
      node.removeChild(stats.dom)
      begin()
      end()
    }
    // eslint-disable-next-line
  }, [])
  return null
}