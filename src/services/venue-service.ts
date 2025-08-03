import axiosHandler from "@/lib/axios";
import { Venue } from "@/types/venue";
import { isAxiosError } from "axios";

/**
 * Fetches a list of venues from the API.
 *
 * @returns A promise that resolves to an array of {@link Venue} objects.
 * @throws Throws an error if the request fails.
 */
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

/**
 * Creates a new venue by sending the venue data to the API.
 *
 * @param body - The {@link Venue} object containing venue details to create.
 * @returns A promise that resolves to the created {@link Venue} object.
 * @throws Throws an error if the request fails.
 */
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