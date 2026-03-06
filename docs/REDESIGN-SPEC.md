# MainBranch — Especificación de Rediseño v1.0

> Medio tech con estética premium, modular, high-signal / low-noise.
> Mezcla entre editorial y producto digital.

---

## 1. Dirección Visual

### Principios de diseño

| Principio | Descripción |
|---|---|
| **High-signal** | Cada elemento visible debe aportar información útil. Sin decoración gratuita. |
| **Editorial + SaaS** | Jerarquía tipográfica de revista, pero con la modularidad y claridad de un dashboard. |
| **Aire** | Generous whitespace. El espacio vacío es un elemento de diseño, no un desperdicio. |
| **Monocromático + acentos semánticos** | Base en escala de grises. Color solo para categorías tech y estados. |
| **Escaneable** | Un usuario debe poder extraer valor en 3 segundos de scroll. |
| **Consistente** | Un sistema de componentes cerrado. Nada ad-hoc. |

### Mood / Referencias

- **Linear** — claridad, tipografía limpia, dark mode premium
- **Stripe Press** — editorial con producto
- **Readwise Reader** — densidad de información bien organizada
- **Changelog.com** — formato de noticias tech minimalista
- **Rauno.me** — craft y detalle tipográfico

---

## 2. Sitemap

```
/                           → Homepage (Hero + Signal Feed)
/releases                   → Catálogo de releases con filtros
/releases/[id]              → Detalle de release (artículo)
/releases/compare           → Comparador lado a lado
/noticias                   → Feed de noticias AI
/noticias/[id]              → Detalle de noticia (futuro)
/tech                       → Índice de tecnologías
/tech/[slug]                → Dashboard por tecnología
/timeline                   → Timeline cronológico
/digest                     → Digests semanales/mensuales
/digest/[id]                → Detalle de digest
/bookmarks                  → Guardados del usuario (localStorage)
/about                      → Acerca de
/privacy                    → Privacidad
/terms                      → Términos
/feed.xml                   → RSS global
/feed/[technology]          → RSS por tecnología
/feed/breaking              → RSS breaking changes
/feed/high-impact           → RSS alto impacto
```

### Páginas nuevas vs existentes

| Página | Estado | Notas |
|---|---|---|
| `/` | **Rediseñar** | Nueva arquitectura Hero + Signal Feed |
| `/releases` | **Rediseñar** | Nuevo layout de filtros + cards |
| `/releases/[id]` | **Rediseñar** | Nuevo template de artículo |
| `/bookmarks` | **Nueva** | Guardados con localStorage |
| `/noticias/[id]` | **Nueva** | Detalle de noticia (actualmente inline) |
| Resto | **Iterar** | Mejoras incrementales de estilo |

---

## 3. Taxonomía y Categorías

### Categorías principales (8)

Reducir de 9 a 8 fusionando `ai-ml` y `data-science`:

| Categoría | Slug | Color accent | Icono sugerido |
|---|---|---|---|
| Frontend | `frontend` | `blue-500` | `Layout` |
| Backend | `backend` | `green-500` | `Server` |
| AI & ML | `ai-ml` | `violet-500` | `Brain` |
| LLMs | `llms` | `purple-500` | `MessageSquare` |
| DevOps | `devops` | `orange-500` | `Container` |
| Mobile | `mobile` | `cyan-500` | `Smartphone` |
| Databases | `databases` | `amber-500` | `Database` |
| Tools | `tools` | `slate-500` | `Wrench` |

### Tipos de contenido

| Tipo | Badge | Descripción | Características |
|---|---|---|---|
| **Release** | `RELEASE` | Nota de lanzamiento de versión | TLDR, features, breaking changes, migration |
| **Noticia** | `NEWS` | Noticia del ecosistema AI/tech | Resumen, fuente, fecha |
| **Análisis** | `ANALYSIS` | Pieza editorial profunda (futuro) | Opinión del autor, contexto amplio |
| **Breve** | `BRIEF` | Dato rápido, sin desarrollo (futuro) | 1-2 oraciones, link externo |
| **Explicador** | `EXPLAINER` | Concepto técnico explicado (futuro) | Didáctico, sin fecha de caducidad |

---

## 4. Design System

### 4.1 Tokens de Color

