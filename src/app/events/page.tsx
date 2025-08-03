/**
 * @fileoverview Events page for displaying, filtering, and browsing events.
 * @module app/events/page
 * @remarks
 * This page is a client-side React component that allows authenticated users to browse, filter, and view events.
 * It supports filtering by search, date range, venue, and event tier, and separates events into "upcoming" and "past" tabs.
 * 
 * @example
 * // Usage in Next.js app
 * import Events from './events/page';
 * 
 * export default function EventsPage() {
 *   return <Events />;
 * }
 */

'use client'

import { useCallback, useEffect, useState } from "react";
import { Loader } from "@/components/ui/loader";
import { FiltersSection } from "@/components/ui/filters";
import { EventCard } from "@/components/cards/event-card";
import { ErrorComponent } from "@/components/custom/error";
import UpgradeAlert from "@/components/custom/upgrade-alert";
import { UnauthorizedModal } from "@/components/custom/unauthorized";
import { filterConfig, tabConfig } from "@/constants/filter-constants";
import { getTodayISO, getYesterdayEndISO } from "@/lib/utils";
import { fetchEvents } from "@/services/event-service";
import { useUser } from "@/hooks/use-user";
import { Event } from "@/types/event";
import { debounce } from "lodash";

/**
 * Filters interface for event filtering.
 * @typedef {Object} Filters
 * @property {string} [tier] - Event tier filter (free, silver, gold, platinum)
 * @property {string} [search] - Search query for event title/description
 * @property {string} [from] - Start date (ISO string)
 * @property {string} [to] - End date (ISO string)
 * @property {string} [venue_id] - Venue ID filter
 * @property {'upcoming'|'past'} [tab] - Tab selection for event time
 */
interface Filters {
    tier?: string;
    search?: string;
    from?: string;
    to?: string;
    venue_id?: string;
    tab?: 'upcoming' | 'past';
};

/**
 * Events page component.
 * 
 * @component
 * @returns {JSX.Element} The rendered events page.
 * 
 * @remarks
 * - Only accessible to authenticated users.
 * - Fetches events based on user tier and filters.
 * - Shows loader, error, or event cards as appropriate.
 * - Prompts unauthenticated users to sign in.
 */
const Events: React.FC = () => {
    /**
     * List of events to display.
     */
    const [events, setEvents] = useState<Event[]>([]);
    /**
     * Current filter state.
     */
    const [filters, setFilters] = useState<Filters>({
        search: '',
        from: undefined,
        to: undefined,
        venue_id: undefined,
        tab: 'upcoming'
    });
    /**
     * Loading state for fetching events.
     */
    const [loading, setLoading] = useState<boolean>(false);
    /**
     * Error message, if any.
     */
    const [error, setError] = useState<string>('');

    /**
     * User authentication and tier information.
     */
    const { isAuthenticated, userTier } = useUser();

    /**
     * Computes effective date filters based on tab and user input.
     * @returns {{from?: string, to?: string}} Effective date range for filtering.
     */
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

    /**
     * Debounced function to fetch events from the API.
     * @function
     */
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

    /**
     * Triggers the debounced event fetch.
     * @function
     */
    const getEvents = useCallback(() => {
        debouncedGetEvents();
    }, [debouncedGetEvents]);

    /**
     * Effect to fetch events when filters or user tier change.
     */
    useEffect(() => {
        if (userTier) {
            getEvents();
        }
    }, [getEvents, userTier]);

    // Show sign-up modal if user is not authenticated
    if (!isAuthenticated) {
        return (
            <UnauthorizedModal
                title="Exclusive Events Await"
                description="Sign in to discover and join our exciting events"
            />
        );
    };

    // Main render
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
                            ? <ErrorComponent />
                            : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {events.map((event) => (
                                        <EventCard
                                            key={event.id}
                                            data={event}
                                            pastEvent={filters.tab === 'past'}
                                        />
                                    ))}
                                </div>
                            )}
                </div>
            </div>
        </div>
    )
};

export default Events;