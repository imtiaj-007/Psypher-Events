import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAllowedTiers } from '@/lib/utils';
import { Tiers } from '@/types/globals';


export async function GET(request: Request) {
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

export async function POST(request: Request) {
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
