// app/comptetences/page.tsx
"use client";

import { useEffect, useState } from 'react';
import CompetenceCard from '@/components/CompCard';

export default function CompetencesPage() {
    return (
        <div>
            <h2 className="text-4xl font-bold text-center text-cyan-400">Compétences</h2>
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 p-4 rounded-lg">

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <CompetenceCard comp={{ id: 1, title: 'React', category: 'Frontend', imageUrl: '/images/react.png', description: 'React is a JavaScript library for building user interfaces.' }} />
                <CompetenceCard comp={{ id: 2, title: 'Node.js', category: 'Backend', imageUrl: '/images/nodejs.png', description: 'Node.js is a JavaScript runtime built on Chrome\'s V8 JavaScript engine.' }} />
                <CompetenceCard comp={{ id: 3, title: 'Tailwind CSS', category: 'Frontend', imageUrl: '/images/tailwindcss.png', description: 'A utility-first CSS framework for quickly building custom designs.' }} />
                <CompetenceCard comp={{ id: 4, title: 'Express', category: 'Backend', imageUrl: '/images/express.png', description: 'Fast, unopinionated, minimalist web framework for Node.js.' }} />
                <CompetenceCard comp={{ id: 5, title: 'Next.js', category: 'Frontend', imageUrl: '/images/nextjs.png', description: 'The React Framework for Production.' }} />
                <CompetenceCard comp={{ id: 6, title: 'MongoDB', category: 'Database', imageUrl: '/images/mongodb.png', description: 'The most popular database for modern apps.' }} />
            </div>
        </div>
    );
}