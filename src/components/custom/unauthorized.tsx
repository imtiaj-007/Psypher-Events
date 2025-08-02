import React from 'react'

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { CalendarDays, LogIn, UserPlus } from "lucide-react";


export interface UnauthorizedModalProps {
    title: string;
    description: string;
}

export const UnauthorizedModal: React.FC<UnauthorizedModalProps> = ({ title, description }) => {
    return (
        <div className="w-full flex h-[50vh] items-center justify-center">
            <div className="max-w-md w-full m-auto border rounded-xl p-8 shadow-lg bg-background">
                <div className="flex flex-col items-center text-center gap-4">
                    <CalendarDays className="w-12 h-12 text-indigo-500" />
                    <h3 className="text-2xl font-bold">{title}</h3>
                    <p className="text-muted-foreground mb-4">{description}</p>
                    <div className="flex items-center gap-4">
                        <SignInButton>
                            <Button variant="outline">
                                <LogIn className="w-4 h-4" />
                                Sign In
                            </Button>
                        </SignInButton>
                        <SignUpButton>
                            <Button>
                                <UserPlus className="w-4 h-4" />
                                Sign Up
                            </Button>
                        </SignUpButton>
                    </div>
                </div>
            </div>
        </div>
    );
};
