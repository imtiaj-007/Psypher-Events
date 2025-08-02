'use client'

import { useCallback, useEffect, useState } from "react";
import { Loader } from "@/components/ui/loader";
import { FiltersSection } from "@/components/ui/filters";
import UpgradeAlert from "@/components/modals/upgrade-alert";
import { UnauthorizedModal } from "@/components/modals/unauthorized";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { filterConfig, tabConfig } from "@/constants/filter-constants";
import { getTodayISO, getYesterdayEndISO } from "@/lib/utils";
import { fetchEvents } from "@/services/event-service";
import { useUser } from "@/hooks/use-user";
import { Event } from "@/types/event";
import { debounce } from "lodash";


interface Filters {
    tier?: string;
    search?: string;
    from?: string;
    to?: string;
    venue_id?: string;
    tab?: 'upcoming' | 'past';
};

const Events: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [filters, setFilters] = useState<Filters>({
        search: '',
        from: undefined,
        to: undefined,
        venue_id: undefined,
        tab: 'upcoming'
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const { isAuthenticated, userTier } = useUser();

    const getEffectiveDateFilters = useCallback(() => {
        const todayISO = getTodayISO();
        const yesterdayEndISO = getYesterdayEndISO();

        if (filters.tab === 'upcoming') {
            const effectiveFrom = filters.from && filters.from > todayISO
                ? filters.from
                : todayISO;
            const effectiveTo = filters.to;
            return { from: effectiveFrom, to: effectiveTo };
        } else {
            const effectiveTo = filters.to && filters.to < yesterdayEndISO
                ? filters.to
                : yesterdayEndISO;
            const effectiveFrom = filters.from;
            return { from: effectiveFrom, to: effectiveTo };
        }
    }, [filters.tab, filters.from, filters.to]);

    const debouncedGetEvents = useCallback(
        debounce(async () => {
            if (!userTier) return;
            try {
                setLoading(true);
                const { from, to } = getEffectiveDateFilters();
                const res = await fetchEvents(
                    userTier, filters.search, from, to, filters.venue_id
                );
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
        }, 300),
        [filters, userTier, getEffectiveDateFilters]
    );

    const getEvents = useCallback(() => {
        debouncedGetEvents();
    }, [debouncedGetEvents]);

    useEffect(() => {
        if (userTier) {
            getEvents();
        }
    }, [getEvents, userTier]);

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
            <h1 className="text-xl font-bold mb-6">Events</h1>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <aside className="col-span-full lg:col-span-3">
                    <FiltersSection<Filters>
                        filters={filterConfig}
                        initialValues={filters}
                        onFilterChange={setFilters}
                        tabOptions={tabConfig}
                    />
                </aside>
                <div className="col-span-full lg:col-span-9">
                    <UpgradeAlert />

                    {loading ?
                        <Loader variant="grid" message="Loading... Please wait" />
                        : error
                            ? <div>TODO: error component</div>
                            :
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
                    }
                </div>
            </div>
        </div>
    )
};

export default Events;