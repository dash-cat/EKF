import React from 'react';
import BoundingBox from '../models/BoundingBox.ts';
import SchematicPreview from './SchematicPreview.tsx';
import json from './annotations.json';

const ComponentTester: React.FC = () => {
  const image = json.images.find((img: any) => img.file_name === '2.jpg');
  const imageId = image ? image.id : null;

  const boxes: BoundingBox[] = json.annotations.map((annotation: any) => ({
    id: annotation.id,
    x: annotation.bbox[0],
    y: annotation.bbox[1],
    width: annotation.bbox[2],
    height: annotation.bbox[3],
    isActive: annotation.id == 19,
  }));

  return (
    <div>
      <h1>Image with Bounding Boxes</h1>
      <SchematicPreview imageSrc="/static/2.jpg" boxes={boxes} />
    </div>
  );
}

export default ComponentTester;
