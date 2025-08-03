import React from 'react'
import Link from 'next/link'
import { Ghost, Home, Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'


export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 dark:bg-gray-700/90 p-4">
            <div className="max-w-2xl w-full grid grid-cols-1 md:grid-cols-2 text-center">
                <div className="w-72 h-72 bg-gray-100 dark:bg-gray-600 border rounded-full p-6">
                    <div className="flex flex-col gap-6 justify-center text-gray-700 dark:text-gray-300">
                        <Ghost className="size-20 mx-auto" />
                        <h1 className="text-5xl font-bold">404</h1>
                        <h2 className="text-2xl font-semibold">Page Not Found</h2>
                    </div>
                </div>

                <div className="space-y-6 flex flex-col justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        The page you&apos;re looking for doesn&apos;t exist, coming soon or has been moved.
                    </p>
                    <div className="flex gap-4 justify-center pt-6">
                        <Link href="/">
                            <Button className="gap-2">
                                <Home className="h-4 w-4" />
                                Go Home
                            </Button>
                        </Link>
                        <Link href="/events">
                            <Button variant="outline" className="gap-2">
                                <Compass className="h-4 w-4" />
                                Browse Events
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
