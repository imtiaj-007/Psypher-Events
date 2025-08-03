export interface Venue {
    id: string;
    name: string;
    address_line_1: string;
    address_line_2?: string;
    city?: string;
    rating?: number;
    reviews?: number;
    google_link?: string;
    map_image_url?: string;
    created_at: string;
    updated_at?: string;
};
