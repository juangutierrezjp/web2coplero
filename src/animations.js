/**
 * animations.js — All GSAP ScrollTrigger scenes
 * Coplero — A.I. Content Production Company
 */

import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { splitText } from './split-text.js'

gsap.registerPlugin(ScrollTrigger)

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function initAnimations() {
  if (reduced) {
    // Show everything without animation
    gsap.set(['.hero__eyebrow', '.hero__sub', '.hero__ctas'], { opacity: 1 })
    document.querySelectorAll('[data-split="chars"]').forEach(el => el.style.opacity = '1')
    return
  }

  initHeroEntrance()
  initNavSolid()
  initSplitTextReveal()
  initScrollAtmosphere()
  initManifesto()
  initServiciosHorizontal()
  initPaquetes()
  initReel()
  initEquipo()
  initProceso()
  initCtaFinal()
}

/* ─── HERO ENTRANCE ──────────────────────────── */
function initHeroEntrance() {
  const sun  = document.querySelector('.hero__sun')
  const tl   = gsap.timeline({ defaults: { ease: 'power3.out' } })

  // Sun: scale in + continuous rotation
  if (sun) {
    gsap.set(sun, { scale: 0.4, opacity: 0 })
    gsap.to(sun, {
      rotate: 360,
      duration: 60,
      repeat: -1,
      ease: 'none',
    })
    tl.to(sun, { scale: 1, opacity: 0.065, duration: 2.5, ease: 'power2.out' }, 0)
  }

  // Headline chars: stagger reveal
  const headline = document.querySelector('.hero__headline')
  if (headline) {
    const lines = headline.querySelectorAll('.hero__line')
    lines.forEach(line => {
      const chars = splitText(line, 'chars')
      gsap.set(chars, { y: '110%', opacity: 0 })
    })

    tl.to(headline.querySelectorAll('.char'), {
      y: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.022,
      ease: 'expo.out',
    }, 0.3)
  }

  // Eyebrow
  tl.to('.hero__eyebrow', {
    opacity: 1,
    y: 0,
    duration: 0.7,
  }, 0.15)

  // Sub + CTAs
  tl.to('.hero__sub', {
    opacity: 0.65,
    duration: 0.7,
  }, 0.9)

  tl.to('.hero__ctas', {
    opacity: 1,
    duration: 0.6,
  }, 1.1)

  // Init hero sub and eyebrow y position
  gsap.set(['.hero__eyebrow'], { y: 20 })
}

/* ─── NAV SOLIDIFIES ON SCROLL ───────────────── */
function initNavSolid() {
  const nav = document.getElementById('nav')
  if (!nav) return

  ScrollTrigger.create({
    start: 'top+=80 top',
    onEnter:    () => nav.classList.add('is-scrolled'),
    onLeaveBack: () => nav.classList.remove('is-scrolled'),
  })
}

/* ─── SPLIT TEXT REVEAL (section titles etc) ─── */
function initSplitTextReveal() {
  document.querySelectorAll('[data-split="chars"]').forEach(el => {
    // Skip hero headline — handled separately
    if (el.closest('.hero__headline')) return

    const chars = splitText(el, 'chars')
    gsap.set(chars, { y: '110%', opacity: 0 })

    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(chars, {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.018,
          ease: 'expo.out',
        })
      }
    })
  })

  // Fade-up for general elements
  document.querySelectorAll('[data-animate="fade-up"]').forEach(el => {
    gsap.set(el, { opacity: 0, y: 40 })
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        })
      }
    })
  })
}

/* ─── MANIFESTO ──────────────────────────────── */
function initManifesto() {
  const quote = document.querySelector('.manifesto__quote')
  const body  = document.querySelectorAll('.manifesto__body p')

  if (quote) {
    gsap.set(quote, { opacity: 0, y: 50 })
    ScrollTrigger.create({
      trigger: quote,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(quote, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: 'expo.out',
        })
      }
    })
  }

  if (body.length) {
    gsap.set(body, { opacity: 0, y: 30 })
    ScrollTrigger.create({
      trigger: '.manifesto__body',
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(body, {
          opacity: 0.6,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
        })
      }
    })
  }
}

