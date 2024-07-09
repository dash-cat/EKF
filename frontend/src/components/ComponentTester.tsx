import React from 'react';
import BoundingBox from '../models/BoundingBox.ts';
import { BoundingBoxDTO, readBoxes } from '../models/BoundingBoxDTO.ts';
import SchematicPreview from './SchematicPreview.tsx';

const ComponentTester: React.FC = () => {
  return (
    <div>
      <h1>Image with Bounding Boxes</h1>
      <SchematicPreview imageSrc="/static/sample-schematic.jpg" boxes={readBoxes()} />
    </div>
  );
}

export default ComponentTester;
