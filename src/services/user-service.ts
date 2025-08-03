import axiosHandler from "@/lib/axios";
import { Tiers } from "@/types/globals";
import { isAxiosError } from "axios";


export const updateUser = async (
    body: {
        id: string,
        tier: Tiers,
        extra?: Record<string, unknown>
    }
): Promise<Event> => {
    try {
        const res = await axiosHandler.post(`/users`, body);
        return res.data;

    } catch (error) {
        if (isAxiosError(error))
            console.error(error.message);
        throw new Error('Failed to create event');
    }
};