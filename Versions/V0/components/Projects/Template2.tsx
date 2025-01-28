import React from 'react';

interface Image {
    id: number;
    url: string;
}

interface ProjectDetail {
    id: number;
    title: string;
    description: string;
    images: Image[];
    imagePrinc?: Image; // Image principale (optionnelle)
}

interface Template2Props {
    project: ProjectDetail;
}

const Template2: React.FC<Template2Props> = ({ project }) => {
    // Vérification des données de `project`
    if (!project) {
        console.error("Le projet est introuvable.");
        return <div>Projet introuvable.</div>;
    }

    // Vérification des images
    if (!project.images || project.images.length === 0) {
        console.warn(`Aucune image trouvée pour le projet ${project.title}.`);
    }

    console.log('Données du projet dans Template2:', project);

    return (
        <div className="template2 bg-gray-100 p-8 rounded-lg shadow-xl">
            {/* Titre et description */}
            <div className="text-center mb-8">
                <h1 className="text-5xl font-extrabold text-gray-800 mb-4">{project.title}</h1>
                <p className="text-xl text-gray-600">{project.description}</p>
            </div>

            {/* Image principale */}
            {project.imagePrinc ? (
                <div className="mb-8">
                    <img
                        src={project.imagePrinc.url}
                        alt={`Image principale du projet ${project.title}`}
                        className="w-full h-96 object-cover rounded-lg shadow-md"
                    />
                </div>
            ) : (
                <p className="text-center text-gray-500">Pas d'image principale disponible.</p>
            )}

            {/* Images associées */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.images && project.images.length > 0 ? (
                    project.images.map((image) => {
                        if (!image.url) {
                            console.error(`Image sans URL trouvée :`, image);
                            return null;
                        }
                        return (
                            <div key={image.id} className="relative group">
                                <img
                                    src={image.url}
                                    alt={`Image du projet ${project.title}`}
                                    className="w-full h-64 object-cover rounded-lg shadow-md transition-transform transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                    <p className="text-white text-lg font-medium">Voir plus</p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-center text-gray-500 col-span-full">Pas d'images associées.</p>
                )}
            </div>
        </div>
    );
};

export default Template2;
