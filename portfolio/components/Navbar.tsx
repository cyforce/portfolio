// components/Navbar.tsx
import Link from 'next/link';
import React, { useState } from 'react';

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className }: NavbarProps) {
  const [active, setActive] = useState<string>('/');

  const menuItems = [
    { label: 'Accueil', href: '/' },
    { label: 'À propos', href: '/a-propos' },
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
                  onClick={() => setActive(item.href)}
                  className={`${
                      active === item.href
                          ? 'font-bold underline text-white'
                          : 'text-gray-300'
                  } hover:font-bold hover:underline`}
              >
                {item.label}
              </a>
          ))}
        </div>
      </nav>
  );
}
