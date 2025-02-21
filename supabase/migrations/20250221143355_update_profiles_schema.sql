-- Add new columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS github_url TEXT,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS twitter_url TEXT,
ADD COLUMN IF NOT EXISTS tiktok_url TEXT,
ADD COLUMN IF NOT EXISTS instagram_url TEXT,
ADD COLUMN IF NOT EXISTS youtube_url TEXT,
ADD COLUMN IF NOT EXISTS other_url TEXT,
ADD COLUMN IF NOT EXISTS skills_looking_for TEXT[],
ADD COLUMN IF NOT EXISTS languages_looking_for TEXT[],
ADD COLUMN IF NOT EXISTS countries_looking_for TEXT[];