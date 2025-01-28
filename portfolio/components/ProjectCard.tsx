import { useRouter } from 'next/navigation';

interface ProjectCardProps {
  project: {
    id: number;
    title: string;
    category: string;
    imageUrl: string;
    description: string;
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/projets/${project.id}`);
  };

  return (
    <div onClick={handleClick} className="cursor-pointer border border-gray-700 rounded-lg overflow-hidden hover:shadow-lg">
      <img src={project.imageUrl} alt={project.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold">{project.title}</h3>
        <p className="text-gray-400">{project.description.substring(0, 100)}...</p>
      </div>
    </div>
  );
}