/* ─── SERVICIOS HORIZONTAL SCROLL ─────────────── */
function initServiciosHorizontal() {
  const section  = document.querySelector('.section--servicios')
  const viewport = document.querySelector('.servicios__viewport')
  const track    = document.querySelector('.servicios__track')

  if (!section || !track || !viewport) return

  const cards = Array.from(track.querySelectorAll('.servicio-card'))
  if (!cards.length) return

  // Horizontal: returns the x value that centers a given card in the viewport.
  // offsetLeft is measured at transform=none, which is what we want.
  const centerX = (card) =>
    viewport.clientWidth / 2 - (card.offsetLeft + card.offsetWidth / 2)

  const getStartX = () => centerX(cards[0])
  const getEndX   = () => centerX(cards[cards.length - 1])

  // Vertical: pin fires when the track's vertical center aligns with the viewport center.
  // GSAP "top+=N center" = when the point N px below section.top reaches viewport center.
  // N = distance from section top edge to track vertical center.
  const getPinStart = () => {
    const header = section.querySelector('.servicios__header')
    const sectionPadTop = parseFloat(getComputedStyle(section).paddingTop) || 0
    const headerH = header
      ? header.offsetHeight + (parseFloat(getComputedStyle(header).marginBottom) || 0)
      : 0
    const distToTrackCenter = sectionPadTop + headerH + viewport.offsetHeight / 2
    return `top+=${distToTrackCenter} center`
  }

  // fromTo: first card centered → last card centered
  const horizTween = gsap.fromTo(track,
    { x: getStartX },
    {
      x: getEndX,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 1.2,
        start: getPinStart,
        // Travel = exact distance between first and last card centers
        end: () => `+=${Math.abs(getEndX() - getStartX())}`,
        invalidateOnRefresh: true,
      }
    }
  )

  // Cards fade in as they scroll into view
  cards.forEach((card, i) => {
    gsap.set(card, { opacity: 0, y: 40 })
    ScrollTrigger.create({
      trigger: card,
      containerAnimation: horizTween,
      start: 'left right',
      once: true,
      onEnter: () => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.65,
          delay: i * 0.05,
          ease: 'power3.out',
        })
      }
    })
  })
}

/* ─── PAQUETES ───────────────────────────────── */
function initPaquetes() {
  const cards = document.querySelectorAll('.pack-card')
  if (!cards.length) return

  gsap.set(cards, { opacity: 0, y: 60 })

  ScrollTrigger.create({
    trigger: '.paquetes__grid',
    start: 'top 80%',
    once: true,
    onEnter: () => {
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        stagger: 0.1,
        ease: 'power3.out',
      })
    }
  })
}

/* ─── REEL ───────────────────────────────────── */
function initReel() {
  // Overlay visible por defecto — click en overlay arranca el video;
  // desaparece mientras se reproduce, vuelve al pausar/terminar
  document.querySelectorAll('.reel-item').forEach(item => {
    const video   = item.querySelector('video')
    const overlay = item.querySelector('.reel-item__overlay')
    if (!video) return

    // Click sobre el overlay → play
    if (overlay) {
      overlay.addEventListener('click', () => {
        video.play()
      })
    }

    video.addEventListener('play',  () => item.classList.add('is-playing'))
    video.addEventListener('pause', () => item.classList.remove('is-playing'))
    video.addEventListener('ended', () => item.classList.remove('is-playing'))
  })

  // Stagger reveal
  const items = document.querySelectorAll('.reel-item')
  gsap.set(items, { opacity: 0, scale: 0.95 })

  ScrollTrigger.create({
    trigger: '.reel__grid',
    start: 'top 80%',
    once: true,
    onEnter: () => {
      gsap.to(items, {
        opacity: 1,
        scale: 1,
        duration: 0.75,
        stagger: 0.07,
        ease: 'power3.out',
      })
    }
  })
}

/* ─── EQUIPO ─────────────────────────────────── */
function initEquipo() {
  const cards = document.querySelectorAll('.team-card')
  if (!cards.length) return

  gsap.set(cards, { opacity: 0, y: 60 })

  ScrollTrigger.create({
    trigger: '.equipo__grid',
    start: 'top 80%',
    once: true,
    onEnter: () => {
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        stagger: 0.15,
        ease: 'power3.out',
      })
    }
  })
}

