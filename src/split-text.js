/**
 * split-text.js — Minimal char/word splitter
 * Free replacement for GSAP SplitText (paid plugin)
 * Usage: splitText(element, 'chars') or splitText(element, 'words')
 */

export function splitText(el, type = 'chars') {
  const original = el.innerHTML
  el.setAttribute('data-original', original)

  if (type === 'chars') {
    const text = el.innerText
    const lines = text.split('\n')
    el.innerHTML = lines
      .map(line =>
        line
          .split('')
          .map(char =>
            char === ' '
              ? '<span class="char char--space" aria-hidden="true"> </span>'
              : `<span class="char" aria-hidden="true">${char}</span>`
          )
          .join('')
      )
      .join('<br>')
    // Accessible: keep text in aria-label
    el.setAttribute('aria-label', text)
    return el.querySelectorAll('.char:not(.char--space)')
  }

  if (type === 'words') {
    const text = el.innerText
    const words = text.split(/\s+/)
    el.innerHTML = words
      .map(word => `<span class="word" aria-hidden="true">${word}</span>`)
      .join(' ')
    el.setAttribute('aria-label', text)
    return el.querySelectorAll('.word')
  }

  return []
}

export function revertSplit(el) {
  const original = el.getAttribute('data-original')
  if (original) {
    el.innerHTML = original
    el.removeAttribute('data-original')
    el.removeAttribute('aria-label')
  }
}
