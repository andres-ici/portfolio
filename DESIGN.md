---
name: Andrés Carrasco Inostroza — Portafolio
description: Vidrio líquido y cintas de señal sobre grafito; un instrumento de precisión para leer un perfil de ingeniería.
colors:
  canvas-night: "#070a0f"
  canvas-night-elevated: "#0c131b"
  canvas-night-deep: "#05080c"
  text-primary-dark: "#f3f6fa"
  text-secondary-dark: "#b0c0d2"
  text-tertiary-dark: "#8ea0b4"
  instrument-blue: "#8cb3e2"
  instrument-blue-bright: "#bad4f5"
  instrument-blue-deep: "#4d76a4"
  instrument-blue-soft: "rgba(140, 179, 226, 0.15)"
  hairline-dark: "rgba(255, 255, 255, 0.12)"
  signal-violet: "#d44dff"
  signal-violet-mid: "#9a5cff"
  signal-blue: "#5f8fd6"
  canvas-light: "#edf1f5"
  canvas-light-elevated: "#f7f9fb"
  canvas-light-deep: "#e3e9ef"
  text-primary-light: "#091119"
  text-secondary-light: "#2a3848"
  text-tertiary-light: "#425264"
  instrument-blue-light: "#1c4a7e"
  instrument-blue-bright-light: "#123661"
  instrument-blue-deep-light: "#0c2545"
  instrument-blue-soft-light: "rgba(28, 74, 126, 0.12)"
  hairline-light: "rgba(12, 20, 29, 0.12)"
  glass-smoked: "rgba(229, 238, 248, 0.42)"
  glass-border-light: "rgba(74, 100, 132, 0.3)"
  ribbon-blueprint: "#6d7fa3"
  ribbon-blueprint-mid: "#7d8fad"
  ribbon-blueprint-deep: "#4f6f96"
typography:
  display:
    fontFamily: "Manrope, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2.9rem, 7vw, 5.7rem)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.05em"
  headline:
    fontFamily: "Manrope, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.4vw, 3.2rem)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Manrope, Segoe UI, system-ui, sans-serif"
    fontSize: "1.18rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, Segoe UI, system-ui, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "0em"
  label:
    fontFamily: "IBM Plex Mono, SFMono-Regular, Consolas, monospace"
    fontSize: "0.72rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.18em"
  caption:
    fontFamily: "IBM Plex Mono, SFMono-Regular, Consolas, monospace"
    fontSize: "0.64rem"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0.1em"
  nav:
    fontFamily: "IBM Plex Mono, SFMono-Regular, Consolas, monospace"
    fontSize: "0.68rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.11em"
  button:
    fontFamily: "IBM Plex Mono, SFMono-Regular, Consolas, monospace"
    fontSize: "0.76rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.09em"
  headline-contact:
    fontFamily: "Manrope, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2.2rem, 5vw, 3.4rem)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.04em"
rounded:
  sm: "10px"
  md: "16px"
  lg: "22px"
  xl: "28px"
  pill: "999px"
spacing:
  gutter: "clamp(20px, 4vw, 40px)"
  section: "clamp(84px, 11vw, 144px)"
  xs: "6px"
  sm: "12px"
  md: "20px"
  lg: "26px"
  xl: "34px"
components:
  button-accent:
    backgroundColor: "{colors.instrument-blue}"
    textColor: "#06101b"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0.72rem 1.2rem"
    height: "44px"
  button-accent-hover:
    backgroundColor: "{colors.instrument-blue-bright}"
    textColor: "#06101b"
    rounded: "{rounded.pill}"
  button-glass:
    backgroundColor: "{colors.instrument-blue-soft}"
    textColor: "{colors.text-primary-dark}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0.72rem 1.2rem"
    height: "44px"
  button-glass-hover:
    backgroundColor: "{colors.instrument-blue-soft}"
    textColor: "{colors.text-primary-dark}"
    rounded: "{rounded.pill}"
  card-glass:
    backgroundColor: "{colors.canvas-night-elevated}"
    textColor: "{colors.text-primary-dark}"
    rounded: "{rounded.lg}"
    padding: "26px"
  chip:
    backgroundColor: "{colors.instrument-blue-soft}"
    textColor: "{colors.text-secondary-dark}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "5px 9px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary-dark}"
    typography: "{typography.nav}"
    rounded: "{rounded.pill}"
    padding: "9px 13px"
  nav-link-active:
    backgroundColor: "{colors.instrument-blue-soft}"
    textColor: "{colors.text-primary-dark}"
    rounded: "{rounded.pill}"
