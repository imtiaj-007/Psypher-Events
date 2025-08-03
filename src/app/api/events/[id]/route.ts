import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Handles GET requests to fetch a single event by its unique identifier.
 *
 * This endpoint retrieves an event from the 'events' table in the database using the provided event ID.
 * It uses Supabase as the backend and returns the event data as JSON if found, or an error message if not found.
 *
 * @param request - The incoming HTTP request object.
 * @param params - An object containing the route parameters, specifically the event `id`.
 *   - `id`: The unique identifier of the event to fetch.
 *
 * @returns {Promise<NextResponse>} A JSON response containing the event data if found,
 * or an error message with a 404 status if not found, or a 500 status for unexpected errors.
 *
 * @example
 * // Fetch an event with a specific ID
 * GET /api/events/123e4567-e89b-12d3-a456-426614174000
 */
export async function GET(
    request: NextRequest, 
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try {
        const id = (await params).id;
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 404 });
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
