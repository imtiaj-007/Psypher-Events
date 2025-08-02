import React from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Event } from '@/types/event';
import { cn } from '@/lib/utils';
import { tierColors } from '@/constants/user-constants';


interface EventCardProps {
    data: Event;
    pastEvent?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ data, pastEvent = false }) => {
    return (
        <Card className={cn(
            "hover:shadow-lg transition-shadow pt-0",
            pastEvent && "grayscale"
        )}>
            <div className="relative w-full h-32 mb-4">
                <Image
                    src={data.thumbnail ?? ''}
                    alt={data.title}
                    width={200}
                    height={200}
                    className='object-cover bg-gray-100 w-full h-full rounded-t-lg'
                    loading='lazy'
                />
                <Badge className={cn(
                    'absolute top-2 right-2 capitalize',
                    tierColors[data.tier]
                )}>
                    {data.tier}
                </Badge>
            </div>
            <CardHeader>
                <CardTitle className='text-sm'>{data.title}</CardTitle>
            </CardHeader>
            <CardContent className='text-sm mb-4'>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{data.description}</p>
                <div className="grid grid-cols-3 text-center text-muted-foreground">
                    <div className='space-y-1 border-r'>
                        <p>{
                            new Date(data.event_date).toLocaleDateString(
                                undefined,
                                { day: 'numeric', month: 'short' }
                            )}
                        </p>
                        <p  className='text-xs'>Date</p>
                    </div>
                    <div className='space-y-1 border-x'>
                        <p>20:00</p>
                        <p  className='text-xs'>Time</p>
                    </div>
                    <div className='space-y-1 border-l'>
                        <p>{Math.floor(Math.random() * 900) + 100}</p>
                        <p  className="text-xs">Joined</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button disabled={pastEvent} className='w-full'>{pastEvent ? 'Closed' : 'View'}</Button>
            </CardFooter>
        </Card>
    );
};
