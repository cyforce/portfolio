"use client";

import React, { useEffect, useState } from "react";

interface StarfieldProps {
  className?: string;
}

const STAR_COUNT = 150;
const EXCLUSION_RADIUS = 60; // Rayon d'exclusion autour de la souris
const MAX_OFFSET_DIST = 60; // Décalage maximum des étoiles

// Génère les étoiles avec des positions en pourcentage de l'écran
const generateStarData = (count: number) => {
  return Array.from({ length: count }).map(() => ({
    percentX: Math.random(), // Position en % de la largeur (0 à 1)
    percentY: Math.random(), // Position en % de la hauteur (0 à 1)
    offsetX: 0, // Décalage dynamique X
    offsetY: 0, // Décalage dynamique Y
  }));
};

export default function Starfield({ className }: StarfieldProps) {
  const [stars, setStars] = useState<
      { percentX: number; percentY: number; offsetX: number; offsetY: number }[]
  >([]);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    setStars(generateStarData(STAR_COUNT));

    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const updateStars = () => {
      setStars((prevStars) =>
          prevStars.map((star) => {
            const absoluteX = star.percentX * window.innerWidth;
            const absoluteY = star.percentY * window.innerHeight;

            const dx = absoluteX - mousePosition.x;
            const dy = absoluteY - mousePosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < EXCLUSION_RADIUS * 3) {
              const ratio = Math.min(1, 1 - distance / (EXCLUSION_RADIUS * 3));
              return {
                ...star,
                offsetX: Math.sign(dx) * ratio * MAX_OFFSET_DIST,
                offsetY: Math.sign(dy) * ratio * MAX_OFFSET_DIST,
              };
            } else {
              return { ...star, offsetX: 0, offsetY: 0 };
            }
          })
      );

      requestAnimationFrame(updateStars);
    };

    requestAnimationFrame(updateStars);
  }, [mousePosition]);

  return (
      <div className={`starfield ${className}`} style={{ position: "fixed", width: "100vw", height: "100vh" }}>
        {stars.map((star, index) => {
          const absoluteX = star.percentX * window.innerWidth + star.offsetX;
          const absoluteY = star.percentY * window.innerHeight + star.offsetY;

          return (
              <div
                  key={index}
                  className="star"
                  style={{
                    left: `${absoluteX}px`,
                    top: `${absoluteY}px`,
                    width: "4px",
                    height: "4px",
                    position: "absolute",
                    borderRadius: "50%",
                    backgroundColor: "white",
                  }}
              />
          );
        })}
      </div>
  );
}
