import * as olProj from "ol/proj";

export default function calculateZSRadius(LonStation = 37.378847, LatStation = 55.558741, edge = 5, orbitHeight = 500) {
  const Re = 6378.137  //Радиус Земли (км)

  const edge_rad = edge * Math.PI / 180 //рад (0,087266463)

  const B = Math.acos(Re * Math.cos(edge_rad) / (orbitHeight + Re)) - edge_rad //угол (рад)

  const zoneRadius = 2 * Re * Math.sin(B / 2)

  LatStation = LatStation / 180 * Math.PI // Широта ЗС (рад)
  LonStation = LonStation / 180 * Math.PI // Долгота ЗС (рад)
  const theta = zoneRadius / Re

  let coordinates = []

  for (let fi = -90; fi < 90; fi = fi + 0.01) {
    let coordinate = {}
    const lon = LonStation + Math.acos((Math.cos(theta) - Math.sin(fi * Math.PI / 180) * Math.sin(LatStation))
      / (Math.cos(fi * Math.PI / 180) * Math.cos(LatStation)))
    if (lon) {
      coordinate.latitude = fi
      coordinate.longitude = lon * 180 / Math.PI
      coordinates.push(olProj.transform([coordinate.longitude, coordinate.latitude], 'EPSG:4326', 'EPSG:3857'))
    }
  }
  for (let fi = 90; fi > -90; fi = fi - 0.01) {
    let coordinate = {}
    const lon = LonStation - Math.acos((Math.cos(theta) - Math.sin(fi * Math.PI / 180) * Math.sin(LatStation))
      / (Math.cos(fi * Math.PI / 180) * Math.cos(LatStation)))
    if (lon) {
      coordinate.latitude = fi
      coordinate.longitude = lon * 180 / Math.PI
      coordinates.push(olProj.transform([coordinate.longitude, coordinate.latitude], 'EPSG:4326', 'EPSG:3857'))
    }
  }
  return coordinates
}