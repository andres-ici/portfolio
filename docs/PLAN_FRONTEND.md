# Diagnóstico frontend y plan de acción — Portafolio

> Alcance: **solo la capa de interfaz** (componentes, estilos, layout, interacción, tematización y accesibilidad). No se evalúan contenido, redacción, proyectos ni branding, ni despliegue, headers, caché o build: eso está en `docs/PLAN_TECNICO.md`.

## Restricciones que todo cambio debe respetar

- **Liquid Glass intacto:** se mantienen transparencias, `backdrop-filter`, bordes especulares (`.glass::before`), capas translúcidas y fondo ambiental. Solo se admiten superficies opacas en los fallbacks que ya existen (`prefers-reduced-transparency` y `@supports not (backdrop-filter)`).
- **100 % estático en Cloudflare Pages Free:** sin backend, Functions ni SSR, y sin dependencias nuevas. Se resuelve con CSS nativo, SCSS y lo que ya trae el proyecto (MUI incluido).
- **Sin cambios de toolchain:** nada de `eject`, Vite, Tailwind ni CSS-in-JS nuevo. Si una tarea lo necesitara, se marca como *requiere aprobación*.
- **Tokens:** todo token nuevo se define en `:root` y en `.main-container.light-mode, body.theme-light` de `src/assets/styles/_tokens.scss` (regla de `AGENTS.md`).
- **Contenido en componentes:** `AGENTS.md` fija que los datos editables (`skillGroups`, `experience`, `awards`) viven en cada componente, así que no se propone sacarlos a otros archivos.

### Relación con `docs/PLAN_TECNICO.md`

Estas tareas de ese plan **no se repiten** aquí. Cuando una tarea de este documento depende de alguna, la cita por su nombre: *Sacar el hero (`Main`) del componente `Reveal`*, *Agregar un enlace "Saltar al contenido"*, *Auditar el contraste del texto sobre vidrio en ambos temas*, *Medir el costo de GPU del vidrio sobre el fondo animado*, *Reducir el blur solo en dispositivos táctiles de gama baja*, *Liberar `will-change` cuando el fondo está en calma o pausado*, *Escribir el parallax directamente en `transform`*, *Evitar trabajo por evento de scroll en `Navigation.tsx`*, *Tipar las props de `Navigation`*, *Limpiar el temporizador del botón copiar en `Contact.tsx`*, *Eliminar el componente muerto `FadeIn.tsx`*, *Quitar el import de efecto lateral de FontAwesome regular en `Timeline.tsx`*, *Unificar íconos en `@mui/icons-material` y quitar FontAwesome*, *Usar enlaces de ancla en la navegación*, *Usar `aria-current="location"` en la navegación interna*, *Agregar un test de persistencia del tema*.

> ⚠️ **Corrección a `PLAN_TECNICO.md`:** la tarea *Eliminar la regla vacía `.glass > * {}`* parte de un dato erróneo. En `src/assets/styles/_glass.scss` (líneas 40-43) la regla **no está vacía**: contiene `position: relative; z-index: 2;`, que coloca el contenido por encima del borde especular `.glass::before` (`z-index: 1`). Si se borra, el brillo del borde queda encima del texto y de los enlaces. No hay que ejecutar esa tarea tal como está escrita.

### Qué se verificó (19-11-2026, rama `feature/visual-overhaul`)

| Qué se revisó | Cómo | Resultado |
|---|---|---|
| Todos los componentes de UI (`Navigation`, `Main`, `Expertise`, `Timeline`, `Project`, `Contact`, `Footer`, `Reveal`, `AmbientBackground`, `App`) | Lectura completa | Hallazgos en las tareas de abajo |
| Todos los SCSS (`_tokens`, `_glass`, `index.scss` y los 10 de componente) | Lectura completa | Hallazgos en las tareas de abajo |
| `public/index.html` (script inline de tema, `theme-color`, viewport) | Lectura | El script no aplica la clase de tema ni actualiza `theme-color`; el viewport no lleva `viewport-fit` |
| Tokens definidos pero sin uso | Búsqueda de `var(--token)` en `src/` | Sin uso: `--duration-slow`, `--radius-sm`, `--radius-md` |
| Tokens presentes en un tema y ausentes en el otro | Comparación de los bloques `:root` y claro | Bien resuelto: los tokens que dependen del tema están en ambos bloques |
| Clases CSS sin uso | Búsqueda de cada clase en `src/components` y `App.tsx` | Sin uso: `.glass-rule` (`_glass.scss:171`) y `.section-rule` (`index.scss:155`) |
| `!important` | Búsqueda | 33 apariciones en `src/assets/styles` + `src/index.scss` (16 en `Navigation.scss`) |
| Colores, radios y duraciones fijos | Búsqueda de `rgba(`, hex, `border-radius:` y `ms` | 13 sombras o velos `rgba` fuera de tokens; 6 radios fijos; 5 duraciones fijas |
| Puntos de quiebre | Búsqueda de `@media (max-width` | 10 valores distintos: 420, 480, 560, 640, 700, 760, 768, 780, 900 y 980 px |
| Tamaños de fuente | Búsqueda de `font-size` | Unos 24 valores distintos, varios por debajo de 0.7rem |
| Hover en táctiles | Búsqueda de `hover: hover` / `pointer:` | 0 apariciones |
| `aria-expanded`, `forced-colors`, `prefers-contrast`, `safe-area` | Búsqueda | 0 apariciones |
| `scroll-margin-top` | Búsqueda | Solo en `.section`, `.hero` y `.footer` |
| `prefers-reduced-motion` y `prefers-reduced-transparency` | Lectura | Bien resuelto: regla global en `index.scss`, `Reveal.scss`, fondo, vidrio y drawer; el JS de `Reveal`, `Navigation` y `AmbientBackground` también lo respeta |
| Fondo ambiental: animaciones | Lectura de `AmbientBackground.scss` | Bien resuelto: solo anima `transform` y `opacity` sobre contenedores y nunca los `<g>`; se pausa en calma y con la pestaña oculta. Lo pendiente ya está en `PLAN_TECNICO.md` |
| Prefijo `-webkit-backdrop-filter` y fallback `@supports` | Lectura de `_glass.scss` y `Navigation.scss` | Bien resuelto en `.glass`, `.glass-button` y `.nav-drawer__paper` |
| Jerarquía de encabezados y textos alternativos | Lectura del JSX | Bien resuelto: un `h1`, luego `h2` por sección y `h3` por tarjeta; todas las `<img>` llevan `alt` |
| Tipos | `npx tsc --noEmit` | Pasa |
| Contraste de los textos que se pintan directamente sobre el fondo ambiental | Medición con Playwright (`scripts/contrast.mjs`) contra `npm start`: 13 textos × 5 posiciones de scroll × 2 temas × 2 viewports, comparando píxel a píxel el color del texto con el fondo capturado sin el texto | Fallan los *eyebrows* y `.footer__role`; los `h2` pasan. Detalle en la sección siguiente |
| Render real (foco, tamaños medidos, flash de tema, forced-colors, Safari) | No ejecutado: no se puede verificar leyendo código | Queda como tareas de **medición** |
| `npm run build`, `npm test`, `npm run shots` | No ejecutados en este diagnóstico (no hubo cambios de código) | Son el chequeo a repetir después de cada tarea |

