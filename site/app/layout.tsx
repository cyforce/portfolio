// app/layout.tsx
import './globals.css';
import Navbar from '../components/Navbar';
import Starfield from '../components/Starfield'; // Import du composant étoilé
import { ReactNode } from 'react';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr">
      <body className="bg-gray-900 text-white font-sans flex flex-col min-h-screen">
        <Starfield /> {/* Ajout du fond étoilé */}
        <Navbar />
        <main className="flex-grow p-6 mt-8">
          {children}
        </main>
      </body>
    </html>
  );
}