---

# Design System: Andrés Carrasco Inostroza — Portafolio

## Overview

**Creative North Star: "El Instrumento de Precisión"**

El sitio se comporta como un instrumento de medición bien calibrado: no grita, no decora y no compite con la lectura. Un campo de cintas violeta y azul se mueve lentamente al fondo —la señal— y sobre él se apoyan superficies de vidrio que funcionan como lecturas, con etiquetas en monoespaciada y cifras alineadas. La atmósfera es **precisa y serena**: la confianza viene del detalle técnico, no de la hipérbole.

La densidad es media-baja. Cada sección respira con un espaciado generoso y un ritmo constante, y la jerarquía se construye con escala tipográfica y contraste de color, nunca con cajas de colores saturados. El resultado debe sentirse como una sala de instrumentación de noche: oscura, ordenada y con una fuente de luz que no molesta.

El sistema se declara en contra de la **landing SaaS genérica**: hero centrado, tarjetas idénticas, botones gritones y degradados morados sin relación con el contenido. Todo lo que se parezca a una plantilla de producto se considera fuera de mundo. La versión clara no es otro sistema: es el mismo instrumento bajo luz de día, con el violeta desaturado a pizarra.

**Key Characteristics:**
- Vidrio en capas con desenfoque real, borde especular de 1px y sombra de anclaje.
- Grafito casi negro como lienzo; el color solo aparece en el acento y en el fondo.
- Manrope para titulares, Inter para lectura, IBM Plex Mono para toda etiqueta técnica.
- Píldoras y círculos para lo interactivo; esquinas medianas para las superficies.
- Movimiento lento y presupuestado: 160–560ms en interacción, 26–38s en el fondo.

**La Regla del Fondo Silencioso.** El campo ambiental nunca compite con el contenido: se pausa al salir del hero, con la pestaña oculta y con `prefers-reduced-motion`.

## Colors

Un instrumento nocturno: grafito casi negro, un azul de lectura y un violeta que solo existe detrás del vidrio.

En tema claro el mismo instrumento pasa a **vidrio ahumado frío**: el blanco aditivo desaparece y el vidrio se vuelve un tinte azul-pizarra semitransparente (alpha 0,30–0,55) que deja ver las cintas por debajo, se apoya en un borde pizarra y proyecta una sombra fría. El violeta no sobrevive al cambio de luz: las cintas se vuelven blueprint y el fondo se enfría en los bordes.

### Primary
- **Azul Instrumento** (`colors.instrument-blue`): el único color de interacción y de énfasis. Tiñe eyebrows, fechas, iconos, bordes activos y el relleno del botón principal. En tema claro sube de luminosidad a `colors.instrument-blue-light` para mantener contraste sobre papel.
- **Azul Instrumento Brillante** (`colors.instrument-blue-bright`): estado hover de enlaces, iconos y texto de acento; también el extremo luminoso del degradado del botón principal.
- **Azul Instrumento Profundo** (`colors.instrument-blue-deep`): extremo oscuro de ese degradado y ancla del acento en el tema claro (`colors.instrument-blue-deep-light`).
- **Azul Instrumento Suave** (`colors.instrument-blue-soft`): relleno translúcido de chips, botones de vidrio, estados activos y anillos alrededor de retrato y marcadores. Es el acento cuando no debe leerse como color.

