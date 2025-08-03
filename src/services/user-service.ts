import axiosHandler from "@/lib/axios";
import { Tiers } from "@/types/globals";
import { isAxiosError } from "axios";

/**
 * Updates a user's information, including their tier and any extra fields.
 *
 * @param body - An object containing the user's id, new tier, and optional extra fields.
 * @param body.id - The unique identifier of the user to update.
 * @param body.tier - The new tier to assign to the user (e.g., 'free', 'silver', 'gold', 'platinum').
 * @param body.extra - (Optional) Additional fields to update for the user.
 * @returns A promise that resolves to the updated user object.
 * @throws Throws an error if the request fails.
 */
export const updateUser = async (
    body: {
        id: string,
        tier: Tiers,
        extra?: Record<string, unknown>
    }
): Promise<unknown> => {
    try {
        const res = await axiosHandler.post(`/users`, body);
        return res.data;
    } catch (error) {
        if (isAxiosError(error))
            console.error(error.message);
        throw new Error('Failed to update user');
    }
};