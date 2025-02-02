"use client";

import { useEffect, useState } from "react";
import AddImageForm from "@/components/addImageForm";
import { useRouter } from "next/navigation";

interface Contenu {
    idContenu: number;
    titre: string;
    description: string;
    type: string;
    imagePrincContenu: string;
}

    export default function AdminContentPage() {

    const router = useRouter();

    return (
        <div className="p-10 text-white min-h-screen">
            <button onClick={() => router.push("/admin")} className={"z-20 absolute top-16 left-2 bg-amber-500 px-4 py-2 text-white rounded hover:bg-amber-400"}>Retour</button>
            <h1 className="text-3xl font-bold text-center mb-6">Gestion du contenu</h1>

            <div className={"flex justify-between items-center"}>
                <input type="text" placeholder="Rechercher..." className="p-2 rounded border border-white bg-transparent text-white"/>
                <select className={"p-2 rounded border border-white bg-transparent text-white"}>
                    <option value="">Tous</option>
                    <option value="0">Projet</option>
                    <option value="1">Competence</option>
                </select>
            </div>

            <div className={"flex flex-wrap gap-4 mt-4 items-center justify-center"}>
                {/* Contenus */}
                <div className={"bg-gray-800 rounded p-4 w-96"}>
                    <img src={"/images/placholder1.jpg"} alt={"Image"} className={"w-full h-32 object-cover rounded"}/>
                    <h2 className={"text-xl font-bold"}>Titre</h2>
                    <p className={"text-sm"}>Description</p>
                    <div className={"flex justify-between items-center mt-2 flex-col gap-2"}>
                        <button className={"px-4 py-2 bg-green-500 hover:bg-green-400 rounded w-full"}>Modifier</button>
                        <button className={"px-4 py-2 bg-red-500 hover:bg-red-400 rounded w-full"}>Supprimer</button>
                    </div>
                </div>
                <div className={"bg-gray-800 rounded p-4 w-96"}>
                    <img src={"/images/placholder1.jpg"} alt={"Image"} className={"w-full h-32 object-cover rounded"}/>
                    <h2 className={"text-xl font-bold"}>Titre</h2>
                    <p className={"text-sm"}>Description</p>
                    <div className={"flex justify-between items-center mt-2 flex-col gap-2"}>
                        <button className={"px-4 py-2 bg-green-500 hover:bg-green-400 rounded w-full"}>Modifier</button>
                        <button className={"px-4 py-2 bg-red-500 hover:bg-red-400 rounded w-full"}>Supprimer</button>
                    </div>
                </div>
                <div className={"bg-gray-800 rounded p-4 w-96"}>
                    <img src={"/images/placholder1.jpg"} alt={"Image"} className={"w-full h-32 object-cover rounded"}/>
                    <h2 className={"text-xl font-bold"}>Titre</h2>
                    <p className={"text-sm"}>Description</p>
                    <div className={"flex justify-between items-center mt-2 flex-col gap-2"}>
                        <button className={"px-4 py-2 bg-green-500 hover:bg-green-400 rounded w-full"}>Modifier</button>
                        <button className={"px-4 py-2 bg-red-500 hover:bg-red-400 rounded w-full"}>Supprimer</button>
                    </div>
                </div>
                <div className={"bg-gray-800 rounded p-4 w-96"}>
                    <img src={"/images/placholder1.jpg"} alt={"Image"} className={"w-full h-32 object-cover rounded"}/>
                    <h2 className={"text-xl font-bold"}>Titre</h2>
                    <p className={"text-sm"}>Description</p>
                    <div className={"flex justify-between items-center mt-2 flex-col gap-2"}>
                        <button className={"px-4 py-2 bg-green-500 hover:bg-green-400 rounded w-full"}>Modifier</button>
                        <button className={"px-4 py-2 bg-red-500 hover:bg-red-400 rounded w-full"}>Supprimer</button>
                    </div>
                </div>
                <div className={"bg-gray-800 rounded p-4 w-96"}>
                    <img src={"/images/placholder1.jpg"} alt={"Image"} className={"w-full h-32 object-cover rounded"}/>
                    <h2 className={"text-xl font-bold"}>Titre</h2>
                    <p className={"text-sm"}>Description</p>
                    <div className={"flex justify-between items-center mt-2 flex-col gap-2"}>
                        <button className={"px-4 py-2 bg-green-500 hover:bg-green-400 rounded w-full"}>Modifier</button>
                        <button className={"px-4 py-2 bg-red-500 hover:bg-red-400 rounded w-full"}>Supprimer</button>
                    </div>
                </div>
                <div className={"bg-gray-800 rounded p-4 w-96"}>
                    <img src={"/images/placholder1.jpg"} alt={"Image"} className={"w-full h-32 object-cover rounded"}/>
                    <h2 className={"text-xl font-bold"}>Titre</h2>
                    <p className={"text-sm"}>Description</p>
                    <div className={"flex justify-between items-center mt-2 flex-col gap-2"}>
                        <button className={"px-4 py-2 bg-green-500 hover:bg-green-400 rounded w-full"}>Modifier</button>
                        <button className={"px-4 py-2 bg-red-500 hover:bg-red-400 rounded w-full"}>Supprimer</button>
                    </div>
                </div>
            </div>
        </div>
    );
}