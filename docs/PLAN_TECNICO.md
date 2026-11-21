# Diagnóstico técnico y plan de acción — Portafolio

> Alcance: **solo técnico** (arquitectura, código, rendimiento, build, SEO técnico, accesibilidad y despliegue). No se evalúa contenido, redacción, proyectos ni branding.

## Restricciones que todo cambio debe respetar

1. **Cloudflare Pages, plan gratuito, 100 % estático.** Sin Workers, Functions, rutas API, SSR ni servicios de pago. Límites a respetar: 20.000 archivos por despliegue, 25 MiB por archivo, 500 builds al mes, 20 minutos por build, hasta 100 reglas en `_headers` y 2.000 redirecciones estáticas en `_redirects`.
2. **Mantener el estilo Liquid Glass.** No se quitan `backdrop-filter`, bordes especulares (`.glass::before`), capas translúcidas ni el fondo ambiental. Las optimizaciones atacan el costo en GPU, no la estética. Se reutilizan `.glass`, `.glass--interactive` y `.glass-button` y los tokens de `_tokens.scss` (todo token nuevo va en `:root` y en `.main-container.light-mode` / `body.theme-light`).
3. **React 18 + TypeScript + SCSS sobre Create React App (`react-scripts` 5).** No se ejecuta `eject` ni se migra a Vite sin una decisión explícita.
4. Se conservan `homepage: "."`, `public/_redirects` (`/* /index.html 200`) y los `id` de sección `top`, `expertise`, `history`, `projects`, `contact`.

## Estado verificado (19-11-2026, rama `feature/visual-overhaul`)

| Verificación | Resultado |
|---|---|
| `npx tsc --noEmit` | Sin errores |
| `CI=true npm test -- --watchAll=false` | 1/1 test pasa; Jest avisa "did not exit one second after the test run" |
| `npm run build` | Compila. JS principal 126,17 kB gzip, CSS 7,7 kB gzip, chunk 1,78 kB |
| Carpeta `build/` | 4,1 MB, 23 archivos, incluye 3 `.map`. Archivo más grande: el PDF del CV (783 KB). Muy por debajo de los límites de Cloudflare |
| `public/_headers` | No existe |
| Scripts inline en `build/index.html` | 1 (el script anti-flash de tema) |

---

## Prioridad ALTA

- [x] **Crear `public/_headers` con política de caché**
  * **Diagnóstico:** No existe `public/_headers`. Cloudflare Pages aplica su caché por defecto, que no aprovecha que CRA pone hash en `static/js`, `static/css` y `static/media`, y no garantiza que `index.html` se revalide tras cada despliegue.
  * **Acción:**
    1. Crear `public/_headers` (CRA lo copia tal cual a `build/`).
    2. Agregar:
       ```
       /static/*
         Cache-Control: public, max-age=31536000, immutable

       /index.html
         Cache-Control: public, max-age=0, must-revalidate

       /
         Cache-Control: public, max-age=0, must-revalidate

       /manifest.json
         Cache-Control: public, max-age=86400
       ```
    3. Ejecutar `npm run build` y confirmar que `build/_headers` existe.
  * **Resultado esperado:** En un despliegue de preview, `curl -sI https://<preview>.pages.dev/static/js/main.<hash>.js` devuelve `cache-control: public, max-age=31536000, immutable` y `curl -sI https://<preview>.pages.dev/` devuelve `max-age=0, must-revalidate`.

- [x] **Agregar headers HTTP de seguridad básicos**
  * **Diagnóstico:** El sitio no envía headers de seguridad: no hay `_headers`.
  * **Acción:** En `public/_headers` agregar una regla global al inicio del archivo:
    ```
    /*
      X-Content-Type-Options: nosniff
      Referrer-Policy: strict-origin-when-cross-origin
      X-Frame-Options: DENY
      Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
      Cross-Origin-Opener-Policy: same-origin
    ```
    No agregar `Strict-Transport-Security` en este archivo: activarlo desde el panel de Cloudflare (SSL/TLS → Edge Certificates → HSTS), que es gratuito, solo si el dominio propio ya funciona siempre por HTTPS.
  * **Resultado esperado:** `curl -sI https://<preview>.pages.dev/` muestra los cinco headers. securityheaders.com da al menos nota B sin CSP.

