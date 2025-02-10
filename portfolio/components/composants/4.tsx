interface Composant {
    texts: string[];
    imgs: Image[];
}

interface Image {
    idImage: number;
    url: string;
    alt: string;
}

export default function Composant4({ texts, imgs, className }: Composant & { className?: string }) {
    // Vérification et construction du chemin de l'image
    // const imageUrl = imgs.length > 0 ? `/images/${imgs[0]}.jpg` : "/images/placeholder.jpg";

    const imageUrl = "/images/nebuleuse-coloree-etoiles-nebuleuse-arriere-plan_910054-24675.jpg";

    return (
        <div className={`w-screen h-[calc(100vh-3.45rem)] flex items-center justify-center text-white relative z-10 mb-3 ${className}`}>
            {/* Image */}
            <img src={imageUrl} alt={imgs[0].alt} className="h-full w-1/2 object-cover" />

            {/* Contenu centré */}
            <div className="relative p-10 text-center w-1/2">
                <h1 className="text-4xl font-bold mb-4">{texts[0] || "Titre par défaut"}</h1>
                <p className="text-lg">{texts[1] || "Texte par défaut."}</p>
            </div>
        </div>
    );
}
