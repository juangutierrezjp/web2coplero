/**
 * lenis-setup.js — Smooth scroll with Lenis
 * Synced with GSAP ticker + ScrollTrigger
 */

import Lenis from 'lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

let lenisInstance = null

export function initLenis() {
  lenisInstance = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
  })

  // Sync Lenis with GSAP ticker (required for ScrollTrigger compatibility)
  lenisInstance.on('scroll', ScrollTrigger.update)

  gsap.ticker.add(time => {
    lenisInstance.raf(time * 1000)
  })

  gsap.ticker.lagSmoothing(0)

  return lenisInstance
}

export function getLenis() {
  return lenisInstance
}

// Smooth scroll to anchor
export function scrollTo(target, offset = 0) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { offset })
  }
}
