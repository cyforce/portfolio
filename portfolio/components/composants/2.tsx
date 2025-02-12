import Image from "next/image";

interface Composant {
    texts: string[];
    imgs: Image[];
}

interface Image {
    idImage: number;
    url: string;
    alt: string;
}

export default function Composant2({ texts, imgs, className }: Composant & { className?: string }) {
    // Vérification et construction du chemin de l'image
    // const imageUrl = imgs.length > 0 ? `/images/${imgs[0]}.jpg` : "/images/placeholder.jpg";

    const imageUrl = `/images/${imgs[0].url}`;

    return (
        <div className={`w-screen h-[calc(100vh-3.45rem)] flex items-center justify-center text-white relative z-10 mb-3 ${className}`}>
            {/* Contenu centré */}
            <div className="relative p-10 text-center w-1/2 flex flex-col items-center justify-evenly h-full">
                <div>
                    <h1 className="text-4xl font-bold mb-4">{texts[0] || "Titre par défaut"}</h1>
                    <p className="text-lg mb-4">{texts[1] || "Sous-titre par défaut"}</p>
                </div>
                <div>
                    <h1 className="text-4xl font-bold mb-4">{texts[2] || "Titre par défaut"}</h1>
                    <p className="text-lg mb-4">{texts[3] || "Sous-titre par défaut"}</p>
                </div>
                <div>
                    <h1 className="text-4xl font-bold mb-4">{texts[4] || "Titre par défaut"}</h1>
                    <p className="text-lg mb-4">{texts[5] || "Sous-titre par défaut"}</p>
                </div>
            </div>
            {/* Image */}
            <Image src={imageUrl} alt={imgs[0].alt} className={"h-full w-1/2 object-cover"} />
        </div>
    );
}
