# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Dos audiencias con el mismo peso:

- **Reclutadores y empresas** que evalúan candidatos para roles de ingeniería, automatización industrial, control de procesos o desarrollo de software.
- **Potenciales clientes de consultoría** que buscan servicios de automatización, control o desarrollo de software.

Ambas llegan sin contexto previo sobre Andrés Carrasco Inostroza y necesitan decidir rápido si su perfil encaja. El sitio también queda disponible para quien llegue desde LinkedIn, GitHub o una referencia directa.

## Product Purpose

Portafolio profesional personal de Andrés Carrasco Inostroza, Ingeniero Civil Electrónico titulado en 2025 por la Universidad de La Frontera. Reúne competencias técnicas, trayectoria profesional y académica, reconocimientos y currículum vitae en un único lugar.

El éxito significa que el visitante pueda, en la misma visita: contactar por correo, revisar o descargar el CV, evaluar la experiencia técnica en profundidad y validar credenciales y premios. Las tres acciones tienen el mismo peso.

## Positioning

Perfil híbrido de ingeniería eléctrica/electrónica con especialización en automatización y control industrial, más desarrollo de software. Esa combinación está respaldada por la memoria de título en la planta de molibdeno de Compañía Minera Doña Inés de Collahuasi, proyectos de control y automatización en la UFRO, y el reconocimiento como Mejor Titulado de la Promoción 2025 de Ingeniería Civil Electrónica.

## Operating Context

- Sitio estático de una página con navegación por anclas: `top`, `expertise`, `history`, `projects`, `contact`.
- El visitante llega desde búsqueda, LinkedIn, GitHub o una referencia directa; no hay login, cuentas ni flujos internos.
- El contacto ocurre por correo (`andres.carrasco@ingenieros.cl`) o mediante enlaces externos a GitHub y LinkedIn.
- El CV se consulta o descarga como PDF desde el hero y desde la sección de reconocimientos.
- Se lee tanto en escritorio como en móvil, en modo oscuro o claro según preferencia persistida en el navegador.
- El contenido está actualmente en español.

## Capabilities and Constraints

- React 18 + TypeScript + SCSS sobre Create React App 5; sin backend, sin SSR, sin rutas de API ni funciones edge.
- Despliegue en Cloudflare Pages (plan gratuito), build `npm run build`, salida `build`, fallback SPA en `public/_redirects`.
- `homepage` es `"."`: el sitio debe funcionar con rutas relativas.
- Contacto solo por `mailto:` y copia al portapapeles; no hay formulario con servidor.
- Tema oscuro por defecto y claro opcional; la preferencia se guarda en `localStorage` bajo `portfolio-theme`.
- El contenido editable vive en los componentes (`Main`, `Expertise`, `Timeline`, `Project`, `Contact`) y los metadatos en `public/index.html`.
- Los datos, fechas, premios y enlaces actuales se consideran contenido confirmado y deben conservarse.
- **Sin decidir:** una versión en inglés u otro idioma, secciones nuevas, analítica y formularios de contacto con backend.

## Brand Commitments

- Nombre completo: **Andrés Carrasco Inostroza**.
- Rol: **Ingeniero Civil Electrónico**.
- Monograma **AC**, usado en navegación y pie de página.
- Enlaces oficiales: GitHub `andres-ici`, LinkedIn de Andrés Carrasco Inostroza, correo `andres.carrasco@ingenieros.cl`.
- Se mantiene el crédito a la plantilla base de Yuji Sato en el pie de página.
- El tono es profesional, directo y en español, sin lenguaje comercial inflado.

## Evidence on Hand

- CV actualizado: `src/assets/images/CV_Andres_Carrasco.pdf`.
- Retrato: `src/assets/images/perfil.webp`.
- Premio Colegio de Ingenieros de Chile (Mejor Titulado Promoción 2025, nota final 6,7) con imagen `PremioCID.webp` y enlace de respaldo en `ingenieros.cl`.
- Premio Universidad de La Frontera (Mejor Titulado Promoción 2025, nota final 6,7, aprobación con distinción máxima) con imagen `PremioUFRO.webp` y enlace de respaldo.
- Trayectoria detallada en `Timeline.tsx`: Collahuasi, LIFIC, seguimiento solar, ayudantías, chatbot IA en iDEAUFRO.
- **Ausencias que no deben inventarse:** testimonios, casos de estudio, métricas de clientes, precios, certificaciones adicionales o experiencia laboral no listada.

## Product Principles

1. **Credibilidad antes que autopromoción.** Cada afirmación debe apoyarse en contenido verificable ya presente (cargos, fechas, premios, enlaces).
2. **Tres salidas, una visita.** Contacto, CV y profundidad técnica deben estar siempre a un paso, sin competir entre sí.
3. **El perfil híbrido es el mensaje.** Automatización/control y software se presentan como una sola capacidad, no como secciones separadas.
4. **Cero fricción técnica.** Sitio estático, rápido y compatible con el plan gratuito de Cloudflare Pages; nada que requiera servidor.
5. **Contenido confirmado, no inflado.** No agregar logros, clientes ni métricas que Andrés no haya proporcionado.

## Accessibility & Inclusion

La implementación actual ya contempla etiquetas ARIA en controles, navegación por teclado en menús y enlaces, estado anunciado al copiar el correo, y respeto por `prefers-reduced-motion` y `prefers-reduced-transparency`. No se estableció un estándar formal adicional; cualquier trabajo futuro debe preservar estas garantías y la legibilidad en ambos temas.