- [x] **Agregar Content-Security-Policy compatible con el build**
  * **Diagnóstico:** No hay CSP. El build tiene un script inline (el anti-flash de tema en `public/index.html`), y MUI/Emotion inyecta `<style>` en tiempo de ejecución. Una CSP estricta sin considerar ambos rompe el tema y los estilos de MUI.
  * **Acción:**
    1. Ejecutar `npm run build`.
    2. Calcular el hash del script inline **ya minificado** en `build/index.html` (el contenido exacto entre `<script>` y `</script>`):
       `node -e "const h=require('fs').readFileSync('build/index.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1];console.log('sha256-'+require('crypto').createHash('sha256').update(h).digest('base64'))"`
    3. Agregar en la regla `/*` de `public/_headers`:
       ```
       Content-Security-Policy: default-src 'self'; script-src 'self' 'sha256-<HASH>'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; manifest-src 'self'
       ```
    4. Documentar en `AGENTS.md` (sección Tema visual) que **todo cambio en el script inline de `public/index.html` obliga a recalcular el hash**.
  * **Resultado esperado:** En el preview, la consola del navegador no muestra violaciones de CSP; el tema claro persiste al recargar sin flash; el `Drawer` y los `Tooltip` de MUI se ven con estilos correctos; el grano SVG (`data:` URI) del fondo ambiental sigue visible.

- [x] **No publicar source maps en producción**
  * **Diagnóstico:** `build/` incluye `main.*.js.map`, `453.*.chunk.js.map` y `main.*.css.map`. Exponen el código fuente completo y suman archivos y peso al despliegue.
  * **Acción (aplicada):** `.env.production` con `GENERATE_SOURCEMAP=false`, versionado en el repo para que aplique en Cloudflare sin configurar el panel. Las variables del shell tienen prioridad, así que para analizar el bundle en local basta `GENERATE_SOURCEMAP=true npm run build`. `scripts/check-csp.mjs` (postbuild) falla si aparecen `.map` sin esa variable.
  * **Resultado esperado:** El build no genera archivos `.map` en `build/static`; `https://<sitio>/static/js/main.<hash>.js.map` devuelve `index.html` (fallback SPA) en lugar del mapa.

- [x] **Sacar el hero (`Main`) del componente `Reveal`**
  * **Diagnóstico:** En `src/App.tsx`, `<Main />` está dentro de `<Reveal>`. `Reveal.scss` arranca con `opacity: 0` y solo pasa a visible cuando un `IntersectionObserver` dispara tras montar. El `h1` y el retrato, que son el elemento LCP, quedan invisibles un tramo extra después de cargar el JS, y la transición dura 680 ms. Esto empeora el LCP.
  * **Acción:**
    1. En `src/App.tsx`, reemplazar `<Reveal><Main /></Reveal>` por `<Main />`.
    2. Si se quiere una entrada suave en el hero, usar una animación CSS de solo `transform` en `Main.scss` que no parta de `opacity: 0` (por ejemplo `translate3d(0, 12px, 0)` → `0`).
  * **Resultado esperado:** Lighthouse (móvil) en `npm run build` + `npx serve -s build` muestra un LCP menor que antes; en el panel Performance el `h1` se pinta en el primer frame después de montar React.

- [ ] **Dar dimensiones y prioridad a la imagen del hero**
  * **Diagnóstico:** En `src/components/Main.tsx` el `<img src={avatar}>` no tiene `width`, `height` ni `fetchpriority`. `perfil.webp` mide 400×400. Sin dimensiones hay riesgo de CLS, y sin prioridad compite con fuentes y JS.
  * **Acción:** Cambiar la etiqueta a `<img src={avatar} alt="…" width={400} height={400} decoding="async" fetchPriority="high" />` (React 18.3 acepta `fetchPriority`; si TypeScript lo rechaza, usar `{...{ fetchpriority: "high" }}`). `Main.scss` ya fija `.hero__portrait-frame img` a `width: 100%; height: 100%; object-fit: cover`, así que los atributos solo reservan el espacio y no cambian el tamaño visual.
  * **Resultado esperado:** El retrato se ve igual que antes en escritorio y móvil; Lighthouse ya no muestra "Image elements do not have explicit width and height"; CLS = 0 en el hero.

