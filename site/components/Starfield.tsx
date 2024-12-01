// components/Starfield.tsx
"use client"; // Client component

import { useEffect } from 'react';

export default function Starfield() {
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
    <div className="starfield">
      {[...Array(150)].map((_, index) => (
        <div key={index} className="star" style={{ left: `${Math.random() * 100}vw`, top: `${Math.random() * 100}vh` }} />
      ))}
    </div>
  );
}
