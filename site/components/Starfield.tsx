"use client"; // Client component

import { useEffect, useState } from 'react';

// Génère des positions aléatoires pour les étoiles
const generateStarPositions = (count: number) => {
  return Array.from({ length: count }).map(() => ({
    left: `${Math.random() * 100}vw`,
    top: `${Math.random() * 100}vh`,
  }));
};

export default function Starfield() {
  const [starPositions, setStarPositions] = useState<{ left: string; top: string }[]>([]);

  useEffect(() => {
    setStarPositions(generateStarPositions(150)); // Déclenché uniquement côté client
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${event.clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="starfield">
      {starPositions.map((position, index) => (
        <div key={index} className="star" style={position} />
      ))}
    </div>
  );
}
