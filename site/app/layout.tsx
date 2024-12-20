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
      <body className="bg-gray-900 text-white font-sans flex flex-col min-h-screen relative">
        {/* Fond étoilé positionné derrière tout le reste */}
        <Starfield className="absolute top-0 left-0 w-full h-full z-0" />
        
        {/* Navbar et autres composants au-dessus */}
        <Navbar className="z-10" />
        
        <main className="flex-grow p-6 mt-8 z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
