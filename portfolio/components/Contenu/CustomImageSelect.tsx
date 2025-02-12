import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface Image {
    idImage: number;
    url: string;
    alt: string;
}

interface CustomImageSelectProps {
    selectedImage: number; // Utilise l'ID de l'image au lieu de l'URL
    setSelectedImage: (value: number) => void; // Passe l'ID à setSelectedImage
    images: Image[];
    placeholder: string;
}

const CustomImageSelect = ({ selectedImage, setSelectedImage, placeholder }: CustomImageSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [images, setImages] = useState<Image[]>([]);
    const selectRef = useRef<HTMLDivElement | null>(null);

    // Récupération des images depuis l'API `/api/getImage`
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch("/api/images/getImages");
                const data = await response.json();
                setImages(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des images :", error);
            }
        };
        fetchImages();
    }, []);

    // Toggle visibility of options
    const toggleDropdown = () => setIsOpen(!isOpen);

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

    const handleSelect = (imageId: number) => {
        setSelectedImage(imageId); // Passe l'ID de l'image sélectionnée
        setIsOpen(false);
    };

    const selectedImageData = images.find((image) => image.idImage === selectedImage); // Recherche l'image sélectionnée dans la liste

    return (
        <div ref={selectRef} className="relative w-full">
            {/* Sélection */}
            <div
                className="bg-transparent text-white border border-white rounded p-2 cursor-pointer select-none flex flex-col items-center"
                onClick={toggleDropdown}
            >
                {selectedImage && selectedImageData ? (
                    <Image src={`/Images/${selectedImageData.url}`} alt={selectedImageData.alt} className={"w-40 h-40 object-cover rounded-lg border border-gray-500 shadow-lg"}/>
                ) : (
                    <span className="text-gray-400">{placeholder}</span>
                )}
            </div>

            {/* Liste déroulante en grille */}
            {isOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-gray-900 border border-gray-700 rounded shadow-lg z-50 animate-fadeIn max-h-80 overflow-y-auto p-2">
                    {images.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                            {images.map((image) => (
                                <div
                                    key={image.idImage}
                                    className="cursor-pointer hover:scale-105 transition-transform duration-200"
                                    onClick={() => handleSelect(image.idImage)} // Passer l'ID de l'image
                                >
                                    <Image
                                        src={`/Images/${image.url}`}
                                        alt={image.alt}
                                        className={"w-full h-24 object-cover rounded-lg border border-gray-600"}/>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 p-2 text-center">Aucune image disponible</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CustomImageSelect;
