import React from 'react'
import { Header } from './header'
import { Footer } from './footer'

interface LayoutProps {
    children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
};
