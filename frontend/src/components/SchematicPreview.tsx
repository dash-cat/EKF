import React from 'react';
import '../css/SchematicPreview.css';

interface BoundingBox {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  isActive: boolean;
}

interface BoundingBoxProps {
  imageSrc: string;
  boxes: BoundingBox[];
}

const SchematicPreview: React.FC<BoundingBoxProps> = ({ imageSrc, boxes }) => {
  return (
    <div className="bounding-box-container">
      <img src={imageSrc} alt="Annotated image" className="image" />
      {boxes.map((box) => (
        <div
          key={box.id}
          className={`bounding-box ${box.isActive ? 'active' : ''}`}
          style={{
            left: `${box.x}px`,
            top: `${box.y}px`,
            width: `${box.width}px`,
            height: `${box.height}px`,
          }}
        />
      ))}
    </div>
  );
}

export default SchematicPreview;
