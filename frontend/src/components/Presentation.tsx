import React, { useState, ReactElement } from 'react';
import '../css/Presentation.css';

type SlideContents = { image: string } | { element: ReactElement };

const Presentation: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const slides: SlideContents[] = [
    { image: '/static/1.jpg' },
    { image: '/static/2.jpg' },
    { image: '/static/3.jpg' },
    { element: <pre>
<span>&lt;attribute name=&quot;Description&quot;&gt;</span>4,5,6,7,8,9,18,19<span>&lt;/attribute&gt;</span>
<br></br><span>&lt;attribute name=&quot;Description&quot;&gt;</span>14<span>&lt;/attribute&gt;</span>
      </pre> }, 
  ];

  const handleNext = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const handlePrevious = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  return (
    <div className="presentation">
      <h2>Презентация</h2>
      <div className="slide-container">
        { 'image' in slides[currentSlideIndex] ? (
          <img src={slides[currentSlideIndex].image} alt="presentation" className="slide" />
        ) : (
          slides[currentSlideIndex].element
        )}
      </div>
      <div className="controls">
        <button onClick={handlePrevious}>Предыдущий</button>
        <button onClick={handleNext}>Следующий</button>
      </div>
    </div>
  );
};

export default Presentation;
