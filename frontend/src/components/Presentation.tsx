import React, { useState } from 'react';
import '../css/Presentation.css';

const Presentation: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    '/static/1.jpg',
    '/static/2.jpg',
    '/static/3.jpg',
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
        <img src={images[currentImageIndex]} alt="presentation" className="image" />
      </div>
      <div className="controls">
        <button onClick={handlePrevious}>Предыдущий</button>
        <button onClick={handleNext}>Следующий</button>
      </div>
    </div>
  );
}

export default Presentation;
