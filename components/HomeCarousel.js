import { useState, useEffect } from 'react';

export default function HomeCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Array of image filenames from your home gallery
  const imageFiles = [
    '/home-gallery/10-768x768.webp',
    '/home-gallery/26-768x768.webp',
    '/home-gallery/27-768x768.webp',
    '/home-gallery/28-768x768.webp',
    '/home-gallery/30-768x768.webp',
    '/home-gallery/7.1-768x768.webp'
  ];

  useEffect(() => {
    setImages(imageFiles);
    setLoading(false);
  }, []);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (images.length === 0) return;

    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentSlide, images.length]);

  if (loading || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 animate-pulse rounded-lg" />
    );
  }

  return (
    <div className="relative w-full bg-gray-900 overflow-hidden rounded-lg shadow-2xl">
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .slide-image {
          animation: slideIn 0.5s ease-in-out;
        }
      `}</style>

      {/* Image Container */}
      <div className="relative w-full h-96 sm:h-[500px] lg:h-[600px] overflow-hidden bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out flex items-center justify-center ${
              index === currentSlide ? 'opacity-100 slide-image' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`Carousel slide ${index + 1}`}
              className="w-full h-full object-contain"
              loading={index === currentSlide ? 'eager' : 'lazy'}
              onError={(e) => console.error('Image load error:', image)}
            />
            {/* Dark overlay on top */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-lg p-3 transition-all duration-300 hover:scale-110 group"
        aria-label="Previous slide"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-lg p-3 transition-all duration-300 hover:scale-110 group"
        aria-label="Next slide"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? 'bg-white w-8 h-2'
                : 'bg-white/50 w-2 h-2 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
