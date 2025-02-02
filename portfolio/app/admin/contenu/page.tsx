"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AddContentForm from "@/components/AddContentForm";
import EditContentForm from "@/components/EditContentForm";

interface Image {
    idImage: number;
    url: string;
    alt: string;
}

interface Contenu {
    idContenu: number;
    titre: string;
    description: string;
    imagePrincContenu: number;
    type: string;
}

export default function AdminContentPage() {
    const [contenus, setContenus] = useState<Contenu[]>([]);
    const [images, setImages] = useState<Image[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState<string>("");
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isEditFormVisible, setIsEditFormVisible] = useState(false);
    const [contentToEdit, setContentToEdit] = useState<Contenu | null>(null); // ID du contenu à modifier
    const router = useRouter();

    // Récupérer les contenus depuis l'API
    const fetchContenus = async () => {
        try {
            const res = await fetch("/api/contenu/getContenu", {
                method: "POST",
                body: JSON.stringify({
                    action: 1,
                    titre: searchTerm,
                    type: selectedType === "" ? undefined : selectedType,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            setContenus(data);
        } catch (error) {
            console.error("Erreur lors de la récupération des contenus:", error);
        }
    };

    // Récupérer les images depuis l'API
    const fetchImages = async () => {
        try {
            const res = await fetch("/api/images/getImages");
            const data = await res.json();
            setImages(data);
        } catch (error) {
            console.error("Erreur lors de la récupération des images:", error);
        }
    };

    // Effectuer les appels au démarrage et quand les filtres sont modifiés
    useEffect(() => {
        fetchContenus();
        fetchImages();
    }, [searchTerm, selectedType]);

    // Fonction pour afficher le formulaire d'ajout
    const handleAddContent = () => {
        setIsFormVisible(true);
    };

    // Fonction pour annuler l'ajout et masquer le formulaire
    const handleCancel = () => {
        setIsFormVisible(false);
    };

    // Fonction pour afficher le formulaire d'édition avec les données du contenu à modifier
    const handleEditContent = (contenu: Contenu) => {
        setContentToEdit(contenu); // Mettre à jour l'état avec le contenu sélectionné
        setIsEditFormVisible(true); // Afficher le formulaire d'édition
    };

    // Fonction pour annuler l'édition et masquer le formulaire
    const handleEditCancel = () => {
        setIsEditFormVisible(false);
        setContentToEdit(null); // Réinitialiser l'ID du contenu à éditer
    };

    const handleDelete = async (idContenu: number) => {
        const confirmation = confirm("Voulez-vous vraiment supprimer cette image ?");
        if (!confirmation) return;

        try {
            const res = await fetch("/api/contenu/editContenu", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action:2, idContenu: idContenu }),
            });

            if (res.ok) {
                fetchContenus();
            } else {
                throw new Error("Failed to delete content");
            }
        } catch (error) {
            console.error("Error deleting content:", error);
        }
    }

    return (
        <div className="p-10 text-white min-h-screen relative">
            <button
                onClick={() => router.push("/admin")}
                className="z-20 absolute top-9 left-6 bg-amber-500 px-4 py-2 text-white rounded hover:bg-amber-400"
            >
                Retour
            </button>
            <h1 className="text-3xl font-bold text-center mb-6">Gestion du contenu</h1>

            <div className="flex justify-between items-center">
                <input
                    type="text"
                    placeholder="Rechercher..."
                    className="p-2 rounded border border-white bg-transparent text-white w-60"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="p-2 rounded border border-white bg-transparent text-white w-60"
                >
                    <option value="">Tous</option>
                    <option value="0">Projet</option>
                    <option value="1">Compétence</option>
                </select>
                <button
                    onClick={handleAddContent}
                    className="bg-green-500 px-4 py-2 w-60 text-white rounded hover:bg-green-400"
                >
                    Nouveau contenu
                </button>
            </div>

            <div className="flex flex-wrap gap-4 mt-4 items-center justify-center">
                {contenus.length > 0 ? (
                    contenus.map((contenu) => {
                        // Recherche de l'image correspondante à l'ID de l'image
                        const image = images.find(img => img.idImage === contenu.imagePrincContenu);
                        const imageUrl = image ? `/images/${image.url}` : "/images/placholder1.jpg";
                        return (
                            <div key={contenu.idContenu} className="bg-gray-800 rounded p-4 w-96">
                                <img
                                    src={imageUrl}
                                    alt={image ? image.alt : "Image de contenu"}
                                    className="w-full h-32 object-cover rounded"
                                />
                                <h2 className="text-xl font-bold overflow-hidden">{contenu.titre}</h2>
                                <p className="text-sm whitespace-normal break-words overflow-wrap">{contenu.description}</p>
                                <div className="mt-4 flex justify-between">
                                    <button
                                        className="bg-blue-500 px-4 py-2 text-white rounded hover:bg-blue-400"
                                        onClick={() => handleEditContent(contenu)} // Passer le contenu à modifier
                                    >
                                        Modifier
                                    </button>
                                    <button className="bg-blue-500 px-4 py-2 text-white rounded hover:bg-blue-400">
                                        Modifier la page
                                    </button>
                                    <button className="bg-red-500 px-4 py-2 text-white rounded hover:bg-red-400" onClick={() => handleDelete(contenu.idContenu)}>
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-center text-gray-400">Aucun contenu trouvé.</p>
                )}
            </div>

            {/* Formulaire d'ajout de contenu */}
            {isFormVisible && <AddContentForm images={images} onCancel={handleCancel} onSuccess={fetchContenus} />}

            {/* Formulaire d'édition de contenu */}
            {isEditFormVisible && contentToEdit && (
                <EditContentForm images={images} contentToEdit={contentToEdit} onCancel={handleEditCancel} onSuccess={fetchContenus}/>
            )}
        </div>
    );
}
