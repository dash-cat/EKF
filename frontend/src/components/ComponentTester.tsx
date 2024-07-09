import React from 'react';
import BoundingBox from '../models/BoundingBox.ts';
import BoundingBoxDTO from '../models/BoundingBoxDTO.ts';
import SchematicPreview from './SchematicPreview.tsx';
import json from './boxes.json';


const ComponentTester: React.FC = () => {
  const dtoRoot: BoundingBoxDTO[] = json as BoundingBoxDTO[];
  const boxes: BoundingBox[] = dtoRoot.map((dto: BoundingBoxDTO) => ({
    id: dto.id,
    x: dto.x,
    y: dto.y,
    width: dto.width,
    height: dto.height,
    isActive: dto.id == 1,
  }));

  return (
    <div>
      <h1>Image with Bounding Boxes</h1>
      <SchematicPreview imageSrc="/static/sample-schematic.jpg" boxes={boxes} />
    </div>
  );
}

export default ComponentTester;
