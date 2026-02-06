<img width="1024" height="434" alt="image" src="https://github.com/user-attachments/assets/3645f4cf-446c-422a-b0ad-6c88ab0a8454" />

# Main Branch

Agregador de **noticias y lanzamientos tecnológicos**: Next.js, React, Node.js, Vercel, GitHub, OpenAI, Anthropic, Hugging Face, PyTorch y más. Información estructurada, comparación de versiones, guías de migración y alertas de seguridad en un solo lugar.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS** · **Lucide React**
- **Prisma** + **SQLite** (better-sqlite3)
- **Vitest** + **React Testing Library** (tests)

## Requisitos

- Node.js 20+
- npm (o yarn/pnpm/bun)

## Instalación

```bash
# Clonar e instalar dependencias
git clone <repo>
cd tech-release-news
npm install

# Configurar entorno
cp .env.example .env
# Editar .env si necesitas cambiar DATABASE_URL o CRON_SECRET

# Crear BD y ejecutar migraciones
npx prisma migrate dev

# Poblar con datos (opción A: seed de ejemplo)
npm run db:seed

# O bien (opción B): arrancar la app y sincronizar fuentes reales
npm run dev
# En otra terminal:
curl http://localhost:3000/api/sync
```

Abre [http://localhost:3000](http://localhost:3000).

## Variables de entorno

| Variable        | Descripción |
|----------------|-------------|
| `DATABASE_URL` | URL de Prisma. Por defecto `file:./dev.db` para SQLite. |
| `CRON_SECRET`  | **Requerido en producción.** Protege `GET /api/sync` (solo acepta `Authorization: Bearer <valor>`). En local puede omitirse para desarrollo. |
| `GITHUB_TOKEN` | (Opcional) Token de GitHub para más cuota en APIs (evitar rate limit). |
| `OPENAI_API_KEY` | (Opcional) Para la sección "Explicación con IA" en la página de detalle de cada release. Sin ella, esa función no estará disponible. |

Ver comentarios en `.env.example`.

## Scripts

| Comando | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo en http://localhost:3000 |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción (tras `build`) |
| `npm run db:seed` | Seed de la base de datos con datos de ejemplo |
| `npm run db:sync` | Ejecuta sync contra la app (requiere `dev` en marcha) |
| `npm run test` | Tests con Vitest (watch) |
| `npm run test:run` | Tests una sola ejecución |
| `npm run lint` | ESLint |

## Datos actualizados

La app lee releases desde la **base de datos**. Si la BD está vacía, usa datos mock.

Para tener **información actualizada** de todas las fuentes (RSS + APIs):

```bash
# Con la app en marcha (npm run dev)
curl http://localhost:3000/api/sync
```

- **Una sola fuente:** `curl "http://localhost:3000/api/sync?source=nextjs-blog"`
- En **Vercel**, el cron en `vercel.json` llama a `/api/sync` cada 6 horas; configura `CRON_SECRET` en las variables de entorno del proyecto.

Más detalle en [NEXT-STEPS.md](./NEXT-STEPS.md).

## Estructura del proyecto

```
app/              # App Router: páginas y API
  api/sync/       # GET /api/sync — pipeline de sincronización
  releases/       # Listado y detalle de releases
  notifications/  # Preferencias de notificaciones por stack
  timeline/       # Vista cronológica
  feed/           # RSS dinámico
components/       # Componentes React (news, ui)
contexts/         # React Context (notificaciones)
lib/              # Lógica: pipeline, BD, datos, fuentes
  pipeline/       # Fetchers RSS/API y transformadores
  sources/        # Configuración de fuentes (lib/sources/config.ts)
  db/             # Prisma y acceso a releases
prisma/           # Schema y migraciones
types/            # Tipos TypeScript
```

## Documentación

- **[FEATURES.md](./FEATURES.md)** — Características del producto, componentes y stack.
- **[PIPELINES.md](./PIPELINES.md)** — Fuentes de datos, pipeline (RSS/API/scraping) y cómo añadir fuentes.
- **[NEXT-STEPS.md](./NEXT-STEPS.md)** — Cómo mantener los datos actualizados y resumen de uso.

## Deploy (Vercel)

1. Conectar el repositorio a Vercel.
2. Añadir variables de entorno: **`CRON_SECRET`** (obligatorio en producción para que el cron pueda llamar a `/api/sync` de forma segura).
3. Deploy: el cron configurado en `vercel.json` ejecutará `/api/sync` cada 6 horas.

Para bases de datos en producción, usar un proveedor compatible con Prisma (por ejemplo PostgreSQL) y configurar `DATABASE_URL` en Vercel.

## Licencia

Proyecto privado.
