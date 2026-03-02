-- AlterTable
ALTER TABLE "Test"
ADD COLUMN "maxAttempts" INTEGER NOT NULL DEFAULT 1;

ALTER TABLE "Test"
ALTER COLUMN "maxAttempts" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Question"
RENAME COLUMN "correct" TO "correctIndex";

-- CreateEnum
CREATE TYPE "AttemptStatus" AS ENUM ('started', 'completed', 'expired');

-- AlterTable
ALTER TABLE "Attempt"
ALTER COLUMN "userId" TYPE INTEGER USING "userId"::integer,
ADD COLUMN "status" "AttemptStatus" NOT NULL DEFAULT 'started';

-- CreateIndex
CREATE UNIQUE INDEX "Attempt_userId_testId_attemptNo_key" ON "Attempt"("userId", "testId", "attemptNo");

-- AddForeignKey
ALTER TABLE "Attempt"
ADD CONSTRAINT "Attempt_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
