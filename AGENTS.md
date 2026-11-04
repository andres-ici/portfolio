# AGENTS.md

Portafolio personal de Andrés Carrasco. React 18 + TypeScript + SCSS sobre Create React App (`react-scripts` 5), sin backend. Contenido y UI en español.

## Comandos

```bash
npm install                 # Node 20 recomendado
npm start                   # http://localhost:3000
npm run build               # genera build/ (ignorado por git)
npx tsc --noEmit            # typecheck; no hay script npm dedicado
CI=true npm test -- --watchAll=false
CI=true npm test -- --watchAll=false src/App.test.tsx -t "renders the portfolio heading"
```

- No hay script de lint: ESLint (`react-app`) corre dentro de `start`/`build`.
- No ejecutar `npm run eject` ni migrar el toolchain sin pedido explícito.
- `build/` es artefacto de salida: no editarlo ni commitearlo.

## Despliegue: Cloudflare Pages (plan gratuito)

- Build command `npm run build`; output `build`; Node 20. Es 100% estático: no agregar Workers, Functions, API routes ni SSR.
- Mantener `public/_redirects` con `/* /index.html 200` para el fallback SPA.
- Respetar límites del plan gratuito (20.000 archivos, 25 MiB por archivo): optimizar imágenes (preferir `.webp`) y evitar dependencias pesadas.
- `homepage` es `"."` (rutas relativas). No cambiarlo sin revisar el hosting.
- Variables `REACT_APP_*` se inlinean en build; no hay variables de entorno en runtime.

## Arquitectura

- `src/index.tsx` monta `App.tsx`; `App.tsx` compone las secciones mediante el barrel `src/components/index.js` (es `.js` por `allowJs: true`). Al agregar/quitar una sección, actualizar ese barrel.
- Cada componente importa su propio SCSS desde `src/assets/styles/`; `tokens` y `glass` se cargan globalmente en `src/index.scss` con `@use`.
- Navegación por scroll a anclas, sin router. Los `id` de sección (`top`, `expertise`, `history`, `projects`, `contact`) deben coincidir con `navItems` en `Navigation.tsx`.
- Contenido editable en los componentes (`Main`, `Expertise`, `Timeline`, `Project`, `Contact`). Datos SEO/`<title>` en `public/index.html`.
- Imágenes y CV en `src/assets/images/`; se importan desde el código para que CRA les ponga hash.

## Tema visual

- Modo oscuro por defecto; el claro se activa con la clase `.main-container.light-mode`.
- Tokens en `src/assets/styles/_tokens.scss`: todo token nuevo debe definirse en `:root` y en `.main-container.light-mode`.
- Persistencia en `localStorage` con la clave `portfolio-theme`. El script inline de `public/index.html` evita el flash de tema; si cambia la lógica de tema en `App.tsx`, sincronizar ese script, `meta[name="theme-color"]` y `documentElement`.
- Sistema "liquid glass" en `_glass.scss`: reutilizar clases `.glass`, `.glass--interactive`, `.glass-button` en lugar de duplicar estilos.
- Respetar `prefers-reduced-motion` y `prefers-reduced-transparency` ya contemplados en los estilos.

## Tests

- Jest + React Testing Library (jsdom); setup en `src/setupTests.ts`.
- Existe una sola prueba (`src/App.test.tsx`) que verifica el `h1`. Si cambia el nombre del titular, actualizarla.
- Los warnings de `act()` deprecado y de `babel-preset-react-app` son preexistentes; el test pasa.
