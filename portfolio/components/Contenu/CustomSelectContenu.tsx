import { useState, useEffect, useRef } from "react";

interface Contenu {
    idContenu: number;
    titre: string;
    description: string;
}

interface CustomContentSelectProps {
    selectedContent: number; // Utilise l'ID du contenu
    setSelectedContent: (value: number) => void; // Passe l'ID au parent
    placeholder: string;
    className?: string;
}

const CustomContentSelect = ({ selectedContent, setSelectedContent, placeholder, className }: CustomContentSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [contenus, setContenus] = useState<Contenu[]>([]);
    const selectRef = useRef<HTMLDivElement | null>(null);

    // Récupération des contenus depuis l'API
    useEffect(() => {
        const fetchContenus = async () => {
            try {
                const response = await fetch("/api/contenu/getContenu", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: 1 }), // Action pour récupérer tous les contenus
                });

                const data = await response.json();
                setContenus(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des contenus :", error);
            }
        };

        fetchContenus();
    }, []);

    // Ferme le menu lorsqu'on clique ailleurs
    useEffect(() => {
        const closeDropdown = (e: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        window.addEventListener("click", closeDropdown);
        return () => window.removeEventListener("click", closeDropdown);
    }, []);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (contentId: number) => {
        setSelectedContent(contentId);
        setIsOpen(false);
    };

    const selectedContentData = contenus.find((contenu) => contenu.idContenu === selectedContent);

    return (
        <div ref={selectRef} className={`relative ${className}`}>
            {/* Sélection affichée */}
            <div
                className="bg-transparent text-white border border-white rounded p-2 cursor-pointer select-none flex items-center justify-between"
                onClick={toggleDropdown}
            >
                <span className={selectedContent ? "text-white" : "text-gray-400"}>
                    {selectedContent && selectedContentData ? selectedContentData.titre : placeholder}
                </span>
                <span className="ml-2">▼</span>
            </div>

            {/* Liste déroulante */}
            {isOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-gray-900 border border-gray-700 rounded shadow-lg z-50 animate-fadeIn max-h-60 overflow-y-auto p-2">
                    {contenus.length > 0 ? (
                        <ul>
                            {contenus.map((contenu) => (
                                <li
                                    key={contenu.idContenu}
                                    className="p-2 cursor-pointer hover:bg-gray-700 rounded transition"
                                    onClick={() => handleSelect(contenu.idContenu)}
                                >
                                    {contenu.titre}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400 p-2 text-center">Aucun contenu disponible</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CustomContentSelect;