```
── Base ──────────────────────────────────────
--color-bg-primary:         white / gray-950
--color-bg-secondary:       gray-50 / gray-900
--color-bg-tertiary:        gray-100 / gray-800
--color-bg-elevated:        white / gray-900        (cards)
--color-bg-overlay:         white / gray-900         (modals, dropdowns)

--color-text-primary:       gray-900 / gray-100
--color-text-secondary:     gray-600 / gray-400
--color-text-tertiary:      gray-400 / gray-600
--color-text-inverse:       white / gray-950

── Bordes ────────────────────────────────────
--color-border-default:     gray-200 / gray-800
--color-border-subtle:      gray-100 / gray-850
--color-border-strong:      gray-300 / gray-700

── Brand ─────────────────────────────────────
--color-brand:              blue-600
--color-brand-hover:        blue-700
--color-brand-subtle:       blue-50 / blue-950

── Categorías (accent) ──────────────────────
--color-cat-frontend:       #3b82f6  (blue-500)
--color-cat-backend:        #22c55e  (green-500)
--color-cat-ai-ml:          #8b5cf6  (violet-500)
--color-cat-llms:           #a855f7  (purple-500)
--color-cat-devops:         #f97316  (orange-500)
--color-cat-mobile:         #06b6d4  (cyan-500)
--color-cat-databases:      #f59e0b  (amber-500)
--color-cat-tools:          #64748b  (slate-500)

── Semánticos ────────────────────────────────
--color-breaking:           #ef4444  (red-500)
--color-high-impact:        #f59e0b  (amber-500)
--color-success:            #22c55e  (green-500)
--color-info:               #3b82f6  (blue-500)

── Superficies especiales ────────────────────
--color-hero-bg:            gray-950             (siempre oscuro)
--color-hero-text:          gray-100
--color-hero-accent:        blue-400
```

### 4.2 Tipografía

| Rol | Font | Weight | Tamaño (desktop) | Tamaño (mobile) | Line-height |
|---|---|---|---|---|---|
| **Display** | Geist Sans | 700 | 48px / `text-5xl` | 32px / `text-3xl` | 1.1 |
| **H1** | Geist Sans | 700 | 36px / `text-4xl` | 28px / `text-2xl` | 1.2 |
| **H2** | Geist Sans | 600 | 24px / `text-2xl` | 20px / `text-xl` | 1.3 |
| **H3** | Geist Sans | 600 | 20px / `text-xl` | 18px / `text-lg` | 1.4 |
| **Body L** | Geist Sans | 400 | 18px / `text-lg` | 16px / `text-base` | 1.6 |
| **Body** | Geist Sans | 400 | 16px / `text-base` | 15px | 1.6 |
| **Body S** | Geist Sans | 400 | 14px / `text-sm` | 13px | 1.5 |
| **Caption** | Geist Sans | 500 | 12px / `text-xs` | 11px | 1.4 |
| **Code** | Geist Mono | 400 | 14px / `text-sm` | 13px | 1.5 |
| **Overline** | Geist Sans | 600 | 11px | 10px | 1.3 |

> Se mantiene Geist Sans + Geist Mono. No se agrega una tercera fuente.
> La jerarquía se logra con peso, tamaño y color, no con familias distintas.

**Regla de overline**: Todas las etiquetas de categoría y tipo de contenido usan `OVERLINE` (uppercase, letter-spacing: 0.05em, font-weight 600, color secundario).

### 4.3 Espaciado

```
── Escala base: 4px ──────────────────────────
--space-1:    4px     (0.25rem)
--space-2:    8px     (0.5rem)
--space-3:    12px    (0.75rem)
--space-4:    16px    (1rem)
--space-5:    20px    (1.25rem)
--space-6:    24px    (1.5rem)
--space-8:    32px    (2rem)
--space-10:   40px    (2.5rem)
--space-12:   48px    (3rem)
--space-16:   64px    (4rem)
--space-20:   80px    (5rem)
--space-24:   96px    (6rem)

── Layout ────────────────────────────────────
--container-max:        1280px   (max-w-7xl → reducir a max-w-6xl = 1152px)
--container-narrow:     768px    (max-w-3xl, para artículos)
--container-padding:    24px mobile / 32px tablet / 48px desktop
--section-gap:          64px mobile / 80px desktop
--card-padding:         20px mobile / 24px desktop
--card-radius:          12px (rounded-xl)
--card-border:          1px solid var(--color-border-default)
```

