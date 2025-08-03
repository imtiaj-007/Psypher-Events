import { Tiers } from "@/types/globals";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names using `clsx` and merges them with Tailwind's `twMerge`.
 *
 * @param inputs - An array of class values (strings, arrays, objects, etc.) to be combined.
 * @returns The merged class name string.
 *
 * @example
 * ```ts
 * cn("p-2", { "bg-red-500": isError }, "text-lg");
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs))
};

/**
 * The order of tiers from lowest to highest.
 * Used for tier comparison and slicing.
 */
const TIER_ORDER: Tiers[] = ['free', 'silver', 'gold', 'platinum'];

/**
 * Returns an array of tiers that are accessible to a user with the given tier.
 *
 * @param userTier - The user's current tier.
 * @returns An array of allowed tiers, from 'free' up to the user's tier.
 *
 * @example
 * ```ts
 * getAllowedTiers('gold'); // ['free', 'silver', 'gold']
 * ```
 */
export function getAllowedTiers(userTier: Tiers): Tiers[] {
    const maxIndex = TIER_ORDER.indexOf(userTier);
    return TIER_ORDER.slice(0, maxIndex + 1);
};

/**
 * Gets the current date at midnight (start of today) in ISO string format.
 *
 * @returns The ISO string for today's date at 00:00:00.000.
 *
 * @example
 * ```ts
 * getTodayISO(); // "2024-06-07T00:00:00.000Z"
 * ```
 */
export const getTodayISO = (): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString();
};

/**
 * Gets the ISO string for the end of yesterday (23:59:59.999).
 *
 * @returns The ISO string for yesterday at 23:59:59.999.
 *
 * @example
 * ```ts
 * getYesterdayEndISO(); // "2024-06-06T23:59:59.999Z"
 * ```
 */
export const getYesterdayEndISO = (): string => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(23, 59, 59, 999);
    return yesterday.toISOString();
};
