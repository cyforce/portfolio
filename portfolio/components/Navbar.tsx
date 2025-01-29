"use client";

// components/Navbar.tsx
import React from 'react';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className }: NavbarProps) {
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

  return (
      <nav className={`fixed top-0 left-0 w-full bg-black bg-opacity-75 p-4 flex justify-center z-50 ${className}`}>
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
      </nav>
  );
}
