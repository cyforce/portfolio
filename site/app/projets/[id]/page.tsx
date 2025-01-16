"use client";

import { useRouter, useParams } from 'next/navigation';
import Carousel from '@/components/Carousel';
import P404 from '@/components/p404';
import { useState, useEffect } from 'react';

interface ProjectDetail {
  id: number;
  title: string;
  description: string;
  images: string[];
}

export default function ProjectDetailPage() {
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchProject = async () => {
      if (!params?.id) {
        console.error('Params id is null');
        setLoading(false);
        return;
      }
      try {
        console.log(`Fetching project with id: ${params.id}`);
        const response = await fetch(`/api/projects/${params.id}`);
        console.log(`Response status: ${response.status}`);
        if (!response.ok) {
          switch (response.status) {
            case 404:
              console.error('Projet introuvable');
              setError('Projet introuvable');
              // router.push('/404'); // Redirection vers la page 404
              break;
            case 400:
              console.error('Requête incorrecte');
              setError('Requête incorrecte');
              break;
            case 500:
              console.error('Erreur interne du serveur');
              setError('Erreur interne du serveur');
              break;
            default:
              console.error(`Erreur HTTP : ${response.status}`);
              setError(`Erreur HTTP : ${response.status}`);
          }
          setLoading(false);
          return;
        }
        const data: ProjectDetail = await response.json();
        setProject(data);
      } catch (error) {
        console.error('Erreur lors de la récupération du projet', error);
        setError('Erreur lors de la récupération du projet');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params?.id, router]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    // return <div>Erreur : {error}</div>;
    return <P404 redirectTo="/projets" text="Le projet est introuvable"/>;
  }

  return (
    <div>
      {project && (
        <>
          <h1>{project.title}</h1>
          <p>{project.description}</p>
          <Carousel images={project.images} />
        </>
      )}
    </div>
  );
}
