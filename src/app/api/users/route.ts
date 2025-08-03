import { NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'

/**
 * Handles POST requests to update a user's public metadata (specifically the user's tier) in Clerk.
 *
 * This endpoint expects a JSON body containing the user's unique identifier (`id`) and the new `tier` value.
 * It uses Clerk's server SDK to update the user's public metadata.
 *
 * @param request - The incoming HTTP request object.
 *   - Body: A JSON object with the following properties:
 *     - `id`: The unique identifier of the user to update.
 *     - `tier`: The new tier to assign to the user (e.g., 'free', 'silver', 'gold', 'platinum').
 *
 * @returns {Promise<NextResponse>} A JSON response containing the updated user object if successful,
 * or an error message with a 500 status if the update fails.
 *
 * @example
 * // Update a user's tier
 * POST /api/users
 * {
 *   "id": "user_123",
 *   "tier": "gold"
 * }
 */
export async function POST(request: Request): Promise<NextResponse> {
    try {
        const client = await clerkClient();
        const body = await request.json();

        const res = await client.users.updateUserMetadata(body.id as string, {
            publicMetadata: { tier: body.tier },
        });
        return NextResponse.json(res, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
