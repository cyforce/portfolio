"use client";

import { useEffect, useState } from "react";

// Génère les positions aléatoires et les vitesses des étoiles
const generateStarData = (count: number) => {
  return Array.from({ length: count }).map(() => ({
    left: Math.random() * window.innerWidth,
    top: Math.random() * window.innerHeight,
    velocityX: (Math.random() - 0.5) * 0.5, // Vitesse aléatoire horizontale
    velocityY: (Math.random() - 0.5) * 0.5, // Vitesse aléatoire verticale
  }));
};

export default function Starfield() {
  const [stars, setStars] = useState<
    { left: number; top: number; velocityX: number; velocityY: number }[]
  >([]);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const [isClient, setIsClient] = useState(false); // État pour vérifier si on est côté client
  const exclusionRadius = 100; // Rayon d'exclusion autour du pointeur
  const minDistance = 50; // Distance minimale entre chaque étoile et le pointeur

  // Utilisation de useEffect pour vérifier si le code est exécuté côté client
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

            // Si l'étoile est trop proche du pointeur, elle est repoussée
            if (distance < exclusionRadius) {
              const angle = Math.atan2(dy, dx);
              star.left += Math.cos(angle) * (exclusionRadius - distance);
              star.top += Math.sin(angle) * (exclusionRadius - distance);
            }

            // Mise à jour de la position des étoiles avec des mouvements aléatoires
            let newLeft = star.left + star.velocityX;
            let newTop = star.top + star.velocityY;

            // Gère les collisions avec les bords de l'écran
            if (newLeft < 0 || newLeft > window.innerWidth) star.velocityX *= -1;
            if (newTop < 0 || newTop > window.innerHeight) star.velocityY *= -1;

            newLeft = Math.max(0, Math.min(window.innerWidth, newLeft));
            newTop = Math.max(0, Math.min(window.innerHeight, newTop));

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
          }}
        />
      ))}
    </div>
  );
}