### Secondary
- **Violeta Señal** (`colors.signal-violet`) y **Violeta Señal Medio** (`colors.signal-violet-mid`): existen únicamente en las cintas del fondo y en sus halos. No tocan texto, bordes, botones ni iconos.
- **Azul Señal** (`colors.signal-blue`): tercera cinta del campo; aporta la temperatura fría que evita que el violeta se vuelva neón.
- **Blueprint** (`colors.ribbon-blueprint`, `colors.ribbon-blueprint-mid`, `colors.ribbon-blueprint-deep`): las tres cintas del tema claro. No hay violeta en claro; el campo se dibuja en azul-pizarra con croma real y un trazo 1,2–1,35px.

### Neutral
- **Grafito Nocturno** (`colors.canvas-night`): lienzo por defecto de todo el sitio.
- **Grafito Elevado** (`colors.canvas-night-elevated`): relleno de marcadores de timeline y superficies que deben separarse del fondo sin vidrio.
- **Grafito Profundo** (`colors.canvas-night-deep`): base del degradado ambiental y fondo de los marcos de imagen.
- **Tinta Primaria** (`colors.text-primary-dark`): titulares y texto de máximo contraste.
- **Tinta Secundaria** (`colors.text-secondary-dark`): párrafos, descripciones y enlaces en reposo.
- **Tinta Terciaria** (`colors.text-tertiary-dark`): índices, numeración, metadatos y microcopy.
- **Grafito Diurno** (`colors.canvas-light`, `colors.canvas-light-elevated`, `colors.canvas-light-deep`): espejo claro del lienzo.
- **Tinta Diurna** (`colors.text-primary-light`, `colors.text-secondary-light`, `colors.text-tertiary-light`): espejo claro del texto. La terciaria se oscurece un paso porque sobre vidrio ahumado el gris anterior quedaba en 4,48:1.
- **Vidrio Ahumado** (`colors.glass-smoked`, `colors.glass-border-light`): relleno frío translúcido y borde pizarra del tema claro. Sustituyen el relleno blanco del sistema anterior.

### Named Rules
**La Regla del Violeta de Fondo.** El violeta y el magenta están prohibidos fuera del campo ambiental. Si aparece en un botón, un borde o un texto, el sistema se rompe.

**La Regla del Azul Único.** El azul es el único color interactivo. El único color ajeno permitido es el verde de confirmación de MUI al copiar el correo, y solo dentro de ese estado.

**La Regla del Tema Espejo.** Todo token nuevo se declara en `:root` y en `.main-container.light-mode, body.theme-light`. Un token sin espejo claro es un bug.

## Typography

**Display Font:** Manrope (con Segoe UI, system-ui)
**Body Font:** Inter (con Segoe UI, system-ui, -apple-system)
**Label/Mono Font:** IBM Plex Mono (con SFMono-Regular, Consolas)

**Character:** Manrope aporta geometría amable y algo de humanidad en los titulares; Inter mantiene la lectura neutra en párrafos largos; IBM Plex Mono introduce la voz de instrumento en todo lo que se lee como dato: etiquetas, fechas, índices y numeración de sección. El contraste entre las tres es deliberado y es la firma tipográfica del sitio.

### Hierarchy
- **Display** (600, `clamp(2.9rem, 7vw, 5.7rem)`, 0.98): solo el nombre en el hero. Tracking muy negativo y `text-wrap: balance`.
- **Headline** (600, `clamp(2rem, 4.4vw, 3.2rem)`, 1.12): títulos de sección; el de contacto sube a `clamp(2.2rem, 5vw, 3.4rem)`.
- **Title** (600, 1.18rem, 1.3): títulos de tarjeta, habilidad y entrada de timeline; baja a 1.08–1.16rem en móvil.
- **Body** (400, 1rem, 1.7): párrafos con ancho máximo de 620–820px según el contenedor; las descripciones de tarjeta bajan a 0.9–0.92rem.
- **Label** (500, 0.72rem, 0.18em, mayúsculas): eyebrows de sección, siempre precedidos por una línea de 28px.
- **Caption** (400, 0.64rem, 0.1em): chips, índices, fechas y numeración. Nunca se usa para frases completas.
- **Nav** (500, 0.68rem, 0.11em, mayúsculas): enlaces de navegación de escritorio.

