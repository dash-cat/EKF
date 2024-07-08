import React, { useState } from 'react';
import '../css/Presentation.css'; // Ensure you have styles for this component

const Presentation: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    'path/to/your/image1.jpg',
    'path/to/your/image2.jpg',
    'path/to/your/image3.jpg',
  ];

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="presentation">
      <h2>Презентация</h2>
      <div className="image-container">
        <button onClick={handlePrevious}>Previous</button>
        <img src={images[currentImageIndex]} alt="presentation" className="image" />
        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  );
}

export default Presentation;
