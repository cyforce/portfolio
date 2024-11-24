// components/Navbar.tsx
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-black bg-opacity-75 p-4 flex justify-center z-50"> {/* Ajout de z-50 */}
      <div className="flex space-x-4">
        <Link href="/">Accueil</Link>
        <Link href="/a-propos">À propos</Link>
        <Link href="/competences">Compétences</Link>
        <Link href="/langues">Langues</Link>
        <Link href="/formations">Formations</Link>
        <Link href="/experiences">Expériences</Link>
        <Link href="/engagements">Engagements</Link>
        <Link href="/projets">Projets</Link>
        <Link href="/loisirs">Loisirs</Link>
        <Link href="/contact">Contact</Link>
      </div>
    </nav>
  );
}