- [ ] **Eliminar los scripts `predeploy` y `deploy` de GitHub Pages**
  * **Diagnóstico:** `package.json` define `"predeploy": "npm run build"` y `"deploy": "gh-pages -d build"`, pero `gh-pages` no está instalado y el hosting es Cloudflare Pages. `npm run deploy` falla y confunde sobre cuál es el despliegue real. `README.md` (línea ~68) repite esos scripts.
  * **Acción:**
    1. Borrar `predeploy` y `deploy` de `scripts` en `package.json`.
    2. En `README.md`, reemplazar la sección de despliegue por: build command `npm run build`, output `build`, Node 20, Cloudflare Pages conectado al repositorio.
  * **Resultado esperado:** `npm run` ya no lista `deploy`; `README.md` no menciona `gh-pages`.

- [ ] **Fijar la versión de Node del build**
  * **Diagnóstico:** No hay `.nvmrc`, `.node-version` ni `engines` en `package.json`. El build en Cloudflare depende de la versión por defecto de su imagen, que puede cambiar y romper `react-scripts` 5.
  * **Acción:**
    1. Crear `.nvmrc` en la raíz con el contenido `20`.
    2. Agregar en `package.json`: `"engines": { "node": ">=20 <21" }`.
    3. Opcional y equivalente: variable `NODE_VERSION=20` en Cloudflare Pages.
  * **Resultado esperado:** El log del build en Cloudflare muestra `Now using node v20.x`; `npm run build` local sigue funcionando con Node 20.

---

## Prioridad MEDIA

- [ ] **Quitar la dependencia sin uso `react-vertical-timeline-component`**
  * **Diagnóstico:** `react-vertical-timeline-component` (dependencies) y `@types/react-vertical-timeline-component` (devDependencies) no se importan en ningún archivo de `src/`. `Timeline.tsx` ya tiene una implementación propia.
  * **Acción:** `npm uninstall react-vertical-timeline-component @types/react-vertical-timeline-component`.
  * **Resultado esperado:** `grep -r "vertical-timeline" src package.json` no devuelve nada; `npx tsc --noEmit`, `npm test` y `npm run build` pasan; la sección Experiencia se ve igual.

- [ ] **Quitar el import de efecto lateral de FontAwesome regular en `Timeline.tsx`**
  * **Diagnóstico:** `src/components/Timeline.tsx` línea 2 tiene `import "@fortawesome/free-regular-svg-icons";`, que no importa ningún ícono y obliga al bundler a evaluar el paquete.
  * **Acción:**
    1. Borrar esa línea.
    2. `npm uninstall @fortawesome/free-regular-svg-icons` (no se usa en ningún otro archivo).
  * **Resultado esperado:** `grep -r "free-regular" src` no devuelve nada; el build pasa; comparar el tamaño gzip de `main.*.js` antes/después y anotarlo.

- [ ] **Quitar la dependencia sin uso `@fortawesome/free-brands-svg-icons`**
  * **Diagnóstico:** `@fortawesome/free-brands-svg-icons` está en `dependencies` pero no se importa en `src/` (los íconos de LinkedIn y GitHub vienen de `@mui/icons-material`).
  * **Acción:** `npm uninstall @fortawesome/free-brands-svg-icons`.
  * **Resultado esperado:** `grep -r "free-brands" src package.json` no devuelve nada; el build pasa.

- [ ] **Unificar íconos en `@mui/icons-material` y quitar FontAwesome**
  * **Diagnóstico:** FontAwesome se usa solo para 4 íconos sólidos: `faGears`, `faCode`, `faServer` (en `Expertise.tsx`) y `faBriefcase` (en `Timeline.tsx`). Conviven dos librerías de íconos con runtimes distintos (`@fortawesome/react-fontawesome` + `fontawesome-svg-core` y los SVG de MUI).
  * **Acción:**
    1. Reemplazar por equivalentes de `@mui/icons-material` importados uno a uno (`@mui/icons-material/SettingsSuggest`, `/Code`, `/Dns`, `/Work`, o los que mejor encajen).
    2. Ajustar el tamaño en el SCSS de cada sección (`font-size` del contenedor o `fontSize="small"`), porque las cajas de MUI y FA difieren.
    3. `npm uninstall @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons`.
  * **Resultado esperado:** `grep -r "fortawesome" src package.json` no devuelve nada; `npm run shots` muestra los íconos alineados y del mismo tamaño visual en ambos temas; baja el tamaño gzip de `main.*.js`.

