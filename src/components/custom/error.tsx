import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
    title?: string;
    description?: string;
    onRetry?: () => void;
    className?: string;
}

export const ErrorComponent: React.FC<ErrorProps> = ({
    title = "Something went wrong",
    description = "We encountered an unexpected error. Please try again.",
    onRetry,
    className = ""
}) => {
    return (
        <div className={`flex flex-col items-center justify-center w-full h-full p-4 ${className}`}>
            <div className="flex flex-col items-center text-center max-w-md gap-4">
                <AlertTriangle className="w-12 h-12 text-destructive" />
                <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{title}</h3>
                    <p className="text-muted-foreground">{description}</p>
                </div>
                {onRetry && (
                    <Button
                        variant="outline"
                        onClick={onRetry}
                        className="mt-2"
                    >
                        Try Again
                    </Button>
                )}
            </div>
        </div>
    );
};