---

## Análisis: contraste de los subtítulos sobre las cintas animadas

**Síntoma:** al hacer scroll, algunos subtítulos pierden legibilidad cuando pasan sobre las líneas del fondo, en ambos temas.

**Por qué ocurre:**

1. **Hay texto sin vidrio detrás.** `.section-heading` (eyebrow, `h2` y párrafo introductorio), `.hero__content` y el pie se pintan directamente sobre `.ambient`, sin ninguna superficie `.glass` debajo. Como `.ambient` es `position: fixed`, cada subtítulo atraviesa todas las alturas de la pantalla mientras se hace scroll.
2. **Hay una banda densa fija en la pantalla.** La cinta principal (`RIBBON_SPECS[0]` en `AmbientBackground.tsx`: 27 hebras, `--ribbon-opacity-main` de 0.72 en oscuro y 0.85 en claro) cruza el viewport aproximadamente entre el 65 % y el 85 % de su altura. En todas las mediciones, el peor caso se dio con el texto al **70 % de la altura de la pantalla**. Cuando la animación se detiene (`.ambient--calm`) la banda queda quieta, pero los textos siguen pasando por encima.
3. **Los eyebrows son del mismo color que las cintas.** `.eyebrow` usa `--accent` (`#8cb3e2` en oscuro y `#1c4a7e` en claro), del mismo tono y luminosidad que las cintas (`#5f8fd6` y `#9a5cff` en oscuro, `#4f6f96` y `#6d7fa3` en claro). Además es texto pequeño: 0.72 rem, monoespaciado y de peso 500. Las hebras atraviesan las letras y se confunden con ellas.
4. **El tema claro tiene cintas más marcadas.** Usa más opacidad (0.85 frente a 0.72) y trazo más grueso (1.35 px frente a 1.15 px), y por eso sale peor en las mediciones.

**Medición (peor caso por texto, `scripts/contrast.mjs`).** "% bajo umbral" es la parte del recuadro del texto donde el fondo queda por debajo de 4.5:1 (o de 3:1 en los `h2`). "p5" es el contraste del 5 % de píxeles de fondo más desfavorable.

| Texto | Tema | Hoy: p5 / % bajo umbral | Con halo y eyebrow `--accent-bright`: p5 / % |
|---|---|---|---|
| Eyebrows de sección (`#expertise`, `#history`, `#projects`), escritorio | Claro | 3.66–4.00 / **10.5–18.6 %** | 5.07–5.52 / 0.2 % |
| Eyebrows de sección, escritorio | Oscuro | 4.42–4.85 / **3.2–5.8 %** | 6.65–7.27 / 0.2 % |
| Eyebrows de sección, móvil | Claro | 4.16–5.18 / **0.6–11.3 %** | 5.95–7.42 / 0.5 % |
| Eyebrow del hero, escritorio | Claro / Oscuro | 4.31 / 6.5 % · 5.64 / 2.8 % | 5.84 / 1.2 % · 8.01 / 0.1 % |
| `.footer__role`, móvil | Claro / Oscuro | 3.70 / **18.1 %** · 4.25 / 8.4 % | 4.37 / 6.7 % · 5.14 / 0.9 % |
| Párrafo introductorio (`.section-heading > p:last-child`) | Ambos | 4.98–6.86 / 0–1.1 % | 5.39–7.39 / 0–1.1 % |
| `h2` de sección | Ambos | ≥ 8.36 / 0 % | No hace falta cambiarlo |
| `.timeline__date`, `.footer__bottom p` | Ambos | ≥ 5.38 / 0 % | No hace falta cambiarlo |

Lo que queda tras la corrección (0.2–0.5 %) corresponde al trazo decorativo `.eyebrow::before`, que entra en el recuadro medido. El párrafo introductorio en móvil conserva cerca del 1 % de píxeles aislados por debajo del umbral, con o sin halo; está dentro de lo esperable para hebras de 1 px, pero hay que confirmarlo a ojo. Esta medición cubre texto **sin** vidrio. El texto sobre vidrio está en *Auditar el contraste del texto sobre vidrio en ambos temas* (`PLAN_TECNICO.md`). axe y Lighthouse no pueden medir ninguno de los dos casos porque no evalúan fondos SVG ni `backdrop-filter`.

---

## Prioridad ALTA

- [ ] **Agregar un halo de legibilidad a los textos que van directo sobre el fondo**
  * **Diagnóstico:** `.eyebrow`, `.section-heading > p:last-child`, `.hero__headline`, `.footer__role` y `.footer__bottom p` (`src/index.scss`, `Main.scss`, `Footer.scss`) no tienen ninguna separación de las cintas animadas. Con el texto al 70 % de la altura de la pantalla, hasta un 18.6 % del fondo de un eyebrow queda por debajo de 4.5:1 (ver la tabla).
  * **Acción:** 1) En los dos bloques de `_tokens.scss`, agregar `--text-halo: 0 0 2px var(--bg), 0 0 10px var(--bg), 0 0 18px var(--bg);`. Usar `var(--bg)` hace que el halo cambie solo con el tema. 2) Aplicar `text-shadow: var(--text-halo);` a esos cinco selectores. 3) No aplicarlo a los textos dentro de `.glass`, que ya tienen su propia superficie. El halo es difuso y translúcido, así que las cintas siguen viéndose alrededor del texto.
  * **Resultado esperado:** `node scripts/contrast.mjs` deja los eyebrows de sección en 0.5 % o menos de píxeles bajo umbral y con p5 de 5 o más, en ambos temas y viewports. Además, a simple vista las cintas se ven igual fuera del área del texto (comparar con `npm run shots`).

