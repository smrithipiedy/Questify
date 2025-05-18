/*
  # Create tasks and rewards tables

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `description` (text)
      - `status` (text)
      - `priority` (text)
      - `created_at` (timestamptz)
      - `completed_at` (timestamptz)
      - `focus_time` (integer)

    - `rewards`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `description` (text)
      - `rarity` (text)
      - `image_url` (text)
      - `unlocked_at` (timestamptz)
      - `coins` (integer)
      - `source` (text)

    - `focus_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `duration` (integer)
      - `task_id` (uuid, references tasks)
      - `character_id` (text)
      - `is_break` (boolean)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'pending',
  priority text NOT NULL DEFAULT 'medium',
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  focus_time integer DEFAULT 0,
  CONSTRAINT valid_status CHECK (status IN ('pending', 'in-progress', 'completed')),
  CONSTRAINT valid_priority CHECK (priority IN ('low', 'medium', 'high'))
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own tasks"
  ON tasks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  description text,
  rarity text NOT NULL,
  image_url text NOT NULL,
  unlocked_at timestamptz DEFAULT now(),
  coins integer DEFAULT 0,
  source text NOT NULL,
  CONSTRAINT valid_rarity CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic')),
  CONSTRAINT valid_source CHECK (source IN ('task', 'focus'))
);

ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own rewards"
  ON rewards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own rewards"
  ON rewards
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Focus sessions table
CREATE TABLE IF NOT EXISTS focus_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  start_time timestamptz DEFAULT now(),
  end_time timestamptz,
  duration integer NOT NULL,
  task_id uuid REFERENCES tasks(id),
  character_id text,
  is_break boolean DEFAULT false
);

ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own focus sessions"
  ON focus_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);