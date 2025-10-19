
import { useState } from 'react';




export default function ProductGallery({ images, name }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-md">
        <div className="aspect-square relative group cursor-zoom-in" onClick={() => setIsZoomed(true)}>
          <img 
            src={images[selectedImage]} 
            alt={name}
            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-4 right-4">
            <button className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-colors">
              <i className="ri-heart-line text-gray-600 hover:text-red-500 transition-colors w-5 h-5 flex items-center justify-center"></i>
            </button>
          </div>
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-gray-600">
            <i className="ri-search-line w-4 h-4 flex items-center justify-center"></i>
          </div>
        </div>
      </div>

      {/* Thumbnail Images */}
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
              selectedImage === index 
                ? 'border-blue-500 shadow-md' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <img 
              src={image} 
              alt={`${name} ${index + 1}`}
              className="w-full h-full object-cover object-top"
            />
          </button>
        ))}
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsZoomed(false)}>
          <div className="relative max-w-4xl max-h-full">
            <img 
              src={images[selectedImage]} 
              alt={name}
              className="max-w-full max-h-full object-contain"
            />
            <button 
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-colors"
            >
              <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
