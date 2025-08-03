import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CountDown } from "@/components/ui/count-down";
import { ArrowRight } from "lucide-react";


export default function Home() {
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
                                eventDate={new Date(
                                    Date.now() + 2 * 24 * 60 * 60 * 1000
                                ).toISOString().split('T')[0]}
                                eventTime="20:00:00" />
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
