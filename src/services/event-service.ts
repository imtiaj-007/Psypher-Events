import axiosHandler from "@/lib/axios";
import { Event } from "@/types/event";
import { Tiers } from "@/types/globals";
import { isAxiosError } from "axios"


export const fetchEvents = async (
    tier: Tiers = 'free', search?: string, from?: Date, to?: Date, venue_id?: string
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