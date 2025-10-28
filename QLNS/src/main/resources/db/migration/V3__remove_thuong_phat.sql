-- Remove thuong and phat columns from bang_luong table
ALTER TABLE bang_luong DROP COLUMN IF EXISTS thuong;
ALTER TABLE bang_luong DROP COLUMN IF EXISTS phat;
