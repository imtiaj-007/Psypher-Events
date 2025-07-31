import { auth, currentUser, User } from '@clerk/nextjs/server';
import { Tiers } from '@/types/globals';


export const getUser = async (): Promise<User> => {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error('User not authenticated');
        }

        const user = await currentUser();
        if (!user) {
            throw new Error('User not found');
        }
        return user;

    } catch (error) {
        console.error('Error getting user:', error);
        throw error;
    }
}

export const getUserTier = async (): Promise<Tiers> => {
    try {
        const user = await getUser();
        if (!user?.publicMetadata?.tier) {
            throw new Error('Tier not found in session claims');
        }
        return user.publicMetadata.tier as Tiers;

    } catch (error) {
        console.error('Error getting user tier:', error);
        throw error;
    }
}