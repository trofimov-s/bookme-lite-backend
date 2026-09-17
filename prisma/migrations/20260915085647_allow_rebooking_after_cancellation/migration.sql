-- DropIndex
DROP INDEX "bookings_user_id_start_time_key";

-- CreateIndex
CREATE UNIQUE INDEX "bookings_active_user_id_start_time_key"
ON "bookings"("user_id", "start_time")
WHERE "status" = 'ACTIVE';
