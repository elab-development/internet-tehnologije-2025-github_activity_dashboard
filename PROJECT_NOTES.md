# Podcast Platforma - Project Notes

## Stack
- Next.js 16 (App Router, TypeScript, Tailwind, dark theme)
- Prisma 7 (driver adapter `@prisma/adapter-pg`, provider `prisma-client-js`)
- PostgreSQL - lokalno u Dockeru (dev) + AWS RDS (shared/production)
- AWS S3 - storage za upload-ovane fajlove (audio + cover slike)
- NextAuth v4 (Credentials provider, JWT sesije)
- bcryptjs za hash lozinki
- Docker + docker-compose (Dockerfile, multi-stage standalone build)

## Setup (novi clone)
```bash
npm install
cp .env.example .env   # popuni DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, AWS_* (4 varijable za S3)
npx prisma generate
npx prisma migrate deploy   # ili migrate dev za novu lokalnu bazu
npm run dev
```

**Node 20.19+ obavezan** (Prisma 7 zahtev).

**Docker (alternativa):**
```bash
docker compose up --build
```
Pokreće `app` (Next.js, port 3000) + `db` (lokalni Postgres, port 5432). AWS env varijable se čitaju iz `.env`.

**Napomena - RDS**: `DATABASE_URL` za RDS zahteva `?sslmode=no-verify` (Node `pg` adapter) ili `sslmode=require` (psql/libpq) zbog AWS-ovog self-signed CA sertifikata.

## Prisma Schema - modeli i veze
- **User** - role enum (`SLUSALAC`, `KREATOR`, `ADMIN`), `statusNaloga` enum (`AKTIVAN`/`SUSPENDOVAN`/`OBRISAN`)
- **Podcast** - `creatorId` → User (KREATOR), `kategorija` enum, `coverImageUrl` (nullable, S3 URL)
- **Episode** - `podcastId` → Podcast, `audioUrl` (S3 URL), `trajanje` (auto-detektovano iz fajla na frontend-u)
- **Comment** - `userId` → User, `episodeId` → Episode
- **Subscription** - join User↔Podcast (`@@unique([userId, podcastId])`)
- **Favorite** - join User↔Episode (`@@unique([userId, episodeId])`)
- Cascade delete: Podcast→Episode/Subscription, Episode→Comment/Favorite
- 3 migracije: `init` (kreiranje tabela), `add_cascade_deletes` (ograničenja), `add_podcast_cover_image` (dodavanje kolone)

## Permisije (po dijagramu iz dokumentacije)
- **kreira**: samo KREATOR pravi podcast i epizode (vlasnik podkasta) - ADMIN NE može da dodaje epizode
- **moderira/uklanja**: ADMIN može da briše bilo koji podcast/episode/comment (moderacija)
- **upravlja**: ADMIN upravlja korisnicima - suspenduje/aktivira nalog (`statusNaloga`), ne može suspendovati sebe; suspendovan korisnik ne može da se uloguje
- Vlasnik (creator) edituje/briše svoje podkaste i epizode
- Subscribe/Favorite/Comment - bilo koji ulogovan korisnik; brisanje komentara - autor ili ADMIN

## Implementirano (kompletan funkcionalni app)
- [x] Register/Login/Logout (NextAuth credentials, JWT sa `id` + `role`), suspendovani nalozi blokirani
- [x] Podcast CRUD API + Episode CRUD API
- [x] Subscribe / Favorite / Comments API (+ comment delete)
- [x] `/api/upload` - upload na **AWS S3** (audio + cover slike), generički za sve dozvoljene tipove
- [x] `/api/files/[filename]` - fallback ruta za lokalne fajlove (legacy)
- [x] Home page - grid layout, search, filter po kategoriji, dark theme
- [x] Podcast detail (`/podcasts/[id]`) - hero, cover slika, subscribe, lista epizoda
- [x] Episode detail (`/episodes/[id]`) - player, favorite, komentari (+ delete)
- [x] Dashboard (`/dashboard`) - kreator: CRUD podkasta/epizoda, cover/audio upload, auto-detect trajanja; ADMIN: moderacija (vidi sve, briše, ne dodaje epizode)
- [x] Admin panel (`/admin/users`) - lista korisnika, suspend/activate, role badge-ovi
- [x] Favorites i Subscriptions stranice
- [x] Navbar - role-based linkovi, active route indicator, dark sticky
- [x] Reusable komponente: `Button` (4 varijante), `Input`/`Textarea`/`Select`, `Card`
- [x] Dark theme design system (zinc layers + indigo accent) kroz celu app
- [x] Dockerfile (multi-stage, standalone) + `docker-compose.yml` (`app` + `db` servisi)
- [x] AWS S3 bucket (eu-central-1, public read za GetObject)
- [x] AWS RDS PostgreSQL 16 (eu-central-1, free tier)
- [x] Auto-detekcija trajanja epizode iz audio fajla (HTML5 Audio API, client-side)

## Git grane (do sad)
`main`, `develop` + feature grane: `feature/audio-upload`, `feature/reusable-components`, `feature/podcast-cover-image`, `feature/styling`, `feature/admin-panel`, `feature/dockerize`, `feature/s3-storage`, `feature/auto-duration` - sve merge-ovane u `develop`.

## TODO (preostalo do finalizacije)

**Obavezno:**
- [ ] Swagger API specifikacija

**Osnovni zahtevi:**
- [ ] Prateća dokumentacija (screenshots + opisi stranica, isečci koda + objašnjenja, dopuna Faza 1/2)

**Viša ocena:**
- [ ] Drugi eksterni API (S3 je #1; kandidat #2: Google OAuth login ili email servis)
- [ ] README (opis app-a + uputstvo za pokretanje, Docker i lokalno)
- [ ] CI/CD pipeline (GitHub Actions - testovi, build Docker image, deploy)
- [ ] Cloud deployment - compute deo (EC2/App Runner) - RDS+S3 već postoje, nedostaje "live" app
- [ ] Security mere (min 3) - Prisma štiti od SQL injection by default, NextAuth ima CSRF za auth; treba eksplicitno dodati/dokumentovati još 1-2 (security headers, rate limiting...)
- [ ] Automatizovani testovi
- [ ] Vizualizacija podataka (Chart.js - npr. broj epizoda po kategoriji, top podkasti po pretplatnicima)

## Poznate napomene / odluke
- Prisma 7: `datasource.url` nije podržan u schema-i - koristi se `@prisma/adapter-pg` (`PrismaPg`) sa `process.env.DATABASE_URL` u `lib/prisma.ts`
- RDS connection string zahteva `sslmode=no-verify` (Node `pg`) zbog AWS RDS self-signed CA
- Docker standalone build cache-uje `public/` listing pri startu - zato `/api/files/[filename]` čita disk per-request; S3 upload ovo čini irelevantnim za nove fajlove
- Guest mode (30s preview pa login popup) - odložen, nije deo trenutnog scope-a