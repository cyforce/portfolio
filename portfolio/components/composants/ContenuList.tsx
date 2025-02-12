"use client";

import { useEffect, useMemo, useState } from "react";
import CustomSelect from "@/components/front/CustomSelect";
import Image from "next/image";

interface Image {
    idImage: number;
    url: string;
    alt: string;
}

interface Contenu {
    idContenu: number;
    titre: string;
    description: string;
    specificData: string;
    imagePrincContenu: Image;
    type: number;
}

interface ContenuBDDTaGrandMere {
    idContenu: number;
    titre: string;
    description: string;
    specificData: string;
    imagePrincContenu: number;
    type: number;
}

interface ContenuListProps {
    contenuType: number;
}

const ContenuList: React.FC<ContenuListProps> = ({ contenuType }) => {
    const [contents, setContents] = useState<Contenu[]>([]);
    const [images, setImages] = useState<Image[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCadre, setSelectedCadre] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [type, setType] = useState("");

    const cadres = [
        { value: "", label: "Tous les cadres" },
        { value: "0", label: "Études" },
        { value: "1", label: "Professionnel" },
        { value: "2", label: "Personnel" },
    ]
    const levels = [
        { value: "", label: "Tous les niveaux" },
        { value: "0", label: "Débutant" },
        { value: "1", label: "Intermédiaire" },
        { value: "2", label: "Avancé" },
    ];
    const types = useMemo(() => [
        { value: 0, label: "projets" },
        { value: 1, label: "competences" },
    ], []);

    useEffect(() => {
        const type = types.find((type) => type.value === contenuType);
        setType(type ? type.label : "");
    }, [contenuType, types]);

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
                    const formattedContents = data.map((content: ContenuBDDTaGrandMere) => {
                        const foundImage = images.find((img) => img.idImage === content.imagePrincContenu);

                        if (foundImage && !foundImage.url.startsWith('/images/')) {
                            foundImage.url = `/api/images/${foundImage.url}`;
                        }

                        console.log("Image trouvée pour le contenu", content.idContenu, ":", foundImage);

                        return {
                            idContenu: content.idContenu,
                            titre: content.titre,
                            description: content.description,
                            specificData: content.specificData,
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

    const filteredContents = contents.filter((content) => {
        const parsedData = content.specificData ? JSON.parse(content.specificData) : {};

        // console.log("🔍 Contenu analysé :", parsedData);
        // console.log("✅ Niveau stocké :", parsedData.level, " | Type :", typeof parsedData.level);
        // console.log("✅ Niveau sélectionné :", selectedLevel, " | Type :", typeof selectedLevel);

        const matchesSearch =
            content.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            content.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCadre = selectedCadre === "" || parsedData.cadre?.toString() === selectedCadre;
        const matchesLevel = selectedLevel === "" || String(parsedData.level) === selectedLevel;

        return matchesSearch && matchesCadre && matchesLevel;
    });

    const renderSpecificData = (contenu: Contenu) => {
        const specificDataJSON = JSON.parse(contenu.specificData);


        if (contenuType === 0) {
            const cadre = cadres.find((cadre) => cadre.value === specificDataJSON.cadre);

            return (
                <p className="text-white">
                    <span className="font-bold">Cadre du projet:</span> {cadre ? cadre.label : "Inconnu"}
                </p>
            );
        } else if (contenu.type === 1) {
            const cadre = cadres.find((cadre) => cadre.value === specificDataJSON.cadre);
            const level = levels.find((level) => level.value === specificDataJSON.level);

            return (
                <p className="text-white">
                    <span className="font-bold">Cadre d&apos;apprentissage:</span> {cadre ? cadre.label : "Inconnu"}
                    <br/>
                    <span className="font-bold">Niveau:</span> {level ? level.label : "Inconnu"}
                </p>
            );
        }
    }

    const renderContents = (filteredContents: Contenu[]) => {
        return filteredContents.map((content) => {
            const href = type === "" ? undefined : `/${type}/${content.idContenu.toString()}`;

            return (
                <div
                    key={content.idContenu}
                    className="bg-gray-800 text-white max-w-60 shadow-lg rounded-lg  transition-transform transform hover:scale-105"
                >
                    {href ? (
                        <a href={href} className="block p-4">
                            <Image
                                src={content.imagePrincContenu.url}
                                alt={content.imagePrincContenu.alt}
                                className={"w-full h-48 object-cover rounded-lg mb-3"}
                            />
                            <h3 className="text-lg font-semibold">{content.titre}</h3>
                            <p className="text-sm">{content.description}</p>
                            {renderSpecificData(content)}
                        </a>
                    ) : (
                        <>
                            <Image
                                src={content.imagePrincContenu.url}
                                alt={content.imagePrincContenu.alt}
                                className={"w-full h-48 object-cover rounded-lg mb-3"}
                            />
                            <h3 className="text-lg font-semibold">{content.titre}</h3>
                            <p className="text-sm">{content.description}</p>
                            {renderSpecificData(content)}
                        </>
                    )}
                </div>
            );
        });
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            {/* Champ de recherche */}
            <div className="mb-4 flex items-center justify-evenly">
                <div className={"w-1/2"}>
                    <input
                        type="text"
                        placeholder="Rechercher par nom..."
                        className="w-60 p-2 border border-gray-300 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {contenuType === 0 && (
                    <div className={"w-1/2"}>
                        <CustomSelect selectedValue={selectedCadre} setSelectedValue={setSelectedCadre} options={cadres} placeholder={cadres[0].label} className={"min-w-32"}/>
                    </div>
                )}

                {contenuType === 1 && (
                    <div className={"w-1/2 flex justify-between"}>
                        <CustomSelect selectedValue={selectedCadre} setSelectedValue={setSelectedCadre} options={cadres} placeholder={cadres[0].label} className={"min-w-32"}/>
                        <CustomSelect selectedValue={selectedLevel} setSelectedValue={setSelectedLevel} options={levels} placeholder={levels[0].label} className={"min-w-32"}/>
                    </div>
                )}
            </div>

            {/* Contenu */}
            <div className="flex flex-wrap gap-4 justify-center">
                {loading ? (
                    <p className="text-center w-screen">Chargement...</p>
                ) : filteredContents.length > 0 ? (
                    renderContents(filteredContents)
                ) : (
                    <p className="text-center text-white">Aucun contenu disponible.</p>
                )}
            </div>
        </div>
    );
};

export default ContenuList;
