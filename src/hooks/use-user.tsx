import { useEffect, useState } from "react";
import { useUser as useClerkUser } from "@clerk/nextjs";
import { Tiers } from "@/types/globals";
import { tierRank } from "@/constants/user-constants";
import { updateUser } from "@/services/user-service";

/**
 * Represents the shape of user data returned by the `useUser` hook.
 */
export interface UserData {
    /** The unique identifier of the user. */
    id: string;
    /** The user's full name, or null if not available. */
    fullName: string | null;
    /** The user's primary email address, or null if not available. */
    email: string | null;
    /** The user's public metadata as a key-value object. */
    metadata: Record<string, unknown>;
}

/**
 * Custom React hook for accessing and managing the authenticated user's data and tier.
 *
 * This hook wraps Clerk's `useUser` and provides additional helpers for updating
 * user metadata and tier, as well as loading and authentication state.
 *
 * @returns An object containing:
 * - `user`: The current user's data, or null if not loaded or not signed in.
 * - `userTier`: The user's current tier, or null if not loaded.
 * - `isLoading`: Whether the user data is still loading.
 * - `isAuthenticated`: Whether the user is signed in.
 * - `updateMetadata`: Function to update the user's public metadata.
 * - `updateUserTier`: Function to upgrade the user's tier (only to a higher tier).
 *
 * @example
 * ```tsx
 * const { user, userTier, isLoading, isAuthenticated, updateMetadata, updateUserTier } = useUser();
 * ```
 */
export const useUser = () => {
    const { user, isLoaded, isSignedIn } = useClerkUser();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [userTier, setUserTier] = useState<Tiers | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoaded) return;

        if (isSignedIn && user) {
            setUserData({
                id: user.id,
                fullName: user.fullName,
                email: user.primaryEmailAddress?.emailAddress || null,
                metadata: user.publicMetadata,
            });
            setUserTier(user.publicMetadata.tier as Tiers);
        } else {
            setUserData(null);
        }
        setLoading(false);
    }, [isLoaded, isSignedIn, user]);

    /**
     * Upgrades the user's tier to a higher level.
     *
     * Only allows upgrades (not downgrades). If the requested tier is not higher than the current tier,
     * the function does nothing.
     *
     * @param tier - The new tier to upgrade to.
     * @returns The new tier if successful, `false` if the update failed, or `undefined` if not allowed.
     */
    const updateUserTier = async (tier: Tiers) => {
        if(!user || !userTier) return;
        if (tierRank[tier] <= tierRank[userTier]) return;

        try {            
            await updateUser({ id: user.id, tier: tier });
            setUserTier(tier);
            return tier;
        } catch (error) {
            console.error("Failed to update metadata:", error);
            return false;
        }
    }

    /**
     * Updates the user's public metadata.
     *
     * @param metadata - A key-value object to set as the user's public metadata.
     * @returns `true` if successful, `false` if the update failed, or `undefined` if not allowed.
     */
    const updateMetadata = async (metadata: Record<string, unknown>) => {
        if (!user) return;

        try {
            await user.update({ unsafeMetadata: metadata });
            setUserData(prev => prev ? { ...prev, metadata } : null);
            return true;
        } catch (error) {
            console.error("Failed to update metadata:", error);
            return false;
        }
    };

    return {
        user: userData,
        userTier,
        isLoading: loading,
        isAuthenticated: isSignedIn,
        updateMetadata,
        updateUserTier,
    };
};
