/*
  Warnings:

  - A unique constraint covering the columns `[renewedPolicyId]` on the table `policies` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "RenewalStatus" AS ENUM ('NOT_DUE', 'UPCOMING', 'DUE_SOON', 'URGENT', 'EXPIRED', 'RENEWED');

-- AlterTable
ALTER TABLE "policies" ADD COLUMN     "renewalReminded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "renewalStatus" "RenewalStatus" DEFAULT 'NOT_DUE',
ADD COLUMN     "renewedPolicyId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "policies_renewedPolicyId_key" ON "policies"("renewedPolicyId");
