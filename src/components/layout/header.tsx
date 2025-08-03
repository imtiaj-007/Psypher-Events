'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Menu, X } from 'lucide-react';
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
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="sticky top-0 left-0 w-full bg-slate-950/90 border-b border-slate-800 backdrop-blur-xl z-10">
            <div className="max-w-7xl w-full m-auto flex flex-col md:flex-row items-center justify-between p-4">
                <div className="w-full md:w-auto flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 font-bold text-lg sm:text-xl"
                    >
                        <Sparkles className='size-6 text-indigo-500' />
                        <span className='bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent'>Psypher</span>
                    </Link>
                    
                    <button 
                        className="md:hidden text-white"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                <div className={`${isOpen ? 'block' : 'hidden'} md:block w-full md:w-auto mt-4 md:mt-0`}>
                    <div className="border rounded-full px-6 py-1.5"><Navbar /></div>
                </div>

                <div className={`${isOpen ? 'flex' : 'hidden'} md:flex items-center gap-2 mt-4 md:mt-0`}>
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
