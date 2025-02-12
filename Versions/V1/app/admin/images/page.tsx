"use client";

import { useEffect, useState } from "react";
import AddImageForm from "@/components/Contenu/addImageForm";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Image {
    idImage: number;
    url: string;
    alt: string;
}

export default function ImagesPage() {
    const [images, setImages] = useState<Image[]>([]);
    const [selectedForm, setSelectedForm] = useState<"add" | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const fetchImages = async () => {
        try {
            const res = await fetch("/api/images/getImages");
            if (!res.ok) {
                throw new Error("Failed to fetch images");
            }
            const data = await res.json();
            if (Array.isArray(data)) {
                setImages(data);
            } else {
                throw new Error("Invalid data format");
            }
        } catch (error) {
            console.error("Error fetching images:", error);
            setError("Failed to fetch images. Please try again later.");
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleDelete = async (idImage: number) => {
        const confirmation = confirm("Voulez-vous vraiment supprimer cette image ?");
        if (!confirmation) return;

        try {
            const res = await fetch("/api/images/deleteImage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idImage }),
            });

            if (res.ok) {
                setImages(images.filter((image) => image.idImage !== idImage));
            } else {
                throw new Error("Failed to delete image");
            }
        } catch (error) {
            console.error("Error deleting image:", error);
            setError("Erreur lors de la suppression de l'image.");
        }
    };

    const closeForm = () => {
        setSelectedForm(null); // Cela fermera la popup
    };

    return (
        <div className="p-10 text-white min-h-screen">
            <button onClick={() => router.push("/admin")} className={"z-20 absolute top-16 left-2 bg-amber-500 px-4 py-2 text-white rounded hover:bg-amber-400"}>Retour</button>
            <h1 className="text-3xl font-bold text-center mb-6">Gestion des images</h1>

            {/* Actions */}
            <div className="mt-4 flex justify-center mb-4">
                <button
                    onClick={() => setSelectedForm("add")}
                    className="bg-green-500 px-4 py-2 text-white rounded hover:bg-green-400"
                >
                    Ajouter une image
                </button>
            </div>

            {/* Message d'erreur */}
            {error && <p className="text-red-500">{error}</p>}

            {/* Liste des images en flex grid */}
            <div className="max-h-[500px] overflow-y-auto">
                <div className="flex flex-wrap gap-4 justify-center">
                    {Array.isArray(images) &&
                        images.map((image) => (
                                <div
                                    key={image.idImage}
                                    className="bg-gray-800 rounded p-2 flex flex-col items-center"
                                >
                                    <span className="block mb-2">ID: {image.idImage}</span>
                                    <Image src={`/api/images/${image.url}`} alt={image.alt} className={"w-32 h-32 object-cover rounded mb-2"} />
                                    <button
                                        onClick={() => handleDelete(image.idImage)}
                                        className="bg-red-500 px-3 py-1 text-white rounded text-sm hover:bg-red-400"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            ))}
                </div>
            </div>

            {/* Popup Formulaire d'ajout */}
            {selectedForm === "add" && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-gray-800 p-6 rounded shadow-md w-96 flex justify-center flex-col items-center">
                        <AddImageForm onImageAdded={fetchImages} onCloseForm={closeForm} />
                        <button
                            onClick={closeForm}
                            className="text-white bg-red-500 px-2 py-1 rounded-full mt-2 w-1/2"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
