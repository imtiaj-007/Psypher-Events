"use client"

import React from "react"
import Link from "next/link"
import { Music, Film, Camera } from "lucide-react"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

const eventTypes: { title: string; href: string; icon: React.ReactNode }[] = [
    {
        title: "Concert",
        href: "/events",
        icon: <Music className="w-4 h-4" />,
    },
    {
        title: "Festival",
        href: "/events",
        icon: <Film className="w-4 h-4" />,
    },
    {
        title: "Business Expo",
        href: "/events",
        icon: <Camera className="w-4 h-4" />,
    },
]

export const Navbar: React.FC = () => {
    return (
        <NavigationMenu viewport={false}>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent hover:bg-gray-900 text-white">Home</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                    <Link
                                        className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                                        href="/"
                                    >
                                        <div className="mt-4 mb-2 text-lg font-medium">
                                            Psypher Events
                                        </div>
                                        <p className="text-muted-foreground text-sm leading-tight">
                                            Beautifully designed events portal built with shadcn & Tailwind CSS.
                                        </p>
                                    </Link>
                                </NavigationMenuLink>
                            </li>
                            <ListItem href="/" title="Events">
                                Find events, concerts and business expo around the Globe.
                            </ListItem>
                            <ListItem href="/" title="Venues">
                                List of all popular venues and event ground with details.
                            </ListItem>
                            <ListItem href="/" title="Ticket">
                                Links, location & complete information about event tickets.
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent hover:bg-gray-900 text-white">Events</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                            {eventTypes.map((event) => (
                                <ListItem
                                    key={event.title}
                                    title={event.title}
                                    href={event.href}
                                >
                                    {event.title} events near you
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), 'bg-transparent text-white')}>
                        <Link href="/venues">Venues</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), 'bg-transparent text-white')}>
                        <Link href="/tickets">My Tickets</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
};

export const ListItem = ({
    title,
    children,
    href,
    ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) => {
    return (
        <li {...props}>
            <NavigationMenuLink asChild>
                <Link href={href}>
                    <div className="text-sm leading-none font-medium">{title}</div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    );
};
