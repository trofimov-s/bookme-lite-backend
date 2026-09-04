-- DropForeignKey
ALTER TABLE "availability_slots" DROP CONSTRAINT "availability_slots_user_id_fkey";

-- AddForeignKey
ALTER TABLE "availability_slots" ADD CONSTRAINT "availability_slots_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
