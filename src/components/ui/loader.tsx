'use client'

import { 
    PulseLoader,
    GridLoader,
    DotLoader,
    BounceLoader,
    CircleLoader,
    PacmanLoader 
} from "react-spinners";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";


interface LoaderProps {
    size?: number;
    color?: string;
    message?: string;
    className?: string;
    variant?: 'pulse' | 'grid' | 'dots' | 'bounce' | 'circle' | 'pacman';
}

export const Loader = ({
    size = 10,
    color,
    message,
    className,
    variant = 'pulse'
}: LoaderProps) => {
    const { theme } = useTheme();
    const loaderColor = color || (theme === 'dark' ? '#ffffff' : '#000000');

    const renderLoader = () => {
        switch (variant) {
            case 'grid':
                return <GridLoader color={loaderColor} size={size} />;
            case 'dots':
                return <DotLoader color={loaderColor} size={size} />;
            case 'bounce':
                return <BounceLoader color={loaderColor} size={size} />;
            case 'circle':
                return <CircleLoader color={loaderColor} size={size} />;
            case 'pacman':
                return <PacmanLoader color={loaderColor} size={size} />;
            case 'pulse':
            default:
                return <PulseLoader color={loaderColor} size={size} speedMultiplier={0.8} />;
        }
    };

    return (
        <div 
            className={cn(
                'w-full h-full p-4 flex flex-col items-center justify-center gap-4',
                className
            )}
        >
            {renderLoader()}
            {message && (
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {message}
                </p>
            )}
        </div>
    );
};
