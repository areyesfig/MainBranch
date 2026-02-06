# Siguientes pasos del proyecto

Este documento resume cómo tener **la última información actualizada** en todos los tópicos.

---

## Cómo tener la información siempre actualizada

### 1. Fuentes de datos actuales

El proyecto ya obtiene datos reales de:

| Tipo | Fuentes |
|------|--------|
| **RSS** | Next.js, React, Vercel, GitHub, OpenAI, Anthropic, Hugging Face, PyTorch |
| **API** | Node.js (index.json), GitHub Releases (Next.js, React) |

Configuración: `lib/sources/config.ts`.

### 2. Sincronizar datos (actualizar todos los tópicos)

**En local (desarrollo):**

```bash
# Arrancar la app
npm run dev

# En otra terminal, ejecutar el sync (fetch + guardado en BD)
curl http://localhost:3000/api/sync
```

**En producción (Vercel):**

- El **cron** ya está configurado en `vercel.json`: se ejecuta cada **6 horas** (0:00, 6:00, 12:00, 18:00 UTC).
- Para que el cron funcione en Vercel:
  1. Ve a **Vercel → proyecto → Settings → Environment Variables**.
  2. Añade `CRON_SECRET` con un valor secreto (ej. un UUID).
  3. Vercel enviará `Authorization: Bearer <CRON_SECRET>` al llamar a `/api/sync`.

**Sync manual (una fuente):**

```bash
curl "http://localhost:3000/api/sync?source=nextjs-blog"
curl "http://localhost:3000/api/sync?source=react-blog"
# etc. (ids en lib/sources/config.ts)
```

### 3. Primera vez: BD con datos

Si la BD está vacía, la app usa datos **mock**. Para usar datos reales:

```bash
# Opción A: Migraciones + seed (datos de ejemplo)
npx prisma migrate dev && npm run db:seed

# Opción B: Dejar que el sync llene la BD con datos reales
npm run dev
curl http://localhost:3000/api/sync
```

Tras el sync, la capa `lib/data/releases.ts` usará la BD y las páginas mostrarán la información actualizada de todas las fuentes configuradas.

### 4. Revalidación en Next.js (opcional)

Si quieres que las páginas se refresquen periódicamente sin depender solo del cron:

- En las páginas que usan `getReleases()` (o similares), puedes añadir **revalidate**:

```ts
// En app/releases/page.tsx o layout
export const revalidate = 3600; // Revalidar cada hora (segundos)
```

Así Next.js regenerará la página como máximo cada hora; los datos siguen viniendo de la BD, que se actualiza con el cron o con llamadas a `/api/sync`.

---

## Resumen rápido

| Objetivo | Acción |
|----------|--------|
| **Tener última info de todos los tópicos** | Ejecutar `GET /api/sync` (cron cada 6h en Vercel o manual en local). |
| **Añadir más tópicos** | Añadir entradas en `RSS_SOURCES` o `API_SOURCES` en `lib/sources/config.ts`. |
| **Refresco más frecuente** | Ajustar `schedule` del cron en `vercel.json` y/o usar `revalidate` en páginas. |
| **TypeScript / Tailwind en la app** | Implementar pipeline de scraping (Playwright) para las fuentes en `SCRAPING_SOURCES_SPEC`. |
