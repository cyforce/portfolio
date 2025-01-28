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

interface Template1Props {
  project: ProjectDetail;
}

const Template1: React.FC<Template1Props> = ({ project }) => {
  if (!project) {
    console.error('Le projet est introuvable.');
    return <div>Projet introuvable.</div>;
  }

  if (!project.images || project.images.length === 0) {
    console.warn(`Aucune image trouvée pour le projet ${project.title}.`);
  }

  return (
    <div className="template1">
      <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
      <p className="text-lg mb-4">{project.description}</p>
      {project.imagePrinc && (
        <div className="mb-4">
          <img
            src={project.imagePrinc.url}
            alt={`Image principale du projet ${project.title}`}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {project.images && project.images.map((image) => {
          if (!image.url) {
            console.error(`Image sans URL trouvée dans le projet ${project.title}.`);
            return null;
          }
          return (
            <img
              key={image.id}
              src={image.url}
              alt={`Image du projet ${project.title}`}
              className="w-full rounded-lg shadow-lg"
            />
          );
        })}
      </div>
    </div>
  );
};

export default Template1;
