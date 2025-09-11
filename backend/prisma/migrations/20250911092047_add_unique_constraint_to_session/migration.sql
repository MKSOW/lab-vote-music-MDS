/*
  Warnings:

  - A unique constraint covering the columns `[subject,start,room]` on the table `Session` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Session_subject_start_room_key" ON "public"."Session"("subject", "start", "room");
