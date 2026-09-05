/*
  Warnings:

  - A unique constraint covering the columns `[user_id,start_time]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "bookings_user_id_start_time_key" ON "bookings"("user_id", "start_time");
