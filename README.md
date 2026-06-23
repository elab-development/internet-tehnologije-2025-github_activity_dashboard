# Podcast Platforma

Moderna web aplikacija za hostovanje i slušanje podkasta, razvijena kao seminarski rad za predmet Internet Tehnologije 2025.

## Live Demo

**Produkcija:** http://ec2-3-68-49-44.eu-central-1.compute.amazonaws.com:3000

**API Dokumentacija (Swagger):** http://ec2-3-68-49-44.eu-central-1.compute.amazonaws.com:3000/api-docs

---

## Tech Stack

| Sloj | Tehnologija |
|------|-------------|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS |
| Backend | Next.js API Routes (REST) |
| Baza podataka | PostgreSQL (lokalno Docker / AWS RDS) |
| ORM | Prisma 7 |
| Autentifikacija | NextAuth v4 (Credentials + Google OAuth) |
| Storage | AWS S3 |
| Kontejnerizacija | Docker + docker-compose |
| CI/CD | GitHub Actions |
| Testovi | Jest + ts-jest |
| Vizualizacija | Recharts |
| API Dokumentacija | Swagger UI (OpenAPI 3.0) |
| Audio Player | react-h5-audio-player |

---

## Tipovi korisnika

| Tip | Opis |
|-----|------|
| **SLUŠALAC** | Može da sluša podkaste, komentariše, pretplaćuje se i dodaje omiljene |
| **KREATOR** | Sve kao SLUŠALAC + može da kreira i upravlja sopstvenim podkastima i epizodama |
| **ADMIN** | Moderacija sadržaja (brisanje podkasta/epizoda/komentara) i upravljanje korisnicima (suspend/aktivacija, promena role) |

---

## Pokretanje aplikacije

### Preduslovi

- Node.js 20.19+
- Docker i docker-compose
- Git

### 1. Kloniranje repozitorijuma

```bash
git clone https://github.com/elab-development/internet-tehnologije-2026-podcast-platform.git
cd internet-tehnologije-2026-podcast-platform
```

### 2. Konfiguracija environment varijabli

```bash
cp .env.example .env
```

Popuni `.env` fajl:

```env
# Baza podataka
# Lokalno (Docker): postgresql://podcast_user:podcast_pass@db:5432/podcast_db?schema=public
# AWS RDS: postgresql://postgres:PASSWORD@ENDPOINT:5432/podcast_db?schema=public&sslmode=no-verify
DATABASE_URL=postgresql://podcast_user:podcast_pass@db:5432/podcast_db?schema=public

# NextAuth
NEXTAUTH_SECRET=your-nextauth-secret-minimum-32-characters
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (opciono)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AWS S3 (opciono - za upload fajlova)
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=eu-central-1
AWS_S3_BUCKET_NAME=your-s3-bucket-name
```

---

### Pokretanje sa Docker-om (preporučeno)

```bash
docker compose up --build
```

Pokreće:
- `app` - Next.js aplikacija na portu **3000**
- `db` - PostgreSQL baza na portu **5432**

Aplikacija je dostupna na: http://localhost:3000

### Lokalno pokretanje (bez Docker-a)

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

Aplikacija je dostupna na: http://localhost:3000

---

## Pokretanje testova

```bash
npm test
```

Pokriva:
- API rute za podkaste (GET lista/filter/search, POST sa permission proverama)
- Auth rute (register - kreiranje, duplikat email, validacija)
- Admin rute (stats i users - role-based access control)

**15 testova, 3 test suite-a** (Jest + ts-jest, mock-based, bez potrebe za bazom)

---

## AWS Infrastruktura

| Servis | Detalji |
|--------|---------|
| **EC2** | t3.micro, Amazon Linux 2023, eu-central-1 |
| **Elastic IP** | 3.68.49.44 (statička IP) |
| **RDS** | PostgreSQL 16, db.t4g.micro, eu-central-1 |
| **S3** | podcast-platform-mirkovic-2026, eu-central-1 |
| **Docker Hub** | mirkovicpetar/podcast-platform:latest |

### Produkcijski deploy

