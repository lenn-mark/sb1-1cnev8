export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
}

export interface ShipmentTag {
  shipmentId: string;
  tagId: string;
}