- [ ] **Separar el color de los eyebrows del de las cintas**
  * **Diagnóstico:** `.eyebrow` (`src/index.scss`) usa `--accent`, del mismo tono y luminosidad que `--ribbon-3` y `--ribbon-2`. Así el texto de 0.72 rem se confunde con las hebras que lo cruzan.
  * **Acción:** En `.eyebrow`, cambiar `color: var(--accent)` por `color: var(--accent-bright)` (`#bad4f5` en oscuro, `#123661` en claro). Las dos variantes ya existen en ambos temas, así que no hace falta crear tokens. Dejar `.eyebrow::before` con `--accent-line`. Esto afecta también a los eyebrows de `.contact-panel` y `.cv-card`, que están sobre vidrio, con un contraste igual o mayor.
  * **Resultado esperado:** El p5 del eyebrow del hero pasa de 4.31 a 5.84 en claro y de 5.64 a 8.01 en oscuro (escritorio), medido con `node scripts/contrast.mjs`. El tono sigue siendo de la familia del acento.

- [ ] **Quitar `border-radius` del `:focus-visible` global**
  * **Diagnóstico:** `src/index.scss` (líneas 86-90) declara `border-radius: 4px` dentro de `:focus-visible`. Eso cambia la forma real del elemento enfocado, no solo la del contorno: los controles en píldora o círculo (`.glass-button`, `.navbar__icon`, `.hero__social`, `.footer__socials a`) pasan a tener esquinas de 4 px, con fondo y borde deformados, mientras tienen el foco.
  * **Acción:** Borrar la línea `border-radius: 4px;` del bloque `:focus-visible` en `src/index.scss`. No agregar reglas por componente: en los navegadores actuales, `outline` ya sigue el `border-radius` del elemento.
  * **Resultado esperado:** Con Tab sobre "Ver CV" y sobre el icono de GitHub, el `border-radius` computado en DevTools sigue en `999px` y `50%`, y el contorno sigue la curva. Revisar en Chromium, Firefox y Safari, en ambos temas.

- [ ] **Hacer que el nombre accesible del logo incluya su texto visible**
  * **Diagnóstico:** En `src/components/Navigation.tsx` (líneas 141-143), el botón `.navbar__brand` muestra "AC Andrés Carrasco", pero su `aria-label="Ir al inicio"` reemplaza ese texto. No cumple WCAG 2.5.3 *Label in Name* (nivel A): quien usa control por voz no puede activarlo diciendo lo que ve.
  * **Acción:** Quitar `aria-label` del botón y poner `aria-hidden="true"` en `<span className="navbar__mark">AC</span>`, para que el nombre accesible sea "Andrés Carrasco". Por debajo de 900 px `.navbar__name` se oculta con `display: none`, lo que deja el botón sin nombre; en ese rango, cambiar ese `display: none` por la técnica de `.sr-only`.
  * **Resultado esperado:** En DevTools > Accessibility, el nombre del botón es "Andrés Carrasco" tanto a 1440 px como a 390 px.

- [ ] **Llevar a 44 px el área táctil de los enlaces e iconos de la barra**
  * **Diagnóstico:** En `src/assets/styles/Navigation.scss`, `.navbar__link` (línea 86) tiene `padding: 9px 13px` y `font-size: 0.68rem`, lo que da unos 31 px de alto. `.navbar__icon` (líneas 123-124) mide `38px !important`, y lo usan el botón de tema y el de "Abrir menú".
  * **Acción:** 1) Agregar `--touch-target: 44px` a los dos bloques de `_tokens.scss`. 2) En `.navbar__link`, agregar `min-height: var(--touch-target)` y `display: inline-flex; align-items: center`. 3) En `.navbar__icon`, reemplazar `38px` por `var(--touch-target)` en ancho y alto. 4) Comprobar que `.navbar__inner` (`min-height: 62px` / `58px`) los sigue conteniendo.
  * **Resultado esperado:** En consola, `[...document.querySelectorAll('.navbar__link, .navbar__icon')].map(e => e.getBoundingClientRect().height)` devuelve solo valores de 44 o más. A 901 px los cuatro enlaces caben sin saltar de línea.

- [ ] **Llevar a 44 px el área táctil de los iconos sociales del hero y del pie**
  * **Diagnóstico:** `.hero__social` mide 42×42 (`Main.scss`, líneas 89-90) y `.footer__socials a` mide 38×38 (`Footer.scss`, líneas 69-70).
  * **Acción:** Usar `width/height: var(--touch-target)` en ambos selectores (depende de la tarea anterior, que crea el token) y mantener el tamaño del SVG.
  * **Resultado esperado:** Los rectángulos miden 44×44 o más. A 320 px los cuatro iconos de `.hero__socials` siguen en una sola línea (4 × 44 + 3 × 7 = 197 px).

- [ ] **Llevar a 44 px el área táctil de los `IconButton` de copiar y cerrar**
  * **Diagnóstico:** `.copy-btn` (`Contact.scss`, línea 81) y `.nav-drawer__close` (`Navigation.scss`, línea 194) son `IconButton` de MUI sin `size`. Su tamaño por defecto es 40×40 (8 px de padding y 24 px de icono).
  * **Acción:** Agregar `width: var(--touch-target); height: var(--touch-target);` a ambos selectores. MUI no fija ni ancho ni alto, así que no hace falta `!important`.
  * **Resultado esperado:** Ambos botones miden 44×44 en DevTools, y `.email-container` mantiene su altura visual a 560 px.

