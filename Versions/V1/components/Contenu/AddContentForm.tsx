import {useState} from "react";
import CustomSelect from "@/components/front/CustomSelect";
import CustomImageSelect from "@/components/Contenu/CustomImageSelect";

interface Image {
    idImage: number;
    url: string;
    alt: string;
}

interface AddContentFormProps {
    images: Image[];
    onCancel: () => void;
    onSuccess: () => void;  // Callback pour rafraîchir la liste des contenus
}

const AddContentForm = ({ images, onCancel, onSuccess }: AddContentFormProps) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [selectedCadreProj, setSelectedCadreProj] = useState("");
    const [selectedCadre, setSelectedCadre] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedImage, setSelectedImage] = useState<number>(2);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
            titre: title,
            description,
            type: selectedType,
            imagePrincContenu: selectedImage,
            specificData: specData,
            page: JSON.stringify([]),
            action: 0,
        };

        try {
            const res = await fetch("/api/contenu/editContenu", {
                method: "POST",
                body: JSON.stringify(newContent),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error);
            }

            // Si tout se passe bien, appel du callback pour rafraîchir les contenus
            onSuccess();
            onCancel();
        } catch (error) {
            console.error("Erreur lors de l'ajout du contenu:", error);
            setErrorMessage("Une erreur est survenue lors de l'ajout du contenu. Veuillez réessayer.");
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
                <h2 className="text-2xl font-bold text-center mb-4 text-white">Ajouter un nouveau contenu</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Champs du formulaire */}
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-white">Titre</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="p-2 w-full bg-transparent border border-white text-white rounded"
                            placeholder="Entrez le titre"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="text-white">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="p-2 w-full bg-transparent border border-white text-white rounded"
                            placeholder="Entrez la description"
                            rows={4}
                            required
                        />
                    </div>

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
                            selectedImage={selectedImage}
                            setSelectedImage={setSelectedImage}
                            images={images}
                            placeholder="Sélectionner une image"
                        />
                    </div>

                    {selectedType == "0" && (
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

                    {selectedType == "1" && (
                        <div className="space-y-2">
                            <div className="space-y-2">
                                <div className="text-white">Cadre d&apos;apprentissage</div>
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

                    {errorMessage && (
                        <div className="text-red-500 text-center mt-4">
                            {errorMessage}
                        </div>
                    )}

                    <div className="flex justify-between gap-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="bg-red-500 px-4 py-2 rounded hover:bg-red-400"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className={`bg-green-500 px-4 py-2 rounded hover:bg-green-400 ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Ajout en cours..." : "Ajouter"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddContentForm;
