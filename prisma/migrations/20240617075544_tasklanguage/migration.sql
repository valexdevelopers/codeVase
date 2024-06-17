/*
  Warnings:

  - Added the required column `languages` to the `Challenge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Challenge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Challenge` ADD COLUMN `description` LONGTEXT NULL,
    ADD COLUMN `languages` ENUM('javascript', 'Java') NOT NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL,
    MODIFY `challenge` LONGTEXT NOT NULL,
    MODIFY `challenge_answer` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `TaskAttempts` MODIFY `user_answer` LONGTEXT NOT NULL;
