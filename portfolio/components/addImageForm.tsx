"use client";

import { useState } from "react";

// AddImageForm.tsx
interface AddImageFormProps {
    onImageAdded: () => Promise<void>;
    onCloseForm: () => void;
}

export default function AddImageForm(props: AddImageFormProps) {
    const [file, setFile] = useState<File | null>(null);
    const [alt, setAlt] = useState<string>(""); // Nouvel état pour alt
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setMessage("Veuillez sélectionner une image.");
            setMessageType("error");
            return;
        }

        const formData = new FormData();
        formData.append("image", file);
        formData.append("alt", alt); // Ajout de l'alt dans la requête

        try {
            const res = await fetch("/api/images/addImage", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                setMessage("Image ajoutée avec succès.");
                setMessageType("success");
                await props.onImageAdded();
                props.onCloseForm();
            } else {
                setMessage("Erreur lors de l'ajout de l'image.");
                setMessageType("error");
            }
        } catch (error) {
            console.error("Error adding image:", error);
            setMessage("Erreur lors de l'ajout de l'image.");
            setMessageType("error");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border border-gray-700 rounded bg-gray-800 bg-opacity-50 text-white">
            <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                className="border p-2 mb-2 w-full text-white"
            />
            <input
                type="text"
                placeholder="Texte alternatif (alt)"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                className="border p-2 mb-2 w-full text-white bg-transparent"
            />
            <button type="submit" className="bg-green-500 px-4 py-2 text-white rounded w-full">
                Ajouter
            </button>
            {message && (
                <p className={`mt-2 text-center ${messageType === "success" ? "text-green-500" : "text-red-500"}`}>
                    {message}
                </p>
            )}
        </form>
    );
}
