"use client";

import { useEffect, useState } from "react";

// Génère les positions initiales des étoiles
const generateStarData = (count: number) => {
  return Array.from({ length: count }).map(() => ({
    left: Math.random() * window.innerWidth,
    top: Math.random() * window.innerHeight,
    originalLeft: Math.random() * window.innerWidth, // Position originale
    originalTop: Math.random() * window.innerHeight, // Position originale
    velocityX: 0, // Vitesse initiale nulle
    velocityY: 0, // Vitesse initiale nulle
    isEscaping: false, // Indique si l'étoile s'écarte du curseur
  }));
};

export default function Starfield() {
  const [stars, setStars] = useState<
    { left: number; top: number; originalLeft: number; originalTop: number; velocityX: number; velocityY: number; isEscaping: boolean }[]
  >([]);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const [isClient, setIsClient] = useState(false); // Vérification côté client
  const exclusionRadius = 100; // Rayon d'exclusion autour du curseur
  const escapeSpeed = 3; // Facteur d'accélération pour l'écartement des étoiles
  const returnSpeed = 0.05; // Vitesse de retour à la position initiale

  // Utilisation de useEffect pour vérifier si on est côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      setStars(generateStarData(150)); // Génération des étoiles au chargement de la page

      // Gestion des mouvements de la souris
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
            // Calcule la distance entre l'étoile et la souris
            const dx = star.left - mousePosition.x;
            const dy = star.top - mousePosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Si l'étoile est proche du curseur, elle doit s'écarter
            if (distance < exclusionRadius) {
              const angle = Math.atan2(dy, dx);

              // Écartement brusque de l'étoile
              star.left += Math.cos(angle) * (exclusionRadius - distance) * escapeSpeed;
              star.top += Math.sin(angle) * (exclusionRadius - distance) * escapeSpeed;
              star.isEscaping = true;
            } else {
              // Si l'étoile est loin du curseur, elle revient à sa position d'origine
              if (star.isEscaping) {
                star.left += (star.originalLeft - star.left) * returnSpeed;
                star.top += (star.originalTop - star.top) * returnSpeed;
              }
              star.isEscaping = false; // L'étoile n'est plus en train de s'écarter
            }

            return { ...star };
          })
        );

        requestAnimationFrame(updateStars);
      };

      requestAnimationFrame(updateStars);
    }
  }, [mousePosition, isClient]);

  // On rend un div vide tant qu'on n'est pas côté client
  if (!isClient) {
    return <div className="starfield" />;
  }

  return (
    <div className="starfield">
      {stars.map((star, index) => (
        <div
          key={index}
          className="star"
          style={{
            left: `${star.left}px`,
            top: `${star.top}px`,
            width: "4px",
            height: "4px",
            position: "absolute",
            borderRadius: "50%",
            backgroundColor: "white",
            transition: star.isEscaping ? "none" : "all 0.1s ease-out", // Pas de transition pendant l'écartement
          }}
        />
      ))}
    </div>
  );
}
