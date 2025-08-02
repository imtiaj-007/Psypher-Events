import { useEffect, useState } from "react";
import { useUser as useClerkUser } from "@clerk/nextjs";
import { Tiers } from "@/types/globals";
import { tierRank } from "@/constants/user-constants";
import { updateUser } from "@/services/user-service";

interface UserData {
    id: string;
    fullName: string | null;
    email: string | null;
    metadata: Record<string, unknown>;
}

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
