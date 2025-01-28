// /projets/[id]/page.tsx

"use client";

import { useRouter, useParams } from 'next/navigation';
import P404 from '@/components/p404';
import Template1 from '@/components/Projects/Template1';
import Template2 from '@/components/Projects/Template2';
import { useState, useEffect } from 'react';

interface ProjectDetail {
  id: number;
  title: string;
  description: string;
  images: Image[];
  templateId: number;
}

interface Image {
  id: number;
  url: string;
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
    return <div className="text-center text-xl">Chargement...</div>;
  }

  if (error) {
    return <P404 redirectTo="/projets" />;
  }

  const renderTemplate = () => {
    if (!project) return null;
    switch (project.templateId) {
      case 1:
        return <Template1 project={project} />;
      case 2:
        return <Template2 project={project} />;
      default:
        return <Template1 project={project} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 overflow-auto">
      {project && renderTemplate()}
    </div>
  );
}
