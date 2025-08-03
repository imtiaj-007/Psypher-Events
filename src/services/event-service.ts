import axiosHandler from "@/lib/axios";
import { Event } from "@/types/event";
import { Tiers } from "@/types/globals";
import { isAxiosError } from "axios";

/**
 * Fetches a list of events from the API, filtered by tier and optional search parameters.
 *
 * @param tier - The user's access tier (e.g., 'free', 'silver', 'gold', 'platinum').
 * @param search - (Optional) A search string to filter events by title or description.
 * @param from - (Optional) The start date (ISO string) to filter events from.
 * @param to - (Optional) The end date (ISO string) to filter events to.
 * @param venue_id - (Optional) The ID of the venue to filter events by venue.
 * @returns A promise that resolves to an array of {@link Event} objects.
 * @throws Throws an error if the request fails.
 */
export const fetchEvents = async (
    tier: Tiers, search?: string, from?: string, to?: string, venue_id?: string
): Promise<Event[]> => {
    try {
        const res = await axiosHandler.get(`/events`, {
            params: {
                tier, 
                ...(search && { search }), 
                ...(from && { from }),
                ...(to && { to }),
                ...(venue_id && { venue_id })
            }
        });
        return res.data;

    } catch (error) {
        if (isAxiosError(error))
            console.error(error.message);
        throw new Error('Failed to fetch events');
    }
};

/**
 * Fetches a single event by its unique identifier.
 *
 * @param id - The unique identifier of the event to fetch.
 * @returns A promise that resolves to the {@link Event} object.
 * @throws Throws an error if the request fails or the event is not found.
 */
export const fetchEventById = async (id: string): Promise<Event> => {
    try {
        const res = await axiosHandler.get(`/events/${id}`);
        return res.data;

    } catch (error) {
        if (isAxiosError(error))
            console.error(error.message);
        throw new Error(`Failed to fetch event with id: ${id}`);
    }
};

/**
 * Creates a new event by sending the event data to the API.
 *
 * @param body - The {@link Event} object containing event details to create.
 * @returns A promise that resolves to the created {@link Event} object.
 * @throws Throws an error if the request fails.
 */
export const createEvent = async (body: Event): Promise<Event> => {
    try {
        const res = await axiosHandler.post(`/events`, body);
        return res.data;

    } catch (error) {
        if (isAxiosError(error))
            console.error(error.message);
        throw new Error('Failed to create event');
    }
};