# Fuentes y Pipelines - Arquitectura de Datos

Este documento especifica cómo obtener datos reales para Main Branch mediante RSS, APIs y scraping.

## Arquitectura del Pipeline

```
[Fuentes] → [Fetch] → [Parse] → [Transform] → [ReleaseNote]
```

### 1. Fuentes (lib/sources/config.ts)

#### RSS
- **Formato**: RSS 2.0, Atom
- **Librería**: `rss-parser`
- **Fuentes configuradas**:
  - Next.js Blog, React Blog
  - Vercel, GitHub, OpenAI, Anthropic
  - Hugging Face, PyTorch

#### API
- **Formato**: REST JSON
- **Fuentes configuradas**:
  - Node.js: `https://nodejs.org/dist/index.json`
  - GitHub Releases: Next.js, React

#### Scraping (especificación)
- **Estrategia**: static (fetch+parse) | dynamic (Puppeteer/Playwright)
- **Especificaciones**: TypeScript Release Notes, Tailwind Releases
- **Implementación**: Requiere setup externo

### 2. Fetchers (lib/pipeline/fetchers/)

| Tipo | Archivo | Descripción |
|------|---------|-------------|
| RSS | `rss.ts` | Parse con rss-parser, timeout 10s |
| API | `api.ts` | fetch con headers, soporta dataPath |

### 3. Transformers (lib/pipeline/transformers/)

- `toReleaseNote.ts`: Convierte RawFeedItem → ReleaseNote
- Extracción de versión: regex configurable por fuente
- Detección de breaking changes: heurística por keywords

### 4. API de Sincronización

```
GET /api/sync           # Todas las fuentes
GET /api/sync?source=nextjs-blog   # Una fuente
```

## Cómo Añadir Nueva Fuente

### RSS
```typescript
{
  id: "nueva-fuente",
  name: "Nombre del Feed",
  type: "rss",
  url: "https://ejemplo.com/feed.xml",
  technology: "Tecnología",
  stack: "stack-id",
  category: "categoria",
  versionPattern: /(\d+\.\d+\.\d+)/,  // opcional
}
```

### API
```typescript
{
  id: "api-fuente",
  name: "Nombre API",
  type: "api",
  url: "https://api.ejemplo.com/releases",
  technology: "Tecnología",
  dataPath: "releases",  // path para extraer array
  headers: { "Authorization": "Bearer TOKEN" },  // si requiere auth
}
```

### Scraping (especificación)
```typescript
{
  id: "scraping-fuente",
  url: "https://ejemplo.com/releases",
  technology: "Tecnología",
  strategy: "static",  // o "dynamic" para JS renderizado
  selectors: {
    items: ".release-item",
    title: "h2",
    date: ".date",
  },
}
```

## Persistencia en Base de Datos

Los datos fetcheados se persisten en **SQLite** local:

- **Ubicación**: `prisma/dev.db`
- **ORM**: Prisma 7 con adaptador better-sqlite3
- **Schema**: `prisma/schema.prisma` - modelo `Release`
- **Deduplicación**: Upsert por `(technology, version)`

### Flujo de datos
1. Pipeline ejecuta fetch (RSS/API)
2. Transforma a ReleaseNote
3. **Upsert** en BD (inserta o actualiza)
4. App lee desde BD (fallback a mock si BD vacía)

### Cómo poblar la BD
```bash
# Ejecutar sync (fetch + persist)
curl http://localhost:3000/api/sync
```

## Seed de Base de Datos

Poblar la BD con datos mock iniciales:

```bash
npm run db:seed
# o
npx prisma db seed
```

Configuración: `prisma.config.ts` → migrations.seed

## Ejecución Programada (Vercel Cron)

Configurado en `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/sync",
    "schedule": "0 */6 * * *"
  }]
}
```

- **Schedule**: `0 */6 * * *` = cada 6 horas (0:00, 6:00, 12:00, 18:00 UTC)
- **Protección**: Añadir `CRON_SECRET` en Vercel → Settings → Environment Variables
- **Local**: Sin CRON_SECRET, `/api/sync` permite requests para desarrollo

### Otras opciones
- **GitHub Actions**: Workflow que llama a `/api/sync` cada 6h
- **Upstash QStash / Inngest**: Para jobs más complejos

## Rate Limits

- **GitHub API**: 60 req/h sin auth, 5000 con token
- **RSS**: Generalmente sin límite; respetar fetchInterval
- **Scraping**: Usar delays entre requests

## Próximos Pasos

1. Persistencia: Base de datos para almacenar releases fetcheados
2. Deduplicación: Evitar duplicados por (technology, version)
3. Scraping real: Implementar con Playwright
4. Webhooks: Notificar cuando hay nuevos releases
