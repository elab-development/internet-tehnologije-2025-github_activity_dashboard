# Podcast Platforma - Project Notes

## Stack
- Next.js 16 (App Router, TypeScript, Tailwind, dark theme)
- Prisma 7 (driver adapter `@prisma/adapter-pg`, provider `prisma-client-js`)
- PostgreSQL - lokalno u Dockeru (dev) + AWS RDS PostgreSQL 16 (production)
- AWS S3 - storage za upload-ovane fajlove (audio + cover slike)
- NextAuth v4 (Credentials provider + Google OAuth provider, JWT sesije)
- bcryptjs za hash lozinki
- Docker + docker-compose (Dockerfile, multi-stage standalone build)
- Recharts - vizualizacija podataka (admin statistike)
- Swagger UI React + swagger-jsdoc - API dokumentacija
- Jest + ts-jest - automatizovani testovi

## Setup (novi clone)
```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate deploy
npm run dev
```

**Node 20.19+ obavezan** (Prisma 7 zahtev).

**Env varijable potrebne:**
DATABASE_URL=postgresql://...?sslmode=no-verify

NEXTAUTH_SECRET=...

NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=...

GOOGLE_CLIENT_SECRET=...

AWS_ACCESS_KEY_ID=...

AWS_SECRET_ACCESS_KEY=...

AWS_REGION=eu-central-1

AWS_S3_BUCKET_NAME=podcast-platform-mirkovic-2026

**Docker:**
```bash
docker compose up --build
```
Pokreće `app` (Next.js, port 3000) + `db` (lokalni Postgres, port 5432). Sve env varijable se čitaju iz `.env`.

**Napomena - RDS SSL**: `DATABASE_URL` za RDS zahteva `?sslmode=no-verify` (Node `pg` adapter) zbog AWS-ovog self-signed CA.

## Prisma Schema - modeli i veze
- **User** - role enum (`SLUSALAC`, `KREATOR`, `ADMIN`), `statusNaloga` enum (`AKTIVAN`/`SUSPENDOVAN`/`OBRISAN`), `biografija` i `nivoPrava` nullable polja
- **Podcast** - `creatorId` → User, `kategorija` enum, `coverImageUrl` nullable (S3 URL)
- **Episode** - `podcastId` → Podcast, `audioUrl` (S3 URL), `trajanje` Int (sekunde, auto-detektovano client-side)
- **Comment** - `userId` → User, `episodeId` → Episode
- **Subscription** - join User↔Podcast (`@@unique([userId, podcastId])`)
- **Favorite** - join User↔Episode (`@@unique([userId, episodeId])`)
- Cascade delete: Podcast→Episode/Subscription, Episode→Comment/Favorite
- **3 migracije:**
  1. `init` - kreiranje svih tabela (CREATE TABLE)
  2. `add_cascade_deletes` - dodavanje ON DELETE CASCADE ograničenja
  3. `add_podcast_cover_image` - dodavanje `coverImageUrl` kolone na Podcast

## Permisije (po dijagramu iz dokumentacije)
- **kreira**: samo KREATOR pravi podcast i epizode; ADMIN ne može da dodaje epizode
- **moderira/uklanja**: ADMIN briše bilo koji podcast/episode/comment
- **upravlja**: ADMIN suspend/aktivira korisnike, menja role (SLUSALAC↔KREATOR); ne može suspendovati sebe; suspendovan korisnik ne može da se uloguje
- Vlasnik (creator) edituje/briše svoje podkaste i epizode
- Subscribe/Favorite/Comment - bilo koji ulogovan korisnik
- Brisanje komentara - autor ili ADMIN

## Implementirano

### Auth
- [x] Register (Credentials) - email/password, role select (SLUSALAC/KREATOR)
- [x] Login (Credentials) - JWT sa `id` + `role` + `statusNaloga` provera (suspendovani blokirani)
- [x] Google OAuth login - auto-kreira nalog ako ne postoji, merge po emailu ako postoji
- [x] Logout
- [x] Middleware - štiti `/dashboard/*` rute

### API Rute
- [x] `GET/POST /api/podcasts` - lista (search, filter po kategoriji) + kreiranje
- [x] `GET/PUT/DELETE /api/podcasts/[id]` - detalji, izmena, brisanje
- [x] `GET/POST /api/podcasts/[id]/episodes` - lista epizoda, dodavanje
- [x] `GET/PUT/DELETE /api/episodes/[id]` - detalji, izmena, brisanje
- [x] `POST /api/episodes/[id]/comments` - dodavanje komentara
- [x] `DELETE /api/comments/[id]` - brisanje komentara (autor ili ADMIN)
- [x] `GET/POST/DELETE /api/podcasts/[id]/subscribe` - pretplata
- [x] `GET/POST/DELETE /api/episodes/[id]/favorite` - omiljene
- [x] `POST /api/upload` - upload na AWS S3 (audio + slike)
- [x] `GET /api/files/[filename]` - fallback za lokalne fajlove (legacy)
- [x] `GET /api/users` - lista korisnika (ADMIN only)
- [x] `PATCH /api/users/[id]` - izmena role/statusNaloga (ADMIN only)
- [x] `GET /api/admin/stats` - statistike platforme (ADMIN only)
- [x] `GET /api/swagger` - OpenAPI spec JSON

