import React from 'react';
import BoundingBox from '../models/BoundingBox.ts';
import SchematicPreview from './SchematicPreview.tsx';
import json from './boxes.json';

interface BoundingBoxDTOAttributes {
  [key: string]: string | null;
}

interface BoundingBoxDTO {
  id: number;
  label: string;
  source: string;
  occluded: number;
  xtl: number;
  ytl: number;
  xbr: number;
  ybr: number;
  x: number;
  y: number;
  width: number;
  height: number;
  z_order: number;
  attributes: BoundingBoxDTOAttributes;
}

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
