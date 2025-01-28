import Link from 'next/link';

interface P404Props {
  redirectTo?: string;
  text?: string;
}

export default function P404({ redirectTo = '/', text = 'page introuvable'}: P404Props) {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <div className="flex items-center justify-center h-fit w-fit space-x-4 bg-gray-900">
        <h1 className="text-5xl font-extrabold">404</h1>
        <div className="bg-gray-300 h-12 w-px"></div>
        <p className="text-lg">{text}</p>
      </div>
      <Link href={redirectTo}>
        <span className="text-blue-500 hover:underline text-lg font-medium">
          Retour à la page précédente
        </span>
      </Link>
    </div>
  );
}