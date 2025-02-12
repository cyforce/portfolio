import "./globals.css";
import Navbar from "@/components/front/Navbar";
import Starfield from "@/components/front/Starfield";
import Footer from "@/components/front/Footer";
import Providers from "./providers"; // ✅ Importer SessionProvider correctement
import { ReactNode } from "react";

export const metadata = {
    title: "Portfolio",
    description: "Portfolio de Célian",
    icons: {
        icon: "/favicon.ico", // ✅ Chemin correct pour Next.js
    },
};

interface RootLayoutProps {
    children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="fr" className="h-full">
        <body className="bg-gray-900 text-white font-sans flex flex-col min-h-screen overflow-y-auto">
        <Providers> {/* ✅ Encapsuler dans Providers pour éviter le mismatch */}
            {/* Fond étoilé */}
            <Starfield className="fixed top-0 left-0 w-full h-full z-10" />

            {/* Navbar */}
            <Navbar className="z-20" />

            {/* Conteneur principal */}
            <main className="min-h-[calc(100vh-3.45rem)] w-full mx-auto overflow-y-hidden z-10"
                  style={{ marginTop: "calc(3.45rem)" }}>
                {children}
            </main>

            {/* Footer */}
            <Footer />
        </Providers>
        </body>
        </html>
    );
}
