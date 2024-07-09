import json from './boxes.json';
import BoundingBox from './BoundingBox.ts';

interface BoundingBoxDTOAttributes {
  [key: string]: string | null;
}

export interface BoundingBoxDTO {
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

export function readBoxes(): BoundingBox[] {
  const dtoRoot: BoundingBoxDTO[] = json as BoundingBoxDTO[];
  return dtoRoot.map((dto: BoundingBoxDTO) => ({
    id: dto.id,
    x: dto.x,
    y: dto.y,
    width: dto.width,
    height: dto.height,
    isActive: dto.id == 1,
  }));
}