- [ ] **Medir el bundle con `source-map-explorer`**
  * **Diagnóstico:** El JS principal pesa 126 kB gzip para una página de una sola vista. No hay medición de qué módulos lo componen (se presume que MUI + Emotion es la mayor parte).
  * **Acción:**
    1. `npm run build` en local (con source maps).
    2. `npx source-map-explorer 'build/static/js/main.*.js' --html docs/bundle-report.html`.
    3. Anotar en este documento el peso de `@mui/material`, `@emotion/*`, `react-dom` y FontAwesome. No commitear el HTML generado (agregar `docs/bundle-report.html` a `.gitignore`).
  * **Resultado esperado:** Queda registrada la composición del bundle y se puede decidir con datos la tarea "Evaluar reemplazar componentes de MUI".

- [ ] **Medir el costo de GPU del vidrio sobre el fondo animado**
  * **Diagnóstico:** Hay 12 superficies con clase `glass` y 11 declaraciones `backdrop-filter`. En el hero, varias superficies desenfocan un fondo que se anima de forma continua (`ambient-drift` 32 s, `ambient-glow-one` 30 s, `ambient-glow-two` 38 s, `ambient-sheen` 26 s), y la barra de navegación `fixed` también es `glass`. Cada frame animado obliga a recomponer el blur de lo que está encima. `AmbientBackground.tsx` ya pausa con `ambient--calm` al salir del hero y con la pestaña oculta, pero no hay medición en móvil.
  * **Acción:**
    1. `npm run build && npx serve -s build`.
    2. Chrome DevTools → Performance, emulación "Moto G Power", CPU 4× slowdown; grabar 10 s quieto en el hero y 10 s haciendo scroll hasta Contacto. Repetir en tema claro.
    3. Activar Rendering → "Frame Rendering Stats" y "Layer borders".
    4. Registrar en este documento: FPS medio, frames > 50 ms y número de capas compuestas.
  * **Resultado esperado:** Un registro con cifras. Umbral de aceptación: ≥ 50 FPS sostenidos en scroll y ningún *long frame* > 50 ms en reposo en el hero. Si no se cumple, aplicar las tareas de Baja "Reducir el blur solo en dispositivos táctiles de gama baja" y "Liberar `will-change` cuando el fondo está en calma".

- [ ] **Agregar un enlace "Saltar al contenido"**
  * **Diagnóstico:** No hay *skip link*. Quien navega con teclado debe pasar por la marca, los 4 enlaces de la barra, el botón de tema y el de menú antes de llegar al contenido. `<main>` en `App.tsx` no tiene `id`.
  * **Acción:**
    1. En `src/App.tsx`, agregar `id="contenido"` y `tabIndex={-1}` a `<main>`.
    2. Como primer hijo de `.main-container`, agregar `<a className="skip-link glass-button" href="#contenido">Saltar al contenido</a>`.
    3. En `src/index.scss`, estilo `.skip-link` oculto fuera de pantalla (`position: fixed; transform: translateY(-150%)`) que aparece con `:focus-visible` (`transform: none`), usando tokens existentes.
    4. Verificar que el efecto de `App.tsx` que limpia el hash en el primer montaje no rompe este enlace (solo corre al montar, no en clics posteriores).
  * **Resultado esperado:** Al cargar y pulsar Tab, el primer foco es el skip link, visible y con estilo de vidrio; al pulsar Enter, el foco pasa a `<main>`.

- [ ] **Auditar el contraste del texto sobre vidrio en ambos temas**
  * **Diagnóstico:** El texto secundario (`--text-secondary`) y los *eyebrows* (`--accent`, 0,72 rem) se pintan sobre superficies translúcidas cuyo fondo efectivo cambia con las cintas animadas. El contraste no está verificado.
  * **Acción:**
    1. Ejecutar axe DevTools o Lighthouse → Accessibility en tema oscuro y claro, en el hero y en cada sección.
    2. Para cada fallo, ajustar **solo el token de color de texto** en `_tokens.scss` (en `:root` y en `.main-container.light-mode`), o subir la opacidad de `--glass-gradient` en esa variante. No quitar `backdrop-filter`.
    3. Comprobar también con `prefers-reduced-transparency: reduce` emulado (DevTools → Rendering).
  * **Resultado esperado:** 0 errores de contraste en axe en ambos temas; texto normal ≥ 4,5:1 y texto grande ≥ 3:1 medido sobre el punto más claro (o más oscuro, en tema claro) del fondo.

