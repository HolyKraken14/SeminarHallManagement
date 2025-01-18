import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  if (!images || images.length === 0) {
    return (
      <div className="h-64 bg-blue-50 flex items-center justify-center">
        <p className="text-blue-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="relative h-64 md:h-96 bg-white">
      <div
        className="w-full h-full bg-center bg-cover duration-500"
        style={{ backgroundImage: `url(${images[currentIndex]})` }}
      />
      <div className="absolute top-1/2 -translate-y-1/2 left-5 text-2xl rounded-full p-2 bg-blue-500/50 text-white cursor-pointer hover:bg-blue-600/50 transition-colors">
        <ChevronLeft onClick={goToPrevious} className="w-6 h-6" />
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-5 text-2xl rounded-full p-2 bg-blue-500/50 text-white cursor-pointer hover:bg-blue-600/50 transition-colors">
        <ChevronRight onClick={goToNext} className="w-6 h-6" />
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              currentIndex === slideIndex ? 'bg-blue-500' : 'bg-blue-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
