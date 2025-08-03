import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAllowedTiers } from '@/lib/utils';
import { Tiers } from '@/types/globals';

/**
 * Handles GET requests to fetch events from the database.
 *
 * This endpoint supports filtering events by user tier, date range, venue, and search query.
 * It uses Supabase as the backend and applies RLS (Row Level Security) based on the user's tier.
 *
 * @param request - The incoming HTTP request object.
 *   - Query parameters:
 *     - `tier` (optional): The user's access tier (e.g., 'free', 'silver', 'gold', 'platinum'). Defaults to 'free'.
 *     - `from` (optional): ISO date string to filter events starting from this date.
 *     - `to` (optional): ISO date string to filter events up to this date.
 *     - `venue_id` (optional): The ID of the venue to filter events by venue.
 *     - `search` (optional): A search string to filter events by title or description.
 *
 * @returns {Promise<NextResponse>} A JSON response containing the filtered events or an error message.
 *
 * @example
 * // Fetch events for 'gold' tier users, searching for "music" in June 2025
 * GET /api/events?tier=gold&search=music&from=2025-06-01&to=2025-06-30
 */
export async function GET(request: Request): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const tier = searchParams.get('tier') || 'free';
        const from = searchParams.get('from');
        const to = searchParams.get('to');
        const venue_id = searchParams.get('venue_id');
        const search = searchParams.get('search');

        const validTiers = getAllowedTiers(tier as Tiers);

        const supabase = await createClient();
        let query = supabase
            .from('events')
            .select('*')
            .order('event_date', { ascending: true });

        if (tier) query = query.in('tier', validTiers);
        if (from) query = query.gte('event_date', from);
        if (to) query = query.lte('event_date', to);
        if (venue_id) query = query.eq('venue_id', venue_id);
        if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);

        const { data, error } = await query;

        if (error) {
            console.log(error)
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json(data);

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}

/**
 * Handles POST requests to create a new event in the database.
 *
 * This endpoint expects a JSON body containing the event details.
 * The event is inserted into the 'events' table using Supabase.
 *
 * @param request - The incoming HTTP request object.
 *   - Body: A JSON object representing the event to create.
 *
 * @returns {Promise<NextResponse>} A JSON response containing the created event or an error message.
 *
 * @example
 * // Create a new event
 * POST /api/events
 * {
 *   "title": "Psypher Music Night",
 *   "description": "A night of music and fun.",
 *   "event_date": "2025-07-01T19:00:00.000Z",
 *   "tier": "gold",
 *   "venue_id": "some-venue-uuid",
 *   "thumbnail": "https://example.com/image.jpg"
 * }
 */
export async function POST(request: Request): Promise<NextResponse> {
    try {
        const supabase = await createClient();
        const body = await request.json();

        const { data, error } = await supabase
            .from('events')
            .insert(body)
            .select();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json(data, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
