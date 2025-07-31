-- 1. Create tier enum
CREATE TYPE IF NOT EXISTS tier AS ENUM ('free', 'silver', 'gold', 'platinum');

-- 2. Create venues table
CREATE TABLE IF NOT EXISTS venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address_line_1 TEXT,
  address_line_2 TEXT,
  city TEXT,
  rating FLOAT,
  reviews INT,
  google_link TEXT,
  map_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- 3. Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  thumbnail TEXT,
  tier tier NOT NULL,
  venue_id UUID REFERENCES venues(id),
  external_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- 4. Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  source TEXT,
  ticket_link TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- 5. Indexes on foreign keys
CREATE INDEX IF NOT EXISTS idx_events_venue_id ON events(venue_id);
CREATE INDEX IF NOT EXISTS idx_tickets_event_id ON tickets(event_id);

-- 6. Indexes on frequently filtered fields
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_tier ON events(tier);

-- 7. Add CHECK constraint for rating and event_date
ALTER TABLE venues ADD CONSTRAINT rating_range CHECK (rating >= 0 AND rating <= 5);
ALTER TABLE events ADD CONSTRAINT future_event CHECK (event_date > created_at);

-- 8. Enable RLS on table events and tickets
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- 9. Create a user access function
CREATE OR REPLACE FUNCTION user_can_access_event(event_tier tier, user_tier tier)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN
    CASE user_tier
      WHEN 'platinum' THEN TRUE
      WHEN 'gold'     THEN event_tier IN ('free', 'silver', 'gold')
      WHEN 'silver'   THEN event_tier IN ('free', 'silver')
      WHEN 'free'     THEN event_tier = 'free'
      ELSE FALSE
    END;
END;
$$ LANGUAGE plpgsql;

-- 10. Create RLS View policy on events
CREATE POLICY "allow_access_based_on_clerk_tier"
ON events
FOR SELECT
USING (
  user_can_access_event(
    events.tier, 
    COALESCE(
      (current_setting('request.jwt.claims', TRUE)::json->>'tier')::tier,
      'free'::tier
    )
  )
);

-- 11. Create RLS View policy on tickets
CREATE POLICY "allow_access_to_tickets_for_accessible_events"
ON tickets
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = tickets.event_id
    AND user_can_access_event(
      events.tier,
      COALESCE(
        (current_setting('request.jwt.claims', TRUE)::json->>'tier')::tier,
        'free'::tier
      )
    )
  )
);

-- 12. Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 13. Apply the trigger to tables:
CREATE TRIGGER set_updated_at_events
BEFORE UPDATE ON events
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER set_updated_at_venues
BEFORE UPDATE ON venues
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER set_updated_at_tickets
BEFORE UPDATE ON tickets
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();