"use client";

import { useEffect, useState } from "react";
import ShowContentsPage from "@/components/front/affichageComposants"; // Utiliser le composant que tu as fourni

interface displayPageProps {
    pageID: number;
    mode?: number;
}

interface Image {
    idImage: number;
    url: string;
    alt: string;
}

interface ComposantData {
    type: number;
    texts: string[];
    imgs: Image[];
}

interface ComposantDataBDD {
    type: number;
    texts: string[];
    imgs: number[];
}

interface Contenu {
    idContenu: number;
    titre: string;
    description: string;
    imagePrincContenu: number;
    type: string;
    page: ComposantData[];
}

const DisplayPage = ({ pageID, mode=0 }: displayPageProps) => {
    const [images, setImages] = useState<Image[]>([]);
    const [idContenu, setIdContenu] = useState<number | null>(null);
    const [contenu, setContenu] = useState<Contenu | null>(null);

    // Fonction pour récupérer le contenu avec les images associées
    const fetchContenu = async (id: number) => {
        // console.log("Fetching content for id:", id); // Log de débogage

        // Vérifie si l'ID est valide et si les images ont bien été chargées
        if (!id || images.length === 0) {
            // console.log("No images available or invalid ID"); // Log de débogage
            return;
        }

        try {
            // Envoi de la requête API
            const res = await fetch("/api/contenu/getContenu", {
                method: "POST",
                body: JSON.stringify({ action: 0, id }),
                headers: { "Content-Type": "application/json" },
            });

            // Vérification du statut de la réponse
            if (!res.ok) {
                console.error("Failed to fetch content, status:", res.status); // Log de débogage
                return;
            }

            // Récupération de la réponse JSON
            const data = await res.json();
            // console.log("Data fetched from getContenu:", data); // Log de débogage

            // Vérification de la structure des données
            if (!data || !data.length || !data[0]) {
                console.error("Contenu non trouvé ou structure de données invalide");
                return; // Pas de contenu à afficher
            }

            // Si page est une chaîne JSON, il faut la parser
            let pageData = data[0].page;
            if (typeof pageData === "string") {
                try {
                    pageData = JSON.parse(pageData); // Essayons de parser le JSON
                    // console.log("Page data parsed successfully:", pageData);
                } catch (error) {
                    console.error("Erreur lors du parsing de la page:", error);
                    return;
                }
            }

            // Assure-toi que 'pageData' est bien un tableau d'objets
            if (!Array.isArray(pageData)) {
                console.error("La propriété 'page' n'est pas un tableau valide");
                return;
            }

            // Transformation des données pour les rendre compatibles avec ton composant
            const vraiPage: ComposantData[] = pageData.map((composant: ComposantDataBDD) => {
                return {
                    type: composant.type,
                    texts: composant.texts || [],  // Assure-toi que 'texts' existe
                    imgs: composant.imgs?.map((imgID: number) => {
                        // Cherche l'image correspondante à imgID
                        const img = images.find((img) => img.idImage === imgID);
                        if (!img) {
                            console.warn(`Image non trouvée pour imgID: ${imgID}`);
                        }
                        return img || { idImage: imgID, url: "", alt: "Image non trouvée" };
                    }) || [],
                };
            });

            // Construction du contenu final
            const contenuFinal: Contenu = {
                idContenu: data[0].idContenu,
                titre: data[0].titre,
                description: data[0].description,
                imagePrincContenu: data[0].imagePrincContenu,
                type: data[0].type,
                page: vraiPage,
            };

            // Mise à jour du state avec le contenu final
            setContenu(contenuFinal);
            // console.log("Contenu mis à jour:", contenuFinal); // Log de débogage

        } catch (error) {
            console.error("Erreur lors de la récupération du contenu:", error);
        }
    };

    // Appels API dans useEffect
    useEffect(() => {
        const fetchImages = async () => {
            // console.log("Fetching images..."); // Log de débogage
            try {
                const response = await fetch("/api/images/getImages");
                const data = await response.json();
                setImages(data);
                // console.log("Images récupérées:", data); // Log de débogage
            } catch (error) {
                console.error("Erreur lors de la récupération des images :", error);
            }
        };

        const getContenuID = async () => {
            if (mode !== 1) {
                // console.log("Fetching content ID for pageID:", pageID); // Log de débogage
                try {
                    const response = await fetch("/api/contenu/PageAttribution", {
                        method: "POST",
                        body: JSON.stringify({action: 1, pageID}),
                        headers: {"Content-Type": "application/json"},
                    });
                    const data = await response.json();
                    // console.log("Contenu ID récupéré:", data);
                    setIdContenu(data.result[0].Contenu);  // Mettre à jour idContenu
                } catch (error) {
                    console.error("Erreur lors de la récupération du contenu :", error);
                }
            } else {
                setIdContenu(pageID);
            }
        };

        fetchImages();
        getContenuID()
        //     .then(() => {
        //     if(idContenu) {
        //         fetchContenu(idContenu);
        //     } else {
        //         console.error("ID Contenu non trouvé.");
        //     }
        // })

    }, [pageID]); // Ce useEffect dépend de pageID, car c'est ce qui déclenche les appels API

    useEffect(() => {
        if (idContenu) {
            // console.log("ID Contenu trouvé:", idContenu); // Log de débogage
            fetchContenu(idContenu); // Si idContenu est mis à jour, on lance la récupération du contenu
            // console.log("Contenu mis à jour pour id:", contenu); // Log de débogage
        }
    }, [idContenu, images]); // Ce useEffect dépend de idContenu et images

    return (
        <div className="w-screen">
            {/* Si contenu est disponible, afficher les composants dynamiquement */}
            {contenu != null ? (
                <ShowContentsPage comps={contenu.page}  />
            ) : (
                <p className={"w-screen mt-[3.45rem] text-center"}>Chargement de la page...</p> // Message de chargement si le contenu n'est pas encore disponible
            )}
        </div>
    );
};

export default DisplayPage;
