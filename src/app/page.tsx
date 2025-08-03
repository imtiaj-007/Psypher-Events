/**
 * @fileoverview Home page for the PsyEvents platform.
 * @module app/page
 * 
 * @remarks
 * This page serves as the landing page for the PsyEvents application. It features a hero section with a call-to-action,
 * a countdown timer for an upcoming event, and promotional content to encourage users to explore events.
 * 
 * @example
 * // Usage in Next.js app
 * import Home from './page';
 * 
 * export default function HomePage() {
 *   return <Home />;
 * }
 */

import Link from "next/link";
import { JSX } from "react";
import { Button } from "@/components/ui/button";
import { CountDown } from "@/components/ui/count-down";
import { ArrowRight } from "lucide-react";

/**
 * Home page component.
 * 
 * @component
 * @returns {JSX.Element} The rendered home/landing page.
 * 
 * @remarks
 * - Features a hero section with a background image, headline, and description.
 * - Includes a prominent "Get Started" button linking to the events page.
 * - Displays a countdown timer for a featured upcoming event.
 * - Offers a "Claim Offer" button for free event passes.
 */
export default function Home(): JSX.Element {
    return (
        <section className="w-full h-screen bg-[url('/block-bg.jpg')] bg-cover bg-center bg-no-repeat">
            <div className="max-w-7xl w-full mx-auto py-20 flex flex-col items-center justify-center gap-6">

                <div className="max-w-5xl space-y-8 text-center text-white p-6">
                    <span className="bg-gray-50 font-medium text-gray-900 inline-block px-4 py-2 rounded-full">
                        Top Notch Events Platform
                    </span>
                    <h1 className="text-3xl md:text-5xl lg:text-7xl font-medium leading-20">
                        Uncover The Ultimate <br />
                        Events & Webinar Platform
                    </h1>
                    <p className="text-lg">
                        Initiating a business venture may appear overwhelming, yet our <br />
                        forty lies in simplifying the entire process for you.
                    </p>
                    <Link href='/events' className="inline-block">
                        <Button className="h-12 w-40 bg-neutral-900 text-white hover:bg-neutral-800 text-base justify-between rounded-full pr-2">
                            Get Started
                            <span className="w-8 h-8 bg-yellow-300 rounded-full p-2">
                                <ArrowRight className="size-4 text-gray-900" />
                            </span>
                        </Button>
                    </Link>

                    <div className="bg-neutral-900/90 border rounded-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <CountDown
                                /**
                                 * The eventDate prop is set to two days from the current date, formatted as YYYY-MM-DD.
                                 */
                                eventDate={new Date(
                                    Date.now() + 2 * 24 * 60 * 60 * 1000
                                ).toISOString().split('T')[0]}
                                /**
                                 * The eventTime prop is set to 20:00:00 (8 PM).
                                 */
                                eventTime="20:00:00"
                            />
                            <div className="space-y-1 my-auto">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p>Catch Us Live</p>
                                        <p>Get your free event passes!</p>
                                    </div>
                                    <Link href='/events'>
                                        <Button>Claim Offer</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