- [ ] **Agregar metadatos Open Graph, Twitter y canonical**
  * **Diagnóstico:** `public/index.html` tiene `title`, `description` y `author`, pero no `<link rel="canonical">`, `og:*` ni `twitter:*`. Al compartir el enlace no se genera vista previa.
  * **Acción:**
    1. Definir el dominio final (por ejemplo `https://<dominio>/`).
    2. En `public/index.html` agregar `canonical`, `og:type=website`, `og:url`, `og:title`, `og:description`, `og:image` (URL **absoluta**), `og:locale=es_CL` y `twitter:card=summary_large_image`.
    3. Crear `public/og-image.webp` (o `.jpg` para máxima compatibilidad) de 1200×630 y < 300 KB.
  * **Resultado esperado:** El validador de vistas previas de LinkedIn (Post Inspector) muestra imagen, título y descripción; Lighthouse SEO sin advertencias de canonical.

- [ ] **Agregar un test que verifique los anclajes de la navegación**
  * **Diagnóstico:** `AGENTS.md` exige que los `id` de sección coincidan con `navItems` en `Navigation.tsx`, pero solo existe un test (el del `h1`). Un cambio de `id` rompería la navegación sin que nada falle.
  * **Acción:**
    1. Exportar `navItems` desde `Navigation.tsx` (`export const navItems`).
    2. En `src/App.test.tsx`, nuevo test que renderice `<App />` y, para cada `[, id]` de `navItems`, compruebe `document.getElementById(id)` no nulo. Incluir también `top`.
  * **Resultado esperado:** `CI=true npm test -- --watchAll=false` pasa con 2 tests; renombrar un `id` hace fallar el test nuevo.

- [ ] **Agregar un test de persistencia del tema**
  * **Diagnóstico:** La lógica de tema de `App.tsx` (clave `portfolio-theme`, clase `light-mode`, `body.theme-light`, `meta[name="theme-color"]`) no tiene pruebas, y `AGENTS.md` exige sincronizarla con el script inline.
  * **Acción:** En `src/App.test.tsx`, test que: renderiza `<App />`, hace clic en el botón con `aria-label` "Cambiar a modo claro", y comprueba que `localStorage.getItem("portfolio-theme") === "light"`, que `.main-container` tiene `light-mode` y que `document.body` tiene `theme-light`.
  * **Resultado esperado:** El test pasa; invertir la lógica del toggle lo hace fallar.

---

## Prioridad BAJA

- [ ] **Eliminar el componente muerto `FadeIn.tsx`**
  * **Diagnóstico:** `src/components/FadeIn.tsx` no se exporta en `src/components/index.js` ni se importa en ningún archivo. `Reveal.tsx` cumple esa función.
  * **Acción:** Borrar `src/components/FadeIn.tsx`.
  * **Resultado esperado:** `grep -r "FadeIn" src` no devuelve nada; `npx tsc --noEmit` y el build pasan.

- [ ] **Sacar de `src/` las imágenes que el código no usa**
  * **Diagnóstico:** En `src/assets/images/` solo se importan `perfil.webp`, `PremioUFRO.webp`, `PremioCID.webp` y `CV_Andres_Carrasco.pdf`. No se referencian: `mock01.png`–`mock10.png` (≈ 7,5 MB), `PremioCI.jpg` (2,5 MB), `PremioCID.jpg`, `PremioUFRO.jpg`, `perfil.jpg` (duplicados `.jpg` de los `.webp`), `bg-dark.png` y `bg-light.png` (solo citadas en un comentario de `AmbientBackground.tsx` como referencia visual) y `screenshot.png` (solo la usa `README.md`). No llegan a `build/`, pero pesan en el repositorio y confunden sobre qué assets están vivos.
  * **Acción:**
    1. Crear `docs/assets/`.
    2. Mover ahí `bg-dark.png`, `bg-light.png` y `screenshot.png`; actualizar la ruta en `README.md` (corrigiendo también la doble barra `./src/assets//images/`) y la mención en `AGENTS.md`.
    3. Borrar los `.jpg` duplicados y los `mock*.png` (o moverlos a `docs/assets/` si se quieren conservar).
  * **Resultado esperado:** `src/assets/images/` contiene solo los 4 archivos importados; el build produce los mismos archivos en `build/static/media`; la imagen del README se ve en GitHub.

