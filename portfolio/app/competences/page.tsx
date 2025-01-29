// app/comptetences/page.tsx
import CompetencesList from "@/components/Competances/CompetencesList";

export default function CompetencesPage() {
  return <CompetencesList apiEndpoint="/api/competences" />;
}