### 4.4 Sombras

```
--shadow-xs:    0 1px 2px rgba(0,0,0,0.04)
--shadow-sm:    0 2px 4px rgba(0,0,0,0.06)
--shadow-md:    0 4px 12px rgba(0,0,0,0.08)
--shadow-lg:    0 8px 24px rgba(0,0,0,0.12)

En dark mode: opacidades x2 (0.08, 0.12, 0.16, 0.24)
```

### 4.5 Radios

```
--radius-sm:    6px     (botones pequeños, badges)
--radius-md:    8px     (inputs, botones)
--radius-lg:    12px    (cards)
--radius-xl:    16px    (modales, hero cards)
--radius-full:  9999px  (pills, avatars)
```

---

## 5. Lista de Componentes

### 5.1 Primitivos (Design System)

| Componente | Props clave | Notas |
|---|---|---|
| `Badge` | `variant`, `size`, `category?` | Refactorizar: agregar variante `category` que mapea a color automático |
| `Button` | `variant`, `size`, `icon?`, `loading?` | Variantes: `primary`, `secondary`, `ghost`, `outline` |
| `Chip` | `label`, `active`, `onClick`, `count?` | Para filtros de categoría. Reemplaza los botones actuales de filtro |
| `Card` | `variant`, `padding?` | Base card. Variantes: `default`, `elevated`, `bordered`, `ghost` |
| `IconButton` | `icon`, `label`, `size` | Bookmark, share, vote |
| `Tag` | `label`, `color?` | Tags de tecnología dentro de cards |
| `Tooltip` | `content`, `children` | Info contextual |
| `Skeleton` | `variant` | Loading states |
| `Divider` | `spacing?` | Línea separadora sutil |
| `Container` | `size?` | `default` (1152px), `narrow` (768px), `wide` (1280px) |
| `SectionHeader` | `title`, `subtitle?`, `action?` | Ya existe, refinar |
| `Overline` | `children`, `color?` | Label de categoría/tipo |

### 5.2 Composición (Domain)

| Componente | Uso | Cambios vs actual |
|---|---|---|
| `HeroFeature` | Noticia principal del hero | **Nuevo**. Card grande con imagen/gradient, categoría, título, TLDR |
| `HeroSecondary` | 2 noticias secundarias del hero | **Nuevo**. Card compacta apilada |
| `SignalCard` | Card de release en feed | **Rediseñar** `ReleaseCard`. Más compacto, accent izquierdo por categoría, metadata inline |
| `NewsCard` | Card de noticia en feed | **Rediseñar**. Alinear visualmente con `SignalCard` |
| `BriefCard` | Breve / dato rápido | **Nuevo**. Una línea + link + timestamp |
| `TrendingItem` | Item en lista de trending | **Nuevo**. Número + título + categoría chip + delta votos |
| `CategoryChipBar` | Barra horizontal de chips de categoría | **Nuevo**. Sticky debajo del navbar, scroll horizontal en mobile |
| `NowInTech` | Bloque "Ahora en tech" | **Nuevo**. Lista compacta de 5-8 items con timestamp relativo |
| `ViewToggle` | Switch Signal ↔ Flow | **Nuevo**. Toggle entre vista compacta (Signal) y expandida (Flow) |
| `BookmarkButton` | Guardar artículo | **Nuevo**. Persistencia en localStorage |
| `ReadingProgress` | Barra de progreso de lectura | **Nuevo**. Para página de artículo |
| `ArticleMeta` | Metadata del artículo | **Nuevo**. Fecha, tiempo de lectura, categoría, impacto |
| `ArticleSummary` | Resumen + bullets del artículo | **Nuevo**. Box destacado al inicio del artículo |
| `RelatedReleases` | Releases relacionados | **Nuevo**. Al final del artículo |
| `Navbar` | Navegación principal | **Rediseñar**. Simplificar links, agregar CategoryChipBar |
| `Footer` | Pie de página | **Iterar**. Reducir peso visual |
| `SearchCommand` | Búsqueda global (⌘K) | **Nuevo**. Command palette |

### 5.3 Componentes existentes que se mantienen (con ajustes de estilo)

