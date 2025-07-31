import { Tiers } from "@/types/globals";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const TIER_ORDER: Tiers[] = ['free', 'silver', 'gold', 'platinum'];

export function getAllowedTiers(userTier: Tiers) {
    const maxIndex = TIER_ORDER.indexOf(userTier);
    return TIER_ORDER.slice(0, maxIndex + 1);
}
