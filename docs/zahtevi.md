# Zahtevi za seminarski rad (Faza 3)

## Opšte informacije

Projekat se nastavlja u istom repozitorijumu kao Faza 1/2. Tehnologija: **Next.js (React)**.

Registracija projekta: GitHub Classroom (`https://classroom.github.com/a/P6-_N0QT`), repo mora biti **public** i povezan sa Elab GitHub organizacijom.

---

## Obavezni zahtevi

- [ ] Dockerizacija aplikacije (Docker + docker-compose)
- [ ] API specifikacija pomoću Swagger-a, uključena u dokumentaciju

---

## Osnovni zahtevi

- [ ] Git verzionisanje - min **10 smislenih komitova**, oba člana tima kao kolaboratori sa svojim komitovima
  - Nije dozvoljeno commit-ovati gotov projekat i naknadno samo doterivati (komentari, nazivi promenljivih...)
- [ ] Repo je public, na GitHub-u, povezan sa Elab organizacijom
- [ ] Prateća dokumentacija po templejtu - prikaz sajta (slike ekrana + opisi), objašnjenje karakterističnih funkcionalnosti (isečak koda + pojašnjenje), dopuna dokumentacije za Faze 1 i 2

### Frontend

- [ ] Dinamički sajt - ReactJS/Next.js
- [ ] Min **3 stranice** sa različitim sadržajem
- [ ] Min **3 reusable komponente** (npr. dugme, polje za unos, kartica, modal)
- [ ] Stilizacija (CSS/Tailwind/SCSS/Bootstrap...)
- [ ] Min **3 funkcionalnosti** korišćenjem JS/JSX (originalne, ne iz skripte)
- [ ] Korišćenje React hooks (useState, useEffect, useNavigate/useRouter...)
- [ ] Rute za pristup svim delovima sajta

### Backend

- [ ] Min **5 modela**, međusobno povezanih
- [ ] Min **3 različita tipa migracija** (kreiranje tabele, izmena/dodavanje/brisanje kolone, dodatna ograničenja, foreign key-evi...)
- [ ] API rute i kontroleri po REST konvenciji
- [ ] API rute vraćaju JSON (i greške takođe)
- [ ] Min **3 različita tipa API ruta**
- [ ] Min **3 tipa korisnika**
- [ ] Rute za autentifikaciju (login, logout, register)
- [ ] Zaštita ruta - samo autentifikovani korisnici za CREATE/UPDATE/DELETE

---

## Zahtevi za višu ocenu

- [ ] Min **2 eksterna API-ja**
- [ ] README sa osnovnim informacijama i uputstvom za pokretanje
- [ ] Git grane: `main`/`master` (stabilna verzija), `develop` (integraciona), min **2 feature grane** (npr. `feature/login`, `feature/dashboard`)
- [ ] CI/CD pipeline (GitHub Actions/GitLab CI) - testovi na push/PR, build Docker image, deployment na cloud
- [ ] Produkcijska verzija na cloud platformi
- [ ] Zaštita od min **3 bezbednosna napada** (CSRF, XSS, IDOR, CORS, SQL Injection...)
- [ ] Automatizovani testovi
- [ ] Vizualizacija podataka (npr. Google Charts) **ili** prikaz mape (npr. Google Maps API) sa custom objektima/lejerima

---

## Mapiranje na naš projekat (Podcast Platforma)

| Zahtev | Status / Implementacija |
|---|---|
| 5+ modela | User, Podcast, Episode, Comment, Subscription, Favorite (6) |
| 3 tipa korisnika | SLUSALAC, KREATOR, ADMIN (role enum) |
| 3 reusable komponente | TODO - Button, Input, Card (refaktor) |
| 3 funkcionalnosti (JS/JSX) | Search/filter, Favorite toggle, Comment posting (sve sa hooks) |
| Auth rute | NextAuth (login/logout) + custom register |
| Zaštićene rute | Podcast/Episode CREATE/UPDATE/DELETE - role + ownership provera |
| 3 tipa API ruta | CRUD (podcasts/episodes), auth (register), relation actions (subscribe/favorite/comments) |
| Dockerizacija | docker-compose za Postgres (app servis TODO za produkciju) |
| Vizualizacija/Mapa | TODO - odlučiti (npr. broj epizoda po kategoriji - chart) |
| 2 eksterna API-ja | TODO - kandidat: chart API + eventualno geo/maps ako menjamo temu vizualizacije |
