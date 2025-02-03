"use client"

import { useRouter } from "next/navigation";
import Composant1 from "@/components/composants/1";
import Composant2 from "@/components/composants/2";

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
    page: string;
}

export default function editContentPage() {
    let page = [
        {
            type: 1,
            texts: ["abc", "abc"],
            imgs: [12]
        },
        {
            type: 2,
            texts: ["abc", "abc"],
            imgs: [12]
        },
        {
            type: 2,
            texts: ["abc", "abc"],
            imgs: [12]
        }
    ];

    return (
        <div className="p-10 text-white min-h-screen relative">
            {page.map((composant: { type: number; texts: string[]; imgs: number[] }, index) => {
                switch (composant.type) {
                    case 1:
                        return <Composant1 key={index} texts={composant.texts} imgs={composant.imgs} />;
                    case 2:
                        return <Composant2 key={index} texts={composant.texts} imgs={composant.imgs} />;
                    default:
                        return <div key={index}>Type de composant inconnu</div>; // Garde une gestion d'erreur
                }
            })}
        </div>
    );
}