- [ ] **Limitar a dispositivos con puntero los hover que mueven o elevan**
  * **Diagnóstico:** El proyecto no tiene ningún `@media (hover: hover)`. En pantallas táctiles el `:hover` se queda pegado después de un toque y deja tarjetas elevadas o imágenes ampliadas. Pasa en `.glass--interactive:hover` (`_glass.scss`, línea 70, `translateY(-3px)` más sombra), `.glass-button:hover`, `.hero__social:hover`, `.footer__socials a:hover`, `.award:hover .award__frame img` (`scale`) y `.email-container:hover`.
  * **Acción:** Envolver en `@media (hover: hover)` solo las declaraciones de `transform`, `box-shadow` y del barrido `::after`, en `_glass.scss` y en el SCSS de cada componente. Los cambios de color pueden quedarse fuera.
  * **Resultado esperado:** En DevTools, con emulación de un dispositivo táctil, tocar una tarjeta o un botón no los deja elevados. Con ratón, el efecto sigue igual que ahora.

- [ ] **Mostrar el icono "abrir" de los premios con foco de teclado y en táctil**
  * **Diagnóstico:** `.award__open` (`Project.scss`, línea 37) tiene `opacity: 0` y solo aparece con `.award:hover .award__open` (línea 55). Quien navega con teclado o con el dedo nunca lo ve.
  * **Acción:** Agregar `.award:focus-within .award__open` al selector de la línea 55. Además, agregar `@media (hover: none) { .award__open { opacity: 1; transform: none; } }`.
  * **Resultado esperado:** Al llegar con Tab al enlace del premio aparece el icono. En emulación táctil se ve sin necesidad de hover.

- [ ] **Dejar un solo enlace por tarjeta de premio**
  * **Diagnóstico:** En `src/components/Project.tsx`, cada `article.award` tiene dos enlaces al mismo `href`: `a.award__frame` (línea 46, con `aria-label="Ver …"`) y el enlace dentro de `<h3>` (línea 59). El resultado es el doble de paradas de tabulación y dos nombres distintos para un mismo destino.
  * **Acción:** 1) Cambiar `<a className="award__frame" …>` por `<div className="award__frame">`, sin `href`, `target` ni `aria-label`. 2) Para que toda la tarjeta siga siendo clicable, agregar en `Project.scss`: `.award__body h3 a::after { content: ""; position: absolute; inset: 0; z-index: 3; }`. `.award` ya es `position: relative` por `.glass`. 3) Cambiar `.award:focus-within` (tarea anterior) para que dependa del enlace del título.
  * **Resultado esperado:** Hay un enlace por premio en el árbol de accesibilidad y Tab recorre dos enlaces de premio, no cuatro. Un clic sobre la imagen sigue abriendo el destino.

- [ ] **Medir el flash de tema al recargar en modo claro**
  * **Diagnóstico:** El script inline de `public/index.html` (línea 30) pone en `<html>` el fondo y el `color-scheme` claros, pero no la clase de tema. Los tokens claros se activan con `body.theme-light` y `.main-container.light-mode`, que `App.tsx` aplica en un `useEffect` después de montar. Hasta ese momento, `body { background: var(--bg) }` (`index.scss`, línea 15) toma el oscuro de `:root`. Es probable que se vea un cuadro oscuro, pero leyendo el código no se puede confirmar.
  * **Acción:** En Chrome, ejecutar `localStorage.setItem("portfolio-theme","light")`, poner CPU 4× más lenta y red "Fast 3G", y grabar en Performance con capturas activadas durante la recarga. Repetir en Safari iOS (simulador o dispositivo) y en Chromium Android. Anotar si aparece un fondo oscuro y cuánto dura.
  * **Resultado esperado:** Un informe de sí o no por navegador, con su duración. Si hay flash, ejecutar la tarea *Aplicar el tema claro antes del primer pintado*.

---

## Prioridad MEDIA

- [ ] **Subir el contraste de `.footer__role` en tema claro**
  * **Diagnóstico:** `.footer__role` (`Footer.scss`) usa `--text-tertiary` (`#425264` en claro), con una luminosidad casi igual a la de las cintas claras. En móvil, con el texto al 70 % de la altura, el 18.1 % de su fondo queda por debajo de 4.5:1. Con el halo de la tarea de Prioridad Alta baja al 6.7 %, que sigue siendo demasiado.
  * **Acción:** Cambiar el color de `.footer__role` a `var(--text-secondary)` y mantener el `text-shadow: var(--text-halo)`. Hacerlo después de *Agregar un halo de legibilidad a los textos que van directo sobre el fondo*.
  * **Resultado esperado:** `node scripts/contrast.mjs` deja `.footer__role` en el 1 % o menos de píxeles bajo umbral en móvil, en ambos temas.

- [ ] **Incorporar la medición de contraste sobre el fondo como script del proyecto**
  * **Diagnóstico:** Ya existe `scripts/contrast.mjs` (sin commitear), usado para este diagnóstico. Usa `@playwright/test`, que ya está en `devDependencies`, y no agrega dependencias. Todavía no tiene un script en `package.json` y escribe en `screenshots/contrast`, que ya está ignorado por git porque `/screenshots` está en `.gitignore`.
  * **Acción:** 1) Agregar `"contrast": "node scripts/contrast.mjs"` a `scripts` en `package.json`, junto a `shots`. 2) Mantener la lista `targets` sincronizada con los selectores de texto que van sin vidrio (si se aplica la tarea de nombres BEM, actualizar `.section-heading > p:last-child`).
  * **Resultado esperado:** Con `npm start` en marcha, `npm run contrast` imprime la tabla por viewport, tema y selector, y guarda recortes solo de los casos que fallan.

- [ ] **Aplicar el tema claro antes del primer pintado (solo si la medición lo confirma)**
  * **Diagnóstico:** Depende de *Medir el flash de tema al recargar en modo claro*. Los tokens claros no existen hasta que React agrega `body.theme-light`.
  * **Acción:** 1) En `_tokens.scss`, agregar `html.theme-light` a la lista de selectores del bloque claro (`.main-container.light-mode, body.theme-light, html.theme-light`); las variables se heredan a `body`. 2) En el script inline de `public/index.html`, si el tema guardado es `light`, ejecutar `root.classList.add("theme-light")`. 3) En el `useEffect` de `App.tsx`, alternar también `document.documentElement.classList.toggle("theme-light", mode === "light")`.
  * **Resultado esperado:** Al repetir la medición no aparece ningún cuadro oscuro. Las capturas de `npm run shots` en tema claro no cambian, y al cambiar de tema todo sigue alternando bien, incluido el `Drawer`.

