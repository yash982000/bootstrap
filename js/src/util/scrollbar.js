/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.0-beta3): util/scrollBar.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import SelectorEngine from '../dom/selector-engine'
import Manipulator from '../dom/manipulator'
import { isElement } from './index'

const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top'
const SELECTOR_STICKY_CONTENT = '.sticky-top'

const _doc = document.documentElement

const getWidth = () => {
  // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes
  const documentWidth = _doc.clientWidth
  return Math.abs(window.innerWidth - documentWidth)
}

const hide = (width = getWidth()) => {
  _disableOverFlow()
  _setElementAttributes(_doc, 'paddingRight', calculatedValue => calculatedValue + width)
  // trick: We adjust positive paddingRight and negative marginRight to sticky-top elements, to keep shown fullwidth
  _setElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight', calculatedValue => calculatedValue + width)
  _setElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight', calculatedValue => calculatedValue - width)
}

const _disableOverFlow = () => {
  const actualValue = _doc.style.overflowY
  if (actualValue.length) {
    Manipulator.setDataAttribute(_doc, 'overflowY', actualValue)
  }

  _doc.style.overflowY = 'hidden'
}

const _setElementAttributes = (selector, styleProp, callback) => {
  const scrollbarWidth = getWidth()
  const manipulationCallBack = element => {
    if (element !== _doc && window.innerWidth > element.clientWidth + scrollbarWidth) {
      return
    }

    const actualValue = element.style[styleProp]
    if (actualValue.length) {
      Manipulator.setDataAttribute(element, styleProp, actualValue)
    }

    const calculatedValue = window.getComputedStyle(element)[styleProp]
    element.style[styleProp] = `${callback(Number.parseFloat(calculatedValue))}px`
  }

  _applyManipulationCallback(selector, manipulationCallBack)
}

const reset = () => {
  _resetElementAttributes(_doc, 'overflowY')
  _resetElementAttributes(_doc, 'paddingRight')
  _resetElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight')
  _resetElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight')
}

const _resetElementAttributes = (selector, styleProp) => {
  const manipulationCallBack = element => {
    const value = Manipulator.getDataAttribute(element, styleProp)
    if (typeof value === 'undefined') {
      element.style.removeProperty(styleProp)
    } else {
      Manipulator.removeDataAttribute(element, styleProp)
      element.style[styleProp] = value
    }
  }

  _applyManipulationCallback(selector, manipulationCallBack)
}

const _applyManipulationCallback = (selector, callBack) => {
  if (isElement(selector)) {
    callBack(selector)
  } else {
    SelectorEngine.find(selector).forEach(callBack)
  }
}

const isBodyOverflowing = () => {
  return getWidth() > 0
}

export {
  getWidth,
  hide,
  isBodyOverflowing,
  reset
}
