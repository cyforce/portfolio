import { useRouter } from 'next/navigation';

interface CompCardProps {
  comp: {
    id: number;
    name: string;
    imageUrl: string;
    level: number;
  };
}

export default function ProjectCard({ comp }: CompCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/competences/${comp.id}`);
  };

  return (
    <div onClick={handleClick} className="cursor-pointer border border-gray-700 rounded-lg overflow-hidden hover:shadow-lg">
      <img src={comp.imageUrl} alt={comp.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        {comp.name && <h3 className="text-xl font-semibold">{comp.name}</h3>}
      </div>
    </div>
  );
}
