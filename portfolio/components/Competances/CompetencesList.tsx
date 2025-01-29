"use client";

import { useEffect, useState } from "react";
import CompetenceCard from "@/components/Competances/CompCard";

interface Competence {
    id: number;
    name: string;
    imageUrl: string;
    level: number;
}

interface CompetencesListProps {
    apiEndpoint: string;
    title?: string;
}

export default function CompetencesList({ apiEndpoint, title = "Mes Compétences" }: CompetencesListProps) {
    const [competences, setCompetences] = useState<Competence[]>([]);
    const [loading, setLoading] = useState(true);
    const [filteredCompetences, setFilteredCompetences] = useState<Competence[]>([]);
    const [levelFilter, setLevelFilter] = useState("");
    const [nameFilter, setNameFilter] = useState("");

    useEffect(() => {
        const fetchCompetences = async () => {
            const response = await fetch(apiEndpoint);
            const data = await response.json();
            setCompetences(data);
            setFilteredCompetences(data);
            setLoading(false);
        };

        fetchCompetences();
    }, [apiEndpoint]);

    useEffect(() => {
        let filtered = competences;

        if (levelFilter) {
            filtered = filtered.filter((competence) => competence.level === Number(levelFilter));
        }

        if (nameFilter) {
            filtered = filtered.filter((competence) => competence.name.toLowerCase().includes(nameFilter.toLowerCase()));
        }

        setFilteredCompetences(filtered);
    }, [competences, levelFilter, nameFilter]);

    if (loading) {
        return <div className="text-center text-xl">Chargement...</div>;
    }

    const categories = [...new Set(competences.map((competence) => competence.level))];

    return (
        <div className="space-y-8">
            <h2 className="text-4xl font-bold text-center text-cyan-400">{title}</h2>
            <div className="flex justify-between items-center">
                <input
                    type="text"
                    placeholder="Rechercher par nom"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    className="border border-gray-700 p-2 rounded bg-gray-900 text-white"
                />
                <select
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value)}
                    className="border border-gray-700 p-2 rounded mt-2 md:mt-0 md:ml-4 bg-gray-900 text-white"
                >
                    <option value="">Toutes les catégories</option>
                    {categories.map((level) => (
                        <option key={level} value={level}>
                            {level}
                        </option>
                    ))}
                </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCompetences.map((competence) => (
                    <CompetenceCard key={competence.id} comp={competence} />
                ))}
            </div>
        </div>
    );
}
