-- CreateEnum
CREATE TYPE "TipKorisnika" AS ENUM ('SLUSALAC', 'KREATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "StatusNaloga" AS ENUM ('AKTIVAN', 'SUSPENDOVAN', 'OBRISAN');

-- CreateEnum
CREATE TYPE "KategorijaPodcasta" AS ENUM ('TEHNOLOGIJA', 'EDUKACIJA', 'ZABAVA', 'BIZNIS', 'OSTALO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "ime" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "lozinkaHash" TEXT NOT NULL,
    "role" "TipKorisnika" NOT NULL DEFAULT 'SLUSALAC',
    "statusNaloga" "StatusNaloga" NOT NULL DEFAULT 'AKTIVAN',
    "biografija" TEXT,
    "nivoPrava" TEXT,
    "datumRegistracije" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Podcast" (
    "id" TEXT NOT NULL,
    "naziv" TEXT NOT NULL,
    "opis" TEXT NOT NULL,
    "kategorija" "KategorijaPodcasta" NOT NULL,
    "datumKreiranja" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "Podcast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Episode" (
    "id" TEXT NOT NULL,
    "naslov" TEXT NOT NULL,
    "opis" TEXT NOT NULL,
    "datumObjave" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audioUrl" TEXT NOT NULL,
    "trajanje" INTEGER NOT NULL,
    "podcastId" TEXT NOT NULL,

    CONSTRAINT "Episode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "sadrzaj" TEXT NOT NULL,
    "datumKreiranja" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "episodeId" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "datumPretplate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "podcastId" TEXT NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "datumDodavanja" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "episodeId" TEXT NOT NULL,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_podcastId_key" ON "Subscription"("userId", "podcastId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_episodeId_key" ON "Favorite"("userId", "episodeId");

-- AddForeignKey
ALTER TABLE "Podcast" ADD CONSTRAINT "Podcast_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Episode" ADD CONSTRAINT "Episode_podcastId_fkey" FOREIGN KEY ("podcastId") REFERENCES "Podcast"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_podcastId_fkey" FOREIGN KEY ("podcastId") REFERENCES "Podcast"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
