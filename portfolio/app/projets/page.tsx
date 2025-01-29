// app/projets/page.tsx
"use client";

import { useEffect, useState } from 'react';
import ProjectCard from '@/components/Projects/ProjectCard';

export default function ProjectsPage() {
  interface Project {
    id: number;
    title: string;
    category: string;
    imageUrl: string;
    description: string;
  }

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data);
      setFilteredProjects(data);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const filterProjects = () => {
      let filtered = projects;

      if (categoryFilter) {
        filtered = filtered.filter((project) => project.category === categoryFilter);
      }

      if (nameFilter) {
        filtered = filtered.filter((project) => project.title.toLowerCase().includes(nameFilter.toLowerCase()));
      }

      setFilteredProjects(filtered);
    };

    filterProjects();
  }, [projects, categoryFilter, nameFilter]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameFilter(e.target.value);
  };

  if (loading) {
    return <div className="text-center text-xl">Chargement...</div>;
  }

  const categories = [...new Set(projects.map((project) => project.category))];

  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-bold text-center text-cyan-400">Mes Projets</h2>

      <div className="flex flex-col md:flex-row justify-between items-center mb-4 p-4 rounded-lg">
        <input
          type="text"
          placeholder="Rechercher par nom"
          value={nameFilter}
          onChange={handleNameChange}
          className="border border-gray-700 p-2 rounded bg-gray-900 text-white"
        />

        <select
          value={categoryFilter}
          onChange={handleCategoryChange}
          className="border border-gray-700 p-2 rounded mt-2 md:mt-0 md:ml-4 bg-gray-900 text-white"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <div className="text-center text-red-400">Aucun projet correspondant aux critères de filtrage.</div>
        )}
      </div>
    </div>
  );
}
