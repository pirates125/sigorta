-- CreateEnum
CREATE TYPE "QuotePriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "QuoteStatus" ADD VALUE 'DRAFT';
ALTER TYPE "QuoteStatus" ADD VALUE 'CONTACTED';
ALTER TYPE "QuoteStatus" ADD VALUE 'QUOTED';
ALTER TYPE "QuoteStatus" ADD VALUE 'WON';
ALTER TYPE "QuoteStatus" ADD VALUE 'LOST';

-- AlterTable
ALTER TABLE "quotes" ADD COLUMN     "assignedTo" TEXT,
ADD COLUMN     "followUpDate" TIMESTAMP(3),
ADD COLUMN     "priority" "QuotePriority" NOT NULL DEFAULT 'MEDIUM';

-- CreateTable
CREATE TABLE "quote_notes" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quote_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quote_tasks" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "QuotePriority" NOT NULL DEFAULT 'MEDIUM',
    "dueDate" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "assignedTo" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quote_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "quote_notes_quoteId_idx" ON "quote_notes"("quoteId");

-- CreateIndex
CREATE INDEX "quote_notes_userId_idx" ON "quote_notes"("userId");

-- CreateIndex
CREATE INDEX "quote_notes_createdAt_idx" ON "quote_notes"("createdAt");

-- CreateIndex
CREATE INDEX "quote_tasks_quoteId_idx" ON "quote_tasks"("quoteId");

-- CreateIndex
CREATE INDEX "quote_tasks_createdBy_idx" ON "quote_tasks"("createdBy");

-- CreateIndex
CREATE INDEX "quote_tasks_assignedTo_idx" ON "quote_tasks"("assignedTo");

-- CreateIndex
CREATE INDEX "quote_tasks_status_idx" ON "quote_tasks"("status");

-- CreateIndex
CREATE INDEX "quote_tasks_dueDate_idx" ON "quote_tasks"("dueDate");

-- CreateIndex
CREATE INDEX "quotes_assignedTo_idx" ON "quotes"("assignedTo");

-- CreateIndex
CREATE INDEX "quotes_status_idx" ON "quotes"("status");

-- CreateIndex
CREATE INDEX "quotes_priority_idx" ON "quotes"("priority");

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_notes" ADD CONSTRAINT "quote_notes_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_notes" ADD CONSTRAINT "quote_notes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_tasks" ADD CONSTRAINT "quote_tasks_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_tasks" ADD CONSTRAINT "quote_tasks_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_tasks" ADD CONSTRAINT "quote_tasks_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
