import mapboxgl from 'mapbox-gl'
import TilecloudControl from '@tilecloud/mbgl-tilecloud-control'
import GestureHandling from '@tilecloud/mbgl-gesture-handling'
import parseApiKey from './parse-api-key'

const getStyleURL = (styleName, userKey, stage = 'v1') => {
  return `https://api.tilecloud.io/${stage}/styles/${styleName}?key=${userKey}`
}


export const render = (container) => {
  const lat = parseFloat(container.dataset.lat) || 0
  const lng = parseFloat(container.dataset.lng) || 0
  const zoom = parseFloat(container.dataset.zoom) || 0
  const bearing = parseFloat(container.dataset.bearing) || 0
  const pitch = parseFloat(container.dataset.pitch) || 0
  const customMarkerClass = container.dataset.markerClass || null
  const hash = (container.dataset.hash || 'false').toUpperCase() === 'TRUE'
  const center = lat && lng ? [lng, lat] : false
  const gestureHandling = (container.dataset['gesture-handling'] || 'true').toUpperCase() === 'TRUE'
  const style = container.dataset.style || 'osm-bright'
  const key = container.dataset.key || parseApiKey()

  const options = {
    style: getStyleURL(style, key),
    container,
    center: center,
    bearing: bearing,
    pitch: pitch,
    zoom: zoom,
    hash,
    localIdeographFontFamily: 'sans-serif',
    attributionControl: true,
  }

  // Getting content should be fire just before initialize the map.
  const content = container.innerHTML.trim()
  container.innerHTML = ''

  const map = new mapboxgl.Map({...options})

  if (gestureHandling) {
    new GestureHandling().addTo(map)
  }

  map.addControl(new mapboxgl.NavigationControl())
  map.addControl(new mapboxgl.GeolocateControl())
  map.addControl(new TilecloudControl())

  map.on('load', event => {
    const map = event.target
    if (center) {
      if (content) {
        const popup = new mapboxgl.Popup().setHTML(content)
        if (customMarkerClass) {
          const el = document.createElement('div')
          el.className = customMarkerClass
          new mapboxgl.Marker(el).setLngLat(center).addTo(map).setPopup(popup)
        } else {
          new mapboxgl.Marker().setLngLat(center).addTo(map).setPopup(popup)
        }
      } else {
        new mapboxgl.Marker().setLngLat(center).addTo(map)
      }
    }
  })
}

export default render