- `BreakingChangesDetail` — ajustar tipografía y spacing
- `MigrationGuide` — ajustar estilo de checklist
- `EcosystemImpact` — simplificar visualmente
- `VersionComparison` — mantener funcionalidad
- `AIReleaseExplanation` — rediseñar como panel lateral o collapsible
- `VoteButton` — ajustar a nuevo design system
- `ShareButton` — ajustar a nuevo design system
- `ThemeToggle` — mantener
- `NewsletterForm` — simplificar

---

## 6. Arquitectura de Homepage

### Estructura (de arriba a abajo)

```
┌─────────────────────────────────────────────────────────┐
│  NAVBAR  (sticky)                                       │
│  Logo · Releases · Tech · Noticias · Timeline · ⌘K · ☾ │
├─────────────────────────────────────────────────────────┤
│  CATEGORY CHIP BAR  (sticky debajo de navbar)           │
│  All · Frontend · Backend · AI & ML · LLMs · DevOps ·  │
│  Mobile · Databases · Tools                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  HERO  (fondo oscuro, siempre)                          │
│  ┌─────────────────────┬──────────────┐                 │
│  │                     │  Secondary 1 │                 │
│  │   FEATURE STORY     ├──────────────┤                 │
│  │   (noticia ppal)    │  Secondary 2 │                 │
│  └─────────────────────┴──────────────┘                 │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  AHORA EN TECH  (bloque compacto)                       │
│  ┌─ NOW ──────────────────────────────────────────────┐ │
│  │ • React 20.1 lanzado con...          hace 2h       │ │
│  │ • OpenAI anuncia GPT-5 Turbo         hace 4h       │ │
│  │ • Tailwind v4.2 añade...             hace 6h       │ │
│  │ • Vercel lanza Edge Runtime v3       hace 8h       │ │
│  └────────────────────────────────────────────────────┘ │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  SIGNAL FEED                         [Signal ↔ Flow]    │
│  ┌────────────────────────┬─────────────────────────┐   │
│  │                        │                         │   │
│  │  SignalCard            │  SIDEBAR                │   │
│  │  SignalCard            │  ┌─ Trending ─────────┐ │   │
│  │  SignalCard            │  │ 1. Next.js 17      │ │   │
│  │  SignalCard            │  │ 2. Claude 4.5      │ │   │
│  │  SignalCard            │  │ 3. Deno 3.0        │ │   │
│  │  SignalCard            │  └────────────────────┘ │   │
│  │  SignalCard            │  ┌─ Breaking ─────────┐ │   │
│  │  SignalCard            │  │ React 20 breaking  │ │   │
│  │                        │  │ Node 24 depreca... │ │   │
│  │  [Cargar más]          │  └────────────────────┘ │   │
│  └────────────────────────┴─────────────────────────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  NEWSLETTER CTA  (sutil, no gradient agresivo)          │
│  Suscríbete al digest semanal · [email] [Suscribir]     │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  FOOTER                                                 │
└─────────────────────────────────────────────────────────┘
```

### Mobile (< 768px)

```
┌──────────────────────────┐
│  NAVBAR (hamburger)      │
├──────────────────────────┤
│  CHIPS (scroll horiz.)   │
├──────────────────────────┤
│  HERO                    │
│  ┌──────────────────────┐│
│  │  FEATURE (full-w)    ││
│  └──────────────────────┘│
│  ┌───────────┬──────────┐│
│  │ Second. 1 │ Second.2 ││
│  └───────────┴──────────┘│
├──────────────────────────┤
│  AHORA EN TECH           │
│  (lista compacta)        │
├──────────────────────────┤
│  [Signal ↔ Flow]         │
│  SignalCard              │
│  SignalCard              │
│  SignalCard              │
│  ...                     │
│  [Cargar más]            │
├──────────────────────────┤
│  TRENDING (horizontal    │
│  scroll cards)           │
├──────────────────────────┤
│  NEWSLETTER CTA          │
├──────────────────────────┤
│  FOOTER                  │
└──────────────────────────┘
```

---

## 7. Template de Artículo (Release Detail)

### Layout Desktop

