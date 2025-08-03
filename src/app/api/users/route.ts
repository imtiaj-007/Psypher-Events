import { NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server';


export async function POST(request: Request) {
    try {
        const client = await clerkClient();
        const body = await request.json();

        const res = await client.users.updateUserMetadata(body.id as string, {
            publicMetadata: { tier: body.tier },
        })
        return NextResponse.json(res, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
