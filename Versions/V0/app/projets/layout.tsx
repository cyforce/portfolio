// app/projets/layout.tsx
import Link from 'next/link';

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-8 p-6">
      <section>{children}</section>
    </div>
  );
}