```
┌─────────────────────────────────────────────────────────┐
│  NAVBAR                                                 │
├─────────────────────────────────────────────────────────┤
│  READING PROGRESS BAR  (thin, brand color, fixed top)   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│        ┌─ max-w-3xl (768px) centered ─────────────┐     │
│        │                                          │     │
│        │  ← Volver a releases                     │     │
│        │                                          │     │
│        │  FRONTEND · RELEASE                      │     │
│        │  React 20.0                              │     │
│        │  Concurrent Rendering Reimagined         │     │
│        │                                          │     │
│        │  ┌─ META ──────────────────────────────┐ │     │
│        │  │ 15 mar 2026 · 8 min · Impact: 85   │ │     │
│        │  │ [🔖 Guardar] [↗ Compartir] [👍 42] │ │     │
│        │  └─────────────────────────────────────┘ │     │
│        │                                          │     │
│        │  ┌─ RESUMEN (box destacado) ───────────┐ │     │
│        │  │ TLDR                                │ │     │
│        │  │ • Bullet 1 de lo más importante     │ │     │
│        │  │ • Bullet 2                          │ │     │
│        │  │ • Bullet 3                          │ │     │
│        │  │ ⚠ Breaking change                   │ │     │
│        │  └─────────────────────────────────────┘ │     │
│        │                                          │     │
│        │  ── Qué cambia ──────────────────────    │     │
│        │  (descripción editorial)                 │     │
│        │                                          │     │
│        │  ── Nuevas features ─────────────────    │     │
│        │  • Feature 1                             │     │
│        │  • Feature 2                             │     │
│        │                                          │     │
│        │  ── Breaking Changes ────────────────    │     │
│        │  (código before/after)                   │     │
│        │                                          │     │
│        │  ── Guía de migración ───────────────    │     │
│        │  (pasos numerados con checklist)          │     │
│        │                                          │     │
│        │  ── Impacto en el ecosistema ────────    │     │
│        │                                          │     │
│        │  ── Métricas de performance ─────────    │     │
│        │                                          │     │
│        │  ┌─ AI EXPLANATION (collapsible) ─────┐  │     │
│        │  │ ▶ Explicación AI                   │  │     │
│        │  └────────────────────────────────────┘  │     │
│        │                                          │     │
│        │  [Ver anuncio oficial ↗]                 │     │
│        │                                          │     │
│        │  ── Relacionados ────────────────────    │     │
│        │  ┌─────────┐ ┌─────────┐ ┌─────────┐   │     │
│        │  │ Rel. 1  │ │ Rel. 2  │ │ Rel. 3  │   │     │
│        │  └─────────┘ └─────────┘ └─────────┘   │     │
│        │                                          │     │
│        └──────────────────────────────────────────┘     │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  FOOTER                                                 │
└─────────────────────────────────────────────────────────┘
```

### Elementos del artículo

| Elemento | Descripción |
|---|---|
| **Overline** | Categoría + tipo de contenido (ej: `FRONTEND · RELEASE`) |
| **Título** | Tecnología + versión (`React 20.0`) en Display |
| **Subtítulo** | Tagline descriptiva en H2 |
| **Meta bar** | Fecha, tiempo de lectura estimado, impact score, acciones |
| **Summary box** | TLDR + bullets de lo más importante. Fondo `bg-secondary`, borde izquierdo `brand` |
| **Cuerpo** | Secciones con H2 como separador. Tipografía `Body L` (18px), `max-w-3xl` |
| **Code blocks** | Geist Mono, fondo oscuro, botón copiar, label de lenguaje |
| **AI Explanation** | Collapsible por defecto. Se abre on-demand. |
| **Relacionados** | 3 cards compactas de releases de la misma categoría o tecnología |

---

## 8. Vista Signal vs Flow

### Signal (por defecto)

Compacta, escaneable. Cada item es una fila con:

```
┌─────────────────────────────────────────────────────┐
│ ▌ FRONTEND  React 20.0 — Concurrent Rendering...   │
│ cat-accent   tech+ver       tldr truncado           │
│              hace 2h · Impact 85 · ⚠ Breaking  🔖  │
└─────────────────────────────────────────────────────┘
```

- Borde izquierdo = color de categoría
- Sin descripción larga
- Metadata en una línea
- ~60px de alto por item

### Flow (expandida)

Card con más contexto:

```
┌─────────────────────────────────────────────────────┐
│ FRONTEND · RELEASE                     hace 2h      │
│                                                     │
│ React 20.0                                          │
│ Concurrent Rendering reimagined with...             │
│                                                     │
│ • Server Components redesign                        │
│ • New hooks API                                     │
│ • 40% faster hydration                              │
│                                                     │
│ Impact: ████████░░ 85   ⚠ Breaking   👍 42   🔖    │
│ #react #frontend #performance                       │
└─────────────────────────────────────────────────────┘
```

