-- CreateTable
CREATE TABLE "TournamentField" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TournamentField_pkey" PRIMARY KEY ("id")
);
