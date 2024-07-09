interface BoundingBoxDTOAttributes {
  [key: string]: string | null;
}

export default interface BoundingBoxDTO {
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