### Frontend Stranice (9)
- [x] `/` - Home (grid podkasta, search, filter po kategoriji)
- [x] `/login` - Login forma + Google OAuth dugme
- [x] `/register` - Register forma (sa role select) + Google OAuth dugme
- [x] `/podcasts/[id]` - Podcast detalji (hero, cover slika, subscribe, lista epizoda)
- [x] `/episodes/[id]` - Episode detalji (audio player, favorite, komentari)
- [x] `/dashboard` - Creator CRUD + Admin moderacija
- [x] `/favorites` - Lista omiljenih epizoda
- [x] `/subscriptions` - Lista pretplata
- [x] `/admin/users` - Admin panel (korisnici, statistike sa chartovima)
- [x] `/api-docs` - Swagger UI dokumentacija

### Komponente
- [x] `Button` (4 varijante: primary/secondary/danger/ghost)
- [x] `Input` / `Textarea` / `Select`
- [x] `Card`
- [x] `Navbar` (role-based linkovi, active route indicator, sticky + backdrop blur)
- [x] `SubscribeButton` (client, toggle pretplate)
- [x] `FavoriteButton` (client, toggle omiljenih)
- [x] `CommentSection` (client, lista + forma + delete)
- [x] `AdminStats` (client, recharts vizualizacija + summary cards)
- [x] `UserStatusButton` (client, suspend/activate)
- [x] `UserRoleButton` (client, promote/demote)

### Infrastruktura
- [x] Dockerfile (multi-stage: deps → builder → runner, standalone output)
- [x] `docker-compose.yml` (app + db servisi, AWS env vars)
- [x] AWS S3 bucket (`podcast-platform-mirkovic-2026`, eu-central-1, public read)
- [x] AWS RDS PostgreSQL 16 (`podcast-platform-db`, eu-central-1, free tier)
- [x] HTTP Security Headers (`next.config.ts` - X-Frame-Options, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)

### Testovi
- [x] Jest + ts-jest setup (`jest.config.js`, `__tests__/setup.ts`)
- [x] Prisma mock (`__tests__/mocks/prisma.ts`)
- [x] NextAuth mock (`__tests__/mocks/auth.ts`)
- [x] 15 testova u 3 test suite-a:
  - `podcasts.test.ts` - 7 testova (GET lista/filter/search, POST 401/403/201/400)
  - `auth.test.ts` - 3 testa (register 201/409/400)
  - `admin.test.ts` - 5 testova (stats/users ADMIN only)

### Dokumentacija
- [x] Swagger API spec (`lib/swagger.ts`) + UI na `/api-docs`
- [x] `PROJECT_NOTES.md`
- [x] `docs/zahtevi.md`

## Git grane
`main`, `develop` + feature grane (sve merge-ovane u develop):
`feature/audio-upload`, `feature/reusable-components`, `feature/podcast-cover-image`, `feature/styling`, `feature/admin-panel`, `feature/dockerize`, `feature/s3-storage`, `feature/auto-duration`, `feature/google-oauth`, `feature/visualization`, `feature/swagger`, `feature/security`, `feature/tests`

## Security mere (5)
1. **SQL Injection** - Prisma parametrizovani upiti (by default)
2. **CSRF** - NextAuth built-in CSRF token za sve auth rute
3. **IDOR** - ownership/role provere na svakom API endpoint-u
4. **XSS** - Next.js automatski escapeuje JSX output
5. **Security Headers** - X-Frame-Options, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy

## Eksterni API-ji (2/2)
1. **AWS S3** - storage za audio/cover slike (`@aws-sdk/client-s3`)
2. **Google OAuth** - login via Google (`next-auth/providers/google`)

## TODO (preostalo)
- [x] CI/CD pipeline (GitHub Actions - testovi na push, build Docker image, deploy)
- [ ] EC2/App Runner deployment (live app na AWS)
- [ ] README
- [ ] Prateća dokumentacija (screenshots + opisi + isečci koda, po templejtu)

## Poznate napomene / odluke
- Prisma 7: `datasource.url` nije podržan u schema-i - koristi se `@prisma/adapter-pg` sa `process.env.DATABASE_URL` direktno u `lib/prisma.ts`
- RDS connection string zahteva `?sslmode=no-verify` za Node `pg` driver (AWS self-signed CA)
- Docker standalone build cache-uje `public/` listing pri startu - `/api/files/[filename]` ruta čita disk per-request (bypass cache); S3 upload ovo čini irelevantnim za nove fajlove
- Google OAuth: merge po emailu - ako korisnik ima Credentials nalog sa istim emailom, Google login ga koristi (ne kreira duplikat)
- Auto-detekcija trajanja epizode: HTML5 Audio API client-side (`getAudioDuration` funkcija u `EpisodeManager`)
- `swagger-ui-react` baca `UNSAFE_componentWillReceiveProps` warning u konzoli - to je bug u biblioteci, ne u našem kodu, ne utiče na funkcionalnost
- Guest mode (30s preview pa login popup) - odložen, nije u scope-u