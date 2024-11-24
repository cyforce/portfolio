"use client";

import { useRouter, useParams } from 'next/navigation';
import Carousel from '@/components/Carousel';
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
          setProject(null);
          setLoading(false);
          return;
        }
        const data = await response.json();
        setProject(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        setError('Erreur lors de la récupération des données');
      }
      setLoading(false);
    };

    fetchProject();
  }, [params?.id]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;
  if (!project) return <div>Projet introuvable</div>;

  return (
    <div className="p-6">
      <h2 className="text-4xl font-bold text-center text-cyan-400 mb-4">Mes Projets</h2>
      <button onClick={() => router.back()} className="border border-gray-700 p-2 rounded mt-2 md:mt-0 md:ml-4 bg-gray-900 text-white">
        ← Retour aux projets
      </button>
      <h1 className="text-2xl font-bold mt-4 mb-4">{project.title}</h1>
      <p className="mb-4">{project.description}</p>
      <Carousel images={project.images} />
    </div>
  );
}