/* ─── PROCESO ────────────────────────────────── */
function initProceso() {
  const steps = document.querySelectorAll('.proceso__step')
  if (!steps.length) return

  steps.forEach(step => {
    const num     = step.querySelector('.proceso__step-num')
    const content = step.querySelector('.proceso__step-content')

    gsap.set([num, content], { opacity: 0, x: -40 })

    ScrollTrigger.create({
      trigger: step,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(num, {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: 'expo.out',
        })
        gsap.to(content, {
          opacity: 1,
          x: 0,
          duration: 0.7,
          delay: 0.1,
          ease: 'expo.out',
        })
      }
    })
  })
}

/* ─── CTA FINAL ──────────────────────────────── */
function initCtaFinal() {
  const headline = document.querySelector('.cta-final__headline')
  const btn      = document.querySelector('.cta-final__btn')

  if (headline) {
    const spans = headline.querySelectorAll('span')
    gsap.set(spans, { opacity: 0, y: 60 })

    ScrollTrigger.create({
      trigger: headline,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(spans, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'expo.out',
        })
      }
    })
  }

  if (btn) {
    gsap.set(btn, { opacity: 0, y: 40, scale: 0.95 })
    ScrollTrigger.create({
      trigger: btn,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(btn, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: 0.5,
          ease: 'back.out(1.3)',
        })
      }
    })
  }
}

