import './globals.css';
import Navbar from '../components/Navbar';
import { ReactNode, useEffect } from 'react';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  useEffect(() => {
    // Gestion des mouvements de la souris
    const handleMouseMove = (event: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${event.clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <html lang="fr">
      <body className="bg-gray-900 text-white font-sans flex flex-col min-h-screen">
        <div className="starfield">
          {/* Générer dynamiquement des étoiles */}
          {[...Array(150)].map((_, index) => (
            <div key={index} className="star" style={{ left: `${Math.random() * 100}vw`, top: `${Math.random() * 100}vh` }} />
          ))}
        </div>
        <Navbar />
        <main className="flex-grow p-6 mt-8">
          {children}
        </main>
      </body>
    </html>
  );
}