- [ ] **Sincronizar `meta[name="theme-color"]` desde el script inline**
  * **Diagnóstico:** `public/index.html` (línea 7) fija `theme-color` en `#070a0f` y el script inline no lo cambia. Quien entra en modo claro ve la barra del navegador móvil oscura hasta que monta React (`App.tsx`, línea 35). Además, los colores `#070a0f` y `#edf1f5` están escritos tres veces: en el script, en `App.tsx` (líneas 35 y 41) y en los tokens.
  * **Acción:** En el script inline, después de calcular `light`, ejecutar `document.querySelector('meta[name="theme-color"]').setAttribute("content", light ? "#edf1f5" : "#070a0f")`. Agregar en `App.tsx` y en el script un comentario que remita al otro, para que se mantengan sincronizados (no se pueden compartir variables entre ambos sin tocar el build).
  * **Resultado esperado:** Con tema claro guardado, `document.querySelector('meta[name="theme-color"]').content` vale `#edf1f5` en el primer evento `DOMContentLoaded`. En Android, la barra del navegador es clara desde el inicio.

- [ ] **Agregar `scroll-margin-top` al destino `#cv`**
  * **Diagnóstico:** En `Footer.tsx`, el enlace `href="#cv"` (línea 44) apunta a `article.cv-card#cv`. Ese elemento no es `.section` y no tiene `scroll-margin-top` (`Project.scss`, línea 96), así que la barra fija tapa la parte superior de la tarjeta.
  * **Acción:** Agregar `scroll-margin-top: calc(var(--nav-height) + 28px);` a `.cv-card`.
  * **Resultado esperado:** Al pulsar el icono de CV del pie, el borde superior de la tarjeta queda unos 28 px por debajo de la barra, a 1440 y a 390 px.

- [ ] **Exponer el estado del menú móvil con `aria-expanded` y `aria-controls`**
  * **Diagnóstico:** El botón "Abrir menú" (`Navigation.tsx`, línea 176) no indica si el menú está abierto, y el `Drawer` no tiene `id`. En todo `src/` no aparece `aria-expanded`.
  * **Acción:** Agregar `aria-expanded={mobileOpen}` y `aria-controls="nav-drawer"` al `IconButton`, y `id: "nav-drawer"` en `PaperProps` (línea 191).
  * **Resultado esperado:** En DevTools > Accessibility, el botón aparece como `expanded: false` o `true` según el estado del menú.

- [ ] **Verificar foco atrapado, Escape y devolución de foco en el `Drawer`**
  * **Diagnóstico:** `Navigation.tsx` usa el `Drawer` de MUI con `keepMounted`. MUI atrapa y devuelve el foco por defecto, pero con `keepMounted` el contenido sigue en el DOM aunque esté cerrado. No se puede confirmar leyendo el código.
  * **Acción:** A 390 px: 1) abrir el menú con Enter; 2) pulsar Tab y Shift+Tab varias veces y comprobar que el foco no sale del drawer; 3) cerrar con Escape y comprobar que el foco vuelve a "Abrir menú"; 4) volver a abrir, elegir un enlace y comprobar que, con el drawer cerrado, sus botones no reciben Tab.
  * **Resultado esperado:** Se cumplen los cuatro puntos. Si alguno falla, se abre una tarea específica con lo observado.

- [ ] **Tokenizar las sombras y velos repetidos por tema**
  * **Diagnóstico:** Hay sombras `rgba` escritas a mano, cada una con su copia para tema claro: `Main.scss` (líneas 30, 35 y 134), `Contact.scss` (44 y 50) y `Navigation.scss` (27, 32, 156 y 161). Los velos del drawer también están fijos (`Navigation.scss`, líneas 165 y 169). Por eso se repiten pares de selectores `.light-mode X` y `body.theme-light X`.
  * **Acción:** Crear en los dos bloques de `_tokens.scss` los tokens `--shadow-lift`, `--shadow-raised`, `--shadow-drawer` y `--scrim`, con los valores actuales de cada tema. Usarlos en esos selectores y borrar los pares `.light-mode …` / `body.theme-light …` que quedan sin efecto.
  * **Resultado esperado:** `grep -n "rgba(" src/assets/styles/{Main,Contact,Navigation}.scss` solo devuelve degradados decorativos. Las capturas de `npm run shots` en ambos temas no cambian.

- [ ] **Tokenizar los colores del botón de acento**
  * **Diagnóstico:** En `_glass.scss`, `.glass-button--accent` (líneas 138-167) usa colores fijos: `#06101b` para el texto, `rgba(169, 198, 234, 0.55)` para el borde y, en tema claro, `#24558e`, `#1c4a7e`, `#12345e`, `#163e6b`, `#0c2545` y `#f7fbff`. Tiene sus propias reglas de tema en vez de tokens.
  * **Acción:** Crear `--on-accent`, `--accent-button`, `--accent-button-hover` y `--accent-button-border` en ambos bloques. Reemplazar los valores y borrar las reglas `.light-mode .glass-button--accent*` y `body.theme-light .glass-button--accent*`.
  * **Resultado esperado:** No queda ningún hex en `_glass.scss`. El botón se ve igual en ambos temas y el texto sobre el botón mantiene un contraste de 4.5:1 o más (lo audita la tarea *Auditar el contraste del texto sobre vidrio en ambos temas*).

- [ ] **Quitar los `!important` de los overrides de MUI en `Navigation.scss`**
  * **Diagnóstico:** `Navigation.scss` tiene 16 `!important` (líneas 2-4, 123-143, 149-153, 195 y 258). Hacen falta porque emotion inyecta el CSS de MUI después del propio y gana cuando la especificidad empata.
  * **Acción:** Subir la especificidad en vez de usar `!important`: `.navbar.MuiAppBar-root`, `.navbar__icon.MuiIconButton-root`, `.navbar__menu.MuiIconButton-root`, `.nav-drawer__paper.MuiDrawer-paper` y `.nav-drawer__close.MuiIconButton-root`. Quitar los `!important` de uno en uno y confirmar en DevTools > Computed que la regla propia sigue ganando.
  * **Resultado esperado:** `grep -c '!important' src/assets/styles/Navigation.scss` da 0. La barra, los iconos, el menú (visible solo por debajo de 900 px) y el drawer se ven igual en ambos temas.

