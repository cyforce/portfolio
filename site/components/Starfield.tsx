"use client";

import { useEffect, useState } from "react";

// Génère les positions et les vitesses des étoiles
const generateStarData = (count: number) => {
  return Array.from({ length: count }).map(() => ({
    left: Math.random() * window.innerWidth,
    top: Math.random() * window.innerHeight,
    velocityX: (Math.random() - 0.5) * 0.1, // Petite vitesse horizontale
    velocityY: (Math.random() - 0.5) * 0.1, // Petite vitesse verticale
    originalVelocityX: (Math.random() - 0.5) * 0.1, // Vitesse initiale horizontale
    originalVelocityY: (Math.random() - 0.5) * 0.1, // Vitesse initiale verticale
    isEscaping: false, // Indique si l'étoile s'écarte du curseur
    isFixed: false, // Indique si l'étoile est fixe et ne doit pas bouger
  }));
};

export default function Starfield() {
  const [stars, setStars] = useState<
    { left: number; top: number; velocityX: number; velocityY: number; originalVelocityX: number; originalVelocityY: number; isEscaping: boolean; isFixed: boolean }[]
  >([]);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const [isClient, setIsClient] = useState(false); // Vérification côté client
  const exclusionRadius = 100; // Rayon d'exclusion autour du curseur
  const minDistance = 50; // Distance minimale entre chaque étoile et le pointeur
  const escapeSpeed = 1.5; // Facteur d'accélération pour l'écartement des étoiles

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

            // Si l'étoile est trop proche du pointeur et qu'elle n'est pas fixe, elle doit s'écarter
            if (distance < exclusionRadius && !star.isFixed) {
              const angle = Math.atan2(dy, dx);
              // Accélération de l'étoile pour l'écarter
              star.velocityX = star.originalVelocityX * escapeSpeed;
              star.velocityY = star.originalVelocityY * escapeSpeed;

              // Écartement brusque
              star.left += Math.cos(angle) * (exclusionRadius - distance);
              star.top += Math.sin(angle) * (exclusionRadius - distance);
              star.isEscaping = true;
            }

            // Si l'étoile est suffisamment éloignée, on rétablit son mouvement lent
            if (star.isEscaping && distance > exclusionRadius) {
              star.isEscaping = false;
              star.velocityX = star.originalVelocityX; // Réinitialise la vitesse
              star.velocityY = star.originalVelocityY; // Réinitialise la vitesse
            }

            // Si l'étoile est trop éloignée du curseur, elle reste fixe
            if (distance > exclusionRadius) {
              star.isFixed = true;
            } else {
              star.isFixed = false;
            }

            // Mise à jour de la position des étoiles fixes ou mobiles
            let newLeft = star.left;
            let newTop = star.top;

            // Les étoiles fixes ne bougent pas
            if (!star.isFixed) {
              newLeft += star.velocityX;
              newTop += star.velocityY;

              // Gère les collisions avec les bords de l'écran
              if (newLeft < 0 || newLeft > window.innerWidth) star.velocityX *= -1;
              if (newTop < 0 || newTop > window.innerHeight) star.velocityY *= -1;

              newLeft = Math.max(0, Math.min(window.innerWidth, newLeft));
              newTop = Math.max(0, Math.min(window.innerHeight, newTop));
            }

            return { ...star, left: newLeft, top: newTop };
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
            opacity: star.isFixed ? 0.5 : 1, // Les étoiles fixes seront un peu transparentes
          }}
        />
      ))}
    </div>
  );
}