- [ ] **Liberar `will-change` cuando el fondo está en calma o pausado**
  * **Diagnóstico:** `AmbientBackground.scss` declara `will-change` en 4 capas (líneas 49, 57, 120, 166). Se mantienen promovidas a GPU aunque `.ambient--calm` o `.ambient--paused` detengan las animaciones, lo que retiene memoria de GPU mientras se lee el resto de la página, justo cuando las tarjetas de vidrio necesitan componer.
  * **Acción:** En `AmbientBackground.scss`, dentro de los bloques `.ambient--calm` y `.ambient--paused`, agregar `will-change: auto;` para las capas que solo se animan por keyframes (drift, halos, sheen). Mantener `will-change: transform` en la capa del parallax (línea 49) solo si el parallax sigue activo fuera del hero.
  * **Resultado esperado:** DevTools → Layers muestra menos capas compuestas al hacer scroll hasta Contacto; el fondo se ve igual.

- [ ] **Reducir el blur solo en dispositivos táctiles de gama baja**
  * **Diagnóstico:** `_tokens.scss` baja `--glass-blur` a 10 px (oscuro) y 14 px (claro) bajo `max-width: 768px`. Solo aplica si la tarea "Medir el costo de GPU del vidrio" muestra caídas de FPS.
  * **Acción:** Agregar en `_tokens.scss` un bloque `@media (max-width: 768px) and (hover: none) and (pointer: coarse)` con `--glass-blur: 8px` (oscuro) y `12px` (claro), definido en `:root` y en `.main-container.light-mode, body.theme-light`. No bajar de 8 px para no perder el efecto vidrio.
  * **Resultado esperado:** Repetir la medición: mejora el FPS en móvil y la captura `npm run shots` móvil sigue mostrando vidrio esmerilado claramente.

- [ ] **Escribir el parallax directamente en `transform`**
  * **Diagnóstico:** En `AmbientBackground.tsx`, cada frame de scroll hace `element.style.setProperty("--ambient-shift", …)` sobre el contenedor raíz `.ambient`. Cambiar una custom property en el padre obliga a recalcular estilos de todo el subárbol del fondo (SVG incluido), no solo de la capa que se mueve.
  * **Acción:**
    1. Agregar un `ref` a la capa que usa `--ambient-shift` (la de la línea 48 de `AmbientBackground.scss`).
    2. En `update()`, escribir `layer.style.transform = \`translate3d(0, ${-shift}px, 0)\`` en lugar de la custom property.
    3. Quitar `--ambient-shift` del SCSS.
  * **Resultado esperado:** En Performance, durante el scroll, desaparece o se reduce "Recalculate Style" asociado a `.ambient`; el parallax se ve igual.

- [ ] **Evitar trabajo por evento de scroll en `Navigation.tsx`**
  * **Diagnóstico:** `handleScroll` corre en cada evento de scroll y llama a `setScrolled(...)` y, bajo 220 px, a `setActive("")`. React descarta los valores iguales, pero el handler se ejecuta cientos de veces por segundo sin `requestAnimationFrame`.
  * **Acción:** Envolver el cuerpo de `handleScroll` en un `requestAnimationFrame` con bandera (como hace `AmbientBackground.tsx`) y cancelar el frame en el cleanup del `useEffect`.
  * **Resultado esperado:** La barra sigue cambiando a `is-scrolled` a los 24 px y el enlace activo se limpia al volver arriba; en Performance el handler se ejecuta como máximo una vez por frame.

- [ ] **Tipar las props de `Navigation`**
  * **Diagnóstico:** `Navigation` recibe `({ parentToChild, modeChange }: any)`, y `App.tsx` le pasa `parentToChild={{ mode }}`, un objeto nuevo en cada render. Se pierde el chequeo de tipos.
  * **Acción:**
    1. Definir `interface NavigationProps { mode: "dark" | "light"; onToggleMode: () => void; }`.
    2. Cambiar la firma a `function Navigation({ mode, onToggleMode }: NavigationProps)`.
    3. En `App.tsx`, tipar el estado como `useState<"dark" | "light">` y pasar `mode={mode} onToggleMode={handleModeChange}`.
  * **Resultado esperado:** `grep -n ": any" src/components/Navigation.tsx` no devuelve nada; `npx tsc --noEmit` pasa.