- [ ] **Quitar los `!important` de los tamaños de icono SVG**
  * **Diagnóstico:** `font-size: … !important` aparece en `.hero__actions .glass-button svg` y `.hero__social svg` (`Main.scss`, líneas 76 y 102), `.footer__socials svg` (`Footer.scss`, 88), `.cv-card__actions .glass-button svg` (`Project.scss`, 148) y `.email-icon` (`Contact.scss`, 71). Los cuatro primeros selectores ya tienen especificidad (0,1,1) o mayor, que gana a `.MuiSvgIcon-fontSize*` (0,1,0).
  * **Acción:** Borrar `!important` en esos cinco puntos. En `.email-icon`, cambiar el selector a `.email-link .email-icon`.
  * **Resultado esperado:** Los iconos miden lo mismo antes y después según DevTools > Computed, y no hay diferencias en las capturas.

- [ ] **Quitar los `!important` de `Contact.scss`**
  * **Diagnóstico:** `.email-link` usa `color: … !important` (línea 58), lo que además anula el `a:hover` global, y `.copy-btn` y `.copy-btn:hover` (líneas 81-90) usan `!important` en color, fondo y transición para ganarle a MUI.
  * **Acción:** Cambiar a `.email-container .email-link` (especificidad 0,2,0, mayor que el 0,1,1 de `a:hover`) y a `.email-container .copy-btn.MuiIconButton-root`, sin `!important`. Decidir si el correo cambia de color al pasar el cursor; hoy no lo hace.
  * **Resultado esperado:** `grep -c '!important' src/assets/styles/Contact.scss` da 0, y el botón de copiar y el enlace se ven igual en ambos temas.

- [ ] **Quitar `glass--interactive` de las tarjetas que no son interactivas**
  * **Diagnóstico:** `.skill` (`Expertise.tsx`, línea 74) y `.timeline__card` (`Timeline.tsx`, línea 87) usan `glass--interactive`: al pasar el cursor se elevan y muestran el barrido de brillo, como si fueran clicables, pero no contienen ningún enlace. `.award` y `.cv-card` sí tienen enlaces y deben conservar la clase.
  * **Acción:** Quitar `glass--interactive` de esos dos `className` y mantener `glass`. *Es una decisión visual: confirmar antes de aplicarla.*
  * **Resultado esperado:** Las tarjetas de competencias y de trayectoria ya no se elevan; las de premios y CV sí. El vidrio, el borde especular y la sombra no cambian.

- [ ] **Eliminar el vidrio anidado en el campo de correo**
  * **Diagnóstico:** En `Contact.tsx`, `.contact-panel.glass` (línea 26) contiene `.email-container.glass.glass--pill` (línea 36). Quedan dos `backdrop-filter`, uno sobre otro, y dos bordes especulares en el mismo bloque.
  * **Acción:** 1) Quitar `glass` y `glass--pill` del `className` de `.email-container`. 2) En `Contact.scss`, darle una superficie interior translúcida: `border: 1px solid var(--glass-border); background: var(--accent-soft); box-shadow: inset 0 1px 0 var(--glass-highlight);`, sin `backdrop-filter`. *Decisión visual: confirmar.*
  * **Resultado esperado:** En DevTools > Layers, el bloque de contacto tiene una sola capa con `backdrop-filter`. El campo sigue leyéndose como vidrio en ambos temas.

- [ ] **Dar al drawer el mismo desenfoque que el resto del vidrio**
  * **Diagnóstico:** `.nav-drawer__paper` (`Navigation.scss`, línea 148) usa `blur(15px)` fijo, mientras el resto del vidrio usa `--glass-blur` (13 o 10 px en oscuro y 18 o 14 px en claro).
  * **Acción:** Reemplazarlo por `blur(var(--glass-blur)) saturate(var(--glass-saturate))` en las dos declaraciones (con y sin prefijo). Funciona porque `--glass-blur` también está definido para `body.theme-light`.
  * **Resultado esperado:** En DevTools > Computed, el `backdrop-filter` del drawer coincide con el de las tarjetas en ambos temas y a 390 y 1024 px.

- [ ] **Mostrar error al copiar el correo en vez de redirigir sin aviso**
  * **Diagnóstico:** En `Contact.tsx`, el `catch` de `handleCopy` (líneas 18-19) navega a `mailto:` sin decir que la copia falló, así que no existe un estado de error. La limpieza del temporizador ya está en la tarea *Limpiar el temporizador del botón copiar en `Contact.tsx`*.
  * **Acción:** Reemplazar `copied: boolean` por `status: "idle" | "copied" | "error"`. En el `catch`, poner `"error"`, mostrar el tooltip "No se pudo copiar" y anunciarlo en el `span.sr-only` con `role="status"`. Quitar la redirección a `mailto:`; el enlace del correo ya cumple esa función.
  * **Resultado esperado:** Con el portapapeles bloqueado (por ejemplo, desactivando `navigator.clipboard` en DevTools), el tooltip muestra el error, el lector de pantalla lo anuncia y la página no navega.

- [ ] **Subir el tamaño mínimo de las etiquetas monoespaciadas**
  * **Diagnóstico:** Varias etiquetas miden entre 0.66 y 0.68 rem (unos 10.6-10.9 px): `.navbar__link`, `.skill__index`, `.chip`, `.chip-title`, `.timeline__number`, `.nav-drawer__index`, `.nav-drawer__title`, `.footer__role` y `.footer__top-link`.
  * **Acción:** Crear `--text-label: 0.75rem` en ambos bloques y aplicarlo a esos selectores. Revisar después que `.navbar__links` siga cabiendo a 901 px.
  * **Resultado esperado:** Ningún texto queda por debajo de 12 px de `font-size` computado. Con zoom al 200 % a 1280 px, la barra y las tarjetas no se solapan.

- [ ] **Verificar el layout de 320 a 1920 px sin el `overflow-x` que lo oculta**
  * **Diagnóstico:** `body { overflow-x: hidden }` (`index.scss`, línea 27) esconde cualquier desborde horizontal, así que el scroll de la página no lo revela.
  * **Acción:** A 320, 390, 768, 1024, 1440 y 1920 px, en ambos temas, desactivar temporalmente esa regla en DevTools y ejecutar `[...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1)`. Ignorar `.ambient` y sus hijos. Repetir en 844×390 (horizontal).
  * **Resultado esperado:** La lista queda vacía en todas las anchuras. Si aparece algún elemento, se abre una tarea con el selector concreto.

