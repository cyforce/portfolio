// app/page.tsx
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="h-screen w-screen">
      <section className="flex flex-col items-center justify-center text-center px-4 h-full">
        <h1 className="text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-300">
          Bienvenue dans mon univers
        </h1>
        <p className="text-lg max-w-2xl">
          Découvrez mon parcours, mes compétences et mes projets dans un voyage immersif inspiré de l'immensité de l'espace.
        </p>
      </section> 
    </div>
  );
}
