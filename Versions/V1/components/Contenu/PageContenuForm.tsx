import { useEffect, useState } from "react";
import CustomContentSelect from "@/components/Contenu/CustomSelectContenu";

interface PageContenuFormProps {
    onCancel: () => void;
}

interface TKTFRR {
    Page: number;
    NomPage: string;
    Contenu: number | null;
}

const PageContenuForm = ({ onCancel }: PageContenuFormProps) => {
    const [options, setOptions] = useState<TKTFRR[]>([]);
    const [selectedContents, setSelectedContents] = useState<{ [key: number]: number | null }>({});

    // Récupération des pages depuis l'API
    useEffect(() => {
        const fetchPageContent = async () => {
            try {
                const response = await fetch("/api/contenu/PageAttribution", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ action: 2 }),
                });

                if (!response.ok) throw new Error("Erreur lors de la récupération des pages");

                const data = await response.json();
                console.log("Pages récupérées :", data);

                if (Array.isArray(data.result)) {
                    const formattedOptions = data.result.map((page: TKTFRR) => ({
                        Page: page.Page,
                        NomPage: page.NomPage,
                        Contenu: page.Contenu,
                    }));

                    setOptions(formattedOptions);
                    console.log("Options après traitement :", formattedOptions);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des pages :", error);
            }
        };

        fetchPageContent();
    }, []);

    // Gestion du changement de contenu pour une page donnée
    const handleContentChange = (pageId: number, contenuId: number | null) => {
        setSelectedContents((prev) => ({
            ...prev,
            [pageId]: contenuId,
        }));
    };

    // Enregistrement des modifications
    const handleSaveChanges = async () => {
        try {
            console.log("Données envoyées à l'API :", selectedContents);

            const response = await fetch("/api/contenu/PageAttribution", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: 3,
                    contenus: selectedContents, // Objet { pageID: contenuID }
                }),
            });

            if (!response.ok) throw new Error("Erreur lors de la sauvegarde des pages");

            console.log("Pages sauvegardées avec succès");
            onCancel();
        } catch (error) {
            console.error("Erreur lors de la sauvegarde des pages :", error);
        }
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="p-4 bg-gray-800 rounded-lg w-96 max-h-[calc(100vh-3.45rem)] mt-[3.45rem] overflow-y-auto">
                <h1 className="text-lg font-bold text-white mb-4">Sélectionner une Page</h1>

                <form key={options.length} className="space-y-4">
                    {options.map((option) => (
                        <div key={option.Page} className="flex items-center mb-2">
                            <p className={`w-1/2 text-white ${option.Contenu ? "text-green-500" : "text-red-500"}`}>
                                {option.NomPage}
                            </p>
                            <CustomContentSelect
                                className="w-1/2"
                                selectedContent={selectedContents[option.Page] ?? option.Contenu ?? 0}
                                setSelectedContent={(contenuId) => handleContentChange(option.Page, contenuId)}
                                placeholder="Sélectionnez un contenu"
                            />
                        </div>
                    ))}
                </form>

                <div className="mt-4 flex justify-between">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white rounded"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSaveChanges}
                        className="px-4 py-2 bg-green-500 hover:bg-green-400 text-white rounded"
                    >
                        Valider
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PageContenuForm;
