"use client";

import { useRouter, useParams } from 'next/navigation';
import P404 from '@/components/p404';
import { useState, useEffect } from 'react';

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

interface CompetenceDetail {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  level: number;
  projects: Project[];
}

export default function CompetenceDetailPage() {
  const [competence, setCompetence] = useState<CompetenceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchCompetence = async () => {
      if (!params?.id) {
        console.error('Params id est null');
        setLoading(false);
        return;
      }
      try {
        console.log(`Fetching competence with id: ${params.id}`);
        const response = await fetch(`/api/competences/${params.id}`);
        console.log(`Response status: ${response.status}`);
        if (!response.ok) {
          switch (response.status) {
            case 404:
              console.error('Compétence introuvable');
              setError('Compétence introuvable');
              router.push('/404'); // Redirection vers la page 404
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
        const data: CompetenceDetail = await response.json();
        setCompetence(data);
      } catch (error) {
        console.error('Erreur lors de la récupération de la compétence', error);
        setError('Erreur lors de la récupération de la compétence');
      } finally {
        setLoading(false);
      }
    };

    fetchCompetence();
  }, [params?.id, router]);

  if (loading) {
    return <div className="text-center text-xl">Chargement...</div>;
  }

  if (error) {
    return <P404 redirectTo="/competences" />;
  }

  const getLevelDescription = (level: number) => {
    switch (level) {
      case 1:
        return "Débutant";
      case 2:
        return "Intermédiaire";
      case 3:
        return "Avancé";
      case 4:
        return "Expert";
      default:
        return "Niveau inconnu";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {competence && (
        <>
          <h1 className="text-4xl font-bold text-center mb-4">{competence.name}</h1>
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <img
              src={competence.imageUrl}
              alt={competence.name}
              className="w-full md:w-1/2 rounded-lg shadow-lg mb-4 md:mb-0 md:mr-4"
            />
            <div className="md:w-1/2">
              <p className="text-lg mb-4">{competence.description}</p>
              <p className="text-lg font-semibold">Maitrise : {getLevelDescription(competence.level)}</p>
            </div>
          </div>
          {competence.projects.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Projets liés</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {competence.projects.map((project) => (
                  <a className="block border p-4 rounded-lg shadow-lg cursor-pointer hover:bg-gray-800 transition duration-200" href={`/projets/${project.id}`}>
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-sm mb-2">{project.description}</p>
                    <img src={project.imageUrl} alt={project.title} className="w-full rounded-lg" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