### Named Rules
**La Regla Mono-Etiqueta.** IBM Plex Mono solo etiqueta, nunca explica. Un párrafo, una descripción o un mensaje de más de una línea jamás va en monoespaciada.

**La Regla del Tracking Inverso.** A mayor tamaño, menor tracking: los titulares aprietan entre −0.02em y −0.05em; las etiquetas monoespaciadas abren entre 0.1em y 0.18em.

## Layout

El contenido vive en un contenedor único de 1120px (`--page-max`) con un gutter fluido de `clamp(20px, 4vw, 40px)` por lado: `width: min(calc(100% - (gutter * 2)), 1120px)`. Las secciones se separan con `clamp(84px, 11vw, 144px)` de padding vertical, reducido a 76px por debajo de 640px. La navegación fija mide 72px y cada ancla reserva `scroll-margin-top` para no quedar tapada.

El hero es una rejilla de dos columnas (`auto` para el retrato, `1fr` para el texto) que se apila por debajo de 768px; en móvil el retrato pasa a fila horizontal y solo vuelve a columna por debajo de 420px. Las habilidades usan tres columnas que bajan a dos en 980px (la última tarjeta ocupa la fila completa) y a una en 700px. Los reconocimientos son dos columnas que colapsan a una en 780px; la tarjeta de CV siempre ocupa el ancho completo.

El ritmo interno es constante: 26px de padding en tarjetas (22px en móvil), 20px de separación en rejillas, 22px entre entradas de timeline y 12px entre botones. Los textos de apoyo nunca superan los 620px de ancho para conservar la línea de lectura.

**La Regla de la Columna Única de Lectura.** Ningún párrafo supera 820px, y los introductorios se quedan en 520–620px. El ancho completo se reserva para rejillas y superficies, no para texto.

## Elevation & Depth

Sistema híbrido: la profundidad principal la produce el **vidrio** (desenfoque de fondo + saturación + borde especular de 1px), y la sombra solo ancla la superficie al lienzo. No hay elevación dramática ni capas apiladas con sombras duras. El fondo ambiental añade una segunda profundidad óptica —cintas, halos, brillo viajero y grano— que nunca se mezcla con la jerarquía del contenido.

El vidrio se define una sola vez en `.glass`: `backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate))`, un degradado de tres paradas y un `::before` que pinta solo el borde con una máscara. **En oscuro es aditivo** (blanco translúcido sobre grafito); **en claro es ahumado** (tinte frío que se espesa hacia el borde inferior, borde pizarra y sombra fría). En móvil el desenfoque baja a 10px en oscuro y a 14px en claro; con `prefers-reduced-transparency` se elimina el filtro y el degradado se vuelve casi opaco. El `Drawer` usa `--drawer-surface` porque es un portal sobre `<body>`.

### Shadow Vocabulary
- **Reposo de vidrio** (`inset 0 1px 0 var(--glass-highlight), 0 24px 70px rgba(0,0,0,0.38), 0 2px 10px rgba(0,0,0,0.18)`): toda tarjeta `.glass` en reposo.
- **Hover de vidrio** (`0 30px 80px rgba(0,0,0,0.42)` más un anillo `0 0 0 1px var(--accent-soft)`): solo en `.glass--interactive`, junto con `translateY(-3px)` y el barrido de brillo.
- **Nav fija** (`0 20px 55px rgba(0,0,0,0.34)`): aparece solo cuando `is-scrolled`; en claro baja a `0 18px 45px rgba(35,52,70,0.14)`.
- **Retrato** (`0 28px 70px rgba(0,0,0,0.34)` más `0 0 0 8px var(--accent-soft)`): el único elemento con anillo de acento permanente.
- **Drawer** (`-24px 0 70px rgba(0,0,0,0.32)`): sombra lateral direccional, nunca simétrica.
- **Reposo de vidrio, claro** (`0 26px 64px rgba(31,52,78,0.16), 0 2px 10px rgba(31,52,78,0.1)`): la sombra nocturna sobre papel se lee como hollín; en claro la sombra es fría y más corta.
- **Hover de vidrio, claro** (`0 26px 60px rgba(31,52,78,0.2)`): mismo criterio, más un anillo `--accent-soft`.

