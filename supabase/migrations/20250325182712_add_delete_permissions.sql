-- Add delete policy for notes table
CREATE POLICY "Users can delete own notes" ON notes
FOR DELETE USING (auth.uid() = user_id);