- Muestra TLDR completo
- Lista de features (max 3)
- Tags visibles
- ~180px de alto por item

---

## 9. Funcionalidades UX Diferenciadoras

| Feature | Prioridad | Descripción |
|---|---|---|
| **Signal/Flow toggle** | P0 | Dos modos de visualización del feed. Persistido en localStorage |
| **Bookmarks** | P0 | Guardar releases/noticias. localStorage. Página `/bookmarks` |
| **Category Chip Bar** | P0 | Chips sticky debajo del nav. Filtrado global instantáneo |
| **Command Palette (⌘K)** | P1 | Búsqueda global rápida. Navegar a cualquier release/tech/página |
| **Reading Progress** | P1 | Barra de progreso en artículo |
| **Ahora en Tech** | P1 | Bloque de actividad reciente tipo ticker |
| **Trending** | P1 | Top releases por votos en últimas 48h |
| **Impact Score visual** | P1 | Barra de impacto en cada card, no solo un número |
| **Related Releases** | P2 | Al final de cada artículo, 3 releases relacionados |
| **Keyboard navigation** | P2 | `j/k` para navegar entre items del feed |
| **View preferences** | P2 | Recordar filtros, vista Signal/Flow, categoría activa |

---

## 10. Diferencias entre Tipos de Contenido

| Aspecto | Release | Noticia | Análisis | Breve | Explicador |
|---|---|---|---|---|---|
| **Badge** | `RELEASE` azul | `NEWS` gris | `ANALYSIS` púrpura | `BRIEF` outline | `EXPLAINER` verde |
| **Longitud** | Variable | Media | Larga | 1-2 frases | Media-larga |
| **Tiene versión** | Sí | No | No | No | No |
| **Tiene TLDR** | Sí | Sí | Sí | No (es el TLDR) | Sí |
| **Tiene code** | Frecuente | Raro | A veces | No | Frecuente |
| **Tiene migration** | A veces | No | No | No | No |
| **Impact score** | Sí | No | No | No | No |
| **Card en feed** | `SignalCard` | `NewsCard` | `SignalCard` variante | `BriefCard` | `SignalCard` variante |
| **Template detalle** | Artículo completo | Artículo simple | Artículo editorial | N/A (inline) | Artículo didáctico |

---

## 11. Roadmap de Implementación

### Fase 0 — Design System Foundation (1-2 semanas)

- [ ] Definir CSS custom properties (tokens de color, spacing, radius, sombras)
- [ ] Refactorizar `globals.css` con los nuevos tokens
- [ ] Crear/actualizar componentes primitivos: `Badge`, `Button`, `Card`, `Chip`, `Container`, `Overline`, `Divider`
- [ ] Actualizar `Navbar` con nuevo estilo (simplificar links, limpiar padding)
- [ ] Actualizar `Footer` (reducir peso visual)
- [ ] Asegurar dark mode correcto con todos los tokens

### Fase 1 — Homepage Redesign (2-3 semanas)

- [ ] Crear `HeroFeature` + `HeroSecondary`
- [ ] Crear `CategoryChipBar` (sticky)
- [ ] Crear `NowInTech` bloque
- [ ] Rediseñar `SignalCard` (vista Signal)
- [ ] Crear vista Flow del `SignalCard`
- [ ] Crear `ViewToggle` (Signal ↔ Flow)
- [ ] Crear sidebar: `TrendingItem` list + Breaking Changes box
- [ ] Componer nueva homepage con layout 2/3 + 1/3
- [ ] Rediseñar `NewsletterForm` (más sutil)
- [ ] Responsive mobile completo

### Fase 2 — Article Template (1-2 semanas)

- [ ] Crear `ArticleMeta` bar
- [ ] Crear `ArticleSummary` box (TLDR + bullets)
- [ ] Crear `ReadingProgress` bar
- [ ] Crear `BookmarkButton`
- [ ] Rediseñar layout de `/releases/[id]` a `max-w-3xl` centrado
- [ ] Ajustar tipografía de cuerpo a `Body L` (18px)
- [ ] Hacer `AIReleaseExplanation` collapsible
- [ ] Crear `RelatedReleases` al final
- [ ] Responsive mobile

