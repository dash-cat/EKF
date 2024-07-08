import React from 'react';
import SchematicPreview from './SchematicPreview.tsx';

const ComponentTester: React.FC = () => {
  const boxes = [
    { id: 1, x: 50, y: 50, width: 100, height: 100, isActive: false },
    { id: 2, x: 200, y: 150, width: 150, height: 100, isActive: true },
    { id: 3, x: 400, y: 200, width: 120, height: 120, isActive: false },
  ];

  return (
    <div>
      <h1>Image with Bounding Boxes</h1>
      <SchematicPreview imageSrc="/static/2.jpg" boxes={boxes} />
    </div>
  );
}

export default ComponentTester;
