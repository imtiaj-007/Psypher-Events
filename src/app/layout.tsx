import type { Metadata } from "next";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Layout } from "@/components/layout";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import "./globals.css";


const inter = Inter({
    variable: "--font-inter-latin",
    subsets: ["latin"],
    fallback: ["Helvetica", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
    title: "PsyEvents | Discover & Attend Exclusive Events",
    description: "Find, explore, and attend the best events in your city. PsyEvents offers exclusive access to concerts, galas, workshops, and more. Secure your spot and never miss out on unforgettable experiences.",
    keywords: [
        "events",
        "concerts",
        "galas",
        "workshops",
        "tickets",
        "exclusive events",
        "local events",
        "event discovery",
        "venues",
        "live music",
        "networking",
        "community"
    ],
    authors: [{ name: "SK Imtiaj Uddin", url: "https://sk-imtiaj-uddin.vercel.app/" }],
    creator: "SK Imtiaj Uddin",
    publisher: "SK Imtiaj Uddin",
    openGraph: {
        title: "PsyEvents | Discover & Attend Exclusive Events",
        description: "Find, explore, and attend the best events in your city. PsyEvents offers exclusive access to concerts, galas, workshops, and more.",
        url: "https://psypher-events.vercel.app/",
        siteName: "PsyEvents",
        images: [
            {
                url: "https://psypher-events.vercel.app/project-demo.png",
                width: 1200,
                height: 630,
                alt: "PsyEvents - Discover & Attend Exclusive Events",
            },
        ],
        locale: "en_IN",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "PsyEvents | Discover & Attend Exclusive Events",
        description: "Find, explore, and attend the best events in your city. PsyEvents offers exclusive access to concerts, galas, workshops, and more.",
        site: "@PsyEvents",
        creator: "@SKImtiajUddin",
        images: ["https://psypher-events.vercel.app/project-demo.png"],
    },
    metadataBase: new URL("https://psypher-events.vercel.app/"),
    alternates: {
        canonical: "/",
    },
    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <head>
                    <Script
                        id="schema-structured-data"
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "WebSite",
                                "name": "PsyEvents",
                                "alternateName": "Psypher Events",
                                "url": "https://psypher-events.vercel.app/",
                                "description": "Find, explore, and attend the best events in your city. PsyEvents offers exclusive access to concerts, galas, workshops, and more. Secure your spot and never miss out on unforgettable experiences.",
                                "publisher": {
                                    "@type": "Person",
                                    "name": "SK Imtiaj Uddin",
                                    "url": "https://sk-imtiaj-uddin.vercel.app/"
                                },
                                "image": "https://psypher-events.vercel.app/project-demo.png",
                                "potentialAction": {
                                    "@type": "SearchAction",
                                    "target": "https://psypher-events.vercel.app/search?q={search_term_string}",
                                    "query-input": "required name=search_term_string"
                                }
                            }),
                        }}
                    />
                </head>
                <body
                    className={`${inter.variable} antialiased`}
                    style={{ fontFamily: "var(--font-inter-latin)", fontWeight: 400 }}
                >
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem
                    >
                        <Toaster richColors />
                        <Layout>
                            {children}
                        </Layout>
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}