### Fase 3 — Releases List Redesign (1 semana)

- [ ] Rediseñar `/releases` con nuevo `SignalCard`
- [ ] Integrar `CategoryChipBar` como filtro
- [ ] Refactorizar `SearchBar` al nuevo estilo
- [ ] Crear `Chip` component para filtros de stack

### Fase 4 — Features UX (1-2 semanas)

- [ ] Implementar Bookmarks (localStorage + página `/bookmarks`)
- [ ] Implementar Command Palette (`⌘K`)
- [ ] Implementar persistencia de preferencias de vista
- [ ] Keyboard navigation (`j/k`) en feed

### Fase 5 — Refinamiento (1 semana)

- [ ] Animaciones y transiciones (page transitions, card hover, skeleton loading)
- [ ] Auditoría de accesibilidad (contraste, focus states, screen reader)
- [ ] Performance audit (Core Web Vitals)
- [ ] Ajustar noticias, tech dashboards, timeline al nuevo design system

---

## 12. Estructura de Archivos Propuesta

```
components/
├── ds/                          ← Design System primitivos
│   ├── Badge.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Chip.tsx
│   ├── Container.tsx
│   ├── Divider.tsx
│   ├── IconButton.tsx
│   ├── Overline.tsx
│   ├── Skeleton.tsx
│   ├── Tag.tsx
│   └── Tooltip.tsx
├── layout/                      ← Estructura de página
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── CategoryChipBar.tsx
│   ├── CommandPalette.tsx
│   └── ReadingProgress.tsx
├── feed/                        ← Componentes de feed
│   ├── SignalCard.tsx
│   ├── NewsCard.tsx
│   ├── BriefCard.tsx
│   ├── TrendingItem.tsx
│   ├── NowInTech.tsx
│   ├── ViewToggle.tsx
│   └── FeedSection.tsx
├── hero/                        ← Hero de homepage
│   ├── HeroFeature.tsx
│   └── HeroSecondary.tsx
├── article/                     ← Template de artículo
│   ├── ArticleMeta.tsx
│   ├── ArticleSummary.tsx
│   ├── RelatedReleases.tsx
│   ├── BreakingChangesDetail.tsx
│   ├── MigrationGuide.tsx
│   ├── EcosystemImpact.tsx
│   ├── VersionComparison.tsx
│   └── AIReleaseExplanation.tsx
├── shared/                      ← Reutilizables de dominio
│   ├── BookmarkButton.tsx
│   ├── VoteButton.tsx
│   ├── ShareButton.tsx
│   ├── SearchBar.tsx
│   ├── NewsletterForm.tsx
│   └── ThemeToggle.tsx
└── filters/                     ← Filtros
    ├── CategoryFilter.tsx
    ├── StackFilter.tsx
    └── TopicFilter.tsx
```

---

## 13. Consideraciones Técnicas

| Aspecto | Decisión |
|---|---|
| **Server vs Client** | Hero, feed principal, artículo = Server Components. ViewToggle, Bookmarks, Command Palette, filtros interactivos = Client |
| **State management** | localStorage para bookmarks y preferencias. No se necesita state global adicional |
| **CSS** | Tailwind v4 con CSS custom properties para tokens. Sin archivo de config — todo en `globals.css` |
| **Animaciones** | CSS transitions para hover/focus. `framer-motion` solo si se necesitan page transitions |
| **Fuentes** | Mantener Geist Sans + Mono. Ya están cargados via next/font |
| **Iconos** | Lucide React (ya en uso). No agregar otra librería |
| **Responsive** | Mobile-first. Breakpoints: `sm` 640, `md` 768, `lg` 1024, `xl` 1280 |
| **Accesibilidad** | WCAG 2.1 AA. Focus visible, skip links, ARIA labels, contraste 4.5:1 mínimo |

---

## 14. Métricas de Éxito

| Métrica | Objetivo |
|---|---|
| Lighthouse Performance | > 95 |
| Lighthouse Accessibility | 100 |
| LCP | < 2.5s |
| CLS | < 0.05 |
| Tiempo en página (artículo) | +30% vs actual |
| Bounce rate homepage | -20% vs actual |
| Bookmarks por usuario/semana | > 3 |
| Newsletter signups | +50% vs actual |