- [ ] **Verificar `forced-colors` y `prefers-contrast`**
  * **Diagnóstico:** No hay reglas `forced-colors` ni `prefers-contrast`. El borde especular (`.glass::before` con máscara y degradado), los chips y los botones de acento dependen de fondos y sombras que el modo de alto contraste elimina.
  * **Acción:** En DevTools > Rendering, emular `forced-colors: active` y `prefers-contrast: more`, y revisar tarjetas, chips, botones, barra, drawer y el anillo de foco. Si se pierde algún límite o estado, agregar `@media (forced-colors: active)` en `_glass.scss` con `border-color: CanvasText` en `.glass` y `.glass-button`, y `.glass::before { display: none }`.
  * **Resultado esperado:** En alto contraste, todas las superficies y botones tienen un borde visible y un foco claro.

- [ ] **Verificar Safari/iOS: máscara del vidrio, fondo fijo y altura del hero**
  * **Diagnóstico:** `.glass::before` combina `mask-composite: exclude` con `-webkit-mask-composite: xor` (`_glass.scss`). `.ambient` es `position: fixed; inset: 0`. `.hero` usa `min-height: 100svh` sin respaldo (`Main.scss`, línea 5).
  * **Acción:** En Safari iOS (dispositivo o simulador) y en Safari de macOS, revisar el borde especular de las tarjetas, hacer scroll para que la barra de URL se contraiga y se expanda (el fondo no debe dejar franjas) y comprobar la altura del hero. Si hay problemas con `svh`, agregar `min-height: 100vh;` justo antes de `min-height: 100svh;`.
  * **Resultado esperado:** El borde especular se ve igual que en Chromium, el fondo no deja franjas y el hero llena la pantalla. Además, revisar Firefox y Chromium Android en las mismas vistas.

---

## Prioridad BAJA

- [ ] **Mapear a tokens los radios fijos**
  * **Diagnóstico:** Hay radios escritos a mano: 9 px en `.award__frame img`, 10 px en `.footer__mark`, 11 px en `.navbar__mark`, 14 px en `.skill__icon`, 15 px en `.award__frame`, 16 px en `.cv-card__icon` y `24px 0 0 24px` en `.nav-drawer__paper`. Al mismo tiempo, `--radius-sm` (10 px) y `--radius-md` (16 px) no se usan.
  * **Acción:** Usar `--radius-sm` para 9, 10 y 11 px, `--radius-md` para 14, 15 y 16 px, y `--radius-lg` para el drawer (24 → 22 px). Si alguna diferencia se nota, crear un token intermedio en ambos bloques.
  * **Resultado esperado:** `grep -n "border-radius: [0-9]" src/assets/styles` solo devuelve `50%`, y las capturas no muestran cambios apreciables.

- [ ] **Mapear a tokens las duraciones fijas**
  * **Diagnóstico:** Hay duraciones fijas: 680 ms en `Reveal.scss`, 620 ms en `.award__frame img`, 720 ms en `.glass--interactive::after` y 600 ms en `.ambient__sheen`. Mientras tanto, `--duration-slow` (560 ms) no se usa.
  * **Acción:** Usar `--duration-slow` para 560-620 ms y crear `--duration-reveal` (680 ms) y `--duration-sheen` (720 ms) en ambos bloques. Las curvas ya usan `--ease-*`.
  * **Resultado esperado:** `grep -nE "[0-9]{3}ms" src/assets/styles` solo devuelve `_tokens.scss`.

- [ ] **Definir una escala tipográfica con tokens**
  * **Diagnóstico:** Hay unos 24 valores de `font-size` distintos entre los SCSS (por ejemplo 0.76, 0.78, 0.86, 0.88, 0.9, 0.92, 0.98, 1.08, 1.12, 1.14, 1.16 y 1.18 rem).
  * **Acción:** Definir en ambos bloques `--text-sm`, `--text-base`, `--text-md` y `--text-lg` (más el `--text-label` de la tarea de Prioridad Media), agrupando los valores que difieren en ±0.02 rem. Los `clamp()` de los títulos se quedan como están.
  * **Resultado esperado:** Los valores de `font-size` fijos bajan de unos 24 a 6 o menos, sin cambios apreciables en las capturas.

- [ ] **Consolidar los puntos de quiebre**
  * **Diagnóstico:** Hay 10 breakpoints distintos (420, 480, 560, 640, 700, 760, 768, 780, 900 y 980 px) repartidos en 9 archivos.
  * **Acción:** Crear `src/assets/styles/_breakpoints.scss` con `$bp-xs: 420px; $bp-sm: 560px; $bp-md: 768px; $bp-lg: 980px;` e importarlo con `@use` en cada SCSS de componente (las custom properties no funcionan dentro de `@media`). Llevar cada consulta al valor más cercano, cambiando de uno en uno.
  * **Resultado esperado:** `grep -rhoE "max-width: [0-9]+px" src/assets/styles src/index.scss | sort -u` devuelve 4 valores o menos, y las capturas a 390 y 1440 px no cambian.

- [ ] **Eliminar las reglas sin uso `.glass-rule` y `.section-rule`**
  * **Diagnóstico:** `.glass-rule` (`_glass.scss`, línea 171) y `.section-rule` (`index.scss`, línea 155) no se usan en ningún componente.
  * **Acción:** Borrar ambos bloques.
  * **Resultado esperado:** `grep -rn "glass-rule\|section-rule" src` no devuelve nada, y el build y las capturas no cambian.

- [ ] **Quitar el fondo fijo duplicado de `body.theme-light`**
  * **Diagnóstico:** `index.scss` (líneas 30-32) declara `body.theme-light { background: #edf1f5; }`, pero `body { background: var(--bg) }` ya resuelve ese mismo valor porque `body.theme-light` redefine `--bg`.
  * **Acción:** Borrar el bloque.
  * **Resultado esperado:** En tema claro, el fondo computado de `body` en DevTools sigue siendo `rgb(237, 241, 245)`.

