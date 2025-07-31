import { Tiers } from '@/types/globals';
import { createClient } from './server';

export async function getEventsForTier(tiers: Tiers[]) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('events')
        .select('*')
        .in('tier', tiers);

    if (error) throw new Error(error.message);
    return data;
}
