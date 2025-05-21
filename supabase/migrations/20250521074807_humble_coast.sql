/*
  # Add task history table and related functions

  1. New Tables
    - `task_history`
      - `id` (uuid, primary key)
      - `task_id` (uuid, references tasks)
      - `user_id` (uuid, references users)
      - `action` (text)
      - `created_at` (timestamp)
      - `details` (jsonb)

  2. Security
    - Enable RLS on `task_history` table
    - Add policy for authenticated users to read their own history
*/

CREATE TABLE IF NOT EXISTS task_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  created_at timestamptz DEFAULT now(),
  details jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE task_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own task history"
  ON task_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to record task history
CREATE OR REPLACE FUNCTION record_task_history()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO task_history (task_id, user_id, action, details)
  VALUES (
    NEW.id,
    NEW.user_id,
    CASE
      WHEN TG_OP = 'INSERT' THEN 'created'
      WHEN TG_OP = 'UPDATE' AND NEW.status = 'completed' AND OLD.status != 'completed' THEN 'completed'
      WHEN TG_OP = 'UPDATE' THEN 'updated'
      WHEN TG_OP = 'DELETE' THEN 'deleted'
    END,
    jsonb_build_object(
      'title', NEW.title,
      'status', NEW.status,
      'priority', NEW.priority
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for task history
CREATE TRIGGER task_history_trigger
AFTER INSERT OR UPDATE OR DELETE ON tasks
FOR EACH ROW
EXECUTE FUNCTION record_task_history();