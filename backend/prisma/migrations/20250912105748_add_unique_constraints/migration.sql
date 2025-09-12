/*
  Warnings:

  - A unique constraint covering the columns `[userId,sessionId]` on the table `Track` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Track_userId_sessionId_key" ON "public"."Track"("userId", "sessionId");
