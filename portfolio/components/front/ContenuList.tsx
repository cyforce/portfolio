"use client";

import { useEffect, useState } from "react";

interface Image {
    idImage: number;
    url: string;
    alt: string;
}

interface Contenu {
    idContenu: number;
    titre: string;
    description: string;
    imagePrincContenu: Image; // Correction ici
    type: string;
}

interface ContenuListProps {
    contenuType: number;
}

const ContenuList: React.FC<ContenuListProps> = ({ contenuType }) => {
    const [contents, setContents] = useState<Contenu[]>([]);
    const [images, setImages] = useState<Image[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Récupération des images
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch("/api/images/getImages");
                const data = await response.json();
                setImages(data);
                console.log("✅ Images récupérées:", data);
            } catch (error) {
                console.error("❌ Erreur lors de la récupération des images :", error);
            }
        };

        fetchImages();
    }, []);

    // Récupération des contenus APRES les images
    useEffect(() => {
        if (images.length === 0) return; // On attend que les images soient chargées

        const fetchContenu = async () => {
            setLoading(true);
            try {
                const response = await fetch("/api/contenu/getContenu", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ action: 1, type: contenuType }),
                });

                if (!response.ok) throw new Error("Erreur lors de la récupération des contenus");

                const data = await response.json();
                console.log("✅ Contenus récupérés :", data);

                if (Array.isArray(data)) {
                    const formattedContents = data.map((content: any) => {
                        const foundImage = images.find((img) => img.idImage === content.imagePrincContenu);

                        if (foundImage && !foundImage.url.startsWith('/images/')) {
                            foundImage.url = `/images/${foundImage.url}`;
                        }

                        console.log("Image trouvée pour le contenu", content.idContenu, ":", foundImage);

                        return {
                            idContenu: content.idContenu,
                            titre: content.titre,
                            description: content.description,
                            imagePrincContenu: foundImage || { idImage: 0, url: `/images/placeholder.png`, alt: "Image non trouvée" },
                            type: content.type,
                        };
                    });

                    setContents(formattedContents);
                    console.log("✅ Contenus formatés :", contents);
                }
            } catch (error) {
                console.error("❌ Erreur lors de la récupération des contenus :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContenu();
    }, [contenuType, images]); // Déclenché après le chargement des images

    const filteredContents = contents.filter(
        (content) =>
            content.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            content.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            {/* Champ de recherche */}
            <div className="mb-4 flex items-center justify-evenly">
                <input
                    type="text"
                    placeholder="Rechercher un contenu..."
                    className="w-full p-2 border border-gray-300 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {/* TODO: - Ajouter un bouton pour effacer le champ de recherche
                 *        - Ajouter un select pour le niveau
                */}
            </div>

            {/* Contenu */}
            <div className="flex flex-wrap gap-4">
                {loading ? (
                    <p className="text-center w-screen">Chargement...</p>
                ) : filteredContents.length > 0 ? (
                    filteredContents.map((content) => (
                        <div
                            key={content.idContenu}
                            className="bg-gray-800 text-white max-w-60 shadow-lg rounded-lg p-4 transition-transform transform hover:scale-105"
                        >
                            <img
                                src={content.imagePrincContenu.url}
                                alt={content.imagePrincContenu.alt}
                                className="w-full h-48 object-cover rounded-lg mb-3"
                            />
                            <h3 className="text-lg font-semibold">{content.titre}</h3>
                            <p className="text-sm">{content.description}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-white">Aucun contenu disponible.</p>
                )}
            </div>
        </div>
    );
};

export default ContenuList;
