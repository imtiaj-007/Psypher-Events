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

-- 14. Insert sample data

 -- 14.1 Insert data into venues
 INSERT INTO venues 
   (name, address_line_1, address_line_2, city, rating, reviews, google_link, map_image_url)
 VALUES 
   ('The Grand Ballroom', '123 Main Street', 'Suite 200', 'New York', 4.7, 1285, 'https://goo.gl/maps/xyz123', 'https://maps.example.com/grandballroom.jpg'),
   ('Oceanview Convention Center', '500 Coastal Highway', null, 'Miami', 4.5, 892, 'https://goo.gl/maps/abc456', 'https://maps.example.com/oceanview.jpg'),
   ('Harmony Hall', '789 Music Lane', 'Building B', 'Nashville', 4.8, 2103, 'https://goo.gl/maps/def789', 'https://maps.example.com/harmonyhall.jpg'),
   ('The Rustic Barn', '250 Country Road', null, 'Austin', 4.6, 745, 'https://goo.gl/maps/ghi012', 'https://maps.example.com/rusticbarn.jpg'),
   ('Metropolitan Events Center', '1 Downtown Plaza', 'Level 3', 'Chicago', 4.4, 1560, 'https://goo.gl/maps/jkl345', 'https://maps.example.com/metrocenter.jpg'),
   ('Garden Pavilion', '88 Park Avenue', null, 'San Francisco', 4.9, 980, 'https://goo.gl/maps/mno678', 'https://maps.example.com/gardenpavilion.jpg'),
   ('The Crystal Room', '600 Luxury Boulevard', 'Penthouse Floor', 'Las Vegas', 4.7, 3200, 'https://goo.gl/maps/pqr901', 'https://maps.example.com/crystalroom.jpg'),
   ('Historic Opera House', '22 Theater District', null, 'Boston', 4.8, 1842, 'https://goo.gl/maps/stu234', 'https://maps.example.com/operahouse.jpg'),
   ('Sunset Terrace', '1010 Hilltop Drive', 'Rooftop Venue', 'Los Angeles', 4.6, 1120, 'https://goo.gl/maps/vwx567', 'https://maps.example.com/sunsetterrace.jpg'),
   ('The Urban Loft', '330 Industrial Way', null, 'Seattle', 4.5, 670, 'https://goo.gl/maps/yza890', 'https://maps.example.com/urbanloft.jpg');


-- 14.2 Get the venue IDs to reference events
WITH venue_ids AS (
  SELECT id, name FROM venues ORDER BY name LIMIT 10
),
venue_list AS (
  SELECT 
    id,
    name,
    ROW_NUMBER() OVER (ORDER BY name) as venue_num
  FROM venue_ids
)

-- 14.3 Insert 8 past events
INSERT INTO events (title, description, event_date, tier, venue_id, external_link, created_at)
SELECT 
  CASE 
    WHEN i <= 2 THEN 'Annual ' || v.name || ' Gala'
    WHEN i <= 4 THEN 'Tech Conference ' || (2025 - i)
    WHEN i <= 6 THEN 'Music Festival Night'
    ELSE 'Charity Fundraiser'
  END as title,
  CASE 
    WHEN i <= 2 THEN 'Our prestigious annual gala event at ' || v.name
    WHEN i <= 4 THEN 'The premier technology conference for innovators'
    WHEN i <= 6 THEN 'An evening of live music and entertainment'
    ELSE 'Supporting local community initiatives'
  END as description,
  (NOW() - (i * INTERVAL '2 days') - (random() * INTERVAL '5 days')) as event_date,
  CASE 
    WHEN i % 4 = 0 THEN 'platinum'::tier
    WHEN i % 4 = 1 THEN 'gold'::tier
    WHEN i % 4 = 2 THEN 'silver'::tier
    ELSE 'free'::tier
  END as tier,
  v.id as venue_id,
  'https://example.com/event-' || i as external_link,
  (NOW() - INTERVAL '7 days' - (random() * INTERVAL '3 days')) as created_at
FROM generate_series(1, 8) as i
JOIN venue_list v ON v.venue_num = (i % 10) + 1;

-- 14.4 Insert 12 upcoming events
WITH venue_ids AS (
  SELECT id, name FROM venues ORDER BY name LIMIT 10
),
venue_list AS (
  SELECT 
    id,
    name,
    ROW_NUMBER() OVER (ORDER BY name) as venue_num
  FROM venue_ids
)
INSERT INTO events (title, description, event_date, tier, venue_id, external_link)
SELECT 
  CASE 
    WHEN i <= 3 THEN 'Summer ' || v.name || ' Festival'
    WHEN i <= 6 THEN 'Business Expo ' || date_part('year', NOW())
    WHEN i <= 9 THEN 'Live Concert Series'
    ELSE 'Community Workshop'
  END as title,
  CASE 
    WHEN i <= 3 THEN 'Join us for our exciting summer festival at ' || v.name
    WHEN i <= 6 THEN 'Network with industry leaders at our annual expo'
    WHEN i <= 9 THEN 'Featuring top artists from around the country'
    ELSE 'Interactive learning sessions for all skill levels'
  END as description,
  (NOW() + (i * INTERVAL '2 days') + (random() * INTERVAL '5 days')) as event_date,
  CASE 
    WHEN i % 4 = 0 THEN 'platinum'::tier
    WHEN i % 4 = 1 THEN 'gold'::tier
    WHEN i % 4 = 2 THEN 'silver'::tier
    ELSE 'free'::tier
  END as tier,
  v.id as venue_id,
  'https://example.com/upcoming-event-' || i as external_link
FROM generate_series(1, 12) as i
JOIN venue_list v ON v.venue_num = (i % 10) + 1;






