import { useState, useEffect } from "react";
import CustomSelect from "@/components/front/CustomSelect";
import CustomImageSelect from "@/components/Contenu/CustomImageSelect";

interface Image {
    idImage: number;
    url: string;
    alt: string;
}

interface EditContentFormProps {
    images: Image[];
    contentToEdit: Contenu; // Contenu à éditer
    onCancel: () => void;
    onSuccess: () => void;
}

interface Contenu {
    idContenu: number;
    titre: string;
    description: string;
    specificData: string;
    imagePrincContenu: number;
    type: number;
}

const EditContentForm = ({ images, contentToEdit, onCancel, onSuccess }: EditContentFormProps) => {
    const [title, setTitle] = useState(contentToEdit.titre);
    const [description, setDescription] = useState(contentToEdit.description);
    const [selectedType, setSelectedType] = useState(contentToEdit.type.toString());
    const [selectedCadreProj, setSelectedCadreProj] = useState("");
    const [selectedCadre, setSelectedCadre] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedImage, setSelectedImage] = useState(contentToEdit.imagePrincContenu);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        setTitle(contentToEdit.titre);
        setDescription(contentToEdit.description);
        setSelectedType(contentToEdit.type.toString());  // Assure-toi que type est une chaîne
        setSelectedImage(contentToEdit.imagePrincContenu);
        let specificDataJSON = JSON.parse(contentToEdit.specificData);
        if (selectedType === "0") {
            setSelectedCadreProj(specificDataJSON.cadre);
        } else if (selectedType === "1") {
            setSelectedCadre(specificDataJSON.cadre);
            setSelectedLevel(specificDataJSON.level);
        }
    }, [contentToEdit]);

    const consoleContentToEdit = () => {
        console.log(contentToEdit);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage(null);

        if (typeof selectedImage !== "number" || isNaN(selectedImage) || selectedImage <= 0) {
            setErrorMessage("Veuillez sélectionner une image valide.");
            setIsSubmitting(false);
            return;
        }

        let specData = JSON.stringify({});

        switch (selectedType) {
            case "0":
                if (!selectedCadreProj) {
                    setErrorMessage("Veuillez sélectionner le cadre du projet.");
                    setIsSubmitting(false);
                    return;
                } else {
                    specData = JSON.stringify({ cadre: selectedCadreProj });
                }
                break;
            case "1":
                if (!selectedCadre || !selectedLevel) {
                    setErrorMessage("Veuillez sélectionner le cadre d'apprentissage et le niveau.");
                    setIsSubmitting(false);
                    return;
                } else {
                    specData = JSON.stringify({ cadre: selectedCadre, level: selectedLevel });
                }
                break;
        }

        const newContent = {
            idContenu: contentToEdit.idContenu,
            titre: title,
            description,
            type: selectedType,  // Utilisation de selectedType ici
            imagePrincContenu: selectedImage,
            specificData: specData,
            page: JSON.stringify([]),
            action: 1,
        };

        try {
            const res = await fetch("/api/contenu/editContenu", {
                method: "POST",
                body: JSON.stringify(newContent),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();

            if (data.success) {
                onSuccess();
                onCancel();
            } else {
                setErrorMessage("Une erreur est survenue lors de la modification.");
            }
        } catch (error) {
            setErrorMessage("Une erreur est survenue lors de la modification.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const types = [
        { value: "", label: "Sélectionner le type" },
        { value: "0", label: "Projet" },
        { value: "1", label: "Compétence" },
        { value: "2", label: "Page classique" },
    ];

    const cadres = [
        { value: "", label: "Sélectionner le cadre du projet" },
        { value: "0", label: "Études" },
        { value: "1", label: "Professionnel" },
        { value: "2", label: "Personnel" },
    ]

    const levels = [
        { value: "", label: "Sélectionner le niveau" },
        { value: "0", label: "Débutant" },
        { value: "1", label: "Intermédiaire" },
        { value: "2", label: "Avancé" },
    ];

    return (
        <div className="w-screen h-[calc(100vh-3.45rem)] mt-[3.45rem] fixed top-0 left-0 z-20 flex justify-center items-center bg-gray-800/50">
            <div className="border border-gray-700 bg-gray-800 p-8 rounded-lg w-full max-w-lg z-30 max-h-[calc(100vh-3.45rem)] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Modifier le contenu</h2>
                <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded max-w-lg mx-auto text-white">
                    {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

                    <label className="space-y-2">
                        <span className="text-white">Titre</span>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 bg-gray-700 rounded text-white"
                        />
                    </label>

                    <label className="space-y-2">
                        <span className="text-white">Description</span>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 bg-gray-700 rounded text-white"
                        />
                    </label>

                    <div className="space-y-2">
                        <label htmlFor="type" className="text-white">Type de contenu</label>
                        <CustomSelect
                            selectedValue={selectedType}
                            setSelectedValue={setSelectedType}
                            options={types}
                            placeholder="Sélectionner le type"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="image" className="text-white">Image Principale</label>
                        <CustomImageSelect
                            images={images}
                            selectedImage={selectedImage}
                            setSelectedImage={(imageId) => setSelectedImage(imageId)}
                            placeholder={"Sélectionner l'image principale"}
                        />
                    </div>

                    {selectedType === "0" && (
                        <div className="space-y-2">
                            <label className="text-white">Cadre du projet</label>
                            <CustomSelect
                                selectedValue={selectedCadreProj}
                                setSelectedValue={setSelectedCadreProj}
                                options={cadres}
                                placeholder={"Sélectionner le cadre du projet"}
                            />
                        </div>
                    )}

                    {selectedType === "1" && (
                        <div className="space-y-2">
                            <div className="space-y-2">
                                <div className="text-white">Cadre d'apprentissage</div>
                                <CustomSelect
                                    selectedValue={selectedCadre}
                                    setSelectedValue={setSelectedCadre}
                                    options={cadres}
                                    placeholder={"Sélectionner le cadre d'apprentissage"}
                                />
                            </div>
                            <div className={"space-y-2"}>
                                <label className="text-white">Niveau</label>
                                <CustomSelect
                                    selectedValue={selectedLevel}
                                    setSelectedValue={setSelectedLevel}
                                    options={levels}
                                    placeholder={"Sélectionner le niveau"}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between mt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="bg-red-500 px-4 py-2 rounded hover:bg-red-400"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-500 px-4 py-2 rounded disabled:bg-blue-300 hover:bg-blue-400"
                        >
                            {isSubmitting ? "En cours..." : "Modifier"}
                        </button>
                        {/* <button
                            type="button"
                            onClick={consoleContentToEdit}
                            className="bg-blue-500 px-4 py-2 rounded disabled:bg-blue-300"
                        >
                            log
                        </button> */}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditContentForm;
