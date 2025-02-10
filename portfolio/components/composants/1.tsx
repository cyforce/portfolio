interface Composant {
    texts: string[];
    imgs: Image[];
}

interface Image {
    idImage: number;
    url: string;
    alt: string;
}

export default function Composant1({ texts, imgs, className }: Composant & { className?: string }) {
    // Vérification et construction du chemin de l'image
    // const imageUrl = imgs.length > 0 ? `/images/${imgs[0]}.jpg` : "/images/placeholder.jpg";

    const imageUrl = `/images/${imgs[0].url}`;

    return (
        <div
            className={`w-screen h-[calc(100vh-3.45rem)] flex items-center justify-center text-white relative bg-cover bg-center mb-3 ${className}`}
            style={{ backgroundImage: `url(${imageUrl})` }}
        >
            {/* Overlay pour améliorer la lisibilité */}
            <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>

            {/* Contenu centré */}
            <div className="relative z-10 p-10 text-center max-w-2xl">
                <h1 className="text-4xl font-bold mb-4">{texts[0] || "Titre par défaut"}</h1>
                <p className="text-lg">{texts[1] || "Texte par défaut."}</p>
            </div>
        </div>
    );
}
