"use client";

import { useCallback, useEffect, useState } from "react";
import ShowContentsPage from "@/components/front/affichageComposants";

interface DisplayPageProps {
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

const DisplayPage = ({ pageID, mode = 0 }: DisplayPageProps) => {
    const [images, setImages] = useState<Image[]>([]);
    const [idContenu, setIdContenu] = useState<number | null>(null);
    const [contenu, setContenu] = useState<Contenu | null>(null);

    const fetchImages = useCallback(async () => {
        try {
            const res = await fetch("/api/images/getImages");
            if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
            const data: Image[] = await res.json();
            setImages(data);
        } catch (error) {
            console.error("Erreur lors de la récupération des images:", error);
        }
    }, []);

    const fetchContenu = useCallback(
        async (id: number) => {
            if (!id || images.length === 0) return;

            try {
                const res = await fetch("/api/contenu/getContenu", {
                    method: "POST",
                    body: JSON.stringify({ action: 0, id }),
                    headers: { "Content-Type": "application/json" },
                });

                if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
                const data = await res.json();

                if (!data?.length || !data[0]) {
                    console.warn("Aucun contenu trouvé");
                    return;
                }

                let pageData = data[0].page;
                if (typeof pageData === "string") {
                    try {
                        pageData = JSON.parse(pageData);
                    } catch {
                        console.error("Erreur lors du parsing de la page");
                        return;
                    }
                }

                if (!Array.isArray(pageData)) {
                    console.error("La propriété 'page' n'est pas un tableau valide");
                    return;
                }

                const vraiPage: ComposantData[] = pageData.map((composant: ComposantDataBDD) => ({
                    type: composant.type,
                    texts: composant.texts || [],
                    imgs: composant.imgs?.map((imgID) => {
                        const img = images.find((img) => img.idImage === imgID);
                        return img || { idImage: imgID, url: "", alt: "Image non trouvée" };
                    }) || [],
                }));

                setContenu({
                    idContenu: data[0].idContenu,
                    titre: data[0].titre,
                    description: data[0].description,
                    imagePrincContenu: data[0].imagePrincContenu,
                    type: data[0].type,
                    page: vraiPage,
                });
            } catch (error) {
                console.error("Erreur lors de la récupération du contenu:", error);
            }
        },
        [images]
    );

    const getContenuID = useCallback(async () => {
        if (mode === 1) {
            setIdContenu(pageID);
            return;
        }

        try {
            const res = await fetch("/api/contenu/PageAttribution", {
                method: "POST",
                body: JSON.stringify({ action: 1, pageID }),
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
            const data = await res.json();
            if (data?.result?.[0]?.Contenu) {
                setIdContenu(data.result[0].Contenu);
            } else {
                console.warn("ID contenu introuvable");
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de l'ID du contenu:", error);
        }
    }, [pageID, mode]);

    useEffect(() => {
        fetchImages();
        getContenuID();
    }, [fetchImages, getContenuID]);

    useEffect(() => {
        if (idContenu) fetchContenu(idContenu);
    }, [idContenu, fetchContenu]);

    return (
        <div className="w-screen">
            {contenu ? (
                <ShowContentsPage comps={contenu.page} />
            ) : (
                <p className="w-screen mt-[3.45rem] text-center">Chargement de la page...</p>
            )}
        </div>
    );
};

export default DisplayPage;
