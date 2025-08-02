import axiosHandler from "@/lib/axios";
import { Venue } from "@/types/venue";
import { isAxiosError } from "axios"


export const fetchVenues = async (): Promise<Venue[]> => {
    try {
        const res = await axiosHandler.get(`/venues`);
        return res.data;

    } catch (error) {
        if (isAxiosError(error))
            console.error(error.message);
        throw new Error('Failed to fetch venues');
    }
};

export const createVenue = async (body: Venue): Promise<Venue> => {
    try {
        const res = await axiosHandler.post(`/venues`, body);
        return res.data;

    } catch (error) {
        if (isAxiosError(error))
            console.error(error.message);
        throw new Error('Failed to create venue');
    }
};