- [ ] **Limpiar el temporizador del botón copiar en `Contact.tsx`**
  * **Diagnóstico:** `handleCopy` hace `setTimeout(() => setCopied(false), 2000)` sin guardar ni limpiar el id. Si el componente se desmonta (tests incluidos), queda un temporizador vivo.
  * **Acción:** Guardar el id en un `useRef<number>()`, limpiar el anterior antes de crear uno nuevo y agregar un `useEffect(() => () => clearTimeout(ref.current), [])`.
  * **Resultado esperado:** El botón sigue mostrando el check 2 s; no hay temporizadores pendientes al desmontar.

- [ ] **Resolver el aviso de Jest "did not exit"**
  * **Diagnóstico:** `CI=true npm test -- --watchAll=false` termina con "Jest did not exit one second after the test run has completed", señal de un handle abierto (temporizador, observer o listener).
  * **Acción:** Ejecutar `CI=true npm test -- --watchAll=false --detectOpenHandles`, identificar el origen y limpiarlo en el componente correspondiente (no silenciarlo con `--forceExit`).
  * **Resultado esperado:** La suite termina sin ese aviso.

- [ ] **Declarar el plugin de Babel que pide `babel-preset-react-app`**
  * **Diagnóstico:** `start`, `build` y `test` muestran la advertencia de que `babel-preset-react-app` usa `@babel/plugin-proposal-private-property-in-object` sin declararlo; hoy funciona por casualidad y "may break at any time".
  * **Acción:** `npm install -D @babel/plugin-proposal-private-property-in-object`.
  * **Resultado esperado:** La advertencia desaparece de `npm run build`.

- [ ] **Actualizar la base de datos de Browserslist**
  * **Diagnóstico:** El build avisa "caniuse-lite is outdated". El autoprefixer de CRA decide prefijos (incluido `-webkit-backdrop-filter`) con datos viejos.
  * **Acción:** `npx update-browserslist-db@latest` y commitear el `package-lock.json` resultante.
  * **Resultado esperado:** El aviso desaparece; el CSS generado conserva `-webkit-backdrop-filter` (Safari lo sigue necesitando).

- [ ] **Mover dependencias de test y tipos a `devDependencies`**
  * **Diagnóstico:** `@testing-library/*`, `@types/jest`, `@types/node`, `@types/react`, `@types/react-dom` y `typescript` están en `dependencies`. No afecta al bundle (CRA solo empaqueta lo importado), pero mezcla runtime y tooling.
  * **Acción:** Moverlas a `devDependencies` en `package.json` y ejecutar `npm install` para regenerar el lock.
  * **Resultado esperado:** `npm run build` y `npm test` pasan; `dependencies` solo lista paquetes que se importan en `src/`.

- [ ] **Eliminar la regla vacía `.glass > * {}`**
  * **Diagnóstico:** `src/assets/styles/_glass.scss` contiene `.glass > * { }` sin declaraciones.
  * **Acción:** Borrar la regla.
  * **Resultado esperado:** El CSS compilado no la contiene; las tarjetas se ven igual.

- [ ] **Usar enlaces de ancla en la navegación**
  * **Diagnóstico:** Los ítems de `Navigation.tsx` son `<button onClick={scrollToSection}>`. No son enlaces para tecnologías de asistencia ni para buscadores, no se pueden abrir en otra pestaña y no funcionan sin JS.
  * **Acción:**
    1. Cambiar cada ítem a `<a href={\`#${id}\`} onClick={(e) => { e.preventDefault(); scrollToSection(id); }}>` en la barra y en el `Drawer`.
    2. Mantener las clases actuales (`navbar__link`, `nav-drawer__link`) y revisar en el SCSS que el estilo de `<a>` coincida con el de `<button>`.
  * **Resultado esperado:** El lector de pantalla anuncia "enlace"; clic central abre la sección en otra pestaña; el scroll suave y `prefers-reduced-motion` siguen funcionando.

- [ ] **Usar `aria-current="location"` en la navegación interna**
  * **Diagnóstico:** `Navigation.tsx` marca el ítem activo con `aria-current="true"`. Para anclas dentro de la misma página el valor semántico es `location`.
  * **Acción:** Reemplazar `"true"` por `"location"` en la barra y en el `Drawer`.
  * **Resultado esperado:** El lector de pantalla anuncia "ubicación actual" en el ítem activo.

