import React from 'react'
import Link from 'next/link'
import { Github, Instagram, Twitter } from 'lucide-react';


export const Footer: React.FC = () => {
    return (
        <footer className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-6 gap-8">
                <div className="space-y-4 col-span-1 lg:col-span-3">
                    <h3 className="text-xl font-bold">Psypher</h3>
                    <p className="text-sm opacity-80 max-w-md">
                        Psypher is revolutionizing digital interactions through cutting-edge technology and 
                        user-centric design.
                    </p>
                    <div className="flex space-x-6 pt-2">
                        <Link href="#" className="hover:text-[#6c47ff] transition">
                            <Instagram className='size-5' />
                        </Link>
                        <Link href="#" className="hover:text-[#6c47ff] transition">
                            <Github className='size-5' />
                        </Link>
                        <Link href="#" className="hover:text-[#6c47ff] transition">
                            <Twitter className='size-5' />
                        </Link>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <h4 className="font-semibold">Product</h4>
                    <ul className="space-y-2 text-sm opacity-80">
                        <li><Link href="#" className="hover:text-[#6c47ff] transition">Features</Link></li>
                        <li><Link href="#" className="hover:text-[#6c47ff] transition">Pricing</Link></li>
                        <li><Link href="#" className="hover:text-[#6c47ff] transition">API</Link></li>
                    </ul>
                </div>
                
                <div className="space-y-4">
                    <h4 className="font-semibold">Company</h4>
                    <ul className="space-y-2 text-sm opacity-80">
                        <li><Link href="#" className="hover:text-[#6c47ff] transition">About</Link></li>
                        <li><Link href="#" className="hover:text-[#6c47ff] transition">Careers</Link></li>
                        <li><Link href="#" className="hover:text-[#6c47ff] transition">Contact</Link></li>
                    </ul>
                </div>
                
                <div className="space-y-4">
                    <h4 className="font-semibold">Legal</h4>
                    <ul className="space-y-2 text-sm opacity-80">
                        <li><Link href="#" className="hover:text-[#6c47ff] transition">Privacy</Link></li>
                        <li><Link href="#" className="hover:text-[#6c47ff] transition">Terms</Link></li>
                        <li><Link href="#" className="hover:text-[#6c47ff] transition">Cookies</Link></li>
                    </ul>
                </div>
            </div>
            
            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[#ffffff10] text-sm opacity-70">
                <p>© {new Date().getFullYear()} Psypher. All rights reserved.</p>
            </div>
        </footer>
    );
};
