-- Enable RLS for swipes and matches tables
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Policy for deleting swipes
CREATE POLICY "Users can delete their own swipes"
  ON swipes
  FOR DELETE
  USING (auth.uid() = swiper_id OR auth.uid() = swiped_id);

-- Policy for deleting matches
CREATE POLICY "Users can delete their own matches"
  ON matches
  FOR DELETE
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);