/**
 * marquee.js — Infinite looping marquees
 * CSS animation approach: más fiable y performante que GSAP para loops puros.
 * JS solo clona el contenido para el seamless loop.
 */

export function initAllMarquees() {
  document.querySelectorAll('.marquee').forEach(marqueeEl => {
    const track = marqueeEl.querySelector('.marquee__track')
    if (!track) return

    const speed  = Number(marqueeEl.dataset.speed) || 80
    const dir    = Number(marqueeEl.dataset.dir)   || 1  // 1=left, -1=right

    // Clone for seamless loop
    const clone = track.cloneNode(true)
    clone.setAttribute('aria-hidden', 'true')
    marqueeEl.appendChild(clone)

    // Width of one track
    const trackW = track.scrollWidth

    // Duration: speed = px/s
    const duration = trackW / speed

    // Apply CSS custom props + animation
    marqueeEl.style.setProperty('--marquee-duration', `${duration}s`)
    marqueeEl.style.setProperty('--marquee-dir', dir === -1 ? 'reverse' : 'normal')

    track.classList.add('marquee__track--animated')
    clone.classList.add('marquee__track--animated')

    // Pause on reduced motion handled by CSS media query
  })
}