- [ ] **Extraer una clase `.icon-tile` para los íconos en baldosa**
  * **Diagnóstico:** `.navbar__mark`, `.footer__mark`, `.skill__icon`, `.cv-card__icon` y `.timeline__marker` repiten el mismo patrón (rejilla centrada, borde, radio, fondo `--accent-soft`, `inset` con `--glass-highlight` y color `--accent-bright`), con pequeñas variaciones de tamaño.
  * **Acción:** Crear `.icon-tile` en `_glass.scss` con el patrón común y modificadores de tamaño (`--sm` 34-36 px, `--md` 48 px, `--lg` 58 px). Agregarla en los JSX y dejar en cada selector solo lo que lo distingue.
  * **Resultado esperado:** Desaparece la duplicación en 5 archivos y las capturas no cambian.

- [ ] **Extraer una clase `.icon-link` para los enlaces circulares**
  * **Diagnóstico:** `.hero__social` (`Main.scss`) y `.footer__socials a` (`Footer.scss`) son casi idénticos: círculo con `--hairline`, `hover` con `--accent-soft` y `--accent-line`, y `translateY(-2px)`.
  * **Acción:** Crear `.icon-link` en `_glass.scss`, usando `--touch-target` y el hover bajo `@media (hover: hover)`, y aplicarla en ambos componentes. Conviene hacerlo después de las tareas de área táctil y de hover.
  * **Resultado esperado:** Una sola definición y el mismo resultado visual en el hero y en el pie.

- [ ] **Reemplazar los selectores frágiles y unificar nombres BEM**
  * **Diagnóstico:** Algunos selectores dependen de la estructura del DOM: `.skill > p`, `.cv-card__body > p:last-of-type`, `.section-heading>p:last-child`, `.contact-panel__intro > p:last-child`, `.footer__socials a` y `.timeline__card h3`. A la vez conviven clases que no siguen BEM (`.copy-btn`, `.email-link`, `.email-icon`) con el resto, que sí lo sigue.
  * **Acción:** Agregar clases explícitas (`skill__description`, `cv-card__text`, `section-heading__lead`, `footer__social`, `timeline__title`) y renombrar `copy-btn` → `email-container__copy`, `email-link` → `email-container__link` y `email-icon` → `email-container__icon`, en SCSS y TSX a la vez.
  * **Resultado esperado:** No quedan selectores con `>`, `:last-child` ni `:last-of-type` sobre etiquetas en los SCSS de componente, y las capturas no cambian.

- [ ] **Decidir si la primera visita sigue `prefers-color-scheme` (requiere aprobación)**
  * **Diagnóstico:** Sin un valor guardado, `App.tsx` (línea 23) usa `"dark"` e ignora la preferencia del sistema. Coincide con `AGENTS.md` ("Modo oscuro por defecto"), así que no es un error, sino una decisión de diseño.
  * **Acción:** Si se aprueba, usar `matchMedia('(prefers-color-scheme: light)')` solo cuando no haya nada guardado, tanto en `App.tsx` como en el script inline, y actualizar `AGENTS.md`.
  * **Resultado esperado:** Con DevTools emulando `prefers-color-scheme: light` y el `localStorage` vacío, la primera carga sale en tema claro sin flash.

- [ ] **Decidir `viewport-fit=cover` y `safe-area-inset` (requiere aprobación)**
  * **Diagnóstico:** El `<meta name="viewport">` no lleva `viewport-fit=cover`, así que en un iPhone con notch en horizontal Safari deja márgenes y el fondo ambiental no llega al borde. Hoy no hay solapamiento con el notch, porque `env(safe-area-inset-*)` vale 0.
  * **Acción:** Si se aprueba, agregar `viewport-fit=cover` y luego `padding-inline: max(var(--page-gutter), env(safe-area-inset-left/right))` en `.navbar__inner`, `.section__inner` y `.footer__inner`, y `padding-right: max(22px, env(safe-area-inset-right))` en `.nav-drawer__paper`.
  * **Resultado esperado:** En un iPhone en horizontal, el fondo llega a los bordes y ningún texto ni botón queda bajo el notch.

---

## Orden sugerido de ejecución

0. **Contraste sobre el fondo:** halo de legibilidad, luego color de los eyebrows y luego `.footer__role`. Medir con `node scripts/contrast.mjs` antes y después de cada paso.
1. **Accesibilidad base:** foco sin `border-radius`, nombre accesible del logo y `aria-expanded`.
2. **Área táctil:** crear el token `--touch-target` y luego barra, iconos sociales y `IconButton`.
3. **Interacción:** hover solo con puntero, icono de premios con foco y un enlace por tarjeta de premio.
4. **Tema:** medir el flash y, si aparece, aplicar el tema antes del primer pintado; después sincronizar `theme-color`.
5. **Anclas y estados:** `scroll-margin-top` de `#cv` y error al copiar.
6. **Tokens:** sombras y velos, luego botón de acento y luego etiquetas monoespaciadas.
7. **Especificidad:** `!important` de iconos SVG, luego `Contact.scss` y luego `Navigation.scss`.
8. **Coherencia del vidrio:** tarjetas no interactivas, vidrio anidado y desenfoque del drawer (las dos primeras necesitan confirmación visual).
9. **Verificaciones:** foco del drawer, layout de 320 a 1920 px, `forced-colors`, y Safari, Firefox y Android.
10. **Baja:** radios, duraciones, escala tipográfica, breakpoints, reglas muertas, `body.theme-light`, `.icon-tile`, `.icon-link`, nombres BEM y, por último, las dos decisiones que requieren aprobación.

## Chequeo después de cada tarea

1. `npx tsc --noEmit`
2. `CI=true npm test -- --watchAll=false`
3. `npm run build`
4. Si la tarea toca colores, tokens de texto, `--ribbon-*` o el fondo ambiental: `node scripts/contrast.mjs` (o `npm run contrast` cuando exista), con `npm start` en marcha.
5. Con `npm start` corriendo en `:3000`: `npm run shots`, que genera capturas en ambos temas, a 1440×900 y 390×844, en `screenshots/` (carpeta ignorada por git). Compararlas con las capturas anteriores a la tarea.

`npm run shots` se ejecuta con `reducedMotion: "reduce"` y solo captura hero, competencias y reconocimientos. No cubre foco, hover, áreas táctiles, el drawer ni el contacto. En las tareas que tocan esas zonas, además hay que repetir la comprobación manual indicada en su **Resultado esperado**.
