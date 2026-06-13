# Podcast Platforma - Project Notes

## Stack
- Next.js 15+ (App Router, TypeScript, Tailwind)
- Prisma 7 (driver adapter `@prisma/adapter-pg`, provider `prisma-client-js`)
- PostgreSQL (lokalno u Dockeru, `docker-compose.yml`)
- NextAuth v4 (Credentials provider, JWT sesije)
- bcryptjs za hash lozinki

## Setup (novi clone)
```bash
npm install
cp .env.example .env   # popuni DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL
docker compose up -d
npx prisma generate
npx prisma migrate dev
npm run dev
```
Napomena: Node 20.19+ je obavezan (Prisma 7 zahtev).

## Prisma Schema - modeli i veze
- **User** - role enum (`SLUSALAC`, `KREATOR`, `ADMIN`), single-table inheritance pristup (statusNaloga/biografija/nivoPrava su nullable polja po role-u)
- **Podcast** - `creatorId` → User (KREATOR), kategorija enum
- **Episode** - `podcastId` → Podcast, `audioUrl` (lokalna putanja ili S3 URL kasnije)
- **Comment** - `userId` → User, `episodeId` → Episode
- **Subscription** - join User↔Podcast (`@@unique([userId, podcastId])`)
- **Favorite** - join User↔Episode (`@@unique([userId, episodeId])`)
- Cascade delete: Podcast→Episode/Subscription, Episode→Comment/Favorite

## Permisije (po dijagramu iz dokumentacije)
- **kreira**: samo KREATOR pravi podcast (postaje creator)
- **moderira/uklanja**: ADMIN može da edituje/briše bilo čiji podcast/episode
- Vlasnik (creator) edituje/briše svoje podkaste i epizode
- Subscribe/Favorite/Comment - bilo koji ulogovan korisnik

## Implementirano (MVP)
- [x] Register/Login/Logout (NextAuth credentials, JWT sa `id` + `role`)
- [x] Podcast CRUD API (`/api/podcasts`, `/api/podcasts/[id]`)
- [x] Episode CRUD API (`/api/podcasts/[id]/episodes`, `/api/episodes/[id]`)
- [x] Subscribe API (`/api/podcasts/[id]/subscribe`)
- [x] Favorite API (`/api/episodes/[id]/favorite`)
- [x] Comments API (`/api/episodes/[id]/comments`)
- [x] Home page - lista, search, filter po kategoriji
- [x] Podcast detail page (`/podcasts/[id]`) - subscribe dugme, lista epizoda
- [x] Episode detail page (`/episodes/[id]`) - player, favorite, komentari
- [x] Dashboard (`/dashboard`) - kreator pravi/briše podcast i epizode
- [x] Favorites i Subscriptions stranice (`/favorites`, `/subscriptions`)
- [x] Navbar sa role-based linkovima

## U TOKU (branch: feature/audio-upload)
- [x] `/api/upload` ruta - prima fajl preko FormData, čuva u `public/uploads/`, vraća `/uploads/<uuid>.ext`
- [ ] Povezati upload sa dashboard formom za dodavanje epizoda (file input umesto URL text input-a)
- [ ] Test end-to-end (upload fajla → kreiranje epizode → playback)

## TODO (preostalo do "kompletnog" MVP-a)
- [ ] Reusable komponente refaktor (Button/Input/Card kao zasebne komponente - zahtev "min 3 reusable")
- [ ] Stilizacija pass (cela app, frontend-design)

## TODO (zahtevi za višu ocenu, posle MVP-a)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Swagger API specifikacija
- [ ] Security mere (min 3: CSRF, XSS, CORS, SQL Injection zaštita - Prisma već štiti od SQL injection)
- [ ] Automatizovani testovi
- [ ] Deployment na cloud (AWS - RDS umesto lokalnog Postgres-a, S3 umesto lokalnog upload-a)
- [ ] Branch strategija: main/develop + feature grane (min 2) - u toku

## Poznate napomene / odluke
- Prisma 7 ne podržava `url` u `datasource` blocku - koristi se `@prisma/adapter-pg` sa `process.env.DATABASE_URL` direktno u `lib/prisma.ts`
- `app/generated/prisma` (eksperimentalni ESM generator) napušten u korist standardnog `prisma-client-js`
- Guest mode (30s preview pa login popup) - **odložen**, nije deo MVP-a
- Audio upload: lokalni storage sad, S3 kasnije - menja se samo `/api/upload` implementacija, ostatak koda se ne dira
