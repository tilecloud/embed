'use strict'

import * as util from './util'

class GestureHandling {
  constructor(options = {}) {
    this.fullscreen = false
    this.id = `mbgl-gesture-handling-help-container-${GestureHandling.count}`
    GestureHandling.count++
    this.timer = null

    let textMessage = 'Use alt + scroll to zoom the map.'
    let textMessageMobile = 'Use two fingers to move the map.'
    const lang = (options.lang === 'auto' || !options.lang) ? util.getLang() : options.lang
    if ('ja' === lang) {
      textMessage = 'Alt キーを押しながらスクロールしてください。'
      textMessageMobile = '2本指を使って操作してください。'
    }

    this.settings = {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      textColor: '#ffffff',
      textMessage: textMessage,
      textMessageMobile: textMessageMobile,
      timeout: 2000,
      ...options,
    }

    this.helpElement = document.querySelector(`#${this.id}`)

    if (null === this.helpElement) {
      this.helpElement = document.createElement('div')
      this.helpElement.id = this.id
      this.helpElement.style.backgroundColor = this.settings.backgroundColor
      this.helpElement.style.position = 'absolute'
      this.helpElement.style.display = 'none'
      this.helpElement.style.zIndex = 9999
      this.helpElement.style.justifyContent = 'center'
      this.helpElement.style.alignItems = 'center'

      const textBox = document.createElement('div')
      textBox.style.textAlign = 'center'
      textBox.style.color = this.settings.textColor
      textBox.innerText = ''

      this.helpElement.appendChild(textBox)
    }
  }

  showHelp(map, message) {
    this.helpElement.style.top = 0
    this.helpElement.style.left = 0
    this.helpElement.style.width = '100%'
    this.helpElement.style.height = '100%'
    this.helpElement.style.display = 'flex'

    this.helpElement.querySelector('div').innerText = message

    map.getContainer().appendChild(this.helpElement)
  }

  hideHelp(map) {
    map.getContainer().removeChild(this.helpElement)
  }

  addTo(map) {
    map.scrollZoom.disable()

    this.helpElement.addEventListener('wheel', event => {
      if (event.altKey || true === this.fullscreen) {
        event.preventDefault()
        this.hideHelp(map)
      } else {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.hideHelp(map)
        }, this.settings.timeout)
      }
    })

    map.getContainer().addEventListener('wheel', event => {
      if (event.altKey || true === this.fullscreen) {
        event.preventDefault()
        if (!map.scrollZoom.isEnabled()) {
          map.scrollZoom.enable()
        }
      } else {
        map.scrollZoom.disable()
        this.showHelp(map, this.settings.textMessage)
        this.timer = setTimeout(() => {
          this.hideHelp(map)
        }, this.settings.timeout)
      }
    })

    this.helpElement.addEventListener('touchstart', event => {
      if (event.touches && (2 <= event.touches.length || true === this.fullscreen)) {
        clearTimeout(this.timer)
        this.hideHelp(map)
        map.dragPan.enable()
        event.preventDefault()
      }
    })

    map.on('movestart', event => {
      if (event.originalEvent && 'touches' in event.originalEvent
              && 2 > event.originalEvent.touches.length && false === this.fullscreen) {
        this.showHelp(map, this.settings.textMessageMobile)
        map.dragPan.disable()
        this.timer = setTimeout(() => {
          map.dragPan.enable()
          this.hideHelp(map)
        }, this.settings.timeout)
      }
    })

    document.addEventListener('fullscreenchange', () => {
      if ( document.fullscreenElement ) {
        this.fullscreen = true
      } else {
        this.fullscreen = false
      }
    })
  }
}

GestureHandling.count = 0 // static

export default GestureHandling
