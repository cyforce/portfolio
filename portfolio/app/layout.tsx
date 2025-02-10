"use client";

import './globals.css';
import Navbar from '@/components/front/Navbar';
import Starfield from '@/components/front/Starfield';
import Footer from "@/components/front/Footer";
import { ReactNode } from 'react';
import { SessionProvider } from "next-auth/react";

interface RootLayoutProps {
    children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="fr" className="h-full">
        <SessionProvider>
            <body className="bg-gray-900 text-white font-sans flex flex-col min-h-screen overflow-y-auto">
                {/* Fond étoilé derrière tout */}
                <Starfield className="fixed top-0 left-0 w-full h-full z-10" />

                {/* Navbar */}
                <Navbar className="z-20" />

                {/* Conteneur principal qui pousse le footer hors écran si nécessaire */}
                <main className="min-h-[calc(100vh-3.45rem)] w-full mx-auto overflow-y-hidden z-10" style={{ marginTop: 'calc(3.45rem)'}}>
                    {children}
                </main>

                {/* Footer qui doit apparaître seulement après un scroll */}
                <Footer className="" />
            </body>
        </SessionProvider>
        </html>
    );
}
