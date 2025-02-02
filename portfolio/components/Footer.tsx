"use client";

import React from 'react';
import { usePathname } from 'next/navigation';

interface FooterProps {
    className?: string;
}

export default function Footer({ className }: FooterProps) {
    const pathname = usePathname();

    const menuItems = [
        { label: 'Accueil', href: '/' },
        { label: 'À propos', href: '/aPropos' },
        { label: 'Compétences', href: '/competences' },
        { label: 'Langues', href: '/langues' },
        { label: 'Formations', href: '/formations' },
        { label: 'Expériences', href: '/experiences' },
        { label: 'Engagements', href: '/engagements' },
        { label: 'Projets', href: '/projets' },
        { label: 'Loisirs', href: '/loisirs' },
        { label: 'Contact', href: '/contact' },
    ];

    const currentYear = new Date().getFullYear();

    return (
        <div className={`w-full bg-black bg-opacity-75 p-4 flex justify-center ${className}`}>
            <div className="flex flex-col items-center space-y-4">
                <div className="flex space-x-4">
                    {menuItems.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className={`relative text-gray-300 ${
                                pathname === item.href ? 'text-white' : ''
                            }`}
                        >
              <span
                  className={`transition-all duration-300 ${
                      pathname === item.href
                          ? 'font-bold underline'
                          : 'hover:font-bold hover:underline'
                  }`}
              >
                {item.label}
              </span>
                        </a>
                    ))}
                </div>
                <div className="text-gray-300">
                    <p>Contact: <a href={"mailto:celian.touzeau@outlook.fr"}>celian.touzeau@outlook.fr</a></p>
                    <p>Téléphone: +33 6 34 99 11 45</p>
                </div>
                <div className="text-gray-300">
                    <p>&copy; {currentYear} Célian TOUZEAU. Tous droits réservés.</p>
                </div>
            </div>
        </div>
    );
}
