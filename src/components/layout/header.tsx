'use client'

import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/navbar';
import { ThemeToggle } from '@/components/theme/theme-toggle';


export const Header: React.FC = () => {
    return (
        <header className="w-full flex h-20 backdrop-blur-lg border-b z-10">
            <div className="max-w-7xl w-full m-auto flex items-center justify-between p-4">
                <div className="logo">
                    <Link
                        href="/"
                        className="flex items-center gap-2 font-bold text-lg sm:text-xl"
                    >
                        <Sparkles className='size-6 text-indigo-500' />
                        <span className='bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent'>Psypher</span>
                    </Link>
                </div>

                <div className="border rounded-full px-6 py-1.5"><Navbar /></div>

                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <SignedOut>
                        <SignInButton><Button variant="outline">Sign In</Button></SignInButton>
                        <SignUpButton><Button>Sign Up</Button></SignUpButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </div>
        </header>
    );
};