### Named Rules
**La Regla del Vidrio Ahumado.** En tema claro la profundidad sale del tinte frío, el borde pizarra y una sombra azulada. Prohibido resolverla con blanco aditivo, sombra negra o un borde blanco.

### Named Rules
**La Regla del Vidrio en Capas.** La profundidad se construye con desenfoque y borde, no con sombra. Si una superficie necesita una sombra más fuerte para separarse, primero falta contraste de borde o de relleno.

**La Regla del Anillo de Acento.** El anillo `0 0 0 Npx var(--accent-soft)` se reserva para el retrato y los marcadores de timeline. No se usa como foco genérico.

## Shapes

Lenguaje de formas en dos familias. Lo **interactivo** es píldora o círculo: botones, chips, navegación, enlaces sociales, marcadores y el contenedor del correo. Lo **contenedor** es rectangular con esquinas medianas: 22px en tarjetas, 28px en el panel de contacto, 15–16px en marcos e iconos.

Los bordes son siempre hairline de 1px en `--hairline` o `--glass-border`; no hay bordes gruesos ni rellenos de color plano. Los marcos de imagen añaden un padding de 8px que funciona como paspartú. El monograma **AC** es la excepción geométrica: un cuadrado de esquinas pequeñas (11px en nav, 10px en footer).

**La Regla de la Píldora.** Si se puede pulsar, es píldora o círculo. Si contiene contenido, es rectángulo de esquinas medianas. Nunca al revés.

## Components

### Buttons
- **Shape:** píldora completa (`{rounded.pill}`), altura mínima 44px, padding `0.72rem 1.2rem`.
- **Primary:** degradado de 135° entre `instrument-blue-bright`, `instrument-blue` y `instrument-blue-deep`, texto `#06101b`, borde translúcido y brillo interior superior. Es el único elemento que puede llevar color pleno.
- **Secondary (glass):** mismo cuerpo con `--glass-gradient`, borde `--glass-border` y texto primario. Al hover sube 1px y el borde pasa a `--accent-line`.
- **Typography:** IBM Plex Mono 0.76rem, 500, tracking 0.09em, mayúsculas; los iconos van a 1rem y separados 0.55em.
- **Hover / Focus:** transición de 160ms; foco visible con outline de 2px en `--accent-bright` y offset de 3px. No hay estado de relleno saturado al hover.
- **Mobile:** por debajo de 420–480px los botones de un grupo se reparten el ancho (`flex: 1 1 auto`).

### Chips
- **Style:** píldora con fondo `instrument-blue-soft`, borde hairline, texto secundario en mono de 0.64rem. Se agrupan con 6px de separación y nunca llevan icono.
- **State:** no son interactivos; no tienen hover ni selección. Su función es listar tecnología.

### Cards / Containers
- **Corner Style:** 22px (`{rounded.lg}`); el panel de contacto usa 28px (`{rounded.xl}`).
- **Background:** `.glass` con degradado blanco translúcido en oscuro; en claro, tinte frío al 30–55% con borde pizarra y sombra azulada.
- **Shadow Strategy:** la de reposo descrita en Elevation; solo `.glass--interactive` responde al hover.
- **Border:** 1px `--glass-border` más el borde especular del `::before`.
- **Internal Padding:** 26px (22px en móvil); las tarjetas de reconocimiento usan 14px con 24px inferior para dejar respirar la imagen.

