# Coplero — A.I. Content Production Company
## Contexto del proyecto para Claude Code

---

## ¿Qué es Coplero?

Coplero es una productora audiovisual argentina impulsada por inteligencia artificial. Combinamos tecnología de vanguardia con una metodología de trabajo precisa y eficiente. Priorizamos profesionalismo, realismo, velocidad y calidad en cada proyecto.

**Servicios que ofrece Coplero:**
- Videos publicitarios generados/asistidos por IA (spots, ads, virales)
- UGC & Avatares IA (contenido estilo user-generated con avatares hiperrealistas)
- Paquetes de contenido social: posts, reels, historias — producción mensual recurrente
- Estrategia de contenido + guionización

**Tagline oficial:** A.I. Content Production Company  
**Origen:** Argentina · "desde el sur"  
**CTA principal:** WhatsApp directo — número en `<!-- TODO:USER -->` en index.html

---

## Brandbook Reference

El brandbook completo está en `BrandbookCoplero.pdf`. Versión texto en `brandbook.txt`.

### Identidad conceptual
El signo surge de una reinterpretación del **sol argentino**. Mediante espacio negativo, el sol se transforma en la letra **C** (inicial de COPLERO), integrando identidad nacional y nombre de marca en un único gesto visual.

### Paleta cromática oficial

| Color | HEX | RGB | CMYK |
|---|---|---|---|
| Azul Primario | `#001B66` | R0 G27 B102 | C100 M74 Y0 K60 |
| Azul Eléctrico | `#1718FF` | R23 G24 B255 | C91 M91 Y0 K0 |
| Gris Claro | `#E3E5F3` | R227 G229 B243 | C7 M6 Y0 K5 |
| Negro | `#000000` | R0 G0 B0 | C0 M0 Y0 K100 |

**El fondo global es `#001B66` (azul primario)**. El texto base es `#E3E5F3`.

### Tipografía oficial

| Rol | Fuente | Pesos |
|---|---|---|
| Principal (display) | Darker Grotesque | ExtraBold 800/900, Bold |
| Secundaria (body) | Helvetica Neue | Bold, Medium, Light |
| Editorial accent (italic serif) | Fraunces (web, libre) / IvyOra Display (comercial) | Italic 300–900 |

**En web usamos:** Darker Grotesque (Google Fonts) + Fraunces italic (Google Fonts, variable) + Helvetica Neue fallback stack para body.

### Usos NO permitidos (brandbook)
- No modificar el color del signo
- No modificar la tipografía oficial
- No deformar la marca
- No usar sobre colores institucionales sin contraste suficiente
- No usar versión negativa sobre fondos neutros claros

---

## Stack técnico

| Herramienta | Versión | Propósito |
|---|---|---|
| Vite | ^5.4 | Bundler / dev server |
| GSAP | ^3.12 | Animaciones y ScrollTrigger |
| Lenis | ^1.1 | Smooth scroll sincronizado con GSAP |
| Vanilla JS | ES2022 | Sin frameworks UI |
| CSS moderno | Layers, clamp(), custom props | Sistema visual |

### Comandos

```bash
npm install          # instalar dependencias
npm run dev          # dev server en http://localhost:5173
npm run build        # build de producción → dist/
npm run preview      # previsualizar el build
```

---

## Arquitectura de archivos

```
web2coplero/
├── index.html              # markup completo — 11 secciones one-page
├── package.json
├── vite.config.js
├── CLAUDE.md               # este archivo
├── public/
│   ├── Coplero.png         # logo original blanco s/ fondo (usa en <img>)
│   ├── sol-coplero.svg     # solo el sol, para elemento decorativo / animado
│   ├── favicon.svg         # sol tiny para pestaña del browser
│   └── reel/               # videos del portfolio — TODO:USER agregar .mp4
├── src/
│   ├── main.js             # entry point: init Lenis + cursor + animations
│   ├── animations.js       # todas las escenas GSAP (ScrollTrigger, hero, etc)
│   ├── cursor.js           # cursor custom (sol que sigue el mouse)
│   ├── lenis-setup.js      # Lenis smooth scroll sincronizado con GSAP ticker
│   ├── split-text.js       # util para partir texto en chars/words (free, no SplitText)
│   ├── marquee.js          # loops infinitos (hero tags + logos clientes)
│   └── styles/
│       ├── main.css        # @layer tokens + reset + typography + utilities
│       ├── layout.css      # containers, grids, secciones
│       ├── components.css  # buttons, cards, accordion, badges, cursor
│       └── sections.css    # estilos por sección (hero, servicios, paquetes…)
└── brandbook.txt           # texto extraído del PDF — solo referencia interna
```

