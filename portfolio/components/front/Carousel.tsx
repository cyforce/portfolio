// components/Carousel.tsx
import { useState } from 'react';

interface CarouselProps {
  images?: string[];
}

export default function Carousel({ images = [] }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  if (images.length === 0) {
    return <div className="text-center text-red-500">Aucune image disponible</div>;
  }

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        className="w-full h-auto rounded-md"
      />
      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded"
      >
        ←
      </button>
      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded"
      >
        →
      </button>
    </div>
  );
}
