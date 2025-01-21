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
  if (!project) {
    return <div className="text-center text-lg">Chargement...</div>;
  }

  return (
    <div className="template2">
      <h1 className="text-4xl font-bold mb-4 text-center">{project.title}</h1>
      <p className="text-lg mb-6 text-center">{project.description}</p>

      {/* Affichage de l'image principale si disponible */}
      {project.imagePrinc && (
        <div className="mb-6 flex justify-center">
          <img
            src={project.imagePrinc.url}
            alt={`Image principale du projet ${project.title}`}
            className="rounded-lg shadow-lg max-w-lg"
          />
        </div>
      )}

      {/* Affichage des images associées */}
      <div className="flex flex-wrap justify-center gap-4">
        {project.images.map((image) => (
          <img
            key={image.id}
            src={image.url}
            alt={`Image du projet ${project.title}`}
            className="w-full md:w-1/4 lg:w-1/6 p-2 rounded-lg shadow-lg"
          />
        ))}
      </div>
    </div>
  );
};

export default Template2;
