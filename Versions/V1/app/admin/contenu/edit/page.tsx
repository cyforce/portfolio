"use client";

import {useEffect, useState} from "react";
import Composant1 from "@/components/composants/1";
import Composant2 from "@/components/composants/2";
import Composant3 from "@/components/composants/3";
import CustomImageSelect from "@/components/Contenu/CustomImageSelect";

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

export default function EditContentPage() {
    const [addComposant, setAddComposant] = useState(false);
    const [composantType, setComposantType] = useState("0");
    const [selectedImages, setSelectedImages] = useState<number[]>([]);
    const [newComposantTxts, setNewComposantTxts] = useState<string[]>([]);
    const [insertionIndex, setInsertionIndex] = useState<number | null>(null);
    const [editingIndex, setEditingIndex] = useState(-1);
    const [images, setImages] = useState<Image[]>([]);
    const [page, setPage] = useState<ComposantData[]>([
        {
            type: 1,
            texts: ["Titre 1", "Description 1"],
            imgs: [{ idImage: 0, url: "placholder6.jpg", alt: "Image 1" }],
        },
        {
            type: 2,
            texts: ["Titre 2", "Description 2"],
            imgs: [{ idImage: 0, url: "placholder6.jpg", alt: "Image 2" }],
        },
        {
            type: 3,
            texts: ["Titre 3", "Description 3"],
            imgs: [{ idImage: 0, url: "placholder6.jpg", alt: "Image 3" }],
        },
    ]);

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

    const getImage = (idImage: number): Image | undefined => {
        return images.find((image) => image.idImage === idImage);
    }

    const handleImageSelect = (index: number, imageId: number) => {
        setSelectedImages((prev) => {
            const newImages = [...prev];
            newImages[index] = imageId;
            return newImages;
        });
    };

    const handleTextChange = (index: number, text: string) => {
        setNewComposantTxts((prev) => {
            const newTxts = [...prev];
            newTxts[index] = text;
            return newTxts;
        });
    };

    function handleComposantAddToggle(index: number | null = null) {
        setAddComposant(!addComposant);
        document.body.style.overflowY = addComposant ? "auto" : "hidden";
        setSelectedImages([]);
        setNewComposantTxts([]);
        setComposantType("0");
        setInsertionIndex(index); // Définir l'index cible pour l'ajout
    }

    function handleTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setComposantType(e.target.value);
        setSelectedImages([0]);
        setNewComposantTxts([]);
    }

    function handleComposantAdd() {
        const newComposant: ComposantData = {
            type: parseInt(composantType),
            texts: newComposantTxts,
            imgs: selectedImages.map((idImage) => (getImage(idImage) ?? { idImage: 0, url: "", alt: "" })),
        };

        console.log(newComposant);

        setPage((prevPage) => {
            const newPage = [...prevPage];
            if (insertionIndex !== null) {
                newPage.splice(insertionIndex, 0, newComposant); // Insère à l'index spécifié
            } else {
                newPage.push(newComposant); // Ajoute à la fin si aucun index n'est spécifié
            }
            return newPage;
        });

        handleComposantAddToggle(); // Ferme le modal après l'ajout
    }

    function handleComposantEdit(index: number, updatedComposant: Partial<ComposantData>) {
        setPage((prevPage) => {
            const newPage = [...prevPage];

            // Transformation des IDs d'images en objets Image complets
            const updatedImgs = updatedComposant.imgs
                ? updatedComposant.imgs.map((img) => ({
                    idImage: img.idImage,
                    url: getImage(img.idImage)?.url || "",
                    alt: getImage(img.idImage)?.alt || "",
                }))
                : newPage[index].imgs;

            // Mise à jour du composant ciblé
            newPage[index] = {
                ...newPage[index],
                ...updatedComposant,
                texts: updatedComposant.texts ?? newPage[index].texts,
                imgs: updatedImgs, // Correction : On met bien à jour l'URL et l'ALT
            };

            console.log(newPage[index]);
            return newPage; // Mise à jour de l'état
        });
    }

    function handleComposantEditToggle(index:number){
        if(editingIndex === -1){
            setEditingIndex(index);
            switch (page[index].type) {
                case 1:
                    setNewComposantTxts(page[index].texts);
                    setSelectedImages(page[index].imgs.map((img) => img.idImage));
                    break;
                case 2:
                    setNewComposantTxts(page[index].texts);
                    setSelectedImages(page[index].imgs.map((img) => img.idImage));
                    break;
                case 3:
                    setNewComposantTxts(page[index].texts);
                    setSelectedImages(page[index].imgs.map((img) => img.idImage));
                    break
                default:
                    break;
            }
        } else {
            setEditingIndex(-1);
            setNewComposantTxts([]);
            setSelectedImages([]);
        }
    }

    function handleDeleteComposant(index: number) {
        setPage((prevPage) => {
            const newPage = [...prevPage];
            newPage.splice(index, 1);  // Supprimer l'élément à l'index donné
            return newPage;
        });
    }

   const renderSpecificEditForm = (composant:ComposantData) => {
        switch (composant.type) {
            case 1:
                return (
                    <div>
                        <label className="block mb-2">Titre :</label>
                        <input
                            type="text"
                            defaultValue={composant.texts[0]}
                            className="w-full p-2 bg-gray-700 text-white rounded mb-2"
                            onChange={(e) => handleTextChange(0, e.target.value)}
                        />
                        <label className="block mb-2">Sous-titre :</label>
                        <input
                            type="text"
                            defaultValue={composant.texts[1]}
                            className="w-full p-2 bg-gray-700 text-white rounded mb-2"
                            onChange={(e) => handleTextChange(1, e.target.value)}
                        />
                        <label className="block mb-2">Image :</label>
                        <CustomImageSelect
                            selectedImage={selectedImages[0]}
                            setSelectedImage={(imageId) =>
                                handleImageSelect(0, imageId)
                            }
                            placeholder="Modifier l'image"
                            images={page.flatMap((c) => c.imgs)}
                        />
                    </div>
                );
            case 2:
                return (
                    <div className="w-full">
                        <label className="block mb-2">Gros 1 :</label>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-700 text-white rounded mb-2"
                            defaultValue={composant.texts[0]}
                            onChange={(e) => handleTextChange(0, e.target.value)}
                        />
                        <label className="block mb-2">Petit 1 :</label>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-700 text-white rounded mb-2"
                            defaultValue={composant.texts[1]}
                            onChange={(e) => handleTextChange(1, e.target.value)}
                        />
                        <label className="block mb-2">Gros 2 :</label>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-700 text-white rounded mb-2"
                            defaultValue={composant.texts[2]}
                            onChange={(e) => handleTextChange(2, e.target.value)}
                        />
                        <label className="block mb-2">Petit 2 :</label>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-700 text-white rounded mb-2"
                            defaultValue={composant.texts[3]}
                            onChange={(e) => handleTextChange(3, e.target.value)}
                        />
                        <label className="block mb-2">Gros 3 :</label>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-700 text-white rounded mb-2"
                            defaultValue={composant.texts[4]}
                            onChange={(e) => handleTextChange(4, e.target.value)}
                        />
                        <label className="block mb-2">Petit 3 :</label>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-700 text-white rounded mb-2"
                            defaultValue={composant.texts[5]}
                            onChange={(e) => handleTextChange(5, e.target.value)}
                        />
                        <label className="block mb-2">Image :</label>
                        <CustomImageSelect
                            selectedImage={selectedImages[0] ?? 0}
                            setSelectedImage={(imageId) => handleImageSelect(0, imageId)}
                            placeholder="Sélectionner une image"
                            images={page.flatMap((composant) => composant.imgs)}
                        />
                    </div>
                );
            case 3:
                return (
                    <div className="w-full">
                        <label className="block mb-2">Image :</label>
                        <CustomImageSelect
                            selectedImage={selectedImages[0] ?? 0}
                            setSelectedImage={(imageId) => handleImageSelect(0, imageId)}
                            placeholder="Sélectionner une image"
                            images={page.flatMap((composant) => composant.imgs)}
                        />
                        <label className="block mb-2">Gros 1 :</label>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-700 text-white rounded mb-2"
                            defaultValue={composant.texts[0]}
                            onChange={(e) => handleTextChange(0, e.target.value)}
                        />
                        <label className="block mb-2">Petit 1 :</label>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-700 text-white rounded mb-2"
                            defaultValue={composant.texts[1]}
                            onChange={(e) => handleTextChange(1, e.target.value)}
                        />
                        <label className="block mb-2">Gros 2 :</label>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-700 text-white rounded mb-2"
                            defaultValue={composant.texts[2]}
                            onChange={(e) => handleTextChange(2, e.target.value)}
                        />
                        <label className="block mb-2">Petit 2 :</label>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-700 text-white rounded mb-2"
                            defaultValue={composant.texts[3]}
                            onChange={(e) => handleTextChange(3, e.target.value)}
                        />
                        <label className="block mb-2">Gros 3 :</label>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-700 text-white rounded mb-2"
                            defaultValue={composant.texts[4]}
                            onChange={(e) => handleTextChange(4, e.target.value)}
                        />
                        <label className="block mb-2">Petit 3 :</label>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-700 text-white rounded mb-2"
                            defaultValue={composant.texts[5]}
                            onChange={(e) => handleTextChange(5, e.target.value)}
                        />
                    </div>
                );
            default:
                return <div></div>;
        }
   }

    const renderEditForm = (index: number) => {
        const composant = page[index];

        return (
            <div className="fixed inset-x-0 top-[3.45rem] bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-[60] overflow-y-auto w-screen h-[calc(100vh-3.45rem)]">
                <form className="bg-gray-800 p-5 m-0 rounded-lg w-full max-w-md max-h-[calc(100vh-3.45rem)] overflow-y-auto">
                    <h2 className="text-lg font-bold mb-4">Modifier le composant</h2>
                    {renderSpecificEditForm(composant)}

                    <div className="flex justify-between mt-4">
                        <button
                            type="button"
                            onClick={() => setEditingIndex(-1)} // Fermer le formulaire
                            className="px-4 py-2 bg-red-500 hover:bg-red-400 rounded"
                        >
                            Annuler
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                handleComposantEdit(index, {
                                    texts: newComposantTxts,
                                    imgs: selectedImages.map((idImage) => ({
                                        idImage,
                                        url: "",
                                        alt: "",
                                    })),
                                });
                                setEditingIndex(-1); // Fermer le formulaire
                            }}
                            className="px-4 py-2 bg-green-500 hover:bg-green-400 rounded"
                        >
                            Sauvegarder
                        </button>
                    </div>
                </form>
            </div>
        );
    };


    const renderComposantsWithEdit = (composant: ComposantData, index: number) => (
        <div key={index} className="relative w-screen">
            {renderComposant(composant, index)}
            {editingIndex === index && renderEditForm(index)}

            {/* Bouton de suppression */}
            <div className="absolute top-10 right-10 w-14 h-14 flex items-center justify-center rounded-full cursor-pointer z-10" onClick={() => handleDeleteComposant(index)}>
                <div className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-400 cursor-pointer flex items-center justify-center relative rotate-45">
                    <div className="absolute w-1.5 h-8 bg-white"></div>
                    <div className="absolute w-8 h-1.5 bg-white"></div>
                </div>
            </div>

            {/* Bouton d'édition */}
            <div className="absolute top-10 right-28 w-14 h-14 flex items-center justify-center rounded-full cursor-pointer z-10" onClick={() => handleComposantEditToggle(index)}>
                <div className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-400 cursor-pointer flex items-center justify-center relative">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="w-6 h-6"
                        fill="white"
                    >
                        <g transform="translate(0,512) scale(0.1,-0.1)">
                            <path d="M865 5105 c-81 -18 -158 -49 -219 -90 -69 -46 -526 -509 -559 -566 -44 -77 -78 -194 -84 -288 -7 -112 14 -211 68 -321 39 -79 57 -100 258 -303 l216 -218 628 629 628 628 -218 215 c-202 200 -224 219 -303 258 -137 67 -278 86 -415 56z" />
                            <path d="M1350 3765 l-625 -625 988 -988 987 -987 627 628 628 627 -985 985 c-542 542 -987 985 -990 985 -3 0 -286 -281 -630 -625z" />
                            <path d="M3507 1612 l-627 -627 313 -313 314 -313 804 -179 c442 -98 804 -178 806 -177 1 2 -79 364 -177 806 l-179 805 -313 313 -313 313 -628 -628z" />
                        </g>
                    </svg>
                </div>
            </div>

            {/* Bouton vert (ajout) */}
            <div
                onClick={() => handleComposantAddToggle(index + 1)} // Définit l'index cible
                className="w-full h-14 flex items-center justify-center rounded-full relative z-10 mt-5"
            >
                <div className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 cursor-pointer flex items-center justify-center relative mb-5">
                    <div className="absolute w-1.5 h-8 bg-white"></div>
                    <div className="absolute w-8 h-1.5 bg-white"></div>
                </div>
            </div>
        </div>
    );

    const renderComposant = (composant: ComposantData, index: number) => {
        switch (composant.type) {
            case 1:
                return <Composant1 key={index} texts={composant.texts} imgs={composant.imgs} className={"border-2 border-amber-600"}/>;
            case 2:
                return <Composant2 key={index} texts={composant.texts} imgs={composant.imgs} className={"border-2 border-amber-600"}/>;
            case 3:
                return <Composant3 key={index} texts={composant.texts} imgs={composant.imgs} className={"border-2 border-amber-600"}/>;
            default:
                return <div key={index} className="text-red-500">Type inconnu</div>;
        }
    };

    const renderComposantAdd = () => (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[60] p-4 mt-[3.45rem]">
            <form className="bg-gray-800 p-5 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <label className="block mb-2">Sélectionner le type à ajouter :</label>
                <select onChange={handleTypeChange} className="w-full p-2 bg-gray-700 text-white rounded">
                    <option value="0">Sélectionner un type</option>
                    <option value="1">Titre et image en fond</option>
                    <option value="2">Texte gauche, image droite</option>
                    <option value="3">Image gauche, texte droite</option>
                </select>
                {renderComposantForm(composantType)}
                <div className="flex justify-between mt-4">
                    <button type="button" onClick={() => handleComposantAddToggle()} className="px-4 py-2 bg-red-500 hover:bg-red-400 rounded">
                        Annuler
                    </button>
                    <button type="button" onClick={handleComposantAdd} className="px-4 py-2 bg-green-500 hover:bg-green-400 rounded">
                        Ajouter
                    </button>
                </div>
            </form>
        </div>
    );


    const renderComposantForm = (type: string) => {
        switch (type) {
            case "1":
                return (
                    <div className="w-full">
                        <label className="block mb-2">Titre :</label>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-700 text-white rounded mb-2"
                            placeholder="Titre"
                            onChange={(e) => handleTextChange(0, e.target.value)}
                        />
                        <label className="block mb-2">Sous-titre :</label>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-700 text-white rounded mb-2"
                            placeholder="Sous-titre"
                            onChange={(e) => handleTextChange(1, e.target.value)}
                        />
                        <label className="block mb-2">Image :</label>
                        <CustomImageSelect
                            selectedImage={selectedImages[0] ?? 0}
                            setSelectedImage={(imageId) => handleImageSelect(0, imageId)}
                            placeholder="Sélectionner une image"
                            images={page.flatMap((composant) => composant.imgs)}
                        />
                    </div>
                );
            case "2":
                return (
                    <div className="w-full">
                        <label className="block mb-2">Gros 1 :</label>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-700 text-white rounded mb-2"
                            placeholder="Gros 1"
                            onChange={(e) => handleTextChange(0, e.target.value)}
                        />
                        <label className="block mb-2">Petit 1 :</label>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-700 text-white rounded mb-2"
                            placeholder="Petit 1"
                            onChange={(e) => handleTextChange(1, e.target.value)}
                        />
                        <label className="block mb-2">Gros 2 :</label>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-700 text-white rounded mb-2"
                            placeholder="Gros 1"
                            onChange={(e) => handleTextChange(0, e.target.value)}
                        />
                        <label className="block mb-2">Petit 2 :</label>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-700 text-white rounded mb-2"
                            placeholder="Petit 1"
                            onChange={(e) => handleTextChange(1, e.target.value)}
                        />
                        <label className="block mb-2">Gros 3 :</label>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-700 text-white rounded mb-2"
                            placeholder="Gros 1"
                            onChange={(e) => handleTextChange(0, e.target.value)}
                        />
                        <label className="block mb-2">Petit 3 :</label>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-700 text-white rounded mb-2"
                            placeholder="Petit 1"
                            onChange={(e) => handleTextChange(1, e.target.value)}
                        />
                        <label className="block mb-2">Image :</label>
                        <CustomImageSelect
                            selectedImage={selectedImages[0] ?? 0}
                            setSelectedImage={(imageId) => handleImageSelect(0, imageId)}
                            placeholder="Sélectionner une image"
                            images={page.flatMap((composant) => composant.imgs)}
                        />
                    </div>
                );
            case "3":
                return (
                    <div className="w-full">
                        <label className="block mb-2">Image :</label>
                        <CustomImageSelect
                            selectedImage={selectedImages[0] ?? 0}
                            setSelectedImage={(imageId) => handleImageSelect(0, imageId)}
                            placeholder="Sélectionner une image"
                            images={page.flatMap((composant) => composant.imgs)}
                        />
                        <label className="block mb-2">Gros 1 :</label>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-700 text-white rounded mb-2"
                            placeholder="Gros 1"
                            onChange={(e) => handleTextChange(0, e.target.value)}
                        />
                        <label className="block mb-2">Petit 1 :</label>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-700 text-white rounded mb-2"
                            placeholder="Petit 1"
                            onChange={(e) => handleTextChange(1, e.target.value)}
                        />
                        <label className="block mb-2">Gros 2 :</label>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-700 text-white rounded mb-2"
                            placeholder="Gros 1"
                            onChange={(e) => handleTextChange(0, e.target.value)}
                        />
                        <label className="block mb-2">Petit 2 :</label>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-700 text-white rounded mb-2"
                            placeholder="Petit 1"
                            onChange={(e) => handleTextChange(1, e.target.value)}
                        />
                        <label className="block mb-2">Gros 3 :</label>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-700 text-white rounded mb-2"
                            placeholder="Gros 1"
                            onChange={(e) => handleTextChange(0, e.target.value)}
                        />
                        <label className="block mb-2">Petit 3 :</label>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-700 text-white rounded mb-2"
                            placeholder="Petit 1"
                            onChange={(e) => handleTextChange(1, e.target.value)}
                        />
                    </div>
                )
            default:
                return <div></div>;
        }
    };

    return (
        <div className="text-white min-h-screen relative">
            {/* Menu de sauvegarde et retour */}
            <div className={"fixed top[3.45rem] left-0 w-16 h-36 bg-gray-800 flex justify-evenly items-center flex-col z-50 rounded-r-2xl"}>
                {/* Bouton de retour */}
                <div className={"w-14 h-14 rounded-full bg-red-500 hover:bg-red-400 cursor-pointer flex items-center justify-center relative"}>
                    <svg fill="#FFFFFF" className="w-7 h-7 text-white cursor-pointer" viewBox="0 0 1024 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M704 288h-281.6l177.6-202.88a32 32 0 0 0-48.32-42.24l-224 256a30.08 30.08 0 0 0-2.24 3.84 32 32 0 0 0-2.88 4.16v1.92a32 32 0 0 0 0 5.12A32 32 0 0 0 320 320a32 32 0 0 0 0 4.8 32 32 0 0 0 0 5.12v1.92a32 32 0 0 0 2.88 4.16 30.08 30.08 0 0 0 2.24 3.84l224 256a32 32 0 1 0 48.32-42.24L422.4 352H704a224 224 0 0 1 224 224v128a224 224 0 0 1-224 224H320a232 232 0 0 1-28.16-1.6 32 32 0 0 0-35.84 27.84 32 32 0 0 0 27.84 35.52A295.04 295.04 0 0 0 320 992h384a288 288 0 0 0 288-288v-128a288 288 0 0 0-288-288zM103.04 760a32 32 0 0 0-62.08 16A289.92 289.92 0 0 0 140.16 928a32 32 0 0 0 40-49.92 225.6 225.6 0 0 1-77.12-118.08zM64 672a32 32 0 0 0 22.72-9.28 37.12 37.12 0 0 0 6.72-10.56A32 32 0 0 0 96 640a33.6 33.6 0 0 0-9.28-22.72 32 32 0 0 0-10.56-6.72 32 32 0 0 0-34.88 6.72A32 32 0 0 0 32 640a32 32 0 0 0 2.56 12.16 37.12 37.12 0 0 0 6.72 10.56A32 32 0 0 0 64 672z"
                            fill="#FFFFFF"/>
                    </svg>
                </div>

                {/* Bouton de sauvegarde */}
                <div
                    className={"w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 cursor-pointer flex items-center justify-center relative"}>
                    <svg fill="#FFFFFF" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                         className="w-7 h-7 text-white cursor-pointer" viewBox="0 0 407.096 407.096">
                        <g>
                            <g>
                                <path d="M402.115,84.008L323.088,4.981C319.899,1.792,315.574,0,311.063,0H17.005C7.613,0,0,7.614,0,17.005v373.086
                                    c0,9.392,7.613,17.005,17.005,17.005h373.086c9.392,0,17.005-7.613,17.005-17.005V96.032
                                    C407.096,91.523,405.305,87.197,402.115,84.008z M300.664,163.567H67.129V38.862h233.535V163.567z"/>
                                <path d="M214.051,148.16h43.08c3.131,0,5.668-2.538,5.668-5.669V59.584c0-3.13-2.537-5.668-5.668-5.668h-43.08
                                    c-3.131,0-5.668,2.538-5.668,5.668v82.907C208.383,145.622,210.92,148.16,214.051,148.16z"/>
                            </g>
                        </g>
                    </svg>
                </div>
            </div>

            {/* Bouton vert (ajout) */}
            <div
                onClick={() => handleComposantAddToggle(0)} // Définit l'index cible
                className="w-full h-14 flex items-center justify-center rounded-full relative z-10 mt-5"
            >
                <div className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 cursor-pointer flex items-center justify-center relative mb-5">
                    <div className="absolute w-1.5 h-8 bg-white"></div>
                    <div className="absolute w-8 h-1.5 bg-white"></div>
                </div>
            </div>
            {page.map(renderComposantsWithEdit)}
            {addComposant && renderComposantAdd()}
        </div>
    );
}
