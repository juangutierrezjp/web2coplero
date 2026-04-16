/**
 * cursor.js — Custom cursor with sol Coplero
 * Follows mouse with GSAP quickTo for silky movement
 * Transforms to animated sun on CTA hover
 */

import gsap from 'gsap'

export function initCursor() {
  // Only on pointer devices
  if (!window.matchMedia('(pointer: fine)').matches) return

  const cursor     = document.getElementById('cursor')
  const dot        = cursor.querySelector('.cursor__dot')
  const ring       = cursor.querySelector('.cursor__ring')
  const sol        = cursor.querySelector('.cursor__sol')

  if (!cursor) return

  let dotX, dotY, ringX, ringY

  // GSAP quickTo for maximum smoothness
  dotX  = gsap.quickTo(dot,  'x', { duration: 0.1, ease: 'none' })
  dotY  = gsap.quickTo(dot,  'y', { duration: 0.1, ease: 'none' })
  ringX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power2.out' })
  ringY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power2.out' })

  const solX = gsap.quickTo(sol, 'x', { duration: 0.35, ease: 'power2.out' })
  const solY = gsap.quickTo(sol, 'y', { duration: 0.35, ease: 'power2.out' })

  // Sol rotation (continuous)
  gsap.to(sol, {
    rotate: 360,
    duration: 6,
    repeat: -1,
    ease: 'none',
  })

  // Mouse move
  window.addEventListener('mousemove', e => {
    const { clientX: x, clientY: y } = e
    dotX(x); dotY(y)
    ringX(x); ringY(y)
    solX(x); solY(y)
  })

  // Show on enter, hide on leave
  document.addEventListener('mouseenter', () => {
    gsap.to([dot, ring], { opacity: 1, duration: 0.3 })
  })

  document.addEventListener('mouseleave', () => {
    gsap.to([dot, ring, sol], { opacity: 0, duration: 0.3 })
  })

  // CTA hover states
  const ctaEls = document.querySelectorAll('[data-cursor="cta"]')

  ctaEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor--cta')
      gsap.to(sol, { opacity: 1, width: 60, height: 60, duration: 0.35, ease: 'back.out(1.5)' })
      gsap.to([dot, ring], { opacity: 0, duration: 0.2 })
    })
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor--cta')
      gsap.to(sol, { opacity: 0, width: 40, height: 40, duration: 0.3, ease: 'power2.in' })
      gsap.to([dot, ring], { opacity: 1, duration: 0.3 })
    })
  })

  // Hover on clickables: shrink dot, expand ring
  const clickables = document.querySelectorAll('a:not([data-cursor="cta"]), button:not([data-cursor="cta"])')

  clickables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(dot,  { scale: 0, duration: 0.25 })
      gsap.to(ring, { scale: 1.5, borderColor: 'rgba(255 255 255 / 0.9)', duration: 0.3 })
    })
    el.addEventListener('mouseleave', () => {
      gsap.to(dot,  { scale: 1, duration: 0.25 })
      gsap.to(ring, { scale: 1, borderColor: 'rgba(255 255 255 / 0.5)', duration: 0.3 })
    })
  })
}
