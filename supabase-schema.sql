-- Tasbeeh App Database Schema for Supabase
-- Run this SQL in your Supabase SQL editor to create the tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Counters table
CREATE TABLE IF NOT EXISTS counters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT 'green',
    icon TEXT NOT NULL DEFAULT 'leaf',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    counter_id UUID REFERENCES counters(id) ON DELETE CASCADE,
    count INTEGER NOT NULL DEFAULT 0,
    goal INTEGER,
    completed BOOLEAN DEFAULT FALSE,
    date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily stats table
CREATE TABLE IF NOT EXISTS daily_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    total_count INTEGER NOT NULL DEFAULT 0,
    date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User points table
CREATE TABLE IF NOT EXISTS user_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    points INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id TEXT NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_counters_user_id ON counters(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_counter_id ON sessions(counter_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(date);
CREATE INDEX IF NOT EXISTS idx_daily_stats_user_id ON daily_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_stats(date);
CREATE INDEX IF NOT EXISTS idx_user_points_user_id ON user_points(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);

-- Enable Row Level Security
ALTER TABLE counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for counters table
CREATE POLICY "Users can view their own counters"
    ON counters FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own counters"
    ON counters FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own counters"
    ON counters FOR UPDATE
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own counters"
    ON counters FOR DELETE
    USING (auth.uid() = user_id OR user_id IS NULL);

-- RLS Policies for sessions table
CREATE POLICY "Users can view sessions for their counters"
    ON sessions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM counters
            WHERE counters.id = sessions.counter_id
            AND (counters.user_id = auth.uid() OR counters.user_id IS NULL)
        )
    );

CREATE POLICY "Users can insert sessions for their counters"
    ON sessions FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM counters
            WHERE counters.id = counter_id
            AND (counters.user_id = auth.uid() OR counters.user_id IS NULL)
        )
    );

CREATE POLICY "Users can update sessions for their counters"
    ON sessions FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM counters
            WHERE counters.id = sessions.counter_id
            AND (counters.user_id = auth.uid() OR counters.user_id IS NULL)
        )
    );

CREATE POLICY "Users can delete sessions for their counters"
    ON sessions FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM counters
            WHERE counters.id = sessions.counter_id
            AND (counters.user_id = auth.uid() OR counters.user_id IS NULL)
        )
    );

-- RLS Policies for daily_stats table
CREATE POLICY "Users can view their own stats"
    ON daily_stats FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own stats"
    ON daily_stats FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own stats"
    ON daily_stats FOR UPDATE
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own stats"
    ON daily_stats FOR DELETE
    USING (auth.uid() = user_id OR user_id IS NULL);

-- RLS Policies for user_points table
CREATE POLICY "Users can view their own points"
    ON user_points FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own points"
    ON user_points FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own points"
    ON user_points FOR UPDATE
    USING (auth.uid() = user_id);

-- RLS Policies for user_achievements table
CREATE POLICY "Users can view their own achievements"
    ON user_achievements FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
    ON user_achievements FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own achievements"
    ON user_achievements FOR DELETE
    USING (auth.uid() = user_id);

-- Optional: Create a function to automatically update daily stats
CREATE OR REPLACE FUNCTION update_daily_stats()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO daily_stats (user_id, total_count, date)
    VALUES (
        (SELECT user_id FROM counters WHERE id = NEW.counter_id),
        NEW.count,
        DATE_TRUNC('day', NEW.date)
    )
    ON CONFLICT (user_id, DATE_TRUNC('day', date))
    DO UPDATE SET total_count = daily_stats.total_count + NEW.count;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Optional: Create trigger to auto-update daily stats when a session is completed
CREATE TRIGGER trigger_update_daily_stats
    AFTER INSERT ON sessions
    FOR EACH ROW
    WHEN (NEW.completed = TRUE)
    EXECUTE FUNCTION update_daily_stats();
