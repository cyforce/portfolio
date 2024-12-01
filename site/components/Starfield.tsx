"use client";

import React, { useEffect, useState } from "react";

interface StarfieldProps {
  className?: string;
}

const STAR_COUNT = 150;
const EXCLUSION_RADIUS = 100; // Rayon d'exclusion autour de la souris
const MAX_OFFSET_DIST = 100; // Décalage maximum des étoiles

// Génère les positions initiales des étoiles
const generateStarData = (count: number) => {
  return Array.from({ length: count }).map(() => ({
    initialX: Math.random() * window.innerWidth, // Position initiale X
    initialY: Math.random() * window.innerHeight, // Position initiale Y
    offsetX: 0, // Décalage X
    offsetY: 0, // Décalage Y
  }));
};

export default function Starfield({ className }: StarfieldProps) {
  const [isClient, setIsClient] = useState(false);
  const [stars, setStars] = useState<
    { initialX: number; initialY: number; offsetX: number; offsetY: number }[]
  >([]);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      setStars(generateStarData(STAR_COUNT)); // Génération des étoiles

      const handleMouseMove = (event: MouseEvent) => {
        setMousePosition({ x: event.clientX, y: event.clientY });
      };
      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      const updateStars = () => {
        setStars((prevStars) =>
          prevStars.map((star) => {
            const dx = star.initialX - mousePosition.x;
            const dy = star.initialY - mousePosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Si l'étoile est proche de la souris, calculer un décalage proportionnel
            if (distance < EXCLUSION_RADIUS * 3) {
              // Calcul du ratio de la distance actuelle par rapport au rayon d'exclusion
              const ratio = Math.min(
                1,
                1 - distance / (EXCLUSION_RADIUS * 3)
              );

              // Calcul des décalages proportionnels
              const offsetX = Math.sign(dx) * ratio * MAX_OFFSET_DIST;
              const offsetY = Math.sign(dy) * ratio * MAX_OFFSET_DIST;

              return {
                ...star,
                offsetX,
                offsetY,
              };
            } else {
              // Si l'étoile est loin de la souris, elle revient à sa position initiale
              return {
                ...star,
                offsetX: 0,
                offsetY: 0,
              };
            }
          })
        );

        requestAnimationFrame(updateStars);
      };

      requestAnimationFrame(updateStars);
    }
  }, [mousePosition, isClient]);

  // On rend un div vide tant qu'on n'est pas côté client
  if (!isClient) {
    return <div className={`starfield ${className}`} />;
  }

  return (
    <div className={`starfield ${className}`}>
      {stars.map((star, index) => (
        <div
          key={index}
          className="star"
          style={{
            left: `${star.initialX + star.offsetX}px`,
            top: `${star.initialY + star.offsetY}px`,
            width: "4px",
            height: "4px",
            position: "absolute",
            borderRadius: "50%",
            backgroundColor: "white",
            // transition: "all 0.2s ease-out", // Transition fluide pour les déplacements
          }}
        />
      ))}
    </div>
  );
}
