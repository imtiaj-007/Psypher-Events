import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Handles GET requests to fetch all venues from the database.
 *
 * This endpoint retrieves all venues from the 'venues' table, ordered by name in ascending order.
 * It uses Supabase as the backend and returns the venue data as JSON if successful,
 * or an error message with a 500 status if the request fails.
 *
 * @returns {Promise<NextResponse>} A JSON response containing the list of venues or an error message.
 *
 * @example
 * // Fetch all venues
 * GET /api/venues
 */
export async function GET(): Promise<NextResponse> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('venues')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
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
 * Handles POST requests to create a new venue in the database.
 *
 * This endpoint expects a JSON body containing the venue details.
 * The venue is inserted into the 'venues' table using Supabase.
 *
 * @param request - The incoming HTTP request object.
 *   - Body: A JSON object representing the venue to create.
 *
 * @returns {Promise<NextResponse>} A JSON response containing the created venue or an error message.
 *
 * @example
 * // Create a new venue
 * POST /api/venues
 * {
 *   "name": "The Music Hall",
 *   "address_line_1": "123 Main St",
 *   "city": "New York",
 *   "rating": 4.5
 * }
 */
export async function POST(request: Request): Promise<NextResponse> {
    try {
        const supabase = await createClient();
        const body = await request.json();
        
        const { data, error } = await supabase
            .from('venues')
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