- [ ] **Agregar `sitemap.xml` y referenciarlo en `robots.txt`**
  * **Diagnóstico:** `public/robots.txt` permite todo pero no declara sitemap, y no existe `public/sitemap.xml`.
  * **Acción:**
    1. Crear `public/sitemap.xml` con una sola `<url>` (el dominio final) y `<lastmod>`.
    2. Agregar `Sitemap: https://<dominio>/sitemap.xml` al final de `public/robots.txt`.
  * **Resultado esperado:** `https://<dominio>/sitemap.xml` responde XML válido (no el `index.html` del fallback SPA); Google Search Console lo acepta.

- [ ] **Agregar datos estructurados `Person` (JSON-LD)**
  * **Diagnóstico:** `public/index.html` no tiene datos estructurados.
  * **Acción:** Agregar `<script type="application/ld+json">` con `@type: Person`, `name`, `jobTitle`, `url` y `sameAs` (LinkedIn y GitHub). Al ser un bloque de datos, la CSP con `script-src` por hash no lo bloquea.
  * **Resultado esperado:** El Rich Results Test de Google detecta la entidad `Person` sin errores.

- [ ] **Traducir y mejorar el `<noscript>`**
  * **Diagnóstico:** `public/index.html` muestra "You need to enable JavaScript to run this app." en inglés en un sitio con `lang="es"`, y es lo único visible sin JS.
  * **Acción:** Reemplazarlo por un texto en español con el nombre y enlaces de contacto en HTML plano, con estilos inline mínimos sobre el fondo `#070a0f`.
  * **Resultado esperado:** Con JS deshabilitado se ve un mensaje en español con enlaces funcionales.

- [ ] **Evaluar prerender estático del HTML (requiere aprobación)**
  * **Diagnóstico:** CRA entrega un `index.html` vacío y todo el contenido aparece tras ejecutar 126 kB de JS. Un snapshot HTML al build mejoraría LCP y SEO sin salir del hosting estático, pero agrega tooling, algo que `AGENTS.md` pide no hacer sin pedido explícito.
  * **Acción:** No implementar todavía. Documentar dos opciones y decidir: (a) un script `postbuild` propio con Playwright (ya está en `devDependencies`) que renderice `build/index.html` y guarde el HTML resultante, usando `hydrateRoot` en `src/index.tsx`; (b) mantener CSR. Revisar que el build siga bajo los 20 minutos de Cloudflare y que la imagen de build tenga Chromium disponible.
  * **Resultado esperado:** Una decisión registrada en este documento (sí/no y por qué) antes de tocar el toolchain.

- [ ] **Evaluar reemplazar componentes de MUI por implementaciones propias (requiere medición)**
  * **Diagnóstico:** De `@mui/material` solo se usan `AppBar`, `Toolbar`, `IconButton`, `Drawer` y `Tooltip`. Arrastran Emotion (runtime CSS-in-JS) y obligan a `style-src 'unsafe-inline'` en la CSP. Depende del resultado de "Medir el bundle con `source-map-explorer`".
  * **Acción:** Solo si el informe muestra que MUI + Emotion superan ~40 % del bundle: reemplazar `AppBar`/`Toolbar`/`IconButton` por `<header>`/`<div>`/`<button>` con las clases `.glass` y `.glass-button` actuales, y `Drawer` por un `<dialog>` nativo con `--drawer-surface`, manteniendo el foco atrapado y el cierre con Escape. Hacerlo componente por componente, cada uno en su propio commit.
  * **Resultado esperado:** Bundle gzip menor y medido; `npm run shots` idéntico en ambos temas; el menú móvil sigue siendo accesible con teclado.

---

## Orden sugerido de ejecución

1. ALTA en el orden listado. Las tres tareas de `_headers` van juntas en un despliegue de preview de Cloudflare para verificarlas con `curl -sI`.
2. MEDIA: primero limpiar dependencias, luego medir el bundle y la GPU; a11y, SEO y tests en cualquier orden.
3. BAJA: las de limpieza (código muerto, assets, warnings) son independientes; las de GPU y MUI dependen de las mediciones de MEDIA.

Después de cada tarea: `npx tsc --noEmit`, `CI=true npm test -- --watchAll=false`, `npm run build` y, si toca UI, `npm run shots` en ambos temas para confirmar que el Liquid Glass se ve igual.