### Inputs / Fields
No existen campos de formulario. El único elemento con forma de campo es la **píldora de correo**: contenedor `.glass--pill` con el enlace, un divisor vertical de 1px y un botón de copiado. Su hover oscurece el borde y añade un anillo suave; el estado copiado cambia el icono a check y anuncia el resultado por `role="status"`.

### Navigation
- **Style:** barra flotante en píldora, separada 14px del borde superior, con marca **AC** de 36px, nombre, enlaces y acciones.
- **Typography:** enlaces en mono de 0.68rem con tracking 0.11em y mayúsculas; el nombre usa Manrope 0.88rem.
- **States:** enlace activo con fondo `accent-soft` y borde `accent-line`; hover solo con fondo suave. La barra gana sombra a partir de 24px de scroll y conserva el vidrio translúcido en todo momento.
- **Mobile:** por debajo de 900px los enlaces desaparecen y se abre un `Drawer` lateral de 360px con índices numéricos y padding-left animado al hover.

### Ambient Field (signature)
El fondo es SVG estático: cintas generadas desde puntos de control, halos radiales, un brillo viajero y grano fractal. Solo se animan los contenedores externos (`translate`/`rotate`), nunca los `<g>`, para rasterizar una vez. Se pausa con `.ambient--calm` al salir del hero y con `.ambient--paused` al ocultar la pestaña. En claro, las tres cintas blueprint (`colors.ribbon-blueprint*`) sustituyen al violeta, suben a 0,62–0,85 de opacidad y engordan el trazo para sostener 2,2–3:1 en el hero.

### Timeline (signature)
Lista vertical con una línea de 1px que se desvanece en los extremos. Cada entrada lleva un marcador circular de 47px (37px en móvil) con icono de 15px, relleno `canvas-night-elevated` y anillo `accent-soft`, desplazado 72px (54px en móvil) del contenido.

### Award Card (signature)
Tarjeta interactiva con marco de imagen 4:3 en `canvas-night-deep`, paspartú de 8px y esquinas de 15px. Al hover, la imagen escala 1.025 y aparece un botón circular de 34px con flecha saliente en la esquina superior derecha. El título enlaza con una flecha que se desplaza 2px al hover.

## Do's and Don'ts

### Do:
- **Do** declarar cada token nuevo en `:root` y en el bloque claro (`.main-container.light-mode, body.theme-light`), incluido el `Drawer`.
- **Do** reutilizar `.glass`, `.glass--interactive`, `.glass--pill` y `.glass-button` antes de escribir estilos de superficie nuevos.
- **Do** usar IBM Plex Mono para etiquetas, índices, fechas y numeración, con tracking entre 0.1em y 0.18em.
- **Do** mantener el azul como único color de interacción y el violeta confinado al fondo.
- **Do** preservar los tres estados de accesibilidad ya implementados: foco visible de 2px, `prefers-reduced-motion` y `prefers-reduced-transparency`.
- **Do** verificar ambos temas: cualquier superficie nueva debe leerse sobre grafito y sobre papel.
- **Do** tratar el tema claro como vidrio ahumado: tinte frío al 30–55%, borde pizarra y sombra azulada.

### Don't:
- **Don't** usar violeta o magenta en texto, bordes, botones o iconos; pertenecen al campo ambiental.
- **Don't** introducir una tercera familia tipográfica ni usar Manrope para párrafos.
- **Don't** construir un hero centrado con tarjetas idénticas y CTA gritón: es la anti-referencia declarada del sistema.
- **Don't** añadir sombras más fuertes para "destacar" una tarjeta; primero corrige borde, relleno o contraste.
- **Don't** animar los `<g>` del SVG ambiental ni dejar el campo corriendo fuera del hero.
- **Don't** usar esquinas rectas en elementos interactivos ni píldoras en contenedores de contenido.
- **Don't** sustituir el vidrio por fondos planos opacos salvo en `prefers-reduced-transparency` o cuando falte `backdrop-filter`.
- **Don't** reutilizar las sombras negras ni los bordes blancos del tema oscuro en claro: allí la sombra es fría y el borde es pizarra.
