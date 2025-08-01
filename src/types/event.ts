import { Tiers } from "@/types/globals";

export interface Event {
    id: string;
    title: string;
    description: string;
    event_date: string;
    thumbnail: string;
    tier: Tiers;
    venue_id?: string;
    external_link?: string;
    created_at: string;
    updated_at?: string;
};
