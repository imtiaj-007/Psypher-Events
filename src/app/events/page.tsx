'use client'

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UnauthorizedModal } from "@/components/modals/unauthorized";
import { fetchEvents } from "@/services/event-service";
import { useUser } from "@/hooks/use-user";
import { Event } from "@/types/event";
import UpgradeAlert from "@/components/modals/upgrade-alert";


const Events: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const { isAuthenticated, userTier } = useUser();

    const getEvents = async () => {
        try {
            setLoading(true);
            const res = await fetchEvents(userTier);
            setEvents(res);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Unexpected error getting events."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getEvents();
    }, [userTier]);

    if (!isAuthenticated) {
        return (
            <UnauthorizedModal
                title="Exclusive Events Await"
                description="Sign in to discover and join our exciting events"
            />
        );
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Events</h1>

            <UpgradeAlert />

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {events.map((event) => (
                    <Card key={event.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle>{event.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">{event.description}</p>
                            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                                <span>Date: {new Date(event.event_date).toLocaleDateString()}</span>
                                <span>Tier: {event.tier}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
};

export default Events;