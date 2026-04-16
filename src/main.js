/**
 * main.js — Entry point
 * Coplero — A.I. Content Production Company
 */

import './styles/main.css'

import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

import { initLenis }      from './lenis-setup.js'
import { initCursor }     from './cursor.js'
import { initAllMarquees } from './marquee.js'
import { initAnimations } from './animations.js'

gsap.registerPlugin(ScrollTrigger)

// ─── INIT ────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // 1. Smooth scroll
  initLenis()

  // 2. Custom cursor
  initCursor()

  // 3. Infinite marquees
  initAllMarquees()

  // 4. GSAP animations + ScrollTrigger scenes
  initAnimations()

  // 5. Anchor scroll with offset (accounts for fixed nav)
  initAnchorScroll()

  // 6. FAQ accordion smooth height
  initFAQ()
})

// ─── ANCHOR SCROLL ────────────────────────────────

function initAnchorScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href')
      if (id === '#') return
      const target = document.querySelector(id)
      if (!target) return
      e.preventDefault()

      const navH = document.getElementById('nav')?.offsetHeight || 80
      const y = target.getBoundingClientRect().top + window.scrollY - navH

      window.scrollTo({ top: y, behavior: 'smooth' })
    })
  })
}

// ─── FAQ ──────────────────────────────────────────

function initFAQ() {
  document.querySelectorAll('.faq__item').forEach(details => {
    const summary = details.querySelector('.faq__question')
    const answer  = details.querySelector('.faq__answer')
    if (!summary || !answer) return

    // Intercept click so we can animate before browser toggles open state
    summary.addEventListener('click', e => {
      e.preventDefault()
      gsap.killTweensOf(answer)

      if (details.open) {
        // Closing: animate then remove [open]
        const h = answer.offsetHeight || answer.scrollHeight
        gsap.to(answer, {
          height: 0,
          opacity: 0,
          paddingBottom: 0,
          duration: 0.35,
          ease: 'power3.in',
          onComplete: () => { details.open = false }
        })
      } else {
        // Opening: set open first (so browser renders content), then animate
        details.open = true
        const h = answer.scrollHeight
        gsap.fromTo(answer,
          { height: 0, opacity: 0, paddingBottom: 0 },
          {
            height: h,
            opacity: 0.65,
            paddingBottom: '1.5rem',
            duration: 0.45,
            ease: 'power3.out',
            onComplete: () => { answer.style.height = 'auto' }
          }
        )
      }
    })
  })
}