```bash
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

---

## CI/CD Pipeline (GitHub Actions)

Pipeline se pokreće automatski:

| Trigger | Akcija |
|---------|--------|
| Push/PR na `develop` | Pokreće testove |
| Push na `master` | Testovi → Docker build → Push na Docker Hub → Deploy na EC2 |

---

## Sigurnosne mere

1. **SQL Injection** - Prisma ORM parametrizovani upiti
2. **CSRF** - NextAuth built-in CSRF token zaštita
3. **IDOR** - Ownership/role provere na svakom API endpoint-u
4. **XSS** - Next.js automatsko escapovanje JSX output-a
5. **Security Headers** - X-Frame-Options, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy

---

## API Dokumentacija

Swagger UI dostupan na `/api-docs` (lokalno: http://localhost:3000/api-docs)

### API Grupe

| Tag | Opis |
|-----|------|
| Auth | Register, Login, Logout |
| Podcasts | CRUD operacije za podkaste |
| Episodes | CRUD operacije za epizode |
| Comments | Dodavanje i brisanje komentara |
| Subscriptions | Pretplata na podkaste |
| Favorites | Omiljene epizode |
| Upload | Upload audio i cover fajlova na AWS S3 |
| Admin | Upravljanje korisnicima i statistike |

---

## Struktura projekta

```
├── app/                    # Next.js App Router stranice i API rute
│   ├── api/               # REST API endpoint-i
│   │   ├── auth/          # Autentifikacija (register, NextAuth)
│   │   ├── podcasts/      # Podcast CRUD + subscribe
│   │   ├── episodes/      # Episode CRUD + favorite + comments
│   │   ├── users/         # Admin - upravljanje korisnicima
│   │   ├── admin/         # Admin statistike
│   │   ├── upload/        # File upload na S3
│   │   ├── files/         # Lokalni file serving (fallback)
│   │   └── swagger/       # OpenAPI spec endpoint
│   ├── admin/             # Admin panel stranice
│   ├── api-docs/          # Swagger UI stranica
│   ├── dashboard/         # Kreator dashboard
│   ├── episodes/          # Episode detail stranica
│   ├── favorites/         # Lista omiljenih
│   ├── login/             # Login stranica
│   ├── podcasts/          # Podcast detail stranica
│   ├── register/          # Register stranica
│   └── subscriptions/     # Lista pretplata
├── components/            # Reusable React komponente
│   ├── Button.tsx         # Dugme (4 varijante)
│   ├── Card.tsx           # Kartica
│   ├── Input.tsx          # Input/Textarea/Select
│   ├── Navbar.tsx         # Navigacija
│   ├── AdminStats.tsx     # Recharts vizualizacija
│   ├── CommentSection.tsx # Komentari
│   ├── FavoriteButton.tsx # Omiljeni toggle
│   ├── SubscribeButton.tsx# Pretplata toggle
│   ├── UserRoleButton.tsx # Admin - promena role
│   ├── UserStatusButton.tsx# Admin - suspend/aktivacija
│   ├── AudioPlayer.tsx    # Custom audio player sa dark theme-om
│   └── GuestModal.tsx     # Modal za guest korisnike (60s preview limit)
├── lib/                   # Utility biblioteke
│   ├── auth.ts            # NextAuth konfiguracija
│   ├── prisma.ts          # Prisma client singleton
│   ├── swagger.ts         # OpenAPI spec definicija
│   ├── s3.ts              # AWS S3 helper (delete, extractKey)
│   └── upload.ts          # Client-side upload helper (presigned URL)
├── prisma/
│   ├── schema.prisma      # Prisma šema (6 modela)
│   └── migrations/        # 3 migracije
├── __tests__/                # Jest testovi
├── .github/workflows/     # GitHub Actions CI/CD
├── middleware.ts          # Route protection (dashboard zaštita)
├── Dockerfile             # Multi-stage Docker build
├── docker-compose.yml     # Lokalni dev (app + db)
├── docker-compose.prod.yml# Produkcija (samo app, RDS)
└── .env.example           # Template za env varijable
```

---

## Baza podataka - modeli

| Model | Opis |
|-------|------|
| **User** | Korisnici sa role enum (SLUŠALAC/KREATOR/ADMIN) |
| **Podcast** | Podkasti sa cover slikom (S3 URL) |
| **Episode** | Epizode sa audio fajlom (S3 URL) i trajanjem |
| **Comment** | Komentari na epizodama |
| **Subscription** | Many-to-many User↔Podcast |
| **Favorite** | Many-to-many User↔Episode |

### Migracije (3 tipa)

1. `init` - Kreiranje svih tabela
2. `add_cascade_deletes` - Dodavanje ON DELETE CASCADE ograničenja
3. `add_podcast_cover_image` - Dodavanje coverImageUrl kolone

---
ftrftrfftrftrtftr
## Git grane

| Grana | Opis |
|-------|------|
| `master` | Stabilna produkcijska verzija |
| `develop` | Integraciona grana |
| `feature/*` | Feature grane (16 feature grana) |

---

## Tim

- Petar Mirković
- Nemanja Mitić
- Nina Latinović