/* ─── SCROLL ATMOSPHERE ──────────────────────── */
function initScrollAtmosphere() {
  const manifesto = document.querySelector('.section--manifesto')
  const ctaFinal  = document.querySelector('.section--cta-final')
  if (!manifesto) return

  // Canvas fixed layer — driven by rAF (stars + isotipo need time + scroll animation)
  const canvas = document.createElement('canvas')
  canvas.id = 'scroll-atmosphere'
  document.body.prepend(canvas)
  const ctx = canvas.getContext('2d')

  let W, H
  function resize() {
    W = canvas.width  = window.innerWidth
    H = canvas.height = window.innerHeight
  }
  window.addEventListener('resize', resize)
  resize()

  // ── Helpers ──────────────────────────────────
  const lerp = (a, b, t) => a + (b - a) * t
  const eio  = t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t

  // ── 7 stages — paleta 100% brand (azul primario + eléctrico + dorado sutil) ──
  //
  // Base siempre cerca de #001B66 (R0 G27 B102) — oscuro para contraste con texto blanco.
  // Blobs: azul eléctrico #1718FF + índigo + dorado/ámbar muy atenuado.
  // Sin rojos, sin crimsons. Alfa de blobs máx ~0.22 para no romper legibilidad.
  //
  // s0 p=0.00 — Abismo     : navy casi puro, base de la marca
  // s1 p=0.17 — Despertar  : electric blue emerge (servicios)
  // s2 p=0.33 — Tormenta   : #1718FF dominante + índigo (paquetes)
  // s3 p=0.50 — Océano     : azul profundo + teal (reel)
  // s4 p=0.67 — Galaxia    : índigo + dorado muy sutil (proceso)
  // s5 p=0.83 — Cenit      : azul eléctrico + dorado equilibrado (clientes/faq)
  // s6 p=1.00 — Amanecer   : dorado del sol + electric blue (cta-final)
  const STAGES = [
    { // s0 — Abismo: base marca, todo oscuro
      baseR:0,  baseG:8,  baseB:22,
      aR:23,  aG:24,  aB:255, aA:0.03, ax:0.22, ay:-0.10, ar:1.10,
      bR:5,   bG:15,  bB:80,  bA:0.02, bx:0.55, by:1.05,  br:0.90,
      cR:10,  cG:20,  cB:100, cA:0.00, cx:0.85, cy:0.12,  cr:0.45,
      dR:10,  dG:20,  dB:90,  dA:0.00, dx:0.14, dy:0.90,  dr:0.65,
      eR:0,   eG:10,  eB:60,  eA:0.00, ex:0.50, ey:0.55,  er:0.40,
      gwA:0.00, gwY:0.90, cyA:0.00, purA:0.00,
      sunA:0.000, sunScl:1.00,
    },
    { // s1 — Despertar: electric blue emerge suavemente
      baseR:0,  baseG:10, baseB:28,
      aR:23,  aG:24,  aB:255, aA:0.52, ax:0.20, ay:-0.05, ar:1.05,
      bR:5,   bG:12,  bB:100, bA:0.18, bx:0.68, by:0.80,  br:0.85,
      cR:10,  cG:18,  cB:90,  cA:0.00, cx:0.85, cy:0.15,  cr:0.40,
      dR:150, dG:120, dB:20,  dA:0.04, dx:0.15, dy:0.88,  dr:0.60,
      eR:0,   eG:10,  eB:70,  eA:0.00, ex:0.50, ey:0.55,  er:0.40,
      gwA:0.04, gwY:0.76, cyA:0.06, purA:0.05,
      sunA:0.030, sunScl:1.00,
    },
    { // s2 — Tormenta: #1718FF full + índigo profundo
      baseR:1,  baseG:4,  baseB:24,
      aR:23,  aG:24,  aB:255, aA:0.20, ax:0.18, ay:0.10,  ar:0.88,
      bR:23,  bG:24,  bB:255, bA:0.16, bx:0.72, by:0.45,  br:0.70,
      cR:50,  cG:0,   cB:140, cA:0.16, cx:0.85, cy:0.16,  cr:0.50,
      dR:20,  dG:0,   dB:100, dA:0.14, dx:0.22, dy:0.68,  dr:0.55,
      eR:0,   eG:70,  eB:110, eA:0.08, ex:0.48, ey:0.78,  er:0.45,
      gwA:0.06, gwY:0.54, cyA:0.07, purA:0.08,
      sunA:0.050, sunScl:0.90,
    },
    { // s3 — Océano: azul marino profundo + teal atenuado
      baseR:2,  baseG:8,  baseB:28,
      aR:0,   aG:50,  aB:110, aA:0.16, ax:0.25, ay:0.32,  ar:0.80,
      bR:20,  bG:20,  bB:230, bA:0.14, bx:0.72, by:0.60,  br:0.75,
      cR:0,   cG:65,  cB:100, cA:0.12, cx:0.80, cy:0.20,  cr:0.50,
      dR:18,  dG:8,   dB:85,  dA:0.12, dx:0.18, dy:0.68,  dr:0.55,
      eR:10,  eG:75,  eB:120, eA:0.08, ex:0.50, ey:0.44,  er:0.42,
      gwA:0.04, gwY:0.50, cyA:0.04, purA:0.05,
      sunA:0.070, sunScl:0.92,
    },
    { // s4 — Galaxia: índigo + primer destello dorado
      baseR:2,  baseG:7,  baseB:20,
      aR:18,  aG:18,  aB:200, aA:0.16, ax:0.60, ay:0.62,  ar:0.85,
      bR:15,  bG:8,   bB:85,  bA:0.14, bx:0.22, by:0.30,  br:0.80,
      cR:160, cG:128, cB:18,  cA:0.07, cx:0.78, cy:0.48,  cr:0.55,
      dR:23,  dG:24,  dB:255, dA:0.12, dx:0.38, dy:0.55,  dr:0.50,
      eR:180, eG:145, eB:22,  eA:0.05, ex:0.16, ey:0.75,  er:0.40,
      gwA:0.05, gwY:0.44, cyA:0.00, purA:0.00,
      sunA:0.100, sunScl:1.08,
    },
    { // s5 — Cenit: azul eléctrico + dorado marca balanceados
      baseR:3,  baseG:8,  baseB:18,
      aR:23,  aG:24,  aB:255, aA:0.15, ax:0.28, ay:0.22,  ar:0.88,
      bR:185, bG:148, bB:22,  bA:0.13, bx:0.68, by:0.62,  br:0.75,
      cR:10,  cG:25,  cB:120, cA:0.14, cx:0.74, cy:0.38,  cr:0.55,
      dR:195, dG:158, dB:25,  dA:0.09, dx:0.22, dy:0.70,  dr:0.60,
      eR:23,  eG:24,  eB:255, eA:0.10, ex:0.54, ey:0.50,  er:0.45,
      gwA:0.10, gwY:0.56, cyA:0.00, purA:0.04,
      sunA:0.150, sunScl:1.25,
    },
    { // s6 — Amanecer (CTA): dorado del sol + eléctrico — el cierre de la marca
      baseR:4,  baseG:7,  baseB:16,
      aR:200, aG:158, aB:18,  aA:0.22, ax:0.50, ay:0.60,  ar:1.05,
      bR:23,  bG:24,  bB:255, bA:0.18, bx:0.20, by:0.36,  br:0.85,
      cR:215, cG:168, cB:22,  cA:0.16, cx:0.76, cy:0.46,  cr:0.60,
      dR:15,  dG:15,  dB:210, dA:0.14, dx:0.34, dy:0.28,  dr:0.55,
      eR:205, eG:170, eB:28,  eA:0.14, ex:0.62, ey:0.76,  er:0.50,
      gwA:0.18, gwY:0.60, cyA:0.00, purA:0.00,
      sunA:0.220, sunScl:1.50,
    },
  ]

  const N_ST = STAGES.length
  function kfLerp(key, p) {
    const seg = Math.min(Math.floor(p * (N_ST - 1)), N_ST - 2)
    const t0  = seg / (N_ST - 1)
    const t1  = (seg + 1) / (N_ST - 1)
    const t   = eio((p - t0) / (t1 - t0))
    return lerp(STAGES[seg][key], STAGES[seg + 1][key], t)
  }

  // ── Isotipo de Coplero ────────────────────────
  // Usa /public/isotipo.png — el sol de mayo de la marca
  const isotipoImg = new Image()
  isotipoImg.src   = '/isotipo.png'
  let isotipoReady = false
  isotipoImg.onload = () => { isotipoReady = true }

  function drawIsotipo(cx, cy, size, rotation, alpha) {
    if (!isotipoReady || alpha < 0.004 || size < 10) return
    // Respetar aspect ratio nativo de la imagen
    const nat    = isotipoImg.naturalWidth / (isotipoImg.naturalHeight || 1)
    const drawW  = nat >= 1 ? size : size * nat
    const drawH  = nat >= 1 ? size / nat : size
    const haloR  = Math.min(drawW, drawH) * 0.65
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.translate(cx, cy)
    ctx.rotate(rotation)
    // Halo suave detrás del isotipo
    const halo = ctx.createRadialGradient(0, 0, haloR * 0.1, 0, 0, haloR)
    halo.addColorStop(0,   'rgba(200,168,30,0.18)')
    halo.addColorStop(0.6, 'rgba(180,148,20,0.06)')
    halo.addColorStop(1,   'transparent')
    ctx.fillStyle = halo
    ctx.beginPath()
    ctx.arc(0, 0, haloR, 0, Math.PI * 2)
    ctx.fill()
    // Imagen centrada con proporciones originales
    ctx.globalCompositeOperation = 'screen'
    ctx.drawImage(isotipoImg, -drawW / 2, -drawH / 2, drawW, drawH)
    ctx.restore()
  }

  // ── Estrellas con parallax de scroll ─────────
  // Cada estrella tiene velocidad de parallax propia → capas de profundidad.
  // El movimiento principal es scroll-driven (p) + drift temporal suave.
  const STAR_N = 62
  const rng = (lo, hi) => lo + Math.random() * (hi - lo)
  // Precompute color: blanco puro o azul-gris marca (#E3E5F3)
  const stars = Array.from({ length: STAR_N }, () => {
    const isBrand = Math.random() > 0.55  // 45% brand blue-white, 55% pure white
    return {
      bx:    Math.random(),                  // base X [0,1]
      by:    Math.random(),                  // base Y [0,1]
      r:     rng(0.3, 1.9),                  // radius px
      phase: rng(0, Math.PI * 2),
      twSpd: rng(0.18, 0.82),               // twinkle speed
      maxA:  rng(0.07, 0.58),               // max alpha
      pxY:   rng(0.18, 0.90),               // parallax Y factor [0→1 of H]
      pxX:   rng(-0.18, 0.18),              // parallax X factor (small)
      cr: isBrand ? 220 : 255,
      cg: isBrand ? 229 : 255,
      cb: isBrand ? 243 : 255,
    }
  })

  function drawStars(t, p) {
    // Estrellas emergen progresivamente: desde p=0.10 hasta p=0.40
    const vis = Math.max(0, Math.min((p - 0.10) / 0.30, 1))
    if (vis < 0.01) return

    stars.forEach(s => {
      // Posición con parallax de scroll + drift temporal muy suave
      const rawY = s.by + p * s.pxY + t * 0.004 * (s.pxY - 0.5)
      const rawX = s.bx + p * s.pxX
      // Wrap modular [0,1)
      const sy = (((rawY % 1) + 1) % 1) * H
      const sx = (((rawX % 1) + 1) % 1) * W
      const sr = s.r

      // Parpadeo sinusoidal
      const pulse = Math.max(0, Math.sin(t * s.twSpd + s.phase))
      // Fade en bordes para suavizar el wrap
      const edgeY = Math.min(sy / (H * 0.06), 1) * Math.min((H - sy) / (H * 0.06), 1)
      const edgeX = Math.min(sx / (W * 0.03), 1) * Math.min((W - sx) / (W * 0.03), 1)
      const a = pulse * s.maxA * vis * Math.min(edgeY, edgeX)
      if (a < 0.006) return

      const { cr, cg, cb } = s

      // Glow suave exterior
      const grd = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr * 5)
      grd.addColorStop(0,   `rgba(${cr},${cg},${cb},${+(a * 0.82).toFixed(3)})`)
      grd.addColorStop(0.4, `rgba(${cr},${cg},${cb},${+(a * 0.18).toFixed(3)})`)
      grd.addColorStop(1,   'transparent')
      ctx.fillStyle = grd
      ctx.fillRect(sx - sr * 5, sy - sr * 5, sr * 10, sr * 10)

      // Core brillante
      ctx.fillStyle = `rgba(255,255,255,${+Math.min(a * 2.0, 0.95).toFixed(3)})`
      ctx.beginPath()
      ctx.arc(sx, sy, sr * 0.72, 0, Math.PI * 2)
      ctx.fill()

      // Rayos cruzados para estrellas grandes
      if (sr > 0.85 && a > 0.042) {
        ctx.save()
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${+(a * 0.42).toFixed(3)})`
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.moveTo(sx - sr * 3.8, sy); ctx.lineTo(sx + sr * 3.8, sy)
        ctx.moveTo(sx, sy - sr * 3.8); ctx.lineTo(sx, sy + sr * 3.8)
        ctx.stroke()
        ctx.restore()
      }
    })
  }

  // ── Blob ─────────────────────────────────────
  function drawBlob(r, g, b, a, x, y, rad) {
    if (a < 0.004 || rad < 0.02) return
    const grd = ctx.createRadialGradient(W*x, H*y, 0, W*x, H*y, W*rad)
    grd.addColorStop(0,    `rgba(${r|0},${g|0},${b|0},${a})`)
    grd.addColorStop(0.45, `rgba(${r|0},${g|0},${b|0},${a * 0.42})`)
    grd.addColorStop(1,    'transparent')
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, W, H)
  }

  // ── rAF loop ─────────────────────────────────
  let currentP = 0
  const T0 = performance.now()
  let rafId

  function frame(now) {
    if (!W) { rafId = requestAnimationFrame(frame); return }
    const t = (now - T0) / 1000
    const p = currentP

    ctx.clearRect(0, 0, W, H)

    const baseR=kfLerp('baseR',p), baseG=kfLerp('baseG',p), baseB=kfLerp('baseB',p)
    const aR=kfLerp('aR',p), aG=kfLerp('aG',p), aB=kfLerp('aB',p), aA=kfLerp('aA',p)
    const ax=kfLerp('ax',p), ay=kfLerp('ay',p), ar=kfLerp('ar',p)
    const bR=kfLerp('bR',p), bG=kfLerp('bG',p), bB=kfLerp('bB',p), bA=kfLerp('bA',p)
    const bx=kfLerp('bx',p), by=kfLerp('by',p), br=kfLerp('br',p)
    const cR=kfLerp('cR',p), cG=kfLerp('cG',p), cB=kfLerp('cB',p), cA=kfLerp('cA',p)
    const cx=kfLerp('cx',p), cy=kfLerp('cy',p), cr=kfLerp('cr',p)
    const dR=kfLerp('dR',p), dG=kfLerp('dG',p), dB=kfLerp('dB',p), dA=kfLerp('dA',p)
    const dx=kfLerp('dx',p), dy=kfLerp('dy',p), dr=kfLerp('dr',p)
    const eR=kfLerp('eR',p), eG=kfLerp('eG',p), eB=kfLerp('eB',p), eA=kfLerp('eA',p)
    const ex=kfLerp('ex',p), ey=kfLerp('ey',p), er=kfLerp('er',p)
    const gwA=kfLerp('gwA',p), gwY=kfLerp('gwY',p)
    const cyA=kfLerp('cyA',p), purA=kfLerp('purA',p)
    const sunA=kfLerp('sunA',p), sunScl=kfLerp('sunScl',p)

    // 1 — Base fill
    ctx.fillStyle = `rgb(${baseR|0},${baseG|0},${baseB|0})`
    ctx.fillRect(0, 0, W, H)

    // 2 — Blobs de color
    drawBlob(aR, aG, aB, aA, ax, ay, ar)
    drawBlob(bR, bG, bB, bA, bx, by, br)
    drawBlob(cR, cG, cB, cA, cx, cy, cr)
    drawBlob(dR, dG, dB, dA, dx, dy, dr)
    drawBlob(eR, eG, eB, eA, ex, ey, er)

    // 3 — Isotipo Coplero: flota suavemente, rota lento, screen blend
    const isoSize = Math.min(W, H) * 0.38 * sunScl
    const isoX    = W * (0.74 + Math.sin(t * 0.063) * 0.045)
    const isoY    = H * (0.65 + Math.cos(t * 0.049) * 0.055)
    const isoPulse = sunA * (0.80 + 0.20 * Math.sin(t * 0.32 + 1.1))
    drawIsotipo(isoX, isoY, isoSize, 0, isoPulse)

    // 4 — Estrellas con parallax scroll
    drawStars(t, p)

    // 5 — Vignette oscuro superior — protege legibilidad del texto
    const vign = ctx.createLinearGradient(0, 0, 0, H * 0.46)
    vign.addColorStop(0,   'rgba(0,3,12,0.80)')
    vign.addColorStop(0.5, 'rgba(0,3,12,0.18)')
    vign.addColorStop(1,   'transparent')
    ctx.fillStyle = vign
    ctx.fillRect(0, 0, W, H * 0.46)

    // 6 — Línea de intersección / glow horizontal
    if (gwA > 0.005) {
      const ly = H * gwY
      const lh = H * 0.08
      const gw = ctx.createLinearGradient(0, ly - lh, 0, ly + lh)
      gw.addColorStop(0,   'transparent')
      gw.addColorStop(0.5, `rgba(215,185,60,${gwA})`)
      gw.addColorStop(1,   'transparent')
      ctx.fillStyle = gw
      ctx.fillRect(0, ly - lh * 1.6, W, lh * 3.2)
    }

    // 7 — Aberración cromática (solo en stages 1-2-3)
    if (cyA > 0.003 || purA > 0.003) {
      const iz  = H * (gwY - 0.08)
      const abr = W * 0.24
      if (cyA > 0.003) {
        const cyn = ctx.createRadialGradient(W*0.32, iz, 0, W*0.32, iz, abr)
        cyn.addColorStop(0, `rgba(68,160,255,${cyA})`)
        cyn.addColorStop(1, 'transparent')
        ctx.fillStyle = cyn
        ctx.fillRect(0, 0, W, H)
      }
      if (purA > 0.003) {
        const pur = ctx.createRadialGradient(W*0.66, iz, 0, W*0.66, iz, abr)
        pur.addColorStop(0, `rgba(100,68,220,${purA})`)
        pur.addColorStop(1, 'transparent')
        ctx.fillStyle = pur
        ctx.fillRect(0, 0, W, H)
      }
    }

    rafId = requestAnimationFrame(frame)
  }

  rafId = requestAnimationFrame(frame)

  // Pausa rAF cuando la pestaña está oculta
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(rafId)
    else rafId = requestAnimationFrame(frame)
  })

  // ── Fade in — empieza al entrar manifesto ─────
  ScrollTrigger.create({
    trigger: manifesto,
    start: 'top 75%',
    end: 'top 5%',
    scrub: 1.5,
    onUpdate(self) { canvas.style.opacity = self.progress },
  })

  // ── Fade out — al final del cta-final ────────
  if (ctaFinal) {
    ScrollTrigger.create({
      trigger: ctaFinal,
      start: 'bottom 75%',
      end: 'bottom top',
      scrub: 1.5,
      onUpdate(self) {
        canvas.style.opacity = 1 - self.progress * 0.7
      },
    })
  }

  // ── Color progress — manifesto → cta-final ───
  const endSection = ctaFinal
    || document.querySelector('.section--faq')
    || document.querySelector('.section--proceso')
  ScrollTrigger.create({
    trigger: manifesto,
    endTrigger: endSection,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate(self) { currentP = self.progress },
  })
}
