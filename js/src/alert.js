/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.0-beta3): alert.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import {
  defineJQueryPlugin,
  emulateTransitionEnd,
  getElementFromSelector,
  getTransitionDurationFromElement
} from './util/index'
import EventHandler from './dom/event-handler'
import BaseComponent from './base-component'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'alert'
const DATA_KEY = 'bs.alert'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'

const SELECTOR_DISMISS = '[data-bs-dismiss="alert"]'

const EVENT_CLOSE = `close${EVENT_KEY}`
const EVENT_CLOSED = `closed${EVENT_KEY}`
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`

const CLASS_NAME_ALERT = 'alert'
const CLASS_NAME_FADE = 'fade'
const CLASS_NAME_SHOW = 'show'

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Alert extends BaseComponent {
  // Getters

  static get DATA_KEY() {
    return DATA_KEY
  }

  // Public

  close() {
    const closeEvent = EventHandler.trigger(this._element, EVENT_CLOSE)

    if (closeEvent.defaultPrevented) {
      return
    }

    this._removeElement()
  }

  // Private
  _removeElement() {
    this._element.classList.remove(CLASS_NAME_SHOW)

    if (!this._element.classList.contains(CLASS_NAME_FADE)) {
      this._destroyElement()
      return
    }

    const transitionDuration = getTransitionDurationFromElement(this._element)
    EventHandler.one(this._element, 'transitionend', () => this._destroyElement())
    emulateTransitionEnd(this._element, transitionDuration)
  }

  _destroyElement() {
    this._element.parentNode.removeChild(this._element)
    EventHandler.trigger(this._element, EVENT_CLOSED)
    this.dispose()
  }

  // Static

  static jQueryInterface(config) {
    return this.each(function () {
      const data = Alert.getInstance(this) || new Alert(this)

      if (typeof config !== 'string') {
        return
      }

      if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
        throw new TypeError(`No method named "${config}"`)
      }

      data[config](this)
    })
  }
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DISMISS, function (event) {
  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault()
  }

  const target = getElementFromSelector(this) || this.closest(`.${CLASS_NAME_ALERT}`)
  const alert = Alert.getInstance(target) || new Alert(target)
  alert.close()
})

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Alert to jQuery only if jQuery is present
 */

defineJQueryPlugin(NAME, Alert)

export default Alert