---

## Filosofía de diseño

**Dirección:** Cinematic dark editorial con brutalismo tipográfico argentino.

- **Fondo**: `#001B66` prácticamente absoluto — no hay fondo blanco/gris.
- **Textos display**: Darker Grotesque 900, tracking -0.04em, uppercase, tamaños brutales con `clamp()`.
- **Acento editorial**: Fraunces italic para pull-quotes, eyebrows, palabras enfatizadas dentro de headlines.
- **El sol** es el elemento diferenciador: aparece como mark gigante rotando en el hero (opac 12%), como bullets en las cards de servicios, y en el cursor custom.
- **Grain texture** en todo el sitio (SVG feTurbulence + overlay, opac 8%).
- **Marquee infinito** de tags en el hero y de logos en la sección de clientes.
- **Scroll horizontal pinneado** en la sección de Servicios (GSAP ScrollTrigger pin).

### Lo que NUNCA hacer en este proyecto
- No usar Inter, Roboto, Arial como fuente principal
- No usar purple gradients ni paletas no autorizadas por el brandbook
- No layouts genéricos Bootstrap-style
- No cambiar la paleta de azules — es la identidad registrada de Coplero
- No usar `cursor: default` — el cursor custom está activado en desktop

---

## Sistema de animación

**Librería**: GSAP + ScrollTrigger (registrado en main.js).  
**Smooth scroll**: Lenis sincronizado vía `gsap.ticker`.

### Patrón estándar para nueva escena ScrollTrigger

```js
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.from('.mi-elemento', {
  opacity: 0,
  y: 60,
  duration: 0.8,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.mi-elemento',
    start: 'top 80%',
    toggleActions: 'play none none reverse',
  }
})
```

### Convención de atributos HTML para animaciones

| Atributo | Uso |
|---|---|
| `data-split="chars"` | El elemento se parte en chars individuales en animations.js |
| `data-split="words"` | El elemento se parte en palabras |
| `data-cursor="cta"` | El cursor custom crece en hover sobre este elemento |
| `data-animate="fade-up"` | Fade+Y básico al entrar en viewport |

### prefers-reduced-motion
Todas las animaciones no-esenciales están envueltas en:
```js
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) { /* animación */ }
```

---

## Copy — Tono de voz y guidelines

- **Idioma**: Español argentino (ES-AR). Voseo ("querés", "tenés").
- **Tono**: Directo, con actitud, orientado a resultados. Sin marketing-speak vacío.
- **Referencias argentinas**: Sutiles ("desde el sur", "hecho en Argentina"). No folklore obvio.
- **Palabras clave en italic serif**: *vende*, *atención*, *impacto*, *mensaje* — se usa `<em>` con Fraunces.
- **Uppercase en headers**: siempre. Títulos de sección en mayúsculas via CSS, no hardcoded.
- **Números**: Se escriben como palabras en el copy ("cinco días", "un mensaje") pero como cifras en los bullets de packs ("8 posts", "4 reels").

---

## Placeholders — TODO:USER antes de producción

Buscar `<!-- TODO:USER -->` en index.html para encontrar todos los items a reemplazar:

1. **Número de WhatsApp**: reemplazar `54911XXXXXXX` con el número real (formato internacional sin +)
2. **Videos del reel**: agregar archivos `.mp4` en `public/reel/` y actualizar los `<source src>` en la sección #reel
3. **Logos de clientes**: reemplazar placeholders SVG en la sección `.section--clientes`
4. **Precios de paquetes**: reemplazar `<!-- TODO:USER precio -->` en las 3 pack-cards
5. **Links de redes sociales**: actualizar href de Instagram, TikTok, LinkedIn en el footer
6. **OG Image**: reemplazar `public/og-image.jpg` con imagen real 1200×630

---

## Skills disponibles

Instaladas en `.claude/skills/`:
- `frontend-design` — guía de diseño frontend production-grade (Anthropic oficial)
- `ui-ux-pro-max` — 67 estilos UI, 161 paletas, 57 font pairings

Estas skills se activan automáticamente cuando Claude Code trabaja en tareas de frontend en este proyecto.
